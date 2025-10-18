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
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  ArrowLeft,
  Gear,
  Sun,
  Moon,
  SpeakerHigh,
  Vibrate,
  ArrowCounterClockwise,
  Hash,
  Info,
} from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../../App';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { StorageUtils } from '../../Utils/StorageUtils';

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

const BackIcon = ({ size = 24, color = '#ffffff' }) => (
  <ArrowLeft size={size} color={color} weight="bold" />
);

const SettingsIcon = ({ size = 24, color = '#4a7c59' }) => (
  <Gear size={size} color={color} weight="bold" />
);

const ThemeIcon = ({ size = 24, color = '#4a7c59' }) => (
  <Sun size={size} color={color} weight="bold" />
);

const SoundIcon = ({ size = 24, color = '#4a7c59' }) => (
  <SpeakerHigh size={size} color={color} weight="bold" />
);

const VibrationIcon = ({ size = 24, color = '#4a7c59' }) => (
  <Vibrate size={size} color={color} weight="bold" />
);

const ResetIcon = ({ size = 24, color = '#d73527' }) => (
  <ArrowCounterClockwise size={size} color={color} weight="bold" />
);

interface SettingsData {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  defaultRoundCount: number;
  autoReset: boolean;
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { theme } = useTheme();

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
      const savedSettings = await StorageUtils.getSettings();
      setSettings(savedSettings);
      setCustomRoundCount(savedSettings.defaultRoundCount.toString());
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: SettingsData) => {
    try {
      await StorageUtils.saveSettings(newSettings);
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
      'This will delete all your counters, custom dhikrs, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageUtils.clearAllData();
              // Reset to default settings
              const defaultSettings = {
                soundEnabled: true,
                vibrationEnabled: true,
                defaultRoundCount: 100,
                autoReset: false,
              };
              setSettings(defaultSettings);
              setCustomRoundCount('100');
              Alert.alert('Success', 'All data has been reset.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data.');
            }
          },
        },
      ],
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
    <Card
      variant="outlined"
      padding="medium"
      style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.settingHeader}>
        <View style={styles.settingIcon}>{icon}</View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.settingSubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingControl}>{children}</View>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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
            <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>
              Settings
            </Text>
          </View>

          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView
        style={[
          styles.scrollView,
          { backgroundColor: theme.colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Counter Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Counter Settings
          </Text>

          <SettingItem
            icon={<Hash size={24} color={theme.colors.primary} weight="bold" />}
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
            icon={
              <ArrowCounterClockwise
                size={24}
                color={theme.colors.primary}
                weight="bold"
              />
            }
            title="Auto Reset"
            subtitle="Automatically reset counter after completion"
          >
            <Switch
              value={settings.autoReset}
              onValueChange={value => updateSetting('autoReset', value)}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={
                settings.autoReset
                  ? theme.colors.surface
                  : theme.colors.textSecondary
              }
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
              onValueChange={value => updateSetting('soundEnabled', value)}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={
                settings.soundEnabled
                  ? theme.colors.surface
                  : theme.colors.textSecondary
              }
            />
          </SettingItem>

          <SettingItem
            icon={<VibrationIcon size={24} color={theme.colors.primary} />}
            title="Haptic Feedback"
            subtitle="Vibrate on counter tap"
          >
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={value => updateSetting('vibrationEnabled', value)}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={
                settings.vibrationEnabled
                  ? theme.colors.surface
                  : theme.colors.textSecondary
              }
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

          <Card
            variant="outlined"
            padding="medium"
            style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}
          >
            <View style={styles.appInfo}>
              <View style={styles.appInfoHeader}>
                <Info size={24} color={theme.colors.primary} weight="bold" />
                <Text style={[styles.appName, { color: theme.colors.text }]}>
                  Digital Tasbih
                </Text>
              </View>
              <Text
                style={[
                  styles.appVersion,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Version 2.0.0
              </Text>
              <Text
                style={[
                  styles.appDescription,
                  { color: theme.colors.textSecondary },
                ]}
              >
                A modern, beautiful digital tasbih counter with Islamic themes
                and comprehensive features.
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
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
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
