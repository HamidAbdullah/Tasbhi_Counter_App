import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';
import IslamicPatternBackground from '../../components/IslamicPatternBackground';
import HapticFeedback from 'react-native-haptic-feedback';
import { useTheme } from '../../contexts/ThemeContext';
import { ZikrItem } from '../../types';
import { AZKAAR } from '../../constants/AzkarData';
import { StorageUtils } from '../../Utils/StorageUtils';
import TapTasbeehFrame from '../../components/TapTasbeehFrame';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  BookOpen,
  Hash,
  Plus,
  PencilSimpleLine,
  ArrowCounterClockwise,
  CaretRight,
  X,
} from 'phosphor-react-native';

const ROUND_OPTIONS = [33, 99, 100, 34, 11, 7];

const TasbeehScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [zikr, setZikr] = useState<ZikrItem>(AZKAAR[0]);
  const [roundCount, setRoundCount] = useState(AZKAAR[0].recommendedCount);
  const [count, setCount] = useState(0);
  const [customZikrs, setCustomZikrs] = useState<ZikrItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [modalDhikr, setModalDhikr] = useState(false);
  const [modalCount, setModalCount] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalCustom, setModalCustom] = useState(false);
  console.log('TasbeehScreen Rendered');

  const [customVerse, setCustomVerse] = useState({ arabic: '', translation: '', translationUrdu: '', recommendedCount: 33 });

  const allZikrs = [...AZKAAR, ...customZikrs];

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

  const handleSelectZikr = (z: ZikrItem) => {
    setZikr(z);
    setRoundCount(z.recommendedCount);
    setModalDhikr(false);
    setLoading(true);
    StorageUtils.getCounterData(z.id).then(c => {
      setCount(c);
      setLoading(false);
    });
  };

  const handleSelectRoundCount = (n: number) => {
    setRoundCount(n);
    setModalCount(false);
  };

  const handleIncrement = async () => {
    const newCount = count + 1;
    setCount(newCount);
    HapticFeedback.trigger('impactLight');
    await StorageUtils.saveCounterData(zikr.id, newCount);
    const today = new Date().toISOString().split('T')[0];
    const todayStats = await StorageUtils.getDailyStats(today) || { totalCount: 0, totalRounds: 0 };
    todayStats.totalCount += 1;
    todayStats.totalRounds = Math.floor(todayStats.totalCount / roundCount);
    await StorageUtils.saveDailyStats(today, todayStats);
    StorageUtils.updateStreak().catch(() => {});
  };

  const handleAddManual = async () => {
    const num = parseInt(manualInput, 10);
    if (Number.isNaN(num) || num < 1) {
      Alert.alert('Invalid', 'Enter a positive number');
      return;
    }
    const newCount = count + num;
    setCount(newCount);
    setManualInput('');
    setModalAdd(false);
    await StorageUtils.saveCounterData(zikr.id, newCount);
    const today = new Date().toISOString().split('T')[0];
    const todayStats = await StorageUtils.getDailyStats(today) || { totalCount: 0, totalRounds: 0 };
    todayStats.totalCount += num;
    todayStats.totalRounds = Math.floor(todayStats.totalCount / roundCount);
    await StorageUtils.saveDailyStats(today, todayStats);
    StorageUtils.updateStreak().catch(() => {});
  };

  const handleSaveCustomDhikr = async () => {
    if (!customVerse.arabic.trim() || !customVerse.translation.trim()) {
      Alert.alert('Required', 'Please enter the verse (Arabic) and at least English translation.');
      return;
    }
    const customZikr: ZikrItem = {
      id: Date.now(),
      arabic: customVerse.arabic.trim(),
      transliteration: '',
      translation: customVerse.translation.trim(),
      reference: 'Custom',
      recommendedCount: customVerse.recommendedCount,
      category: 'custom',
      translationUrdu: customVerse.translationUrdu.trim() || undefined,
    };
    try {
      await StorageUtils.saveCustomZikr(customZikr);
      setCustomZikrs(prev => [...prev, customZikr]);
      setCustomVerse({ arabic: '', translation: '', translationUrdu: '', recommendedCount: 33 });
      setModalCustom(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to save custom dhikr');
    }
  };

  const handleReset = () => {
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
  };

  const currentRoundCount = count % roundCount;
  const completedRounds = Math.floor(count / roundCount);
  const progress = roundCount > 0 ? currentRoundCount / roundCount : 0;

  return (
    <ScreenWrapper withPadding={false}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={[styles.gradient, { paddingTop: insets.top + 10 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <IslamicPatternBackground color="#fff" opacity={0.05} />

        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>Tasbeeh</Text>
          <Text style={[styles.headerSubtitle, { color: 'rgba(255,255,255,0.85)' }]}>Count your remembrance</Text>
        </View>

        {/* Action bar */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.topButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={() => setModalDhikr(true)}
            activeOpacity={0.8}
          >
            <BookOpen size={18} color={theme.colors.surface} weight="duotone" />
            <Text style={styles.topButtonText}>Dhikr</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={() => setModalCount(true)}
            activeOpacity={0.8}
          >
            <Hash size={18} color={theme.colors.surface} weight="duotone" />
            <Text style={styles.topButtonText}>Count</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={() => setModalAdd(true)}
            activeOpacity={0.8}
          >
            <Plus size={18} color={theme.colors.surface} weight="duotone" />
            <Text style={styles.topButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={() => setModalCustom(true)}
            activeOpacity={0.8}
          >
            <PencilSimpleLine size={18} color={theme.colors.surface} weight="duotone" />
            <Text style={styles.topButtonText}>Custom</Text>
          </TouchableOpacity>
        </View>

        {/* Current dhikr */}
        <Card variant="elevated" padding="medium" style={[styles.zikrCard, { backgroundColor: theme.colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 }]}>
          <Text style={[styles.arabic, { color: theme.colors.text }]}>{zikr.arabic}</Text>
          <Text style={[styles.translation, { color: theme.colors.textSecondary }]}>{zikr.translation}</Text>
          {zikr.translationUrdu ? (
            <Text style={[styles.translationUrdu, { color: theme.colors.textTertiary }]}>{zikr.translationUrdu}</Text>
          ) : null}
        </Card>

        {/* Round progress */}
        <Card variant="outlined" padding="medium" style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
              {currentRoundCount} / {roundCount}
            </Text>
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
              <ArrowCounterClockwise size={18} color={theme.colors.primary} weight="bold" />
            </TouchableOpacity>
          </View>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%`, backgroundColor: theme.colors.primary },
              ]}
            />
          </View>
          <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>
            Total: {count} {completedRounds > 0 && ` · ${completedRounds} round${completedRounds > 1 ? 's' : ''}`}
          </Text>
        </Card>

        {/* Tap frame – no rotation, press-only feedback */}
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

      {/* Dhikr selection modal */}
      <Modal visible={modalDhikr} transparent animationType="slide">
        <Pressable style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]} onPress={() => setModalDhikr(false)}>
          <View style={[styles.modalBox, { backgroundColor: theme.colors.surface }]} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>Choose Dhikr</Text>
              <TouchableOpacity onPress={() => setModalDhikr(false)}><X size={24} color={theme.colors.text} weight="bold" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.sheetScrollContent} keyboardShouldPersistTaps="handled">
              {allZikrs.map((z) => (
                <TouchableOpacity
                  key={z.id}
                  style={[styles.dhikrRow, { borderBottomColor: theme.colors.border }]}
                  onPress={() => handleSelectZikr(z)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dhikrRowArabic, { color: theme.colors.text }]} numberOfLines={1}>{z.arabic}</Text>
                  <Text style={[styles.dhikrRowCount, { color: theme.colors.primary }]}>{z.recommendedCount}</Text>
                  <CaretRight size={20} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Count selection modal */}
      <Modal visible={modalCount} transparent animationType="fade">
        <Pressable style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]} onPress={() => setModalCount(false)}>
          <View style={[styles.modalBoxSmall, { backgroundColor: theme.colors.surface }]} onStartShouldSetResponder={() => true}>
            <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>Round count</Text>
            <View style={styles.countOptions}>
              {ROUND_OPTIONS.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.countOption, { backgroundColor: roundCount === n ? theme.colors.primary : theme.colors.background }]}
                  onPress={() => handleSelectRoundCount(n)}
                >
                  <Text style={[styles.countOptionText, { color: roundCount === n ? theme.colors.surface : theme.colors.text }]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setModalCount(false)} style={styles.sheetDone}>
              <Text style={[styles.sheetDoneText, { color: theme.colors.primary }]}>Done</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Add count manually modal */}
      <Modal visible={modalAdd} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalBoxSmall, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>Add count</Text>
              <TouchableOpacity onPress={() => setModalAdd(false)}><X size={24} color={theme.colors.text} weight="bold" /></TouchableOpacity>
            </View>
            <Text style={[styles.manualHint, { color: theme.colors.textSecondary }]}>Used a physical tasbeeh? Enter the count to add to today.</Text>
            <TextInput
              style={[styles.manualInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="e.g. 100"
              placeholderTextColor={theme.colors.textTertiary}
              value={manualInput}
              onChangeText={setManualInput}
              keyboardType="number-pad"
            />
            <Button title="Add to count" onPress={handleAddManual} variant="primary" fullWidth style={styles.manualButton} />
          </View>
        </View>
      </Modal>

      {/* Add Custom Dhikr modal */}
      <Modal visible={modalCustom} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>Add custom verse</Text>
              <TouchableOpacity onPress={() => setModalCustom(false)}><X size={24} color={theme.colors.text} weight="bold" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} contentContainerStyle={[styles.sheetPadding, styles.sheetScrollContent]} keyboardShouldPersistTaps="handled">
              <Text style={[styles.manualHint, { color: theme.colors.textSecondary }]}>Add a verse with Arabic text and translations (English and Urdu).</Text>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Verse (Arabic)</Text>
              <TextInput
                style={[styles.textArea, { borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="Enter Arabic verse..."
                placeholderTextColor={theme.colors.textTertiary}
                value={customVerse.arabic}
                onChangeText={(t) => setCustomVerse(prev => ({ ...prev, arabic: t }))}
                multiline
                numberOfLines={3}
              />
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Translation (English)</Text>
              <TextInput
                style={[styles.textArea, { borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="English translation..."
                placeholderTextColor={theme.colors.textTertiary}
                value={customVerse.translation}
                onChangeText={(t) => setCustomVerse(prev => ({ ...prev, translation: t }))}
                multiline
                numberOfLines={2}
              />
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Translation (Urdu)</Text>
              <TextInput
                style={[styles.textArea, { borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="اردو ترجمہ (optional)"
                placeholderTextColor={theme.colors.textTertiary}
                value={customVerse.translationUrdu}
                onChangeText={(t) => setCustomVerse(prev => ({ ...prev, translationUrdu: t }))}
                multiline
                numberOfLines={2}
              />
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Recommended count per round</Text>
              <View style={styles.countOptions}>
                {ROUND_OPTIONS.map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.countOptionSmall, { backgroundColor: customVerse.recommendedCount === n ? theme.colors.primary : theme.colors.background }]}
                    onPress={() => setCustomVerse(prev => ({ ...prev, recommendedCount: n }))}
                  >
                    <Text style={[styles.countOptionText, { color: customVerse.recommendedCount === n ? theme.colors.surface : theme.colors.text }]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Button title="Save custom dhikr" onPress={handleSaveCustomDhikr} variant="primary" fullWidth style={styles.manualButton} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  topButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 12,
  },
  topButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  zikrCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  arabic: {
    fontSize: 22,
    fontFamily: 'Amiri-Bold',
    textAlign: 'center',
    lineHeight: 36,
  },
  translation: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: 6,
    textAlign: 'center',
  },
  translationUrdu: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  resetBtn: {
    padding: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 8,
  },
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
  sheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  sheetPadding: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBox: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 32,
  },
  modalBoxSmall: {
    marginHorizontal: 24,
    marginBottom: 80,
    borderRadius: 20,
    padding: 20,
  },
  modalScroll: {
    maxHeight: 400,
  },
  sheetScrollContent: {
    paddingBottom: 40,
  },
  dhikrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  dhikrRowArabic: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Amiri-Bold',
  },
  dhikrRowCount: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginRight: 8,
  },
  countOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  countOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 64,
    alignItems: 'center',
  },
  countOptionSmall: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 52,
    alignItems: 'center',
  },
  countOptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  sheetDone: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  sheetDoneText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  manualHint: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  manualInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  manualButton: {
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 6,
    marginTop: 8,
  },
  textArea: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    minHeight: 72,
    textAlignVertical: 'top',
  },
});

export default TasbeehScreen;
