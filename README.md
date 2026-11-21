# Acond Integration for Home Assistant

Acond Integration is a local-polling Home Assistant integration for Acond heat pumps controlled by a Tecomat PLC. It connects to the controller's built-in web interface, maintains the Tecomat login session, and exposes XML values from the controller as Home Assistant entities.

The integration is written for Home Assistant and uses asynchronous `aiohttp` requests with `DataUpdateCoordinator`.

## Features

- Local communication with a Tecomat/Acond controller over HTTP
- Config and options flows for IP address, Tecomat name, credentials, and polling interval
- Optional hostname or mDNS resolution with fallback to the manually configured IP address
- Automatic login and one re-login attempt after an expired session
- XML polling from:
  - `PAGE49.XML` - operating data
  - `PAGE63.XML` - trends and process values
  - `PAGE61.XML` - operating hours
- Sensors and binary sensors associated with one Home Assistant device
- XML key, source page, and raw value retained as entity attributes where useful
- Czech and English config, options, and entity translations

## Requirements

- Home Assistant
- An Acond heat pump or compatible Tecomat controller
- The controller reachable over the local network
- A valid Tecomat web-interface username and password

## Installation

1. Copy the `acond_integration` directory into the Home Assistant `custom_components` directory:

   ```text
   <config>/custom_components/acond_integration/
   ```

2. Restart Home Assistant.
3. Open **Settings** > **Devices & services**.
4. Select **Add integration** and search for **Acond Integration**.

## Configuration

The setup and options flows provide:

| Option | Description |
| --- | --- |
| IP address | Address of the Tecomat controller. The default example is `192.168.1.202`. |
| Tecomat name | Optional hostname or name used for DNS/mDNS resolution. |
| Automatically resolve Tecomat name | Resolves the Tecomat name before setup or reload. |
| Username | Tecomat web-interface username. |
| Password | Tecomat web-interface password. |
| Polling interval | Update interval in seconds. The default is 30 seconds; the minimum is 5 seconds. |

If automatic resolution fails, the integration falls back to the manually entered IP address.

## Communication and XML parsing

The integration obtains a `SoftPLC` session cookie from `/syswww/login.xml`. It calculates the Tecomat password value from the cookie and configured password and posts the username and derived password to the login endpoint.

After login, the coordinator periodically requests:

```text
http://<controller-ip>/PAGE49.XML
http://<controller-ip>/PAGE63.XML
http://<controller-ip>/PAGE61.XML
```

The XML parser:

- Parses `INPUT`, `DATA`, `ACCESS`, and other XML elements
- Reads `NAME` and `VALUE` attributes
- Falls back to element text and additional attributes for unknown structures
- Converts numeric, boolean, and text values
- Uses page-specific definitions from `acond_logged_keys.json` when available
- Creates a generated entity key for previously unknown variables
- Detects login pages and expired sessions and retries the login once
- Reports invalid XML or communication failures through `UpdateFailed`

Real XML can contain binary or large payload values. These are exposed with raw metadata and, where an `ML` attribute is available, a suitable sensor value.

## Entities

The integration creates one device named **Acond Heat Pump** under the Acond integration entry.

Available XML values are exposed as:

- Regular sensors for temperatures, strings, counters, operating times, and other process values
- Binary sensors for boolean values and status flags

Some values use the key catalogue in `acond_logged_keys.json` to provide:

- A stable suggested entity object ID
- An appropriate value type
- A Czech or English entity name
- Hidden or visible display behavior

Unknown XML keys remain available by generating a `PAGEXX:<XML_KEY>` data key and an entity ID. This allows real XML output to be inspected and mapped to a more descriptive entity name later.

Entity values and attributes can be used in dashboards, Automations, Templates, graphs, and the Home Assistant Recorder.

## Project structure

```text
acond_integration/
├── __init__.py
├── api.py
├── binary_sensor.py
├── acond_logged_keys.json
├── config_flow.py
├── const.py
├── coordinator.py
├── manifest.json
├── sensor.py
├── strings.json
└── translations/
    ├── cs.json
    └── en.json
```

## Development and testing

Run the API unit tests from the project root:

```powershell
python -m unittest tests/test_api.py
```

The included tests cover key catalogue handling, XML parsing, the SoftPLC login flow, derived passwords, cookies, and session handling.
