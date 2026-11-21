"""DataUpdateCoordinator for Acond Integration."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from aiohttp import ClientError
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import (
    DataUpdateCoordinator,
    UpdateFailed,
)

from .api import AcondClient


class AcondDataUpdateCoordinator(DataUpdateCoordinator[dict[str, dict[str, Any]]]):
    """Coordinate periodic Acond XML updates."""

    def __init__(
        self,
        hass: HomeAssistant,
        client: AcondClient,
        scan_interval: int,
    ) -> None:
        super().__init__(
            hass,
            logger=__import__("logging").getLogger(__package__),
            name="Acond Integration",
            update_interval=timedelta(seconds=scan_interval),
        )
        self.client = client

    async def _async_update_data(self) -> dict[str, dict[str, Any]]:
        try:
            return await self.client.async_fetch_all()
        except (ClientError, ValueError, RuntimeError) as err:
            raise UpdateFailed(f"Error communicating with Acond pump: {err}") from err
