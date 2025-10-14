export interface ZikrItem {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  recommendedCount: number;
}

export interface CounterData {
  id: number;
  count: number;
  lastUpdated: string;
}

export type TasbihType = 'realistic' | 'tap';