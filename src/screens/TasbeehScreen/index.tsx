import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomSheetMethods } from '@devvie/bottom-sheet';
import ScreenWrapper from '../../components/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';
import IslamicPatternBackground from '../../components/IslamicPatternBackground';
import HapticFeedback from 'react-native-haptic-feedback';
import { useTheme } from '../../contexts/ThemeContext';
import { ZikrItem } from '../../types';
import { AZKAAR } from '../../constants/AzkarData';
import { StorageUtils } from '../../Utils/StorageUtils';
import TapTasbeehFrame from '../../components/TapTasbeehFrame';
import TasbeehHeader from './components/TasbeehHeader';
import TasbeehActionBar from './components/TasbeehActionBar';
import ZikrCardArabic from './components/ZikrCardArabic';
import RoundProgressCard from './components/RoundProgressCard';
import DhikrBottomSheet from './components/DhikrBottomSheet';
import CountBottomSheet from './components/CountBottomSheet';
import AddCountBottomSheet from './components/AddCountBottomSheet';
import CustomDhikrBottomSheet from './components/CustomDhikrBottomSheet';

const TasbeehScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [zikr, setZikr] = useState<ZikrItem>(AZKAAR[0]);
  const [roundCount, setRoundCount] = useState(AZKAAR[0].recommendedCount);
  const [count, setCount] = useState(0);
  const [customZikrs, setCustomZikrs] = useState<ZikrItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [customVerse, setCustomVerse] = useState({ arabic: '', recommendedCount: 33 });

  const dhikrSheetRef = useRef<BottomSheetMethods>(null);
  const countSheetRef = useRef<BottomSheetMethods>(null);
  const addSheetRef = useRef<BottomSheetMethods>(null);
  const customSheetRef = useRef<BottomSheetMethods>(null);

  const allZikrs = useMemo(() => [...AZKAAR, ...customZikrs], [customZikrs]);

  const loadData = useCallback(async () => {
    try {
      const [savedCount, custom] = await Promise.all([
        StorageUtils.getCounterData(zikr.id),
        StorageUtils.getCustomZikrs(),
      ]);
      setCount(savedCount);
      setCustomZikrs(custom);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [zikr.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectZikr = useCallback((z: ZikrItem) => {
    setZikr(z);
    setRoundCount(z.recommendedCount);
    dhikrSheetRef.current?.close();
    setLoading(true);
    StorageUtils.getCounterData(z.id).then((c) => {
      setCount(c);
      setLoading(false);
    });
  }, []);

  const handleSelectRoundCount = useCallback((n: number) => {
    setRoundCount(n);
    countSheetRef.current?.close();
  }, []);

  const handleIncrement = useCallback(async () => {
    const newCount = count + 1;
    setCount(newCount);
    HapticFeedback.trigger('impactLight');
    await StorageUtils.saveCounterData(zikr.id, newCount);
    const today = new Date().toISOString().split('T')[0];
    const todayStats = (await StorageUtils.getDailyStats(today)) || { totalCount: 0, totalRounds: 0 };
    todayStats.totalCount += 1;
    todayStats.totalRounds = Math.floor(todayStats.totalCount / roundCount);
    await StorageUtils.saveDailyStats(today, todayStats);
    StorageUtils.updateStreak().catch(() => {});
  }, [count, zikr.id, roundCount]);

  const handleAddManual = useCallback(async () => {
    const num = parseInt(manualInput, 10);
    if (Number.isNaN(num) || num < 1) {
      Alert.alert('Invalid', 'Enter a positive number');
      return;
    }
    const newCount = count + num;
    setCount(newCount);
    setManualInput('');
    addSheetRef.current?.close();
    await StorageUtils.saveCounterData(zikr.id, newCount);
    const today = new Date().toISOString().split('T')[0];
    const todayStats = (await StorageUtils.getDailyStats(today)) || { totalCount: 0, totalRounds: 0 };
    todayStats.totalCount += num;
    todayStats.totalRounds = Math.floor(todayStats.totalCount / roundCount);
    await StorageUtils.saveDailyStats(today, todayStats);
    StorageUtils.updateStreak().catch(() => {});
  }, [manualInput, count, zikr.id, roundCount]);

  const handleSaveCustomDhikr = useCallback(async () => {
    if (!customVerse.arabic.trim()) {
      Alert.alert('Required', 'Please enter the verse (Arabic).');
      return;
    }
    const customZikr: ZikrItem = {
      id: Date.now(),
      arabic: customVerse.arabic.trim(),
      transliteration: '',
      translation: '',
      reference: 'Custom',
      recommendedCount: customVerse.recommendedCount,
      category: 'custom',
    };
    try {
      await StorageUtils.saveCustomZikr(customZikr);
      setCustomZikrs((prev) => [...prev, customZikr]);
      setCustomVerse({ arabic: '', recommendedCount: 33 });
      customSheetRef.current?.close();
    } catch (e) {
      Alert.alert('Error', 'Failed to save custom dhikr');
    }
  }, [customVerse.arabic, customVerse.recommendedCount]);

  const handleReset = useCallback(() => {
    Alert.alert('Reset', 'Reset this counter to zero?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          setCount(0);
          await StorageUtils.resetCounter(zikr.id);
        },
      },
    ]);
  }, [zikr.id]);

  const currentRoundCount = count % roundCount;
  const completedRounds = Math.floor(count / roundCount);
  const progress = roundCount > 0 ? currentRoundCount / roundCount : 0;

  const zikrCardStyle = useMemo(
    () => ({
      backgroundColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    }),
    [theme.colors.surface]
  );

  const progressCardStyle = useMemo(
    () => ({ backgroundColor: theme.colors.surface }),
    [theme.colors.surface]
  );

  return (
    <ScreenWrapper withPadding={false}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={[styles.gradient, { paddingTop: insets.top + 10 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <IslamicPatternBackground color="#ffffff" opacity={0.05} />

        <TasbeehHeader titleColor={theme.colors.surface} subtitleColor="rgba(255,255,255,0.85)" />

        <TasbeehActionBar
          iconColor={theme.colors.surface}
          onDhikr={() => dhikrSheetRef.current?.open()}
          onCount={() => countSheetRef.current?.open()}
          onAdd={() => addSheetRef.current?.open()}
          onCustom={() => customSheetRef.current?.open()}
        />

        <ZikrCardArabic arabic={zikr.arabic} textColor={theme.colors.text} cardStyle={zikrCardStyle} />

        <RoundProgressCard
          currentRoundCount={currentRoundCount}
          roundCount={roundCount}
          count={count}
          completedRounds={completedRounds}
          progressFillPct={progress}
          textColor={theme.colors.text}
          secondaryColor={theme.colors.textSecondary}
          borderColor={theme.colors.border}
          primaryColor={theme.colors.primary}
          cardStyle={progressCardStyle}
          onReset={handleReset}
        />

        <View style={styles.tapArea}>
          {loading ? (
            <Text style={[styles.hint, { color: theme.colors.surface }]}>Loading...</Text>
          ) : (
            <TapTasbeehFrame
              count={currentRoundCount}
              onIncrement={handleIncrement}
              isCompleted={currentRoundCount === roundCount && roundCount > 0}
              targetCount={roundCount}
            />
          )}
        </View>
      </LinearGradient>

      <DhikrBottomSheet
        ref={dhikrSheetRef}
        zikrs={allZikrs}
        textColor={theme.colors.text}
        primaryColor={theme.colors.primary}
        tertiaryColor={theme.colors.textTertiary}
        borderColor={theme.colors.border}
        surfaceColor={theme.colors.surface}
        backdropColor={theme.colors.overlay}
        onClose={() => dhikrSheetRef.current?.close()}
        onSelect={handleSelectZikr}
      />

      <CountBottomSheet
        ref={countSheetRef}
        roundCount={roundCount}
        textColor={theme.colors.text}
        primaryColor={theme.colors.primary}
        surfaceColor={theme.colors.surface}
        bgColor={theme.colors.background}
        backdropColor={theme.colors.overlay}
        onClose={() => countSheetRef.current?.close()}
        onSelect={handleSelectRoundCount}
      />

      <AddCountBottomSheet
        ref={addSheetRef}
        manualInput={manualInput}
        textColor={theme.colors.text}
        secondaryColor={theme.colors.textSecondary}
        tertiaryColor={theme.colors.textTertiary}
        borderColor={theme.colors.border}
        surfaceColor={theme.colors.surface}
        backdropColor={theme.colors.overlay}
        onClose={() => addSheetRef.current?.close()}
        onInputChange={setManualInput}
        onAdd={handleAddManual}
      />

      <CustomDhikrBottomSheet
        ref={customSheetRef}
        arabic={customVerse.arabic}
        recommendedCount={customVerse.recommendedCount}
        textColor={theme.colors.text}
        secondaryColor={theme.colors.textSecondary}
        tertiaryColor={theme.colors.textTertiary}
        borderColor={theme.colors.border}
        primaryColor={theme.colors.primary}
        surfaceColor={theme.colors.surface}
        bgColor={theme.colors.background}
        backdropColor={theme.colors.overlay}
        onClose={() => customSheetRef.current?.close()}
        onArabicChange={(t) => setCustomVerse((prev) => ({ ...prev, arabic: t }))}
        onCountSelect={(n) => setCustomVerse((prev) => ({ ...prev, recommendedCount: n }))}
        onSave={handleSaveCustomDhikr}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  tapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  hint: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});

export default TasbeehScreen;
