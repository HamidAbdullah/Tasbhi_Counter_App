import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';
import BottomSheet, { type BottomSheetMethods } from '@devvie/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Plus,
  Gear,
  Moon,
  BookOpen,
  Star,
  CheckCircle,
  X,
  CaretRight,
  ClockCounterClockwise,
} from 'phosphor-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ZikrItem } from '../../types';
import { AZKAAR } from '../../constants/AzkarData';
import { RootStackParamList, TabParamList } from '../../types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { FONT_WEIGHTS, TYPOGRAPHY } from '../../constants/Fonts';
import { StorageUtils } from '../../Utils/StorageUtils';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Dhikr'>,
  StackNavigationProp<RootStackParamList>
>;

const IslamicStarIcon = ({ size = 20, color = '#DAA520' }) => (
  <Star size={size} color={color} weight="fill" />
);

const CrescentIcon = ({ size = 18, color = '#4a7c59' }) => (
  <Moon size={size} color={color} weight="fill" />
);

const BookQuranIcon = ({ size = 20, color = '#4a7c59' }) => (
  <BookOpen size={size} color={color} weight="fill" />
);

const ModernHomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [customZikrs, setCustomZikrs] = useState<ZikrItem[]>([]);
  const [editingZikr, setEditingZikr] = useState<ZikrItem | null>(null);
  const addSheetRef = useRef<BottomSheetMethods>(null);
  const editSheetRef = useRef<BottomSheetMethods>(null);
  const [loading, setLoading] = useState(true);
  const [recentZikrs, setRecentZikrs] = useState<ZikrItem[]>([]);
  const [fabAnimation] = useState(new Animated.Value(1));
  const [newZikr, setNewZikr] = useState({
    arabic: '',
    transliteration: '',
    translation: '',
    reference: '',
    recommendedCount: 33,
  });
  console.log('HomeScreen Rendered');
  // Load custom zikrs on component mount and when screen comes into focus
  React.useEffect(() => {
    loadCustomZikrs();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCustomZikrs();
    }, [])
  );

  const loadCustomZikrs = async () => {
    try {
      setLoading(true);
      const [savedZikrs, recentIds] = await Promise.all([
        StorageUtils.getCustomZikrs(),
        StorageUtils.getRecentZikrIds(),
      ]);
      setCustomZikrs(savedZikrs);
      const allZikrs = [...AZKAAR, ...savedZikrs];
      const recent = recentIds
        .map(id => allZikrs.find(z => z.id === id))
        .filter((z): z is ZikrItem => z != null);
      setRecentZikrs(recent);
    } catch (error) {
      console.error('Error loading custom zikrs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleZikrPress = (zikr: ZikrItem) => {
    StorageUtils.addRecentZikr(zikr.id);
    navigation.navigate('Counter', { zikr });
  };

  const allBuiltIn = AZKAAR;
  const allZikrs = [...allBuiltIn, ...customZikrs];

  const addCustomZikr = async () => {
    if (!newZikr.arabic || !newZikr.translation) {
      Alert.alert('Error', 'Please enter Arabic text and translation');
      return;
    }

    const customZikr: ZikrItem = {
      id: Date.now(),
      ...newZikr,
    };

    try {
      await StorageUtils.saveCustomZikr(customZikr);
      setCustomZikrs([...customZikrs, customZikr]);
      setNewZikr({
        arabic: '',
        transliteration: '',
        translation: '',
        reference: '',
        recommendedCount: 33,
      });
      addSheetRef.current?.close();
    } catch (error) {
      Alert.alert('Error', 'Failed to save custom dhikr');
    }
  };

  const editCustomZikr = (zikr: ZikrItem) => {
    setEditingZikr(zikr);
    setNewZikr({
      arabic: zikr.arabic,
      transliteration: zikr.transliteration,
      translation: zikr.translation,
      reference: zikr.reference,
      recommendedCount: zikr.recommendedCount,
    });
    editSheetRef.current?.open();
  };

  const updateCustomZikr = async () => {
    if (!newZikr.arabic || !newZikr.translation || !editingZikr) {
      Alert.alert('Error', 'Please enter Arabic text and translation');
      return;
    }

    const updatedZikr: ZikrItem = {
      ...editingZikr,
      ...newZikr,
    };

    try {
      await StorageUtils.updateCustomZikr(editingZikr.id, updatedZikr);
      setCustomZikrs(customZikrs.map(zikr =>
        zikr.id === editingZikr.id ? updatedZikr : zikr
      ));
      setNewZikr({
        arabic: '',
        transliteration: '',
        translation: '',
        reference: '',
        recommendedCount: 33,
      });
      setEditingZikr(null);
      editSheetRef.current?.close();
    } catch (error) {
      Alert.alert('Error', 'Failed to update custom dhikr');
    }
  };

  const deleteCustomZikr = (zikrId: number) => {
    Alert.alert(
      'Delete Dhikr',
      'Are you sure you want to delete this custom dhikr?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageUtils.deleteCustomZikr(zikrId);
              setCustomZikrs(customZikrs.filter(zikr => zikr.id !== zikrId));
              // Show success message
              Alert.alert('Success', 'Custom dhikr deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete custom dhikr');
            }
          },
        },
      ]
    );
  };

  const ZikrRow: React.FC<{ zikr: ZikrItem; isCustom?: boolean; isLast?: boolean }> = ({
    zikr,
    isCustom = false,
    isLast = false,
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleZikrPress(zikr)}
      style={[
        styles.zikrRow,
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
      ]}
    >
      <View style={[styles.zikrRowIcon, { backgroundColor: isCustom ? theme.colors.accent + '22' : theme.colors.primary + '18' }]}>
        {isCustom ? <CrescentIcon size={22} color={theme.colors.accent} /> : <BookQuranIcon size={22} color={theme.colors.primary} />}
      </View>
      <View style={styles.zikrRowContent}>
        <Text style={[styles.zikrRowArabic, { color: theme.colors.text }]} numberOfLines={2}>
          {zikr.arabic}
        </Text>
        <Text style={[styles.zikrRowTranslation, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {zikr.translation}
        </Text>
      </View>
      <View style={styles.zikrRowRight}>
        <View style={[styles.zikrCountPill, { backgroundColor: theme.colors.primary + '18' }]}>
          <Text style={[styles.zikrCountText, { color: theme.colors.primary }]}>{zikr.recommendedCount}</Text>
        </View>
        {isCustom && (
          <View style={styles.zikrRowActions}>
            <TouchableOpacity onPress={() => editCustomZikr(zikr)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.zikrRowActionBtn}>
              <Gear size={18} color={theme.colors.primary} weight="bold" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteCustomZikr(zikr.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.zikrRowActionBtn}>
              <X size={18} color={theme.colors.error} weight="bold" />
            </TouchableOpacity>
          </View>
        )}
        {!isCustom && <CaretRight size={20} color={theme.colors.textTertiary} weight="bold" />}
      </View>
    </TouchableOpacity>
  );

  const recentIds = new Set(recentZikrs.map(z => z.id));
  const restBuiltIn = allBuiltIn.filter(z => !recentIds.has(z.id));
  const displayList: { zikr: ZikrItem; isCustom: boolean }[] = [
    ...recentZikrs.slice(0, 6).map(zikr => ({ zikr, isCustom: customZikrs.some(c => c.id === zikr.id) })),
    ...restBuiltIn.map(zikr => ({ zikr, isCustom: false })),
    ...customZikrs.map(zikr => ({ zikr, isCustom: true })),
  ];

  return (
    <ScreenWrapper withPadding={false}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>
              Tap Tasbeeh
            </Text>
            <Text style={[styles.headerSubtitle, { color: 'rgba(255,255,255,0.85)' }]}>
              Choose a remembrance
            </Text>
          </View>
        </View>
        <View style={styles.headerBorder}>
          {[...Array(6)].map((_, i) => (
            <IslamicStarIcon key={i} size={10} color={theme.colors.accent} />
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {recentZikrs.length > 0 && (
          <View style={styles.recentStrip}>
            <ClockCounterClockwise size={16} color={theme.colors.primary} weight="duotone" />
            <Text style={[styles.recentStripText, { color: theme.colors.textSecondary }]}>Recent</Text>
          </View>
        )}

        <Card variant="elevated" padding="none" style={[styles.zikrListCard, { backgroundColor: theme.colors.surface }]}>
          {loading ? (
            <View style={styles.zikrListEmpty}>
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading...</Text>
            </View>
          ) : displayList.length === 0 ? (
            <View style={styles.zikrListEmpty}>
              <BookQuranIcon size={40} color={theme.colors.border} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No dhikr yet</Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>Tap + to add your first</Text>
            </View>
          ) : (
            displayList.map(({ zikr, isCustom }, index) => (
              <ZikrRow
                key={isCustom ? `c-${zikr.id}` : zikr.id}
                zikr={zikr}
                isCustom={isCustom}
                isLast={index === displayList.length - 1}
              />
            ))
          )}
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            transform: [{ scale: fabAnimation }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            Animated.sequence([
              Animated.timing(fabAnimation, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(fabAnimation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
            ]).start();
            addSheetRef.current?.open();
          }}
          style={styles.fabButton}
          activeOpacity={0.8}
        >
          <Plus size={24} color={theme.colors.surface} weight="bold" />
        </TouchableOpacity>
      </Animated.View>

      {/* Add New Dhikr Bottom Sheet */}
      <BottomSheet
        ref={addSheetRef}
        height="85%"
        style={{ backgroundColor: theme.colors.surface }}
        backdropMaskColor={theme.colors.overlay}
        closeOnBackdropPress
      >
        <Card
          variant="elevated"
          padding="large"
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.modalHeader}
          >
            <View style={styles.modalHeaderLeft}>
              <BookOpen
                size={24}
                color={theme.colors.surface}
                weight="fill"
              />
              <Text
                style={[styles.modalTitle, { color: theme.colors.surface }]}
              >
                Add New Dhikr
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => addSheetRef.current?.close()}
              style={styles.modalCloseButton}
            >
              <X size={24} color={theme.colors.surface} weight="bold" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Arabic Text *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder=""
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newZikr.arabic}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, arabic: text })
                  }
                  multiline
                  textAlign="right"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Transliteration
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder="English pronunciation (optional)"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newZikr.transliteration}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, transliteration: text })
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Translation *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder="English meaning"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newZikr.translation}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, translation: text })
                  }
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Reference
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder="Quran/Hadith reference (optional)"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newZikr.reference}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, reference: text })
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Recommended Count
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder="33"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newZikr.recommendedCount.toString()}
                  onChangeText={text =>
                    setNewZikr({
                      ...newZikr,
                      recommendedCount: parseInt(text) || 33,
                    })
                  }
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button
                title="Add Dhikr"
                onPress={addCustomZikr}
                variant="primary"
                icon={
                  <CheckCircle
                    size={16}
                    color={theme.colors.surface}
                    weight="bold"
                  />
                }
                style={styles.modalButton}
              />
            </View>
          </Card>
      </BottomSheet>

      {/* Edit Dhikr Bottom Sheet */}
      <BottomSheet
        ref={editSheetRef}
        height="85%"
        style={{ backgroundColor: theme.colors.surface }}
        backdropMaskColor={theme.colors.overlay}
        closeOnBackdropPress
      >
        <Card
          variant="elevated"
          padding="large"
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.modalHeader}
          >
            <View style={styles.modalHeaderLeft}>
              <Gear
                size={24}
                color={theme.colors.surface}
                weight="fill"
              />
              <Text
                style={[styles.modalTitle, { color: theme.colors.surface }]}
              >
                Edit Dhikr
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => editSheetRef.current?.close()}
              style={styles.modalCloseButton}
            >
              <X size={24} color={theme.colors.surface} weight="bold" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Arabic Text *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder=""
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newZikr.arabic}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, arabic: text })
                  }
                  multiline
                  textAlign="right"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Transliteration
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder="English pronunciation"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newZikr.transliteration}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, transliteration: text })
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Translation *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder="English meaning"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newZikr.translation}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, translation: text })
                  }
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Reference
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder="Quran/Hadith reference (optional)"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newZikr.reference}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, reference: text })
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Recommended Count
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder="33"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newZikr.recommendedCount.toString()}
                  onChangeText={text =>
                    setNewZikr({
                      ...newZikr,
                      recommendedCount: parseInt(text) || 33,
                    })
                  }
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button
                title="Update Dhikr"
                onPress={updateCustomZikr}
                variant="primary"
                icon={
                  <CheckCircle
                    size={16}
                    color={theme.colors.surface}
                    weight="bold"
                  />
                }
                style={styles.modalButton}
              />
            </View>
          </Card>
      </BottomSheet>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  headerText: {},
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  headerBorder: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 6,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  recentStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingLeft: 4,
  },
  recentStripText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.5,
  },
  zikrListCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  zikrListEmpty: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  zikrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  zikrRowIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  zikrRowContent: {
    flex: 1,
    minWidth: 0,
  },
  zikrRowArabic: {
    fontSize: 18,
    fontFamily: 'Amiri-Bold',
    lineHeight: 28,
  },
  zikrRowTranslation: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  zikrRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zikrCountPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  zikrCountText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  zikrRowActions: {
    flexDirection: 'row',
    gap: 4,
  },
  zikrRowActionBtn: {
    padding: 6,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPadding: {
    height: 100,
  },

  // Bottom sheet form styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  modalContent: {
    borderRadius: 20,
    maxHeight: '85%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 20,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    marginLeft: 12,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollView: {
    flex: 1,
    maxHeight: 400,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  inputContainer: {
    marginVertical: 8,
  },
  inputLabel: {
    ...TYPOGRAPHY.label,
    marginBottom: 6,
  },
  input: {
    ...TYPOGRAPHY.body,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    width: "100%",
  },
  modalButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});

export default ModernHomeScreen;
