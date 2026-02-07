export type ZikrCategory = 'morning' | 'evening' | 'afterSalah' | 'favorites' | 'custom' | 'general';

export interface ZikrItem {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  recommendedCount: number;
  category?: ZikrCategory;
  isSunnah?: boolean;
  /** Optional Urdu translation for custom verses */
  translationUrdu?: string;
}

export interface CounterData {
  id: number;
  count: number;
  lastUpdated: string;
}

export type TasbihType = 'realistic' | 'tap';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  Counter: { zikr: ZikrItem };
  Leaderboard: undefined;
};

export type TabParamList = {
  Dhikr: undefined;
  Digital: undefined;
  Bluetooth: undefined;
  ProfileTab: undefined;
};

/** Profile tab stack: Profile (or guest view) + Settings + Login + SignUp */
export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  Login: { fromProfileTab?: boolean };
  SignUp: { fromProfileTab?: boolean };
};

/** Legacy: kept for DigitalTasbeehScreen (unused in nav; Dashboard is now tab root). */
export type DigitalStackParamList = {
  Tasbeeh: undefined;
  Dashboard: undefined;
};
