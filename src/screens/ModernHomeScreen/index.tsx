import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Plus,
  ChartBar,
  Gear,
  Moon,
  BookOpen,
  Star,
  CheckCircle,
  X,
  ClockCounterClockwise,
  MagnifyingGlass,
} from 'phosphor-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ZikrItem } from '../../types';
import { AZKAAR, ZIKR_CATEGORIES } from '../../constants/AzkarData';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingZikr, setEditingZikr] = useState<ZikrItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentZikrs, setRecentZikrs] = useState<ZikrItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fabAnimation] = useState(new Animated.Value(1));
  const [newZikr, setNewZikr] = useState({
    arabic: '',
    transliteration: '',
    translation: '',
    reference: '',
    recommendedCount: 33,
  });

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

  const filterZikrs = (list: ZikrItem[], forCustomList: boolean) => {
    let out = list;
    if (selectedCategory === 'custom') {
      if (!forCustomList) return [];
      return searchQuery.trim() ? out.filter(z => {
        const q = searchQuery.trim().toLowerCase();
        return z.arabic.includes(searchQuery) || (z.transliteration && z.transliteration.toLowerCase().includes(q)) || (z.translation && z.translation.toLowerCase().includes(q));
      }) : out;
    }
    if (selectedCategory) {
      out = out.filter(z => (z.category || 'general') === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      out = out.filter(
        z =>
          z.arabic.includes(searchQuery) ||
          (z.transliteration && z.transliteration.toLowerCase().includes(q)) ||
          (z.translation && z.translation.toLowerCase().includes(q))
      );
    }
    return out;
  };

  const filteredAzkar = filterZikrs(AZKAAR, false);
  const filteredCustom = filterZikrs(customZikrs, true);

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
      setModalVisible(false);
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
    setEditModalVisible(true);
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
      setEditModalVisible(false);
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

  const ZikrCard: React.FC<{ zikr: ZikrItem; isCustom?: boolean }> = ({
    zikr,
    isCustom = false,
  }) => (
    <Card
      variant="elevated"
      padding="medium"
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
    >
      <TouchableOpacity
        onPress={() => handleZikrPress(zikr)}
        activeOpacity={0.8}
        style={styles.cardTouchable}
      >
        <View style={styles.cardHeader}>
          {isCustom ? (
            <CrescentIcon color={theme.colors.accent} />
          ) : (
            <BookQuranIcon color={theme.colors.accent} />
          )}
          <View style={styles.cardTitleContainer}>
            <Text style={[styles.cardCategory, { color: theme.colors.accent }]}>
              {isCustom ? 'Personal' : (ZIKR_CATEGORIES.find(c => c.key === (zikr.category || 'general'))?.label || 'Dhikr')}
            </Text>
            {zikr.isSunnah && (
              <View style={[styles.sunnahBadge, { backgroundColor: `${theme.colors.accent}25` }]}>
                <Text style={[styles.sunnahBadgeText, { color: theme.colors.accent }]}>Sunnah</Text>
              </View>
            )}
            <IslamicStarIcon size={16} color={theme.colors.accent} />
          </View>
          <View style={styles.cardActions}>
            <View
              style={[
                styles.countBadge,
                { backgroundColor: `${theme.colors.accent}20` },
              ]}
            >
              <Text style={[styles.countText, { color: theme.colors.accent }]}>
                {zikr.recommendedCount}
              </Text>
            </View>
            {isCustom && (
              <View style={styles.customActions}>
                <TouchableOpacity
                  onPress={() => editCustomZikr(zikr)}
                  style={styles.actionButton}
                >
                  <Gear size={16} color={theme.colors.primary} weight="bold" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteCustomZikr(zikr.id)}
                  style={styles.actionButton}
                >
                  <X size={16} color={theme.colors.error} weight="bold" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.arabicText, { color: theme.colors.text }]}>
            {zikr.arabic}
          </Text>
          {zikr.transliteration && (
            <Text
              style={[
                styles.transliterationText,
                { color: theme.colors.accent },
              ]}
            >
              {zikr.transliteration}
            </Text>
          )}
          <Text
            style={[styles.translationText, { color: theme.colors.textSecondary }]}
          >
            {zikr.translation}
          </Text>

          {zikr.reference && (
            <Text
              style={[
                styles.referenceText,
                { color: theme.colors.textTertiary },
              ]}
            >
              {zikr.reference}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <ScreenWrapper withPadding={false}>
      {/* Modern Header */}
      <LinearGradient
        colors={[
          theme.colors.primary,
          theme.colors.secondary,
          theme.colors.tertiary,
        ]}
        style={[styles.header, { paddingTop: insets.top + 15 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>
              Digital Tasbih
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard' as any)}
              style={styles.headerActionButton}
            >
              <ChartBar size={20} color={theme.colors.surface} weight="bold" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings' as any)}
              style={styles.headerActionButton}
            >
              <Gear size={20} color={theme.colors.surface} weight="bold" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Islamic Pattern Border */}
        <View style={styles.headerBorder}>
          {[...Array(8)].map((_, i) => (
            <IslamicStarIcon key={i} size={12} color={theme.colors.accent} />
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        style={[
          styles.scrollView,
          { backgroundColor: theme.colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={[styles.searchRow, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.searchBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <MagnifyingGlass size={20} color={theme.colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search dhikr..."
              placeholderTextColor={theme.colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category chips */}
        <View style={styles.categoryRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryChips}>
            {ZIKR_CATEGORIES.map(c => (
              <TouchableOpacity
                key={c.key}
                onPress={() => setSelectedCategory(selectedCategory === c.key ? null : c.key)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategory === c.key ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: selectedCategory === c.key ? theme.colors.surface : theme.colors.text },
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recently used */}
        {recentZikrs.length > 0 && !searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ClockCounterClockwise size={22} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Recently used
              </Text>
              <View style={[styles.sectionDivider, { backgroundColor: theme.colors.accent }]} />
            </View>
            {recentZikrs.slice(0, 5).map(zikr => (
              <ZikrCard key={`recent-${zikr.id}`} zikr={zikr} isCustom={customZikrs.some(c => c.id === zikr.id)} />
            ))}
          </View>
        )}

        {/* Sacred Remembrance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookQuranIcon size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Sacred Remembrance
            </Text>
            <View style={[styles.sectionDivider, { backgroundColor: theme.colors.accent }]} />
          </View>

          {filteredAzkar.length === 0 ? (
            <Card variant="outlined" padding="medium" style={[styles.loadingCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                No dhikr in this category.
              </Text>
            </Card>
          ) : (
            filteredAzkar.map(zikr => <ZikrCard key={zikr.id} zikr={zikr} />)
          )}
        </View>

        {/* Custom Dhikr Section */}
        {loading ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CrescentIcon color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Personal Collection
              </Text>
              <View
                style={[
                  styles.sectionDivider,
                  { backgroundColor: theme.colors.accent },
                ]}
              />
            </View>
            <Card
              variant="outlined"
              padding="medium"
              style={[styles.loadingCard, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Loading your personal dhikrs...
              </Text>
            </Card>
          </View>
        ) : customZikrs.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CrescentIcon color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Personal Collection
              </Text>
              <View
                style={[
                  styles.sectionDivider,
                  { backgroundColor: theme.colors.accent },
                ]}
              />
            </View>

            {(filteredCustom.length === 0 ? (
              <Card variant="outlined" padding="medium" style={[styles.loadingCard, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                  No matching personal dhikr.
                </Text>
              </Card>
            ) : (
              filteredCustom.map(zikr => (
                <ZikrCard key={zikr.id} zikr={zikr} isCustom={true} />
              ))
            ))}
          </View>
        ) : null}

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
            setModalVisible(true);
          }}
          style={styles.fabButton}
          activeOpacity={0.8}
        >
          <Plus size={24} color={theme.colors.surface} weight="bold" />
        </TouchableOpacity>
      </Animated.View>

      {/* Enhanced Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: theme.colors.overlay },
          ]}
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
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={theme.colors.surface} weight="bold" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.modalScrollView}>
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
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: theme.colors.overlay },
          ]}
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
                onPress={() => setEditModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={theme.colors.surface} weight="bold" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.modalScrollView}>
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
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Styles
  header: {
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 30,
  },
  headerText: {
    flex: 1,
    marginHorizontal: 15,
  },
  headerTitle: {
    marginBottom: 4,
    fontSize: 30,
  },
  headerSubtitle: {},
  headerBorder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content Styles
  scrollView: {
    flex: 1,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    paddingVertical: 0,
  },
  categoryRow: {
    paddingVertical: 8,
    paddingLeft: 16,
  },
  categoryChips: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginLeft: 10,
    flex: 1,
  },
  sectionDivider: {
    height: 2,
    flex: 1,
    borderRadius: 1,
  },

  // Card Styles
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  sunnahBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sunnahBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
  },
  cardCategory: {
    ...TYPOGRAPHY.caption,
    fontFamily: FONT_WEIGHTS.semiBold.primary,
    marginRight: 6,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    ...TYPOGRAPHY.caption,
    fontFamily: FONT_WEIGHTS.bold.primary,
    marginLeft: 4,
  },
  cardContent: {
    alignItems: 'center',
  },
  arabicText: {
    ...TYPOGRAPHY.arabicLarge,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 52,
  },
  transliterationText: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  translationText: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    marginBottom: 8,
  },
  referenceText: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
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

  // Modal Styles
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
    maxHeight: 400,
    paddingHorizontal: 20,
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
  loadingCard: {
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default ModernHomeScreen;
