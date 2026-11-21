from __future__ import annotations

import sys
import types
import unittest
import struct
from pathlib import Path
from typing import Any, cast

import aiohttp

_INTEGRATION_PACKAGE = "custom_components.acond_integration"
if _INTEGRATION_PACKAGE not in sys.modules:
    # Import the API without running integration setup, which requires Home Assistant.
    _package = types.ModuleType(_INTEGRATION_PACKAGE)
    _package.__path__ = [
        str(
            Path(__file__).resolve().parents[1]
            / "custom_components"
            / "acond_integration"
        )
    ]
    sys.modules[_INTEGRATION_PACKAGE] = _package

from custom_components.acond_integration.api import AcondClient


class FakeCookie:
    def __init__(self, value: str) -> None:
        self.value = value


class FakeResponse:
    def __init__(
        self,
        status: int,
        body: bytes = b"",
        *,
        url: str = "http://controller/syswww/login.xml",
        location: str | None = None,
        softplc_cookie: str | None = None,
    ) -> None:
        self.status = status
        self.url = url
        self.body = body
        self.headers: dict[str, str] = {}
        self.cookies: dict[str, FakeCookie] = {}
        if location is not None:
            self.headers["Location"] = location
        if softplc_cookie is not None:
            self.cookies["SoftPLC"] = FakeCookie(softplc_cookie)
        self.request_info = object()
        self.history: tuple[Any, ...] = ()

    async def __aenter__(self) -> FakeResponse:
        return self

    async def __aexit__(self, *args: Any) -> None:
        return None

    async def read(self) -> bytes:
        return self.body

    def raise_for_status(self) -> None:
        if self.status >= 400:
            raise AssertionError(f"Unexpected HTTP status {self.status}")


class FakeSession:
    def __init__(
        self,
        get_responses: list[FakeResponse],
        post_responses: list[FakeResponse],
    ) -> None:
        self.get_responses = get_responses
        self.post_responses = post_responses
        self.get_calls: list[tuple[str, dict[str, Any]]] = []
        self.post_calls: list[tuple[str, dict[str, Any]]] = []

    def get(self, url: str, **kwargs: Any) -> FakeResponse:
        self.get_calls.append((url, kwargs))
        return self.get_responses.pop(0)

    def post(self, url: str, **kwargs: Any) -> FakeResponse:
        self.post_calls.append((url, kwargs))
        return self.post_responses.pop(0)


class AcondLoginTests(unittest.IsolatedAsyncioTestCase):
    def test_duplicate_catalog_prefers_page49_visibility(self) -> None:
        definitions = AcondClient.load_key_definitions()

        page49 = definitions["PAGE49:__R1156.0_BOOL_i"]
        page61 = definitions["PAGE61:__R1156.0_BOOL_i"]

        self.assertNotIn("show", page49)
        self.assertFalse(page61["show"])

    def test_hidden_key_definition_is_propagated_to_value(self) -> None:
        client = AcondClient(
            "controller",
            "user",
            "password",
            cast(aiohttp.ClientSession, object()),
            {
                "PAGE49:__R6284_REAL_.1f": {
                    "type": "temperature",
                    "suggested_object_id": "page49_r6284_real_1f",
                    "show": False,
                },
            },
        )

        result = client._add_value(
            {},
            "PAGE49",
            "__R6284_REAL_.1f",
            "12.5",
            {},
        )

        item = result["PAGE49:__R6284_REAL_.1f"]
        self.assertFalse(item["show"])

    async def test_login_posts_cookie_derived_password_and_fetches_page(self) -> None:
        session = FakeSession(
            get_responses=[
                FakeResponse(
                    302,
                    location="/syswww/login.xml",
                    softplc_cookie="12345",
                ),
                FakeResponse(
                    200,
                    b'<PAGE><INPUT NAME="ROOM_TEMP" VALUE="21"/></PAGE>',
                    url="http://controller/PAGE49.XML",
                ),
            ],
            post_responses=[
                FakeResponse(302, location="/PAGE49.XML"),
            ],
        )
        client = AcondClient(
            "controller",
            "user",
            "pässword",
            cast(aiohttp.ClientSession, session),
        )

        result = await client.async_fetch_page("PAGE49", "/PAGE49.XML")

        self.assertTrue(client._logged_in)
        self.assertEqual(
            session.post_calls[0][1]["data"],
            {
                "USER": "user",
                "PASS": "f0d0704e236eac58c27a66edca66bb6d7e1462f3",
            },
        )
        self.assertEqual(
            session.post_calls[0][1]["cookies"],
            {"SoftPLC": "12345"},
        )
        self.assertEqual(
            session.get_calls[1][1]["headers"]["x-tecomat"],
            "data",
        )
        self.assertEqual(
            session.get_calls[1][1]["cookies"],
            {"SoftPLC": "12345"},
        )
        self.assertIn("PAGE49:ROOM_TEMP", result)

    async def test_login_xml_response_is_not_treated_as_success(self) -> None:
        session = FakeSession(
            get_responses=[
                FakeResponse(
                    302,
                    location="/syswww/login.xml",
                    softplc_cookie="12345",
                ),
            ],
            post_responses=[
                FakeResponse(200, b"<LOGIN><USER VALUE=''/></LOGIN>"),
            ],
        )
        client = AcondClient(
            "controller",
            "user",
            "pässword",
            cast(aiohttp.ClientSession, session),
        )

        with self.assertRaisesRegex(ValueError, "rejected"):
            await client.async_login()

        self.assertFalse(client._logged_in)


class AcondBrandTests(unittest.TestCase):
    @staticmethod
    def _png_size(file_path: Path) -> tuple[int, int]:
        with file_path.open("rb") as png:
            header = png.read(24)
        if header[:8] != b"\x89PNG\r\n\x1a\n":
            raise AssertionError(f"{file_path} is not a PNG")
        return struct.unpack(">II", header[16:24])

    def test_brand_assets_are_present_and_have_valid_dimensions(self) -> None:
        brand_dir = (
            Path(__file__).resolve().parents[1]
            / "custom_components"
            / "acond_integration"
            / "brand"
        )
        expected_sizes = {
            "icon.png": (256, 256),
            "icon@2x.png": (512, 512),
            "logo.png": (300, 200),
            "logo@2x.png": (600, 400),
        }
        for file_name, expected_size in expected_sizes.items():
            file_path = brand_dir / file_name
            self.assertTrue(file_path.is_file(), f"Missing {file_name}")
            self.assertEqual(self._png_size(file_path), expected_size)
