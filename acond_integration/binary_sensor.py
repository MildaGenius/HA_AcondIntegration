"""Binary sensor platform for Acond Integration."""

from __future__ import annotations

import re
from typing import Any

from homeassistant.components.binary_sensor import (
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import AcondDataUpdateCoordinator


def _safe_id(value: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "_", value).strip("_").lower()


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: AcondDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id]
    entities = [
        AcondBinarySensor(coordinator, entry, key, item)
        for key, item in coordinator.data.items()
        if item.get("show", True)
        and (
            item["type"] == "status"
            or (
                isinstance(item["value"], int)
                and str(item["key"]).upper().endswith("_BOOL_I")
            )
        )
    ]
    async_add_entities(entities)


class AcondBinarySensor(
    CoordinatorEntity[AcondDataUpdateCoordinator],
    BinarySensorEntity,
):
    """Representation of an Acond binary XML value."""

    _attr_should_poll = False

    def __init__(
        self,
        coordinator: AcondDataUpdateCoordinator,
        entry: ConfigEntry,
        data_key: str,
        item: dict[str, Any],
    ) -> None:
        super().__init__(coordinator)
        self._data_key = data_key
        self._attr_translation_key = item["translation_key"]
        self._attr_suggested_object_id = item["suggested_object_id"]
        self._attr_has_entity_name = True
        self._attr_unique_id = f"{entry.entry_id}_{_safe_id(data_key)}"
        self._attr_device_info = {
            "identifiers": {(DOMAIN, entry.entry_id)},
            "name": "Acond Heat Pump",
            "manufacturer": "Acond",
            "model": "Tecomat",
        }

    @property
    def unique_id(self) -> str:
        return self._attr_unique_id

    @property
    def is_on(self) -> bool:
        item = self.coordinator.data.get(self._data_key)
        if not item:
            return False
        value = item["value"]
        if isinstance(value, bool):
            return value
        if isinstance(value, (int, float)):
            return value != 0
        return str(value).strip().lower() in ("1", "true", "on", "yes")

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        item = self.coordinator.data.get(self._data_key, {})
        attributes = {
            "xml_key": item.get("key"),
            "source_page": item.get("source_page"),
            "raw_value": item.get("raw_value"),
        }
        return attributes
