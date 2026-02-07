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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  ArrowLeft,
  Gear,
  Sun,
  Moon,
  DeviceMobile,
  SpeakerHigh,
  Vibrate,
  ArrowCounterClockwise,
  Hash,
  MoonStars,
  Bell,
  UserFocus,
} from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';
import { ProfileStackParamList } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { StorageUtils } from '../../Utils/StorageUtils';

type SettingsScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'Settings'
>;

const BackIcon = ({ size = 24, color = '#ffffff' }) => (
  <ArrowLeft size={size} color={color} weight="bold" />
);

const SettingsIcon = ({ size = 24, color }: { size?: number; color?: string }) => (
  <Gear size={size} color={color ?? '#0d9488'} weight="bold" />
);

const ThemeIcon = ({ size = 24, color }: { size?: number; color?: string }) => (
  <Sun size={size} color={color ?? '#0d9488'} weight="bold" />
);

const SoundIcon = ({ size = 24, color }: { size?: number; color?: string }) => (
  <SpeakerHigh size={size} color={color ?? '#0d9488'} weight="bold" />
);

const VibrationIcon = ({ size = 24, color }: { size?: number; color?: string }) => (
  <Vibrate size={size} color={color ?? '#0d9488'} weight="bold" />
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
  const {
    theme,
    themeMode,
    setThemeMode,
    ramadanMode,
    setRamadanMode,
    focusMode,
    setFocusMode,
    dailyReminderEnabled,
    setDailyReminderEnabled,
  } = useTheme();
  const insets = useSafeAreaInsets();

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

  const SettingRow: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    isLast?: boolean;
    children: React.ReactNode;
  }> = ({ icon, title, subtitle, isLast, children }) => (
    <View style={[styles.settingRow, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
      <View style={[styles.settingRowIcon, { backgroundColor: theme.colors.primary + '18' }]}>{icon}</View>
      <View style={styles.settingRowContent}>
        <Text style={[styles.settingRowTitle, { color: theme.colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingRowSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.settingRowControl}>{children}</View>
    </View>
  );

  const SectionCard: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode }> = ({
    label,
    icon,
    children,
  }) => (
    <View style={styles.sectionCardWrap}>
      <View style={styles.sectionLabelRow}>
        {icon}
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      </View>
      <Card variant="elevated" padding="none" style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
        {children}
      </Card>
    </View>
  );

  return (
    <ScreenWrapper withPadding={false}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary, theme.colors.tertiary]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={goBack} style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]} activeOpacity={0.8}>
            <BackIcon size={22} color={theme.colors.surface} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Gear size={22} color={theme.colors.surface} weight="duotone" />
            <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>Settings</Text>
          </View>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme — segmented control */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Sun size={18} color={theme.colors.primary} weight="duotone" />
            <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Appearance</Text>
          </View>
          <Card variant="elevated" padding="medium" style={[styles.themeCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.settingRowTitle, { color: theme.colors.text, marginBottom: 10 }]}>Theme</Text>
            <View style={[styles.themeSegmented, { backgroundColor: theme.colors.background }]}>
              {(['light', 'dark', 'auto'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  onPress={() => setThemeMode(mode)}
                  activeOpacity={0.85}
                  style={[
                    styles.themeSegment,
                    {
                      backgroundColor: themeMode === mode ? theme.colors.primary : 'transparent',
                    },
                  ]}
                >
                  {mode === 'light' && <Sun size={18} color={themeMode === mode ? theme.colors.surface : theme.colors.textSecondary} weight="bold" />}
                  {mode === 'dark' && <Moon size={18} color={themeMode === mode ? theme.colors.surface : theme.colors.textSecondary} weight="bold" />}
                  {mode === 'auto' && <DeviceMobile size={18} color={themeMode === mode ? theme.colors.surface : theme.colors.textSecondary} weight="bold" />}
                  <Text
                    style={[
                      styles.themeSegmentText,
                      { color: themeMode === mode ? theme.colors.surface : theme.colors.text },
                    ]}
                  >
                    {mode === 'auto' ? 'Auto' : mode === 'light' ? 'Light' : 'Dark'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </View>

        {/* Spiritual & Focus — single card */}
        <SectionCard
          label="Spiritual & Focus"
          icon={<MoonStars size={18} color={theme.colors.accent} weight="duotone" />}
        >
          <SettingRow
            icon={<MoonStars size={20} color={theme.colors.accent} weight="bold" />}
            title="Ramadan Mode"
            subtitle="Gold-tinted theme"
            isLast={false}
          >
            <Switch
              value={ramadanMode}
              onValueChange={setRamadanMode}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor={ramadanMode ? theme.colors.surface : theme.colors.textSecondary}
            />
          </SettingRow>
          <SettingRow
            icon={<Bell size={20} color={theme.colors.primary} weight="bold" />}
            title="Daily Reminder"
            subtitle="Gentle dhikr reminder"
            isLast={false}
          >
            <Switch
              value={dailyReminderEnabled}
              onValueChange={setDailyReminderEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={dailyReminderEnabled ? theme.colors.surface : theme.colors.textSecondary}
            />
          </SettingRow>
          <SettingRow
            icon={<UserFocus size={20} color={theme.colors.primary} weight="bold" />}
            title="Focus Mode"
            subtitle="Minimal UI during dhikr"
            isLast={true}
          >
            <Switch
              value={focusMode}
              onValueChange={setFocusMode}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={focusMode ? theme.colors.surface : theme.colors.textSecondary}
            />
          </SettingRow>
        </SectionCard>

        {/* Counter */}
        <SectionCard label="Counter" icon={<Hash size={18} color={theme.colors.primary} weight="duotone" />}>
          <SettingRow
            icon={<Hash size={20} color={theme.colors.primary} weight="bold" />}
            title="Default round count"
            subtitle="Counts per round"
            isLast={false}
          >
            <TextInput
              style={[
                styles.roundCountInput,
                { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text },
              ]}
              value={customRoundCount}
              onChangeText={handleRoundCountChange}
              keyboardType="numeric"
              maxLength={4}
            />
          </SettingRow>
          <SettingRow
            icon={<ArrowCounterClockwise size={20} color={theme.colors.primary} weight="bold" />}
            title="Auto reset"
            subtitle="Reset after completion"
            isLast={true}
          >
            <Switch
              value={settings.autoReset}
              onValueChange={(v) => updateSetting('autoReset', v)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={settings.autoReset ? theme.colors.surface : theme.colors.textSecondary}
            />
          </SettingRow>
        </SectionCard>

        {/* Audio & Haptics */}
        <SectionCard label="Audio & Haptics" icon={<SpeakerHigh size={18} color={theme.colors.primary} weight="duotone" />}>
          <SettingRow
            icon={<SpeakerHigh size={20} color={theme.colors.primary} weight="bold" />}
            title="Sound"
            subtitle="Tap sound"
            isLast={false}
          >
            <Switch
              value={settings.soundEnabled}
              onValueChange={(v) => updateSetting('soundEnabled', v)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={settings.soundEnabled ? theme.colors.surface : theme.colors.textSecondary}
            />
          </SettingRow>
          <SettingRow
            icon={<Vibrate size={20} color={theme.colors.primary} weight="bold" />}
            title="Haptic"
            subtitle="Vibration on tap"
            isLast={true}
          >
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(v) => updateSetting('vibrationEnabled', v)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={settings.vibrationEnabled ? theme.colors.surface : theme.colors.textSecondary}
            />
          </SettingRow>
        </SectionCard>

        {/* Data */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <ArrowCounterClockwise size={18} color={theme.colors.error} weight="duotone" />
            <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Data</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleResetAllData}
            style={[styles.dangerCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.error + '40' }]}
          >
            <ResetIcon size={22} color={theme.colors.error} />
            <View style={styles.dangerTextWrap}>
              <Text style={[styles.dangerTitle, { color: theme.colors.text }]}>Reset all data</Text>
              <Text style={[styles.dangerSubtitle, { color: theme.colors.textSecondary }]}>Counters & custom dhikrs</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingLeft: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.5,
  },
  sectionCardWrap: {
    marginBottom: 24,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingRowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingRowContent: {
    flex: 1,
  },
  settingRowTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  settingRowSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  settingRowControl: {
    marginLeft: 8,
  },
  themeCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  themeSegmented: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  themeSegment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  themeSegmentText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  roundCountInput: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    minWidth: 72,
  },
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dangerTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  dangerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  dangerSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  bottomPadding: {
    height: 40,
  },
});

export default SettingsScreen;
