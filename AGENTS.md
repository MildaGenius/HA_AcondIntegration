# AGENTS.md

Guidance for coding agents and contributors working on the Acond Integration for Home Assistant.

## Project

- This repository contains a Home Assistant custom integration for Acond heat pumps controlled by a Tecomat PLC.
- The integration domain is `acond_integration`.
- Runtime integration files are in `custom_components/acond_integration/`.
- API unit tests are in `tests/test_api.py`.
- XML examples captured from real Tecomat controllers are in `PageExamples/`.
- The root `README.md` documents installation, configuration, communication, entities, and testing.

## Commands

```powershell
# Run the current API unit tests
python -m unittest tests/test_api.py
```

There is currently no package manifest or separate lint configuration in the repository. Use Python syntax compilation and the smallest relevant test command before opening a change.

```powershell
python -m compileall acond_integration tests
```

## Architecture

- `__init__.py` sets up config entries and forwards them to platforms.
- `api.py` owns HTTP login, cookies, host resolution, XML fetching, and XML parsing.
- `coordinator.py` owns asynchronous polling through `DataUpdateCoordinator`.
- `config_flow.py` owns initial configuration and options.
- `const.py` owns domain and configuration constants.
- `sensor.py` creates regular sensor entities.
- `binary_sensor.py` creates binary sensor entities.
- `acond_logged_keys.json` contains known XML key metadata.
- `strings.json` contains source English strings and entity definitions.
- `translations/cs.json` and `translations/en.json` contain localized strings.

Keep these responsibilities separate. Do not place HTTP or XML parsing in entity platforms.

## Rules for every change

- Preserve asynchronous, non-blocking Home Assistant behavior.
- Use `aiohttp`, `DataUpdateCoordinator`, type hints, and Home Assistant config entries.
- Keep credentials in config-entry data or options. Never log passwords or derived session credentials.
- Do not log cookie values or full URLs containing sensitive query data.
- Keep the controller communication local and use HTTP only against the configured controller address.
- Set a bounded timeout for network requests.
- Detect expired Tecomat sessions and re-login safely, normally once per failed fetch.
- Treat malformed or unexpected XML as a communication failure or unavailable value; never crash the setup unexpectedly.
- Expose unknown XML keys instead of silently discarding them.
- Use page and key-specific metadata from `acond_logged_keys.json` when available.
- Do not guess entity names or units. Add mappings only from source definitions or diagnostic XML evidence.
- Preserve XML keys and raw values in entity attributes where they help users diagnose mappings.
- Keep XML parsing generic and add exact keys only as mappings become known.
- Add or update Czech and English strings for new user-facing text.
- Regenerate or update translations consistently; do not leave config-flow fields undocumented.
- Keep entity IDs and unique IDs stable. Unique IDs should include the config-entry identity and normalized XML key.
- One config entry represents one Tecomat controller and one Home Assistant device.
- Keep binary values out of regular sensors and expose appropriate flags as binary sensors.
- Update the root `README.md` for user-visible setup or behavior changes.
- Never introduce hardcoded real credentials or controller addresses in code or tests.

## XML and entity mapping

- Inputs and data elements may use `NAME` and `VALUE` attributes.
- XML values can be numeric, boolean, text, date, time, operating-hour strings, or binary payloads.
- PAGE49 XML represents operating data.
- PAGE63 XML represents trends and process values.
- PAGE61 XML represents operating hours.
- The parser must support unknown elements and attributes.
- `acond_logged_keys.json` is the mapping catalogue. Use exact page/key definitions for page-specific behavior and fall back to generic key definitions for shared values.
- Do not expose a mapped value as a binary sensor if the key catalogue identifies it as a regular sensor.
- Hidden catalogue entries must remain hidden in entity platforms.
- Real XML examples under `PageExamples/` are diagnostic fixtures and evidence for mappings.

## Testing

- Add a deterministic unit test for each communication or parser bug fix.
- Tests must not depend on a real controller, credentials, the internet, or Home Assistant runtime services.
- Keep mock sessions and fake responses independent and type-safe.
- Cover session initialization, credential rejection, expired sessions, malformed XML, unknown XML keys, and re-login behavior.
- Prefer one focused test method per behavior.
- Run the smallest relevant test command first, then the full API test file and syntax compilation.

## Review checklist

- Does the change affect another Tecomat page or entity mapping?
- Are units, device classes, binary states, `unknown`, and `unavailable` handled without crashes or fabricated zeros?
- Does it preserve stable entity IDs and unique IDs?
- Was a real XML example used instead of guessing an entity name or unit?
- Did the change add or update translations?
- Did the change avoid exposing passwords, cookies, or session credentials?
- Did the change update README documentation for a user-visible behavior?
- Is there a regression test that would fail before the fix?
