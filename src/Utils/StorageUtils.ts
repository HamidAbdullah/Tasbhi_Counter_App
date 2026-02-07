import AsyncStorage from '@react-native-async-storage/async-storage';
import {CounterData, ZikrItem} from '../types';

const COUNTER_DATA_KEY = 'tasbih_counter_data';
const CUSTOM_ZIKR_KEY = 'custom_zikr_data';
const SETTINGS_KEY = 'app_settings';
const DAILY_STATS_KEY = 'daily_stats';
const STREAK_DATA_KEY = 'streak_data';
const RECENT_ZIKRS_KEY = 'recent_zikr_ids';
const MAX_RECENT_ZIKRS = 10;

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
      await StorageUtils.resetCounter(zikrId);
    } catch (error) {
      console.error('Error deleting custom zikr:', error);
    }
  },

  // Update custom zikr
  updateCustomZikr: async (zikrId: number, updatedZikr: ZikrItem): Promise<void> => {
    try {
      const existingData = await AsyncStorage.getItem(CUSTOM_ZIKR_KEY);
      if (!existingData) return;
      
      const customZikrs: ZikrItem[] = JSON.parse(existingData);
      const index = customZikrs.findIndex(zikr => zikr.id === zikrId);
      
      if (index >= 0) {
        customZikrs[index] = updatedZikr;
        await AsyncStorage.setItem(CUSTOM_ZIKR_KEY, JSON.stringify(customZikrs));
      }
    } catch (error) {
      console.error('Error updating custom zikr:', error);
    }
  },

  // Get settings
  getSettings: async (): Promise<any> => {
    try {
      const settings = await AsyncStorage.getItem(SETTINGS_KEY);
      return settings ? JSON.parse(settings) : {
        soundEnabled: true,
        vibrationEnabled: true,
        defaultRoundCount: 100,
        autoReset: false,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        soundEnabled: true,
        vibrationEnabled: true,
        defaultRoundCount: 100,
        autoReset: false,
      };
    }
  },

  // Save settings
  saveSettings: async (settings: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Save daily stats
  saveDailyStats: async (date: string, stats: any): Promise<void> => {
    try {
      const existingData = await AsyncStorage.getItem(DAILY_STATS_KEY);
      const dailyStats = existingData ? JSON.parse(existingData) : {};
      dailyStats[date] = stats;
      await AsyncStorage.setItem(DAILY_STATS_KEY, JSON.stringify(dailyStats));
    } catch (error) {
      console.error('Error saving daily stats:', error);
    }
  },

  // Get daily stats
  getDailyStats: async (date: string): Promise<any> => {
    try {
      const existingData = await AsyncStorage.getItem(DAILY_STATS_KEY);
      if (!existingData) return null;
      const dailyStats = JSON.parse(existingData);
      return dailyStats[date] || null;
    } catch (error) {
      console.error('Error getting daily stats:', error);
      return null;
    }
  },

  // Get all daily stats
  getAllDailyStats: async (): Promise<any> => {
    try {
      const existingData = await AsyncStorage.getItem(DAILY_STATS_KEY);
      return existingData ? JSON.parse(existingData) : {};
    } catch (error) {
      console.error('Error getting all daily stats:', error);
      return {};
    }
  },

  // Save streak data
  saveStreakData: async (streakData: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(STREAK_DATA_KEY, JSON.stringify(streakData));
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  },

  // Get streak data
  getStreakData: async (): Promise<any> => {
    try {
      const existingData = await AsyncStorage.getItem(STREAK_DATA_KEY);
      return existingData ? JSON.parse(existingData) : {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
      };
    } catch (error) {
      console.error('Error getting streak data:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
      };
    }
  },

  // Calculate dashboard stats
  calculateDashboardStats: async (): Promise<any> => {
    try {
      const counters = await StorageUtils.getAllCounterData();
      const dailyStats = await StorageUtils.getAllDailyStats();
      const streakData = await StorageUtils.getStreakData();
      
      const today = new Date().toISOString().split('T')[0];
      const todayStats = dailyStats[today] || { totalCount: 0, totalRounds: 0 };
      
      // Calculate weekly stats
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyCount = Object.keys(dailyStats)
        .filter(date => date >= weekAgo.toISOString().split('T')[0])
        .reduce((sum, date) => sum + (dailyStats[date]?.totalCount || 0), 0);
      
      // Calculate monthly stats
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const monthlyCount = Object.keys(dailyStats)
        .filter(date => date >= monthAgo.toISOString().split('T')[0])
        .reduce((sum, date) => sum + (dailyStats[date]?.totalCount || 0), 0);
      
      // Find most recited dhikr
      const zikrCounts: { [key: number]: number } = {};
      counters.forEach(counter => {
        zikrCounts[counter.id] = (zikrCounts[counter.id] || 0) + counter.count;
      });
      
      const mostRecitedId = Object.keys(zikrCounts).reduce((a, b) => 
        zikrCounts[parseInt(a)] > zikrCounts[parseInt(b)] ? a : b, '0'
      );
      
      return {
        totalCount: counters.reduce((sum, counter) => sum + counter.count, 0),
        totalRounds: counters.reduce((sum, counter) => sum + Math.floor(counter.count / 100), 0),
        dailyProgress: todayStats.totalCount,
        weeklyCount,
        monthlyCount,
        streak: streakData.currentStreak,
        mostRecitedZikrId: parseInt(mostRecitedId),
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      return {
        totalCount: 0,
        totalRounds: 0,
        dailyProgress: 0,
        weeklyCount: 0,
        monthlyCount: 0,
        streak: 0,
        mostRecitedZikrId: 0,
      };
    }
  },

  // Update streak logic
  updateStreak: async (): Promise<void> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const streakData = await StorageUtils.getStreakData();
      const todayStats = await StorageUtils.getDailyStats(today);
      
      if (todayStats && todayStats.totalCount > 0) {
        // User was active today
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const yesterdayStats = await StorageUtils.getDailyStats(yesterdayStr);
        
        if (yesterdayStats && yesterdayStats.totalCount > 0) {
          // Continue streak
          streakData.currentStreak += 1;
        } else if (streakData.lastActiveDate !== today) {
          // Start new streak
          streakData.currentStreak = 1;
        }
        
        streakData.longestStreak = Math.max(streakData.longestStreak, streakData.currentStreak);
        streakData.lastActiveDate = today;
      } else {
        // Check if streak should be reset (no activity for more than 1 day)
        const lastActive = streakData.lastActiveDate ? new Date(streakData.lastActiveDate) : null;
        if (lastActive) {
          const daysDiff = Math.floor((new Date().getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff > 1) {
            streakData.currentStreak = 0;
          }
        }
      }
      
      await StorageUtils.saveStreakData(streakData);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  },

  // Check and perform daily reset if needed
  checkDailyReset: async (): Promise<void> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastResetDate = await AsyncStorage.getItem('last_daily_reset');
      
      if (lastResetDate !== today) {
        // Perform daily reset
        await AsyncStorage.setItem('last_daily_reset', today);
        
        // Reset daily counters but keep total counts
        const counters = await StorageUtils.getAllCounterData();
        const todayStats = await StorageUtils.getDailyStats(today) || { totalCount: 0, totalRounds: 0 };
        
        // Update streak
        await StorageUtils.updateStreak();
        
        console.log('Daily reset completed for', today);
      }
    } catch (error) {
      console.error('Error performing daily reset:', error);
    }
  },

  // Recent zikrs (for "Recently used" section)
  addRecentZikr: async (zikrId: number): Promise<void> => {
    try {
      const raw = await AsyncStorage.getItem(RECENT_ZIKRS_KEY);
      const ids: number[] = raw ? JSON.parse(raw) : [];
      const next = [zikrId, ...ids.filter(id => id !== zikrId)].slice(0, MAX_RECENT_ZIKRS);
      await AsyncStorage.setItem(RECENT_ZIKRS_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Error saving recent zikr:', error);
    }
  },

  getRecentZikrIds: async (): Promise<number[]> => {
    try {
      const raw = await AsyncStorage.getItem(RECENT_ZIKRS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Error loading recent zikr ids:', error);
      return [];
    }
  },

  // Clear all data
  clearAllData: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        COUNTER_DATA_KEY,
        CUSTOM_ZIKR_KEY,
        SETTINGS_KEY,
        DAILY_STATS_KEY,
        STREAK_DATA_KEY,
        RECENT_ZIKRS_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};