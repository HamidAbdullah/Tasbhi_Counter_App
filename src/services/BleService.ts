import {
    NativeModules,
    NativeEventEmitter,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import BleManager, { Peripheral, PeripheralInfo } from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export interface BleDevice extends Peripheral {
    connected?: boolean;
}

class BleService {
    private queue: Promise<any> = Promise.resolve();
    private isInitialized: boolean = false;

    constructor() {
        // Initialization is handled in initialize()
    }

    /**
     * Helper to queue BLE operations to prevent native overlaps/crashes
     */
    private async enqueue<T>(operation: () => Promise<T>): Promise<T> {
        const nextPromise = this.queue.then(operation);
        // We catch errors on the internal queue handle so subsequent operations can still run,
        // but we return the original promise (nextPromise) so the caller can handle the error.
        this.queue = nextPromise.catch((err) => {
            console.warn('[BleService] Queue operation background failure:', err);
            return null;
        });
        return nextPromise;
    }

    /**
     * Initializes the BLE Manager
     */
    async initialize() {
        if (this.isInitialized) return;
        try {
            await BleManager.start({ showAlert: false });
            this.isInitialized = true;
            console.log('[BleService] BLE Manager initialized');
        } catch (error) {
            console.error('[BleService] BLE Manager init error:', error);
        }
    }

    /**
     * Requests necessary permissions for Android and iOS
     */
    async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 31) {
                const result = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);

                return (
                    result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                );
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location to scan for Bluetooth devices.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
        }
        // iOS handles permissions via Info.plist and system prompts
        return true;
    }

    /**
     * Adds a listener for BLE events
     */
    addListener(event: string, callback: (data: any) => void) {
        return bleManagerEmitter.addListener(event, callback);
    }

    /**
     * Starts scanning for devices
     * @param duration Scanning duration in seconds
     */
    async startScan(duration: number = 10) {
        try {
            await BleManager.scan([], duration, true);
            console.log('[BleService] Scan started');
        } catch (error) {
            console.error('[BleService] Scan error:', error);
            throw error;
        }
    }

    /**
     * Stops the current scan
     */
    async stopScan() {
        try {
            await BleManager.stopScan();
            console.log('[BleService] Scan stopped');
        } catch (error) {
            console.error('[BleService] Stop scan error:', error);
        }
    }

    /**
     * Connects to a peripheral and retrieves its services
     */
    async connectToDevice(id: string): Promise<PeripheralInfo> {
        return this.enqueue(async () => {
            try {
                await BleManager.stopScan();
                await BleManager.connect(id);
                console.log('[BleService] Connected to:', id);
                const peripheralInfo = await BleManager.retrieveServices(id);
                console.log('[BleService] Services retrieved:', peripheralInfo);
                return peripheralInfo;
            } catch (error) {
                console.error('[BleService] Connection error:', error);
                throw error;
            }
        });
    }

    /**
     * Disconnects from a peripheral
     */
    async disconnectDevice(id: string) {
        return this.enqueue(async () => {
            try {
                await BleManager.disconnect(id);
                console.log('[BleService] Disconnected from:', id);
            } catch (error) {
                console.error('[BleService] Disconnection error:', error);
            }
        });
    }

    /**
     * Reads the value of a specific characteristic
     */
    async read(peripheralId: string, serviceUUID: string, characteristicUUID: string): Promise<number[]> {
        return this.enqueue(async () => {
            try {
                return await BleManager.read(peripheralId, serviceUUID, characteristicUUID);
            } catch (error) {
                console.error('[BleService] Read error:', error);
                throw error;
            }
        });
    }

    /**
     * Writes a value to a specific characteristic
     */
    async write(peripheralId: string, serviceUUID: string, characteristicUUID: string, data: number[]): Promise<void> {
        return this.enqueue(async () => {
            try {
                await BleManager.write(peripheralId, serviceUUID, characteristicUUID, data);
                console.log(`[BleService] Write success to ${characteristicUUID}:`, data);
            } catch (error) {
                console.error('[BleService] Write error:', error);
                throw error;
            }
        });
    }

    /**
     * Writes a value to a specific characteristic without waiting for response
     */
    async writeWithoutResponse(peripheralId: string, serviceUUID: string, characteristicUUID: string, data: number[]): Promise<void> {
        return this.enqueue(async () => {
            try {
                await BleManager.writeWithoutResponse(peripheralId, serviceUUID, characteristicUUID, data);
                console.log(`[BleService] Write (no response) success to ${characteristicUUID}:`, data);
            } catch (error) {
                console.error('[BleService] Write (no response) error:', error);
                throw error;
            }
        });
    }

    /**
     * Enables notifications for a specific characteristic
     */
    async startNotification(peripheralId: string, serviceUUID: string, characteristicUUID: string) {
        return this.enqueue(async () => {
            try {
                await BleManager.startNotification(peripheralId, serviceUUID, characteristicUUID);
                console.log(`[BleService] Notification started for ${characteristicUUID}`);
            } catch (error) {
                console.error('[BleService] Notification error:', error);
                throw error;
            }
        });
    }

    /**
     * Requests an MTU size for a connected device (Android only stability fix)
     */
    async requestMTU(peripheralId: string, mtu: number): Promise<number> {
        return this.enqueue(async () => {
            if (Platform.OS !== 'android') return mtu;
            try {
                const result = await BleManager.requestMTU(peripheralId, mtu);
                console.log(`[BleService] MTU requested: ${result}`);
                return result;
            } catch (error) {
                console.error('[BleService] requestMTU error:', error);
                return mtu;
            }
        });
    }

    /**
     * Requests connection priority (Android only stability fix)
     */
    async requestConnectionPriority(peripheralId: string, priority: 0 | 1 | 2): Promise<void> {
        return this.enqueue(async () => {
            if (Platform.OS !== 'android') return;
            try {
                await BleManager.requestConnectionPriority(peripheralId, priority);
                console.log(`[BleService] Connection priority set to: ${priority}`);
            } catch (error) {
                console.error('[BleService] requestConnectionPriority error:', error);
            }
        });
    }

    /**
     * Creates a bond with the device (Android specific stability fix)
     */
    async createBond(peripheralId: string): Promise<void> {
        return this.enqueue(async () => {
            if (Platform.OS !== 'android') return;
            try {
                console.log(`[BleService] Attempting to create bond with ${peripheralId}`);
                await BleManager.createBond(peripheralId);
                console.log('[BleService] Bond created or already exists');
            } catch (error) {
                console.warn('[BleService] Bonding error (often benign if already bonded):', error);
            }
        });
    }

    /**
     * Filters specifically for iQibla rings (Zikr or Zikr1)
     */
    isIQiblaDevice(peripheral: Peripheral): boolean {
        const name = (peripheral.name || peripheral.advertising?.localName || '').toLowerCase();
        // Strict focus on Zikr/iQibla related devices
        const isMatch = name.includes('zikr') || name.includes('qibla') || name.includes('noor');
        return isMatch;
    }
}

export default new BleService();
