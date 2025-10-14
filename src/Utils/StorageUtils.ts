import AsyncStorage from '@react-native-async-storage/async-storage';
import {CounterData, ZikrItem} from '../types';

const COUNTER_DATA_KEY = 'tasbih_counter_data';
const CUSTOM_ZIKR_KEY = 'custom_zikr_data';

export const StorageUtils = {
  // Save counter data for a specific zikr
  saveCounterData: async (zikrId: number, count: number): Promise<void> => {
    try {
      const existingData = await AsyncStorage.getItem(COUNTER_DATA_KEY);
      const counters: CounterData[] = existingData ? JSON.parse(existingData) : [];
      
      const existingIndex = counters.findIndex(item => item.id === zikrId);
      const newCounterData: CounterData = {
        id: zikrId,
        count,
        lastUpdated: new Date().toISOString(),
      };
      
      if (existingIndex >= 0) {
        counters[existingIndex] = newCounterData;
      } else {
        counters.push(newCounterData);
      }
      
      await AsyncStorage.setItem(COUNTER_DATA_KEY, JSON.stringify(counters));
    } catch (error) {
      console.error('Error saving counter data:', error);
    }
  },

  // Get counter data for a specific zikr
  getCounterData: async (zikrId: number): Promise<number> => {
    try {
      const existingData = await AsyncStorage.getItem(COUNTER_DATA_KEY);
      if (!existingData) return 0;
      
      const counters: CounterData[] = JSON.parse(existingData);
      const counterData = counters.find(item => item.id === zikrId);
      
      return counterData ? counterData.count : 0;
    } catch (error) {
      console.error('Error getting counter data:', error);
      return 0;
    }
  },

  // Get all counter data
  getAllCounterData: async (): Promise<CounterData[]> => {
    try {
      const existingData = await AsyncStorage.getItem(COUNTER_DATA_KEY);
      return existingData ? JSON.parse(existingData) : [];
    } catch (error) {
      console.error('Error getting all counter data:', error);
      return [];
    }
  },

  // Reset counter for a specific zikr
  resetCounter: async (zikrId: number): Promise<void> => {
    try {
      const existingData = await AsyncStorage.getItem(COUNTER_DATA_KEY);
      if (!existingData) return;
      
      const counters: CounterData[] = JSON.parse(existingData);
      const filteredCounters = counters.filter(item => item.id !== zikrId);
      
      await AsyncStorage.setItem(COUNTER_DATA_KEY, JSON.stringify(filteredCounters));
    } catch (error) {
      console.error('Error resetting counter:', error);
    }
  },

  // Save custom zikr
  saveCustomZikr: async (zikr: ZikrItem): Promise<void> => {
    try {
      const existingData = await AsyncStorage.getItem(CUSTOM_ZIKR_KEY);
      const customZikrs: ZikrItem[] = existingData ? JSON.parse(existingData) : [];
      
      customZikrs.push(zikr);
      await AsyncStorage.setItem(CUSTOM_ZIKR_KEY, JSON.stringify(customZikrs));
    } catch (error) {
      console.error('Error saving custom zikr:', error);
    }
  },

  // Get all custom zikrs
  getCustomZikrs: async (): Promise<ZikrItem[]> => {
    try {
      const existingData = await AsyncStorage.getItem(CUSTOM_ZIKR_KEY);
      return existingData ? JSON.parse(existingData) : [];
    } catch (error) {
      console.error('Error getting custom zikrs:', error);
      return [];
    }
  },

  // Delete custom zikr
  deleteCustomZikr: async (zikrId: number): Promise<void> => {
    try {
      const existingData = await AsyncStorage.getItem(CUSTOM_ZIKR_KEY);
      if (!existingData) return;
      
      const customZikrs: ZikrItem[] = JSON.parse(existingData);
      const filteredZikrs = customZikrs.filter(zikr => zikr.id !== zikrId);
      
      await AsyncStorage.setItem(CUSTOM_ZIKR_KEY, JSON.stringify(filteredZikrs));
      
      // Also remove counter data for this zikr
      await (this as any).resetCounter(zikrId);
    } catch (error) {
      console.error('Error deleting custom zikr:', error);
    }
  },

  // Clear all data
  clearAllData: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([COUNTER_DATA_KEY, CUSTOM_ZIKR_KEY]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};