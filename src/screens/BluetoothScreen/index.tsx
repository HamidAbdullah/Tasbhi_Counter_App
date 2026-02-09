import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import BleManager, { Peripheral } from 'react-native-ble-manager';
import BleService, { BleDevice } from '../../services/BleService';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import {
  Bluetooth,
  BluetoothConnected,
  ClockCounterClockwise,
  MagnifyingGlass as SearchIcon,
  WarningCircle,
  BatteryHigh,
  BatteryMedium,
  BatteryLow,
  BatteryEmpty,
} from 'phosphor-react-native';

const BluetoothScreen: React.FC = () => {
  const { theme } = useTheme();
  // VERSION: 6.8.0 (Corrected Parsing + Optional Polling)
  useEffect(() => { console.log('[BluetoothScreen] App Logic Version: 6.8.0 (Polling + ByteFix Active)'); }, []);

  // 1. STATE HOOKS (Maintain order from initial stable render)
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState<Map<string, BleDevice>>(new Map());
  const [connectedDevice, setConnectedDevice] = useState<BleDevice | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'Disconnected' | 'Connecting' | 'Connected'>('Disconnected');
  const [tasbihCount, setTasbihCount] = useState<number>(0);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isHandshaking, setIsHandshaking] = useState(false);
  const insets = useSafeAreaInsets();
  const lastUpdateRef = useRef<number>(0);
  const isConnectingRef = useRef<boolean>(false);
  const pollingIntervalRef = useRef<any>(null);
  const [autoSync, setAutoSync] = useState(false);

  // Initialize BLE and listeners
  useEffect(() => {
    BleService.initialize();

    // Listener for when scanning stops
    const stopScanListener = BleService.addListener('BleManagerStopScan', () => {
      setIsScanning(false);
      console.log('[BluetoothScreen] Scan stopped');
    });

    // Listener for when a device is discovered
    const discoverDeviceListener = BleService.addListener('BleManagerDiscoverPeripheral', (peripheral: Peripheral) => {
      if (BleService.isIQiblaDevice(peripheral)) {
        console.log(`[BluetoothScreen] Found Zikr device: ${peripheral.name || peripheral.advertising?.localName} (${peripheral.id})`);
        setPeripherals(prev => {
          const newMap = new Map(prev);
          newMap.set(peripheral.id, peripheral);
          return newMap;
        });
      }
    });

    // Helpers: match characteristic UUID in both short (Android) and full 128-bit (iOS) form
    const isFF02 = (uuid: string) => {
      const u = uuid.toLowerCase();
      return u === '02f00000-0000-0000-0000-00000000ff02' || u.endsWith('ff02');
    };
    const isD002 = (uuid: string) => {
      const u = uuid.toLowerCase();
      return u === 'd002' || u.endsWith('d002');
    };

    // Listener for real-time value updates
    const updateValueListener = BleService.addListener('BleManagerDidUpdateValueForCharacteristic', (data: any) => {
      const charUuid = (data.characteristic || '').toLowerCase();
      if (!data.value || !Array.isArray(data.value) || data.value.length === 0) return;

      // Zikr Ring data channel (d002): ASCII CSV, last field = count
      if (isD002(charUuid)) {
        try {
          const str = String.fromCharCode(...data.value);
          const fields = str.split(',');
          const lastField = fields[fields.length - 1]?.trim();
          const count = parseInt(lastField, 10);
          if (!Number.isNaN(count) && count >= 0) {
            const preview = str.length > 60 ? str.slice(0, 60) + '...' : str;
            console.log(`[Tasbeeh] d002 CSV count: ${count} (raw: "${preview}")`);
            setTasbihCount(count);
          }
        } catch (e) {
          console.warn('[Tasbeeh] d002 parse error:', e);
        }
        return;
      }

      // Legacy ff02 (binary): bytes 2–3 = 16-bit count, optional battery at 4
      if (isFF02(charUuid)) {
        console.log(`[Tasbeeh] Update on ff02: [${data.value.join(', ')}]`);
        if (data.value.length >= 3) {
          const count = data.value[2] + (data.value[3] ? (data.value[3] << 8) : 0);
          if (count >= 0) {
            setTasbihCount(count);
          }
          if (data.value.length >= 5 && data.value[4] <= 100 && data.value[4] > 0) {
            setBatteryLevel(data.value[4]);
          }
        }
      }
    });

    // Listener for disconnection
    const disconnectListener = BleService.addListener('BleManagerDisconnectPeripheral', (data: any) => {
      console.log('[BluetoothScreen] Device disconnected:', data.peripheral);
      setConnectedDevice(null);
      setConnectionStatus('Disconnected');
      setTasbihCount(0);
      Alert.alert('Disconnected', 'The ring has been disconnected.');
    });

    return () => {
      stopScanListener.remove();
      discoverDeviceListener.remove();
      updateValueListener.remove();
      disconnectListener.remove();
    };
  }, []);

  /**
   * Triggers permission check and starts scanning
   */
  const handleStartScan = async () => {
    const granted = await BleService.requestPermissions();
    if (granted) {
      setPeripherals(new Map());
      setIsScanning(true);
      try {
        await BleService.startScan(10);
      } catch (error) {
        setIsScanning(false);
        Alert.alert('Error', 'Failed to start scanning.');
      }
    } else {
      Alert.alert('Permissions Required', 'Please grant Bluetooth and location permissions to find your ring.');
    }
  };

  /**
   * Helper to delay execution
   */
  const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

  /**
  * Connects to a selected device with a maximum-stability handshake (v2)
  */
  const handleConnect = useCallback(async (device: BleDevice) => {
    if (isHandshaking || isConnectingRef.current) return;

    setConnectionStatus('Connecting');
    setIsHandshaking(true);
    isConnectingRef.current = true;

    try {
      // 1. CLEAN SLATE: Force disconnect first to clear stale native handles
      console.log('[BluetoothScreen] 1/8 Cleaning stale connections...');
      await BleService.disconnectDevice(device.id);
      await sleep(1000);

      // 2. CONNECT
      console.log('[BluetoothScreen] 2/8 Initiating connection...');
      const peripheralInfo = await BleService.connectToDevice(device.id);

      // 3. BOND (Android stability fix)
      console.log('[BluetoothScreen] 3/8 Creating bond/pairing...');
      await BleService.createBond(device.id);

      // CRITICAL: LONG stabilization delay for Binder
      console.log('[BluetoothScreen] 4/8 Stabilizing bridge (5s)...');
      await sleep(5000);

      setConnectedDevice(device);
      setConnectionStatus('Connected');

      // 4. HARDWARE OPTIMIZATION
      console.log('[BluetoothScreen] 5/8 Optimizing MTU & Priority...');
      const info = await BleService.requestMTU(device.id, 512);
      await BleService.requestConnectionPriority(device.id, 1); // HIGH
      await sleep(1000);

      // DEBUG: Log all characteristic properties to help find why ff03 fails
      const SERVICE_UUID = '02f00000-0000-0000-0000-00000000fe00';
      const ff02 = '02f00000-0000-0000-0000-00000000ff02';
      const ff03 = '02f00000-0000-0000-0000-00000000ff03';
      const WRITE_CHAR = '02f00000-0000-0000-0000-00000000ff01';

      // DEBUG: Log all characteristic properties
      peripheralInfo.characteristics?.forEach((c: any) => {
        if (c.characteristic.toLowerCase().includes('ff0') || c.characteristic.toLowerCase().includes('d00')) {
          console.log(`[BLE Debug] Service ${c.service} Char ${c.characteristic}: ${JSON.stringify(c.properties)}`);
        }
      });

      // 5. NOTIFICATION – only subscribe to data characteristics (d002 = Zikr data; d004 is write-only)
      console.log('[BluetoothScreen] 6/8 Establishing notification streams...');
      const subs = [
        { s: SERVICE_UUID, c: ff02 },
        { s: 'd0ff', c: 'd002' },
      ];

      for (const sub of subs) {
        try {
          await BleService.startNotification(device.id, sub.s, sub.c);
          console.log(`[BluetoothScreen] Stream active: ${sub.c}`);
        } catch (e) {
          console.log(`[BluetoothScreen] Stream failed/skipped: ${sub.c}`);
        }
        await sleep(500);
      }

      // 6. ACTIVATION / SYNC TRIGGER
      console.log('[BluetoothScreen] 7/8 Triggering activation sequence...');
      // Broad spectrum of potential activation commands
      // [0x01] = Sync, [0x02] = Memory 2, [0x06, 0x01] = Real-time enable?, [0x05] = Time sync request?
      const activationCommands = [
        [0x01],
        [0x06, 0x01],
        [0x02],
        [0x08],
        [0x05],
        [0x11]
      ];

      for (const cmd of activationCommands) {
        await BleService.writeWithoutResponse(device.id, SERVICE_UUID, WRITE_CHAR, cmd);
        await sleep(400);
      }

      // Optional: one-off read from d002 to get current Zikr count (ASCII CSV)
      try {
        const d002Data = await BleService.read(device.id, 'd0ff', 'd002');
        if (d002Data?.length) {
          const str = String.fromCharCode(...d002Data);
          const fields = str.split(',');
          const lastField = fields[fields.length - 1]?.trim();
          const count = parseInt(lastField, 10);
          if (!Number.isNaN(count) && count >= 0) {
            setTasbihCount(count);
            console.log('[BluetoothScreen] Initial count from d002 read:', count);
          }
        }
      } catch (_) {
        // d002 read optional; notifications will provide updates
      }

      console.log('[BluetoothScreen] 8/8 Handshake Complete!');

    } catch (error) {
      console.error('[BluetoothScreen] High-Stability Setup Failed:', error);
      setConnectionStatus('Disconnected');
      setConnectedDevice(null);
      Alert.alert('Connection Failed', 'Bluetooth bridge error. Please retry.');
    } finally {
      setIsHandshaking(false);
      isConnectingRef.current = false;
    }
  }, [isHandshaking]);

  /**
   * Polling management
   */
  useEffect(() => {
    if (autoSync && connectedDevice && connectionStatus === 'Connected') {
      console.log('[BluetoothScreen] Starting Auto-Sync Polling (2s)');
      pollingIntervalRef.current = setInterval(() => {
        forceSync();
      }, 2000);
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [autoSync, connectedDevice, connectionStatus]);

  /**
   * Resets the tasbih count locally and on the device
   */
  const resetTasbih = async () => {
    if (!connectedDevice) return;

    console.log('[BluetoothScreen] Sending Reset Command (0x00)');
    try {
      await BleService.writeWithoutResponse(
        connectedDevice.id,
        '02f00000-0000-0000-0000-00000000fe00',
        '02f00000-0000-0000-0000-00000000ff01',
        [0x00]
      );
    } catch (e) { console.error('Reset failed', e); }
  };

  /**
   * Manually triggers a sync from the ring
   */
  const forceSync = async () => {
    if (!connectedDevice) return;
    console.log('[BluetoothScreen] Manually triggering sync (0x01)');
    try {
      await BleService.writeWithoutResponse(
        connectedDevice.id,
        '02f00000-0000-0000-0000-00000000fe00',
        '02f00000-0000-0000-0000-00000000ff01',
        [0x01]
      );
    } catch (e) { console.error('Force sync failed', e); }
  };

  /**
   * Direct read: try Zikr ring d002 (ASCII CSV) first, then legacy ff02 (binary)
   */
  const directRead = async () => {
    if (!connectedDevice) return;
    const SERVICE_UUID = '02f00000-0000-0000-0000-00000000fe00';
    const ff02 = '02f00000-0000-0000-0000-00000000ff02';
    try {
      const data = await BleService.read(connectedDevice.id, 'd0ff', 'd002');
      if (data?.length) {
        const str = String.fromCharCode(...data);
        const fields = str.split(',');
        const lastField = fields[fields.length - 1]?.trim();
        const count = parseInt(lastField, 10);
        if (!Number.isNaN(count) && count >= 0) {
          setTasbihCount(count);
          console.log('[Tasbeeh] Count from d002 read:', count);
          return;
        }
      }
    } catch (_) {
      // Fallback to ff02
    }
    try {
      const data = await BleService.read(connectedDevice.id, SERVICE_UUID, ff02);
      if (data?.length >= 3) {
        const count = (data[1] << 8) + data[2];
        setTasbihCount(count);
        console.log('[Tasbeeh] Count from ff02 read:', count);
      }
    } catch (e) { console.error('Direct read failed', e); }
  };

  /**
   * Disconnects the currently connected device
   */
  const handleDisconnect = useCallback(async () => {
    if (connectedDevice) {
      await BleService.disconnectDevice(connectedDevice.id);
      setConnectedDevice(null);
      setConnectionStatus('Disconnected');
      setTasbihCount(0);
    }
  }, [connectedDevice]);

  const renderDeviceItem = ({ item }: { item: BleDevice }) => (
    <Card style={styles.deviceCard} variant="outlined">
      <View style={styles.deviceInfo}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '10' }]}>
          <Bluetooth size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[theme.typography.body, { color: theme.colors.text, fontWeight: '600' }]}>
            {item.name || item.advertising?.localName || 'iQibla Ring'}
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            {item.id}
          </Text>
        </View>
      </View>
      <Button
        title="Connect"
        onPress={() => handleConnect(item)}
        size="small"
        variant="primary"
        style={styles.connectButton}
      />
    </Card>
  );

  return (
    <ScreenWrapper withPadding={false}>
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
          <Text style={[theme.typography.h2, { color: theme.colors.text }]}>Smart Ring</Text>
          <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
            Pair your iQibla ring to sync your tasbih counts automatically.
          </Text>
        </View>

        {connectedDevice ? (
          <View style={styles.connectedView}>
            <Card style={styles.mainCard} variant="elevated">
              <View style={styles.statusRow}>
                <View style={styles.badge}>
                  <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
                  <Text style={[theme.typography.label, { color: theme.colors.success, fontSize: 12 }]}>CONNECTED</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {batteryLevel !== null && (
                    <View style={[styles.badge, { marginRight: 8, backgroundColor: theme.colors.border + '20' }]}>
                      {batteryLevel > 75 ? <BatteryHigh size={16} color={theme.colors.success} /> :
                        batteryLevel > 50 ? <BatteryMedium size={16} color={theme.colors.warning} /> :
                          batteryLevel > 20 ? <BatteryLow size={16} color={theme.colors.warning} /> :
                            <BatteryEmpty size={16} color={theme.colors.error} />}
                      <Text style={[theme.typography.label, { color: theme.colors.text, fontSize: 12, marginLeft: 4 }]}>
                        {batteryLevel}%
                      </Text>
                    </View>
                  )}
                  <BluetoothConnected size={28} color={theme.colors.success} weight="fill" />
                </View>
              </View>

              <Text style={[theme.typography.h3, { color: theme.colors.text, textAlign: 'center', marginTop: 12 }]}>
                {connectedDevice.name || 'Zikr Ring'}
              </Text>

              <View style={styles.divider} />

              <View style={styles.countSection}>
                <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>REAL-TIME COUNT</Text>
                <Text style={[theme.typography.h1, { color: theme.colors.primary, fontSize: 64, marginVertical: 8 }]}>
                  {tasbihCount}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>
                  Press the button on your ring to update
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
                  <Button
                    title={autoSync ? "Stop Polling" : "Auto Poll"}
                    onPress={() => setAutoSync(!autoSync)}
                    variant={autoSync ? "primary" : "outline"}
                    size="small"
                    style={{ margin: 4, paddingHorizontal: 12 }}
                  />
                  <Button
                    title="Read"
                    onPress={directRead}
                    variant="outline"
                    size="small"
                    style={{ margin: 4, paddingHorizontal: 12 }}
                  />
                  <Button
                    title="Reset"
                    onPress={resetTasbih}
                    variant="outline"
                    size="small"
                    style={{ margin: 4, paddingHorizontal: 12 }}
                  />
                </View>
              </View>

              <Button
                title="Disconnect Ring"
                onPress={handleDisconnect}
                variant="outline"
                fullWidth
                style={{ marginTop: 24, borderColor: theme.colors.error }}
                textStyle={{ color: theme.colors.error }}
              />
            </Card>

            <View style={styles.tipContainer}>
              <WarningCircle size={18} color={theme.colors.textSecondary} />
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginLeft: 8 }]}>
                Keep the app open for background synchronization.
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.scanSection}>
              <Button
                title={isScanning ? 'Searching...' : 'Scan for Devices'}
                onPress={handleStartScan}
                loading={isScanning}
                fullWidth
                icon={<SearchIcon size={20} color={theme.colors.surface} style={{ marginRight: 8 }} />}
              />
            </View>

            <View style={styles.listHeader}>
              <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>
                AVAILABLE RINGS ({peripherals.size})
              </Text>
            </View>

            <FlatList
              data={Array.from(peripherals.values())}
              renderItem={renderDeviceItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listPadding}
              ListEmptyComponent={
                <View style={styles.emptyView}>
                  {!isScanning ? (
                    <>
                      <ClockCounterClockwise size={48} color={theme.colors.border} weight="light" />
                      <Text style={[theme.typography.bodySmall, { color: theme.colors.textTertiary, marginTop: 16, textAlign: 'center' }]}>
                        No rings found yet.{"\n"}Make sure your ring is nearby and in pairing mode.
                      </Text>
                    </>
                  ) : (
                    <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                      Looking for Zikr rings...
                    </Text>
                  )}
                </View>
              }
            />
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  scanSection: {
    marginBottom: 20,
  },
  listHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  listPadding: {
    paddingBottom: 40,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  connectButton: {
    minHeight: 32,
    paddingHorizontal: 16,
  },
  connectedView: {
    flex: 1,
  },
  mainCard: {
    padding: 24,
    borderRadius: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#38a16915',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginVertical: 20,
  },
  countSection: {
    alignItems: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  buttonGroup: {
    width: '100%',
  },
});

export default BluetoothScreen;
