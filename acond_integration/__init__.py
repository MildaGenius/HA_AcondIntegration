"""The Acond Integration integration."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import AcondClient
from .const import (
    CONF_AUTO_DISCOVER,
    CONF_HOST,
    CONF_HOSTNAME,
    CONF_PASSWORD,
    CONF_SCAN_INTERVAL,
    CONF_USERNAME,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
)
from .coordinator import AcondDataUpdateCoordinator

PLATFORMS: list[Platform] = [Platform.SENSOR, Platform.BINARY_SENSOR]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Acond Integration from a config entry."""
    host = entry.options.get(CONF_HOST, entry.data[CONF_HOST])
    username = entry.options.get(CONF_USERNAME, entry.data[CONF_USERNAME])
    password = entry.options.get(CONF_PASSWORD, entry.data[CONF_PASSWORD])
    scan_interval = entry.options.get(
        CONF_SCAN_INTERVAL,
        entry.data.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL),
    )

    session = async_get_clientsession(hass)
    key_definitions = await hass.async_add_executor_job(
        AcondClient.load_key_definitions
    )
    client = AcondClient(
        host,
        username,
        password,
        session,
        key_definitions,
    )

    hostname = entry.options.get(
        CONF_HOSTNAME,
        entry.data.get(CONF_HOSTNAME),
    )
    auto_discover = entry.options.get(
        CONF_AUTO_DISCOVER,
        entry.data.get(CONF_AUTO_DISCOVER, True),
    )
    if auto_discover and hostname:
        resolved = await client.async_resolve_host(hostname)
        if resolved:
            client.set_host(resolved)

    coordinator = AcondDataUpdateCoordinator(hass, client, scan_interval)
    await coordinator.async_config_entry_first_refresh()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator
    entry.async_on_unload(entry.add_update_listener(async_reload_entry))

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload an Acond Integration config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)
    return unload_ok


async def async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload the integration after an options update."""
    await hass.config_entries.async_reload(entry.entry_id)
