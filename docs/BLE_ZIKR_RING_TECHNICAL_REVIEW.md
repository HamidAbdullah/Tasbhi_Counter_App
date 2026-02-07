# BLE Zikr Ring – Technical Review

**Document version:** 1.0  
**Date:** 2025-02-02  
**Scope:** BLE integration, notification handling, and data parsing for the Zikr Ring. No code changes; review and plan only.

---

## 1. Context and Research Summary

### 1.1 Device and protocol (from your nRF Connect research)

| Item | Details |
|------|--------|
| **Characteristic 0xD002** | NOTIFY + READ. **Data channel** – device pushes sensor/state updates here. |
| **Value format** | ASCII string, CSV-like, e.g. `"Q07,0140,50453261,0,0,0000000000000000,147"`. |
| **Zikr count** | Last CSV field; increments when the ring button is pressed (e.g. `147`). |
| **Characteristic 0xD004** | WRITE / WRITE_NO_RESPONSE. **Command channel** – e.g. vibration; not for reading count. |

### 1.2 Why 0xD002 for listening

- 0xD002 has **NOTIFY** (and READ). The ring sends updates by **notifying** on this characteristic.
- To get real-time Zikr count you must **subscribe to notifications** on 0xD002 and parse the CSV in the notification callback.
- READ on 0xD002 can be used for one-off reads (e.g. initial sync), but the primary flow is NOTIFY.

### 1.3 Why 0xD004 is write-only

- 0xD004 has **WRITE / WRITE_NO_RESPONSE** only (no NOTIFY/INDICATE in your research).
- It is for **sending commands** (e.g. vibration). The app should **only write** to 0xD004, not subscribe for notifications.
- Subscribing to 0xD004 is unnecessary and may fail or be ignored by the stack.

### 1.4 Data format and parsing

- Payload is **ASCII text**: each byte is an ASCII code (e.g. `'1'` = 49, `'4'` = 52, `'7'` = 55).
- Parsing steps:
  1. Treat `value` as a **byte array** (each element 0–255).
  2. Decode to string: **ASCII** → e.g. `String.fromCharCode(...value)` (no base64 in the notification path – see below).
  3. Split by comma: `string.split(',')`.
  4. Last field is the Zikr count: `fields[fields.length - 1]`, then `parseInt(..., 10)`.

Example: `"Q07,0140,50453261,0,0,0000000000000000,147"` → count = `147`.

---

## 2. Library and value format

**Clarification:** The app uses **react-native-ble-manager** (v11.0.0), not react-native-ble-plx. The following is based on react-native-ble-manager.

- **Event:** `BleManagerDidUpdateValueForCharacteristic`
- **Payload type:** `BleManagerDidUpdateValueForCharacteristicEvent` has `value: number[]` (array of byte values 0–255).
- **No base64 in this path:** The native layer already converts the raw bytes to a JS array of numbers; the app does not receive base64 for this event. (Other APIs in the library may use base64; the notification event does not.)

So the pipeline is: **raw BLE bytes → native → JS as `number[]`**. Decoding is: bytes → ASCII string → CSV → last field = count.

---

## 3. Current implementation summary

### 3.1 BleService (`src/services/BleService.ts`)

- Uses **react-native-ble-manager**: `BleManager.start`, `scan`, `connect`, `retrieveServices`, `read`, `write`, `writeWithoutResponse`, `startNotification`, etc.
- **No** `stopNotification` exposed (only `startNotification` used in the app).
- Queues operations via `enqueue()`.
- No subscription to 0xD002/0xD004 inside BleService; subscription is done in the screen.

### 3.2 BluetoothScreen (`src/screens/BluetoothScreen/index.tsx`)

**Connection handshake (after connect):**

- Service UUID used for “Zikr” data/commands: `02f00000-0000-0000-0000-00000000fe00` (full 128-bit).
- For “d0ff” service: subscribes to:
  - `{ s: 'd0ff', c: 'd002' }`
  - `{ s: 'd0ff', c: 'd004' }`
- Also subscribes to `{ s: SERVICE_UUID, c: ff02 }` (02f0...ff02).
- Activation: writes to `WRITE_CHAR` `02f0...ff01` with `[0x01]`, `[0x06,0x01]`, etc.

**Notification listener (`BleManagerDidUpdateValueForCharacteristic`):**

- Filters by characteristic: `02f00000-0000-0000-0000-00000000ff02` OR `d002` OR `d004`.
- Treats `data.value` as **binary**:  
  `count = data.value[2] + (data.value[3] ? (data.value[3] << 8) : 0)` (bytes 2 and 3 as 16-bit little-endian).
- Optional battery from `data.value[4]` if present and in 1–100.

**Read:**

- `directRead()` reads from `ff02` (service `02f0...fe00`), then `count = (data[1] << 8) + data[2]` (again binary).

**Writes (sync/reset):**

- All to service `02f0...fe00`, characteristic `02f0...ff01` (WRITE_CHAR), not to 0xD004.

---

## 4. Problems / bugs / incorrect parts

### 4.1 Wrong data model for 0xD002 (critical)

- **Current:** `data.value` is interpreted as **binary**: count from bytes at indices 2 and 3 (and optionally battery at 4).
- **Actual (from nRF):** 0xD002 carries an **ASCII CSV string** (e.g. `"Q07,0140,50453261,0,0,0000000000000000,147"`).
- **Effect:** Count (and any battery from the same payload) will be wrong. For ASCII, e.g. first bytes are `'Q','0','7',','` (81, 48, 55, 44…), so `data.value[2]` and `data.value[3]` are not a 16-bit count.

**Conclusion:** Parsing must treat 0xD002 as **ASCII text**, then CSV, then last field as count.

### 4.2 Subscribing to 0xD004

- 0xD004 is **write-only** (WRITE / WRITE_NO_RESPONSE). Subscribing to notifications there is unnecessary and may fail.
- **Change:** Only **write** to 0xD004 for commands (e.g. vibration). Do **not** call `startNotification` for 0xD004.

### 4.3 Characteristic UUID matching on iOS (likely bug)

- **Android (react-native-ble-manager):** When sending the event, the library can normalize UUIDs to **short form** (e.g. `"d002"`) via `UUIDHelper.uuidToString`.
- **iOS:** The event uses `characteristic.uuid.uuidString.lowercased()`, which is typically the **full 128-bit** string (e.g. `"0000d002-0000-1000-8000-00805f9b34fb"`).
- **Current check:** `charUuid === 'd002'` (and similar for d004). On iOS, `charUuid` will be the full UUID, so the condition **never matches** and 0xD002 notifications are ignored on iOS.

**Conclusion:** Characteristic matching must work for both short and full UUIDs (e.g. “ends with” or normalized short form).

### 4.4 Service UUID for 0xD002 (assumption to verify)

- Code uses service **`d0ff`** for characteristics `d002` and `d004`. The library expands 4-char UUIDs to 128-bit (e.g. `0000d0ff-0000-1000-8000-00805f9b34fb`).
- **Assumption:** The service that contains 0xD002 (and 0xD004) on the Zikr Ring is 0xD0FF. This should be **confirmed in nRF Connect** (exact service UUID that contains 0xD002). If the real service is different, subscriptions and writes will fail until the correct service UUID is used.

### 4.5 Listening to 0xD004 in the handler

- Even if subscription to 0xD004 is removed, the **listener** still handles `charUuid === 'd004'` and tries to parse count from bytes 2–3. Since 0xD004 is not a data channel, that parsing is meaningless and can be removed. Only 0xD002 (and optionally ff02 if you keep it) should drive count/battery from notifications.

### 4.6 No explicit stopNotification on disconnect

- When the user disconnects or the device drops, the app does not call `stopNotification` for 0xD002 (BleService does not expose it). Many stacks clean up automatically on disconnect, but explicitly stopping notifications on disconnect is good practice and avoids ambiguity.

### 4.7 Optional: Chunked notifications

- If the ring sends the CSV in **multiple notification packets**, a single `value` could be a **partial** string. The current logic assumes one notification = one full CSV line. If you see truncated or multiple packets in nRF Connect, you may need a small buffer (e.g. accumulate until newline or stable delimiter) before parsing. Mark as **optional** until you confirm behavior.

---

## 5. Required fixes and improvements

| # | Item | Action |
|---|------|--------|
| 1 | **0xD002 parsing** | Decode `value` as ASCII, split by `,`, take last field, `parseInt(..., 10)` for Zikr count. Do not use binary bytes 2–3 for count. |
| 2 | **0xD004** | Do not subscribe to 0xD004. Use 0xD004 only for writes (e.g. vibration). Remove 0xD004 from notification subscription list and from the “count/battery” branch of the listener. |
| 3 | **Characteristic matching** | Normalize or compare so both Android (short "d002") and iOS (full "0000d002-...") match. E.g. `isDataCharacteristic(charUuid)` that returns true if `charUuid` is 0xD002 in short or full form. |
| 4 | **Service UUID** | Confirm in nRF Connect the exact service UUID that contains 0xD002 (and 0xD004). If it is not 0xD0FF, replace `'d0ff'` with the correct UUID. |
| 5 | **Listener scope** | In the update-value listener, only parse count (and battery if present) from 0xD002 (and from ff02 only if you still use that and know its format). Remove 0xD004 from count/battery logic. |
| 6 | **directRead** | If you use direct read on 0xD002, the same ASCII CSV format applies: decode bytes to string, split by comma, last field = count. Current `directRead` uses ff02 and binary parsing; if you add read from 0xD002, use CSV parsing. |
| 7 | **stopNotification (optional)** | Expose `stopNotification` in BleService and call it for 0xD002 (and ff02 if used) on disconnect. |
| 8 | **Chunking (optional)** | If you observe chunked notifications for 0xD002, add a buffer and parse only when you have a full CSV line. |

---

## 6. Step-by-step implementation plan

After you confirm, implementation can proceed in this order:

1. **Verify UUIDs**
   - In nRF Connect, note the **exact service UUID** that contains 0xD002 (and 0xD004). Update the app’s service UUID constant if it is not `d0ff`.

2. **Characteristic matching helper**
   - Add a small helper (e.g. `isZikrDataCharacteristic(uuid: string): boolean`) that returns true for 0xD002 in both short (`"d002"`) and full 128-bit form (e.g. `...-0000-1000-8000-00805f9b34fb` with `d002` in the right place). Use this in the listener instead of `charUuid === 'd002'`.

3. **Subscription list**
   - Remove 0xD004 from the list of characteristics passed to `startNotification`. Keep only 0xD002 (and ff02 only if you still need it). Do not subscribe to 0xD004.

4. **Parsing for 0xD002**
   - In the `BleManagerDidUpdateValueForCharacteristic` handler:
     - If the characteristic is not 0xD002 (and not ff02 if kept), return or skip count/battery parsing.
     - For 0xD002: ensure `data.value` is a non-empty array; decode to string: `String.fromCharCode(...data.value)`; split by `','`; take the last element; `parseInt(lastField, 10)`; if the result is a valid number, call `setTasbihCount(count)`. Optionally parse battery from the same CSV if the format is documented (e.g. a specific column).
   - Remove binary parsing (bytes 2–3, 4) for 0xD002.

5. **Stop handling 0xD004 in the listener**
   - Remove the branch that treats 0xD004 as a source of count/battery. Use 0xD004 only in write paths (e.g. vibration command).

6. **directRead (if used with 0xD002)**
   - If you add or switch a “Read” action to 0xD002, use the same ASCII → CSV → last-field parsing. Do not use binary parsing for 0xD002.

7. **Optional: stopNotification on disconnect**
   - In BleService, add `stopNotification(deviceId, serviceUUID, characteristicUUID)` and call it for 0xD002 (and ff02 if used) when disconnecting.

8. **Optional: chunked notifications**
   - Only if you see multi-packet notifications: buffer `value` until you have a complete CSV line (e.g. by newline or length), then parse.

---

## 7. Assumptions

- **Service UUID:** The service containing 0xD002 and 0xD004 is **0xD0FF** (128-bit: `0000d0ff-0000-1000-8000-00805f9b34fb`) until verified in nRF Connect.
- **CSV format:** The last field of the 0xD002 string is always the Zikr count (integer, base 10). Other fields (e.g. battery) are not specified here; battery parsing can be added later if the protocol is documented.
- **Single packet:** One notification = one full CSV line. If the device sends one line in multiple packets, the optional chunking in step 8 is needed.
- **Library:** Behavior and types are as in **react-native-ble-manager** v11.0.0; notification event `value` is `number[]` (bytes), not base64.
- **Vibration:** You mentioned vibration works; the review assumes 0xD004 is used for that. The current app code uses `02f0...ff01` for sync/reset only; no 0xD004 write was found. If vibration is implemented elsewhere or planned, use 0xD004 for those writes only.

---

## 8. Summary

- Use **0xD002** for **listening** (NOTIFY); parse **ASCII CSV** and take the **last field** as Zikr count.
- Use **0xD004** only for **writing** commands (e.g. vibration); do **not** subscribe to it.
- Fix **parsing** (binary → ASCII CSV), **UUID matching** (iOS full UUID), and **subscription list** (remove 0xD004). Verify **service UUID** (0xD0FF) in nRF Connect.
- After confirmation, apply the steps above in order and refactor with minimal scope (BLE, notifications, parsing only).
