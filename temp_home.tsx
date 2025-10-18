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
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  House,
  Plus,
  ChartBar,
  Gear,
  Sun,
  Moon,
  BookOpen,
  Star,
  CheckCircle,
  X,
} from 'phosphor-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ZikrItem } from '../../types';
import { AZKAAR } from '../../constants/AzkarData';
import { RootStackParamList } from '../../../App';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Modern Islamic-themed Icons using Phosphor
const MosqueIcon = ({ size = 32, color = '#ffffff' }) => (
  <House size={size} color={color} weight="fill" />
);

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
  const [customZikrs, setCustomZikrs] = useState<ZikrItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fabAnimation] = useState(new Animated.Value(1));
  const [newZikr, setNewZikr] = useState({
    arabic: '',
    transliteration: '',
    translation: '',
    reference: '',
    recommendedCount: 33,
  });

  const handleZikrPress = (zikr: ZikrItem) => {
    navigation.navigate('Counter', { zikr });
  };

  const addCustomZikr = () => {
    if (!newZikr.arabic || !newZikr.translation) {
      Alert.alert('Error', 'Please enter Arabic text and translation');
      return;
    }

    const customZikr: ZikrItem = {
      id: Date.now(),
      ...newZikr,
    };

    setCustomZikrs([...customZikrs, customZikr]);
    setNewZikr({
      arabic: '',
      transliteration: '',
      translation: '',
      reference: '',
      recommendedCount: 33,
    });
    setModalVisible(false);
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
              {isCustom ? 'Personal' : 'Traditional'}
            </Text>
            <IslamicStarIcon size={16} color={theme.colors.accent} />
          </View>
          <View
            style={[
              styles.countBadge,
              { backgroundColor: `${theme.colors.accent}20` },
            ]}
          >
            <CrescentIcon size={14} color={theme.colors.accent} />
            <Text style={[styles.countText, { color: theme.colors.accent }]}>
              {zikr.recommendedCount}
            </Text>
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
            style={[styles.translationText, { color: theme.colors.surface }]}
          >
            {zikr.translation}
          </Text>

          {zikr.reference && (
            <Text
              style={[
                styles.referenceText,
                { color: `${theme.colors.surface}80` },
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Modern Header */}
      <LinearGradient
        colors={[
          theme.colors.primary,
          theme.colors.secondary,
          theme.colors.tertiary,
        ]}
        style={styles.header}
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
        {/* Traditional Dhikr Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookQuranIcon size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Sacred Remembrance
            </Text>
            <View
              style={[
                styles.sectionDivider,
                { backgroundColor: theme.colors.accent },
              ]}
            />
          </View>

          {AZKAAR.map(zikr => (
            <ZikrCard key={zikr.id} zikr={zikr} />
          ))}
        </View>

        {/* Custom Dhikr Section */}
        {customZikrs.length > 0 && (
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

            {customZikrs.map(zikr => (
              <ZikrCard key={zikr.id} zikr={zikr} isCustom={true} />
            ))}
          </View>
        )}

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
    </SafeAreaView>
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
  },
  headerText: {
    flex: 1,
    marginHorizontal: 15,
  },
  headerTitle: {
    marginBottom: 4,
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
    fontSize: 20,
    fontWeight: '700',
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
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: '600',
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
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  cardContent: {
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  transliterationText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  referenceText: {
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
