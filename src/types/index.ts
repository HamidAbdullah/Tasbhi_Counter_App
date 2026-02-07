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
  Settings: undefined;
  Dashboard: undefined;
  Leaderboard: undefined;
};

export type TabParamList = {
  Dhikr: undefined;
  Digital: undefined;
  Bluetooth: undefined;
  ProfileTab: undefined;
};