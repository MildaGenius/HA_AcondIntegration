"""Tecomat/Acond API client."""

from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import re
import socket
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

import aiohttp

from .const import PAGE_URLS

LOGGER = logging.getLogger(__name__)
REQUEST_HEADERS = {"Accept": "*/*", "x-tecomat": "data"}
_LOGIN_ATTEMPTS: dict[str, int] = {}


class AcondClient:
    """Asynchronous HTTP and XML client for an Acond Tecomat controller."""

    def __init__(
        self,
        host: str,
        username: str,
        password: str,
        session: aiohttp.ClientSession,
        key_definitions: dict[str, dict[str, Any]] | None = None,
    ) -> None:
        self._host = host
        self._username = username
        self._password = password
        self._session = session
        self._logged_in = False
        self._softplc_cookie: str | None = None
        self._key_definitions = key_definitions or {}

    @property
    def host(self) -> str:
        return self._host

    def set_host(self, host: str) -> None:
        self._host = host

    async def async_resolve_host(self, hostname: str) -> str | None:
        """Resolve a Tecomat name through normal DNS/mDNS name lookup."""
        candidates = [hostname.strip()]
        if candidates[0] and not candidates[0].lower().endswith(".local"):
            candidates.append(f"{candidates[0]}.local")

        loop = asyncio.get_running_loop()
        for candidate in candidates:
            if not candidate:
                continue
            try:
                addresses = await loop.run_in_executor(
                    None, lambda host=candidate: socket.getaddrinfo(
                        host, 80, type=socket.SOCK_STREAM
                    )
                )
                for address in addresses:
                    value = address[4][0]
                    if value:
                        return value
            except socket.gaierror:
                continue
        return None

    @staticmethod
    def load_key_definitions() -> dict[str, dict[str, Any]]:
        """Load the XML key catalogue from disk."""
        path = Path(__file__).with_name("acond_logged_keys.json")
        data = json.loads(path.read_text(encoding="utf-8"))
        definitions: dict[str, dict[str, Any]] = {}
        for page_name, items in data.get("pages", {}).items():
            if isinstance(items, list):
                for item in items:
                    key = item.get("key")
                    if key:
                        page = page_name.removesuffix(".XML")
                        definitions[f"{page}:{key}"] = item
                        definitions.setdefault(key, item)
        for item in data.get("unobserved", []):
            key = item.get("key")
            if key:
                definitions.setdefault(key, item)
        return definitions

    def _base_url(self) -> str:
        host = self._host.strip()
        if "://" in host:
            parsed = urlparse(host)
            return f"{parsed.scheme}://{parsed.netloc}"
        return f"http://{host}"

    async def async_login(self, force: bool = False) -> None:
        """Create a Tecomat WebMaker session."""
        if self._logged_in and not force:
            return

        base_url = self._base_url()
        safe_base_url = self._safe_url(base_url)
        attempt = _LOGIN_ATTEMPTS.get(safe_base_url, 0) + 1
        _LOGIN_ATTEMPTS[safe_base_url] = attempt
        LOGGER.info(
            "Starting Tecomat login attempt #%d for %s%s",
            attempt,
            safe_base_url,
            " (forced re-login)" if force else "",
        )
        try:
            await self._async_login(attempt, base_url)
        except (aiohttp.ClientError, RuntimeError, ValueError) as err:
            LOGGER.warning(
                "Tecomat login attempt #%d for %s failed: %s",
                attempt,
                safe_base_url,
                err,
            )
            raise

        self._logged_in = True
        LOGGER.info(
            "Tecomat login attempt #%d for %s succeeded",
            attempt,
            safe_base_url,
        )

    async def _async_login(self, attempt: int, base_url: str) -> None:
        """Log in using the Tecomat WebMaker cookie and form protocol."""
        login_url = base_url + "/syswww/login.xml"
        request_headers = {
            **REQUEST_HEADERS,
            "Referer": base_url + "/PAGE49.XML",
        }
        self._softplc_cookie = None
        LOGGER.debug(
            "Login attempt #%d: initializing the Tecomat login session",
            attempt,
        )
        async with self._session.get(
            login_url,
            headers=request_headers,
            allow_redirects=False,
            timeout=15,
        ) as response:
            body = await response.read()
            status = response.status
            safe_response_url = self._safe_url(str(response.url))
            self._update_softplc_cookie(response)

        LOGGER.debug(
            "Login attempt #%d: session initialization returned HTTP %s from %s",
            attempt,
            status,
            safe_response_url,
        )
        if status >= 500:
            detail = self._response_detail(body)
            LOGGER.error(
                "Login attempt #%d: Tecomat login endpoint returned "
                "HTTP %s from %s%s",
                attempt,
                status,
                safe_response_url,
                f": {detail}" if detail else "",
            )
            raise RuntimeError(
                f"Tecomat returned HTTP {status} from {safe_response_url}"
                + (f": {detail}" if detail else "")
            )
        if status >= 400:
            raise aiohttp.ClientResponseError(
                response.request_info,
                response.history,
                status=status,
                message="Tecomat session initialization failed",
            )
        if not self._softplc_cookie:
            raise RuntimeError("Tecomat login response did not set a SoftPLC cookie")

        # TECO expects SHA-1 of the session cookie followed by the password.
        password = hashlib.sha1(
            (unquote(self._softplc_cookie) + self._password).encode(
                "cp1250", "replace"
            )
        ).hexdigest()
        async with self._session.post(
            login_url,
            data={"USER": self._username, "PASS": password},
            headers=request_headers,
            cookies={"SoftPLC": self._softplc_cookie},
            allow_redirects=False,
            timeout=15,
        ) as response:
            body = await response.read()
            status = response.status
            location = response.headers.get("Location", "")
            safe_response_url = self._safe_url(str(response.url))
            self._update_softplc_cookie(response)

        location_path = urlparse(location).path.lower()
        LOGGER.debug(
            "Login attempt #%d: credential submission returned HTTP %s "
            "from %s; redirect_path=%s",
            attempt,
            status,
            safe_response_url,
            location_path or "<none>",
        )
        redirected_after_login = (
            status in (301, 302, 303, 307, 308)
            and bool(location)
            and "login" not in location_path
        )
        completed_without_login_page = (
            status == 200 and not self._looks_like_login_page(body)
        )
        if redirected_after_login or completed_without_login_page:
            LOGGER.debug("Login attempt #%d: HTTP session is ready", attempt)
            return

        if status >= 500:
            LOGGER.error(
                "Login attempt #%d: credential submission returned HTTP %s",
                attempt,
                status,
            )
            raise RuntimeError(
                f"Tecomat credential submission returned HTTP {status}"
            )

        LOGGER.error(
            "Login attempt #%d: Tecomat rejected the credentials "
            "(HTTP %s, redirect_path=%s)",
            attempt,
            status,
            location_path or "<none>",
        )
        raise ValueError("Tecomat rejected the configured credentials")

    def _update_softplc_cookie(self, response: aiohttp.ClientResponse) -> None:
        """Remember the controller's session cookie without logging its value."""
        cookie = response.cookies.get("SoftPLC")
        if cookie is not None:
            self._softplc_cookie = cookie.value

    @staticmethod
    def _response_detail(content: bytes) -> str:
        detail = re.sub(
            r"<input\b[^>]*>",
            "",
            content.decode(errors="replace"),
            flags=re.IGNORECASE,
        )
        detail = re.sub(r"<[^>]+>", " ", detail)
        return re.sub(r"\s+", " ", detail).strip()[:200]

    @staticmethod
    def _safe_url(url: str) -> str:
        """Return a URL without query parameters or fragments for diagnostics."""
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}{parsed.path}"

    def _looks_like_login_page(self, content: bytes) -> bool:
        lower = content[:8192].lower()
        return b"<login" in lower or (
            b"<form" in lower
            and (b"password" in lower or b"login" in lower or b"pass" in lower)
        )

    async def async_fetch_page(self, page: str, path: str) -> dict[str, dict[str, Any]]:
        """Fetch and parse one XML page, relogging once after an expired session."""
        url = self._base_url() + path
        for attempt in range(2):
            if not self._logged_in:
                await self.async_login()
            try:
                LOGGER.debug("Requesting Tecomat page %s", path)
                async with self._session.get(
                    url,
                    headers={
                        **REQUEST_HEADERS,
                        "Referer": self._base_url() + "/PAGE49.XML",
                    },
                    cookies=(
                        {"SoftPLC": self._softplc_cookie}
                        if self._softplc_cookie
                        else None
                    ),
                    allow_redirects=False,
                    timeout=15,
                ) as response:
                    content = await response.read()
                    self._update_softplc_cookie(response)
                    LOGGER.debug(
                        "Tecomat page %s returned HTTP %s",
                        path,
                        response.status,
                    )
                    location = response.headers.get("Location", "")
                    if (
                        response.status in (301, 302, 303, 307, 308)
                        and "login" in urlparse(location).path.lower()
                    ) or (
                        response.status in (401, 403)
                        or self._looks_like_login_page(content)
                    ):
                        if attempt == 0:
                            LOGGER.warning(
                                "Tecomat session expired while fetching %s; "
                                "logging in again",
                                path,
                            )
                            await self.async_login(force=True)
                            continue
                        raise aiohttp.ClientResponseError(
                            response.request_info,
                            response.history,
                            status=response.status,
                            message="Tecomat session expired",
                        )
                    if 300 <= response.status < 400:
                        raise RuntimeError(
                            f"Unexpected redirect from Tecomat page {path}: "
                            f"{urlparse(location).path or '<unknown>'}"
                        )
                    response.raise_for_status()
                    parsed = self._parse_xml(content, page)
                    LOGGER.debug(
                        "Parsed %s values from Tecomat page %s",
                        len(parsed),
                        path,
                    )
                    return parsed
            except ET.ParseError as err:
                if attempt == 0:
                    LOGGER.warning(
                        "Invalid XML from Tecomat page %s; logging in and "
                        "retrying once",
                        path,
                    )
                    await self.async_login(force=True)
                    continue
                raise ValueError(f"Invalid XML returned by {url}: {err}") from err
        raise RuntimeError(f"Unable to fetch {url}")

    def _parse_xml(self, content: bytes, page: str) -> dict[str, dict[str, Any]]:
        """Parse known and unknown XML elements into a flat entity-ready mapping."""
        try:
            root = ET.fromstring(content)
        except ET.ParseError:
            raise

        result: dict[str, dict[str, Any]] = {}

        for element in root.iter():
            tag = element.tag.rsplit("}", 1)[-1].upper()
            name = element.attrib.get("NAME") or element.attrib.get("name")
            value = element.attrib.get("VALUE")
            if value is None:
                value = element.attrib.get("value")

            if name:
                if value is None:
                    value = (element.text or "").strip()
                result.update(
                    self._add_value(result, page, name, value, element.attrib)
                )
                continue

            if tag not in ("PAGE", "ACCESS") and (element.text or "").strip():
                leaf_name = f"{tag}_{len(result)}"
                result.update(
                    self._add_value(
                        result,
                        page,
                        leaf_name,
                        (element.text or "").strip(),
                        element.attrib,
                    )
                )

            for attribute_name, attribute_value in element.attrib.items():
                normalized = attribute_name.upper()
                if normalized not in ("NAME", "VALUE"):
                    key = f"{tag}_{normalized}"
                    result.update(
                        self._add_value(
                            result,
                            page,
                            key,
                            attribute_value,
                            element.attrib,
                        )
                    )
        return result

    def _add_value(
        self,
        existing: dict[str, dict[str, Any]],
        page: str,
        name: str,
        value: Any,
        attributes: dict[str, str],
    ) -> dict[str, dict[str, Any]]:
        page_definition = self._key_definitions.get(f"{page}:{name}")
        definition = page_definition or self._key_definitions.get(name, {})
        key = f"{page}:{name}"
        converted = self._convert_value(value)
        translation_key = f"{self._slug(page)}_{self._slug(name)}"
        suggested_object_id = (
            page_definition.get("suggested_object_id")
            if page_definition
            else None
        )
        item = {
            "key": name,
            "page": page,
            "source_page": f"{page}.XML",
            "value": converted,
            "raw_value": value,
            "show": definition.get("show", True),
            "translation_key": (
                translation_key
                if suggested_object_id
                else "unknown_variable"
            ),
            "suggested_object_id": suggested_object_id
            or f"{self._slug(page)}_tecomat_{self._slug(name)}",
            "type": definition.get("type")
            or ("status" if "_BOOL_" in name.upper() else "info"),
            "editable": bool(definition.get("editable", False)),
            "attributes": dict(attributes),
        }
        return {key: item}

    @staticmethod
    def _slug(value: str) -> str:
        """Create an ASCII identifier for translation and entity IDs."""
        return re.sub(r"[^a-zA-Z0-9]+", "_", value).strip("_").lower()

    @staticmethod
    def _convert_value(value: Any) -> Any:
        if value is None:
            return None
        text = str(value).strip()
        if text.lower() in ("true", "false"):
            return text.lower() == "true"
        if re.fullmatch(r"[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)", text):
            normalized = text.replace(",", ".")
            number = float(normalized)
            return int(number) if number.is_integer() else number
        if text in ("0", "1") and text.isdigit():
            return int(text)
        return text

    @staticmethod
    def _fallback_name(name: str) -> str:
        name = re.sub(r"^__|_REAL.*|_BOOL.*|_STRING.*|_DT.*|_TIME.*|_USINT.*|_UINT.*|_UDINT.*", "", name)
        name = re.sub(r"([._])", " ", name)
        name = re.sub(r"\s+", " ", name).strip()
        return name or "Acond value"

    async def async_fetch_all(self) -> dict[str, dict[str, Any]]:
        """Fetch Tecomat XML pages sequentially to limit controller connections."""
        await self.async_login()
        combined: dict[str, dict[str, Any]] = {}
        for page, path in PAGE_URLS.items():
            combined.update(await self.async_fetch_page(page, path))
        return combined
