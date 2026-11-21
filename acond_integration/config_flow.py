"""Config and options flows for Acond Integration."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import AcondClient
from .const import (
    CONF_AUTO_DISCOVER,
    CONF_HOST,
    CONF_HOSTNAME,
    CONF_PASSWORD,
    CONF_SCAN_INTERVAL,
    CONF_USERNAME,
    DEFAULT_HOST,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MIN_SCAN_INTERVAL,
)


class AcondConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Acond Integration."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        errors: dict[str, str] = {}

        if user_input is not None:
            host = user_input[CONF_HOST].strip()
            hostname = user_input.get(CONF_HOSTNAME, "").strip()
            if user_input[CONF_AUTO_DISCOVER] and hostname:
                client = AcondClient(
                    host,
                    user_input[CONF_USERNAME],
                    user_input[CONF_PASSWORD],
                    async_get_clientsession(self.hass),
                )
                resolved = await client.async_resolve_host(hostname)
                if resolved:
                    host = resolved

            if not errors:
                await self.async_set_unique_id(host)
                self._abort_if_unique_id_configured()
                title = hostname or host
                return self.async_create_entry(
                    title=f"Acond {title}",
                    data=user_input | {CONF_HOST: host},
                )

        schema = vol.Schema(
            {
                vol.Required(CONF_HOST, default=DEFAULT_HOST): str,
                vol.Optional(CONF_HOSTNAME, default=""): str,
                vol.Required(CONF_AUTO_DISCOVER, default=True): bool,
                vol.Required(CONF_USERNAME, default=""): str,
                vol.Required(CONF_PASSWORD, default=""): str,
                vol.Required(
                    CONF_SCAN_INTERVAL,
                    default=DEFAULT_SCAN_INTERVAL,
                ): vol.All(vol.Coerce(int), vol.Range(min=MIN_SCAN_INTERVAL)),
            }
        )
        return self.async_show_form(
            step_id="user",
            data_schema=schema,
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> "AcondOptionsFlow":
        return AcondOptionsFlow()


class AcondOptionsFlow(config_entries.OptionsFlow):
    """Handle Acond integration options."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        current_host = self.config_entry.options.get(
            CONF_HOST, self.config_entry.data.get(CONF_HOST, DEFAULT_HOST)
        )
        current_username = self.config_entry.options.get(
            CONF_USERNAME,
            self.config_entry.data.get(CONF_USERNAME, ""),
        )
        current_password = self.config_entry.options.get(
            CONF_PASSWORD,
            self.config_entry.data.get(CONF_PASSWORD, ""),
        )
        current_hostname = self.config_entry.options.get(
            CONF_HOSTNAME,
            self.config_entry.data.get(CONF_HOSTNAME, ""),
        )
        current_auto = self.config_entry.options.get(
            CONF_AUTO_DISCOVER,
            self.config_entry.data.get(CONF_AUTO_DISCOVER, True),
        )
        current_interval = self.config_entry.options.get(
            CONF_SCAN_INTERVAL,
            self.config_entry.data.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL),
        )

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST, default=current_host): str,
                    vol.Optional(CONF_HOSTNAME, default=current_hostname): str,
                    vol.Required(CONF_AUTO_DISCOVER, default=current_auto): bool,
                    vol.Required(CONF_USERNAME, default=current_username): str,
                    vol.Required(CONF_PASSWORD, default=current_password): str,
                    vol.Required(
                        CONF_SCAN_INTERVAL,
                        default=current_interval,
                    ): vol.All(
                        vol.Coerce(int),
                        vol.Range(min=MIN_SCAN_INTERVAL),
                    ),
                }
            ),
        )
