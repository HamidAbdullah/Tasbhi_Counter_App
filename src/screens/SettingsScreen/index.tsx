import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../../App';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const BackIcon = ({ size = 24, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SettingsIcon = ({ size = 24, color = '#4a7c59' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
    <Path
      d="M12 1v6m0 6v6m11-7h-6m-6 0H1"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ThemeIcon = ({ size = 24, color = '#4a7c59' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="5" fill={color} />
    <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);

const SoundIcon = ({ size = 24, color = '#4a7c59' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 5L6 9H2v6h4l5 4V5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const VibrationIcon = ({ size = 24, color = '#4a7c59' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2 12h4m14 0h-4m-2-6l-4 4 4 4m-8-8l4 4-4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ResetIcon = ({ size = 24, color = '#d73527' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M3 3v5h5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

interface SettingsData {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  defaultRoundCount: number;
  autoReset: boolean;
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  
  const [settings, setSettings] = useState<SettingsData>({
    soundEnabled: true,
    vibrationEnabled: true,
    defaultRoundCount: 100,
    autoReset: false,
  });

  const [customRoundCount, setCustomRoundCount] = useState('100');

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('app_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        setCustomRoundCount(parsedSettings.defaultRoundCount.toString());
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: SettingsData) => {
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = (key: keyof SettingsData, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleRoundCountChange = (value: string) => {
    setCustomRoundCount(value);
    const count = parseInt(value) || 100;
    updateSetting('defaultRoundCount', count);
  };

  const handleResetAllData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your counters and custom dhikrs. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data has been reset.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data.');
            }
          },
        },
      ]
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  const SettingItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }> = ({ icon, title, subtitle, children }) => (
    <Card variant="outlined" padding="medium" style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.settingHeader}>
        <View style={styles.settingIcon}>
          {icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingControl}>
        {children}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <BackIcon size={24} color={theme.colors.surface} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <SettingsIcon size={28} color={theme.colors.surface} />
            <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>
              Settings
            </Text>
          </View>

          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Appearance
          </Text>
          
          <SettingItem
            icon={<ThemeIcon size={24} color={theme.colors.primary} />}
            title="Theme"
            subtitle="Choose your preferred theme"
          >
            <View style={styles.themeSelector}>
              {[
                { key: 'light', label: 'Light' },
                { key: 'dark', label: 'Dark' },
                { key: 'auto', label: 'Auto' },
              ].map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: themeMode === key ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => setThemeMode(key as any)}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      {
                        color: themeMode === key ? theme.colors.surface : theme.colors.text,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingItem>
        </View>

        {/* Counter Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Counter Settings
          </Text>

          <SettingItem
            icon={<Text style={[styles.iconText, { color: theme.colors.primary }]}>🔢</Text>}
            title="Default Round Count"
            subtitle="Number of counts for each round"
          >
            <TextInput
              style={[
                styles.roundCountInput,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                },
              ]}
              value={customRoundCount}
              onChangeText={handleRoundCountChange}
              keyboardType="numeric"
              maxLength={4}
            />
          </SettingItem>

          <SettingItem
            icon={<Text style={[styles.iconText, { color: theme.colors.primary }]}>🔄</Text>}
            title="Auto Reset"
            subtitle="Automatically reset counter after completion"
          >
            <Switch
              value={settings.autoReset}
              onValueChange={(value) => updateSetting('autoReset', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={settings.autoReset ? theme.colors.surface : theme.colors.textSecondary}
            />
          </SettingItem>
        </View>

        {/* Audio & Haptics Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Audio & Haptics
          </Text>

          <SettingItem
            icon={<SoundIcon size={24} color={theme.colors.primary} />}
            title="Sound Effects"
            subtitle="Play sound on counter tap"
          >
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSetting('soundEnabled', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={settings.soundEnabled ? theme.colors.surface : theme.colors.textSecondary}
            />
          </SettingItem>

          <SettingItem
            icon={<VibrationIcon size={24} color={theme.colors.primary} />}
            title="Haptic Feedback"
            subtitle="Vibrate on counter tap"
          >
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => updateSetting('vibrationEnabled', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={settings.vibrationEnabled ? theme.colors.surface : theme.colors.textSecondary}
            />
          </SettingItem>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Data Management
          </Text>

          <SettingItem
            icon={<ResetIcon size={24} color={theme.colors.error} />}
            title="Reset All Data"
            subtitle="Delete all counters and custom dhikrs"
          >
            <Button
              title="Reset"
              onPress={handleResetAllData}
              variant="outline"
              size="small"
              style={[styles.resetButton, { borderColor: theme.colors.error }]}
              textStyle={{ color: theme.colors.error }}
            />
          </SettingItem>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            About
          </Text>

          <Card variant="outlined" padding="medium" style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.appInfo}>
              <Text style={[styles.appName, { color: theme.colors.text }]}>
                Digital Tasbih
              </Text>
              <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>
                Version 2.0.0
              </Text>
              <Text style={[styles.appDescription, { color: theme.colors.textSecondary }]}>
                A modern, beautiful digital tasbih counter with Islamic themes and comprehensive features.
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerRight: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  settingItem: {
    marginBottom: 12,
    borderRadius: 12,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 124, 89, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  settingControl: {
    alignItems: 'flex-end',
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  roundCountInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 80,
  },
  resetButton: {
    borderWidth: 1,
    borderRadius: 8,
  },
  iconText: {
    fontSize: 24,
  },
  infoCard: {
    borderRadius: 12,
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 30,
  },
});

export default SettingsScreen;
