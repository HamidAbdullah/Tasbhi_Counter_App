export const firebaseConfig = {
  apiKey: "AIzaSyDGrdo2GKkXSl4LsAANT9R4iJU_XasiN50",
  authDomain: "mariab-darood-app.firebaseapp.com",
  projectId: "mariab-darood-app",
  storageBucket: "mariab-darood-app.firebasestorage.app",
  messagingSenderId: "390113223871",
  appId: "1:390113223871:web:a9da12d11a194dae9f920a",
  measurementId: "G-31R7PWKBTR",
};

// Firestore collections
export const COLLECTIONS = {
  USERS: 'users',
  COUNTERS: 'counters',
  LEADERBOARD: 'leaderboard',
  DAILY_STATS: 'dailyStats',
  WEEKLY_STATS: 'weeklyStats',
  MONTHLY_STATS: 'monthlyStats',
};

// Document structure interfaces
export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  totalCount: number;
  totalRounds: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  preferences: {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    defaultRoundCount: number;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface CounterDocument {
  id: string;
  userId: string;
  zikrId: number;
  count: number;
  lastUpdated: Date;
  sessionCount: number;
  totalSessions: number;
}

export interface DailyStatsDocument {
  id: string; // Format: userId_YYYY-MM-DD
  userId: string;
  date: string; // YYYY-MM-DD format
  totalCount: number;
  roundsCompleted: number;
  sessionsCompleted: number;
  topZikr: string;
  timeSpent: number; // in minutes
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
  totalCount: number;
  rank: number;
  lastUpdated: Date;
}

// Firebase service functions (to be implemented when Firebase is set up)
export class FirebaseService {
  // Authentication methods
  static async signInWithGoogle() {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async signInWithEmail(email: string, password: string) {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async signUpWithEmail(email: string, password: string, displayName: string) {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async signOut() {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async getCurrentUser() {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  // Firestore methods
  static async createUser(userData: Partial<UserDocument>) {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async updateUser(uid: string, userData: Partial<UserDocument>) {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async getUser(uid: string): Promise<UserDocument | null> {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async saveCounterData(userId: string, zikrId: number, count: number) {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async getCounterData(userId: string, zikrId: number): Promise<CounterDocument | null> {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async updateDailyStats(userId: string, date: string, count: number) {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async getDailyStats(userId: string, date: string): Promise<DailyStatsDocument | null> {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async getLeaderboard(type: 'daily' | 'weekly' | 'monthly' | 'alltime', limit: number = 10): Promise<LeaderboardEntry[]> {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static async getUserRank(userId: string, type: 'daily' | 'weekly' | 'monthly' | 'alltime'): Promise<number> {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  // Real-time listeners
  static subscribeToLeaderboard(callback: (leaderboard: LeaderboardEntry[]) => void) {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }

  static subscribeToUserStats() {
    // Implementation will go here
    throw new Error('Firebase not configured yet');
  }
}

export default FirebaseService;
