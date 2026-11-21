"""Constants for the Acond Integration."""

DOMAIN = "acond_integration"

CONF_HOST = "host"
CONF_HOSTNAME = "hostname"
CONF_AUTO_DISCOVER = "auto_discover"
CONF_USERNAME = "username"
CONF_PASSWORD = "password"
CONF_SCAN_INTERVAL = "scan_interval"

DEFAULT_HOST = "192.168.1.202"
DEFAULT_SCAN_INTERVAL = 120
MIN_SCAN_INTERVAL = 5

PAGE_URLS = {
    "PAGE49": "/PAGE49.XML",
    "PAGE63": "/PAGE63.XML",
    "PAGE61": "/PAGE61.XML",
}

TEMPERATURE_SUFFIX = "\u00b0C"
