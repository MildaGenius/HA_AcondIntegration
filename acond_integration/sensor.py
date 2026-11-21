"""Sensor platform for Acond Integration."""

from __future__ import annotations

import re
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
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

    known: set[str] = set()
    entities: list[AcondSensor] = []
    for key, item in coordinator.data.items():
        if not item.get("show", True):
            continue
        if item["type"] == "status" or str(item["key"]).upper().endswith(
            "_BOOL_I"
        ):
            continue
        if key in known:
            continue
        known.add(key)
        entities.append(AcondSensor(coordinator, entry, key, item))
    async_add_entities(entities)


class AcondSensor(CoordinatorEntity[AcondDataUpdateCoordinator], SensorEntity):
    """Representation of an Acond XML value."""

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
        if item["type"] == "temperature":
            self._attr_native_unit_of_measurement = "\u00b0C"
            self._attr_device_class = SensorDeviceClass.TEMPERATURE
        elif item["type"] == "payload":
            self._attr_native_unit_of_measurement = "B"
            self._attr_device_class = SensorDeviceClass.DATA_SIZE

    @property
    def unique_id(self) -> str:
        return self._attr_unique_id

    @property
    def native_value(self) -> Any:
        item = self.coordinator.data.get(self._data_key)
        if not item:
            return None
        if item["type"] == "payload":
            try:
                return int(item["attributes"].get("ML", len(item["raw_value"])))
            except (TypeError, ValueError):
                return len(item["raw_value"])
        return item["value"]

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        item = self.coordinator.data.get(self._data_key, {})
        attributes = {
            "xml_key": item.get("key"),
            "source_page": item.get("source_page"),
        }
        if item.get("type") != "payload":
            attributes["raw_value"] = item.get("raw_value")
        return attributes
