import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeMode, getTheme, darkTheme } from '../theme';

const PREFERENCES_KEY = 'app_preferences';

interface AppPreferences {
  ramadanMode?: boolean;
  focusMode?: boolean;
  dailyReminderEnabled?: boolean;
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  ramadanMode: boolean;
  setRamadanMode: (on: boolean) => void;
  focusMode: boolean;
  setFocusMode: (on: boolean) => void;
  dailyReminderEnabled: boolean;
  setDailyReminderEnabled: (on: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = 'theme_mode';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [isInitialized, setIsInitialized] = useState(false);
  const [ramadanMode, setRamadanModeState] = useState(false);
  const [focusMode, setFocusModeState] = useState(false);
  const [dailyReminderEnabled, setDailyReminderEnabledState] = useState(true);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const setRamadanMode = async (on: boolean) => {
    try {
      setRamadanModeState(on);
      const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
      const prefs: AppPreferences = raw ? JSON.parse(raw) : {};
      prefs.ramadanMode = on;
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving ramadan mode:', error);
    }
  };

  const setFocusMode = async (on: boolean) => {
    try {
      setFocusModeState(on);
      const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
      const prefs: AppPreferences = raw ? JSON.parse(raw) : {};
      prefs.focusMode = on;
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving focus mode:', error);
    }
  };

  const setDailyReminderEnabled = async (on: boolean) => {
    try {
      setDailyReminderEnabledState(on);
      const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
      const prefs: AppPreferences = raw ? JSON.parse(raw) : {};
      prefs.dailyReminderEnabled = on;
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving daily reminder:', error);
    }
  };

  const toggleTheme = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('light');
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [savedThemeMode, rawPrefs] = await Promise.all([
          AsyncStorage.getItem(THEME_STORAGE_KEY),
          AsyncStorage.getItem(PREFERENCES_KEY),
        ]);
        if (savedThemeMode && ['light', 'dark', 'auto'].includes(savedThemeMode)) {
          setThemeModeState(savedThemeMode as ThemeMode);
        }
        if (rawPrefs) {
          const prefs: AppPreferences = JSON.parse(rawPrefs);
          if (prefs.ramadanMode != null) setRamadanModeState(prefs.ramadanMode);
          if (prefs.focusMode != null) setFocusModeState(prefs.focusMode);
          if (prefs.dailyReminderEnabled != null) setDailyReminderEnabledState(prefs.dailyReminderEnabled);
        }
      } catch (error) {
        console.error('Error loading theme/preferences:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    load();
  }, []);

  const theme = getTheme(themeMode, systemColorScheme || 'light', ramadanMode);
  const isDark = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');

  if (!isInitialized) {
    return (
      <ThemeContext.Provider
        value={{
          theme: getTheme('auto', systemColorScheme || 'light'),
          themeMode: 'auto',
          setThemeMode,
          toggleTheme,
          isDark: systemColorScheme === 'dark',
          ramadanMode: false,
          setRamadanMode,
          focusMode: false,
          setFocusMode,
          dailyReminderEnabled: true,
          setDailyReminderEnabled,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        toggleTheme,
        isDark,
        ramadanMode,
        setRamadanMode,
        focusMode,
        setFocusMode,
        dailyReminderEnabled,
        setDailyReminderEnabled,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
