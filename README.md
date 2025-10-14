# Digital Tasbih Counter - Modern Islamic App

A beautiful, modern digital tasbih counter app built with React Native, featuring Islamic themes, real-time tracking, and comprehensive user statistics.

## ✨ Features

### 🎨 Modern UI & Theme System
- **Material 3 Design** with Islamic-inspired aesthetics
- **Light/Dark Mode** support with automatic system theme detection
- **Smooth Animations** and transitions throughout the app
- **Responsive Design** that works on all screen sizes
- **Custom Color Palette** with primary, secondary, and accent colors

### 🧮 Enhanced Counter Features
- **Beautiful Circular Progress** indicators
- **Real-time Progress Tracking** with visual feedback
- **Haptic Feedback** and sound effects
- **Customizable Round Counts** (default 100, user-configurable)
- **Auto-reset Option** after completing rounds
- **Session Statistics** with detailed tracking

### 📊 Personal Dashboard
- **Daily Progress Tracking** with circular progress indicators
- **Comprehensive Statistics** (total count, rounds, streaks)
- **Weekly & Monthly Overviews**
- **Goal Setting** and achievement tracking
- **Favorite Zikr Tracking**

### 🏆 Leaderboard System
- **Real-time Rankings** (Daily, Weekly, Monthly, All-time)
- **User Profiles** with avatars and statistics
- **Achievement System** with medals and trophies
- **Current User Position** highlighting
- **Pull-to-refresh** functionality

### ⚙️ Advanced Settings
- **Theme Customization** (Light/Dark/Auto)
- **Sound & Haptic Controls**
- **Default Round Count** configuration
- **Auto-reset Settings**
- **Data Management** (export/import/reset)

### 🔐 Firebase Integration (Ready for Setup)
- **User Authentication** (Google + Email sign-in)
- **Real-time Data Sync** across devices
- **Cloud Storage** for user data and preferences
- **Leaderboard Backend** with Firestore
- **Offline Support** with local storage fallback

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 20)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TasbihCounter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Firebase dependencies** (Optional - for full functionality)
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage @react-native-community/google-signin
   ```

4. **iOS Setup** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

5. **Run the app**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## 🔧 Firebase Setup (Optional)

To enable Firebase features:

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore

2. **Configure Authentication**
   - Enable Google Sign-in
   - Enable Email/Password authentication

3. **Setup Firestore Database**
   - Create database in test mode
   - Set up security rules for user data

4. **Add Configuration**
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place them in the appropriate directories
   - Update `src/config/firebase.ts` with your configuration

5. **Enable Google Sign-in**
   - Add SHA-1 fingerprint for Android
   - Configure OAuth consent screen

## 📱 App Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── CircularProgress.tsx
│   ├── ModernTapTasbih.tsx    # Enhanced counter component
│   └── TapTasbih.tsx         # Original counter component
├── contexts/
│   └── ThemeContext.tsx      # Theme management
├── screens/
│   ├── ModernHomeScreen/     # Main home screen
│   ├── ModernCounterScreen/  # Counter interface
│   ├── DashboardScreen/      # User statistics
│   ├── SettingsScreen/       # App settings
│   └── LeaderboardScreen/    # Rankings
├── theme/
│   └── index.ts             # Theme definitions
├── types/
│   └── index.ts             # TypeScript interfaces
├── constants/
│   └── AzkarData.ts         # Islamic dhikr data
└── Utils/
    └── StorageUtils.ts      # Local storage utilities
```

## 🎨 Theme System

The app uses a comprehensive theme system with:

- **Light Theme**: Clean, modern appearance
- **Dark Theme**: Easy on the eyes with Islamic green accents
- **Auto Theme**: Follows system preference
- **Customizable Colors**: Primary, secondary, accent colors
- **Typography Scale**: Consistent font sizes and weights
- **Shadow System**: Material Design shadows

## 📊 Data Management

### Local Storage
- User preferences and settings
- Counter data and session history
- Custom dhikr entries
- Theme preferences

### Firebase Integration (When Configured)
- User authentication and profiles
- Real-time leaderboard data
- Cross-device synchronization
- Cloud backup of user data

## 🔧 Customization

### Adding New Dhikr
Users can add custom dhikr through the app interface:
1. Tap "Add New Dhikr" on the home screen
2. Enter Arabic text, transliteration, translation
3. Set recommended count
4. Add reference (optional)

### Theme Customization
Developers can customize themes in `src/theme/index.ts`:
- Color palettes
- Typography scales
- Spacing system
- Shadow definitions

## 🚀 Performance Features

- **Optimized Animations** using React Native Reanimated
- **Efficient State Management** with React Context
- **Lazy Loading** for large datasets
- **Memory Management** with proper cleanup
- **Smooth 60fps** animations throughout

## 📱 Platform Support

- **Android**: API level 21+ (Android 5.0+)
- **iOS**: iOS 11.0+
- **Responsive Design** for various screen sizes
- **Accessibility Support** with proper labels

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Islamic dhikr data from authentic sources
- Material Design guidelines
- React Native community
- Firebase for backend services

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Note**: This app is designed for Islamic users and includes authentic dhikr (remembrance) phrases. The UI and UX are optimized for spiritual practice and ease of use.