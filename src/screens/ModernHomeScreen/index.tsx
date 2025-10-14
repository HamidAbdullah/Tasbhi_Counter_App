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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path, Circle, G, Polygon } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';
import { ZikrItem } from '../../types';
import { AZKAAR } from '../../constants/AzkarData';
import { RootStackParamList } from '../../../App';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Modern Islamic-themed SVG Icons
const MosqueIcon = ({ size = 32, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L8 6v2h8V6l-4-4z" fill={color} />
    <Circle cx="12" cy="4" r="1" fill={color} />
    <Path d="M6 8v12h12V8H6z" fill={color} />
    <Path d="M4 20h16v2H4v-2z" fill={color} />
    <Circle cx="8" cy="12" r="1" fill="#4a7c59" />
    <Circle cx="16" cy="12" r="1" fill="#4a7c59" />
    <Path d="M10 14h4v4h-4v-4z" fill="#4a7c59" />
  </Svg>
);

const TasbihBeadsIcon = ({ size = 24, color = '#4a7c59' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="4" r="2.5" fill={color} />
    <Circle cx="12" cy="10" r="3" fill={color} />
    <Circle cx="12" cy="17" r="2.5" fill={color} />
    <Path
      d="M12 1.5v21"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Circle cx="8" cy="7" r="1.5" fill={color} opacity="0.7" />
    <Circle cx="16" cy="7" r="1.5" fill={color} opacity="0.7" />
    <Circle cx="8" cy="14" r="1.5" fill={color} opacity="0.7" />
    <Circle cx="16" cy="14" r="1.5" fill={color} opacity="0.7" />
  </Svg>
);

const IslamicStarIcon = ({ size = 20, color = '#DAA520' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2l2.09 6.26L20 8l-3.91 2.74L18.18 17L12 14.5L5.82 17l2.09-6.26L4 8l5.91.26L12 2z"
      fill={color}
    />
    <Circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="1" />
  </Svg>
);

const CrescentIcon = ({ size = 18, color = '#4a7c59' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.5 2 5.5 4.5 5.5 8s3 6 6.5 6c-4.5 0-8-3.5-8-8s3.5-8 8-8z"
      fill={color}
    />
    <Path
      d="M16 4l1.5 2.5L20 5l-1.5 2.5L20 10l-2.5-1.5L16 11l1.5-2.5L16 6l2.5 1.5L16 4z"
      fill={color}
    />
  </Svg>
);

const BookQuranIcon = ({ size = 20, color = '#4a7c59' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 2v20l4-2 4 2 4-2 4 2V2l-4 2-4-2-4 2-4-2z" fill={color} />
    <Path
      d="M8 6h8M8 10h6M8 14h8"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Circle cx="16" cy="8" r="1" fill="#DAA520" />
  </Svg>
);

const PlusCircleIcon = ({ size = 20, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path
      d="M12 7v10M7 12h10"
      stroke="#4a7c59"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const ThemeToggleIcon = ({ size = 24, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="5" fill={color} />
    <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const ModernHomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, toggleTheme, isDark } = useTheme();
  const [customZikrs, setCustomZikrs] = useState<ZikrItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
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
        <LinearGradient
          colors={
            isCustom
              ? [theme.colors.secondary, theme.colors.primary]
              : [theme.colors.primary, theme.colors.secondary]
          }
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            {isCustom ? <CrescentIcon color={theme.colors.accent} /> : <BookQuranIcon color={theme.colors.accent} />}
            <View style={styles.cardTitleContainer}>
              <Text style={[styles.cardCategory, { color: theme.colors.accent }]}>
                {isCustom ? 'Personal' : 'Traditional'}
              </Text>
              <IslamicStarIcon size={16} color={theme.colors.accent} />
            </View>
            <View style={[styles.countBadge, { backgroundColor: `${theme.colors.accent}20` }]}>
              <CrescentIcon size={14} color={theme.colors.accent} />
              <Text style={[styles.countText, { color: theme.colors.accent }]}>
                {zikr.recommendedCount}
              </Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={[styles.arabicText, { color: theme.colors.surface }]}>
              {zikr.arabic}
            </Text>
            {zikr.transliteration && (
              <Text style={[styles.transliterationText, { color: theme.colors.accent }]}>
                {zikr.transliteration}
              </Text>
            )}
            <Text style={[styles.translationText, { color: theme.colors.surface }]}>
              {zikr.translation}
            </Text>

            {zikr.reference && (
              <Text style={[styles.referenceText, { color: `${theme.colors.surface}80` }]}>
                {zikr.reference}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Modern Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary, theme.colors.tertiary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <MosqueIcon size={40} color={theme.colors.surface} />
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>
              Digital Tasbih
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.accent }]}>
              الله أكبر • سُبْحَانَ اللّهِ • الحمد لله
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Dashboard' as any)} 
              style={styles.dashboardButton}
            >
              <Text style={{ fontSize: 18, color: theme.colors.surface }}>📊</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
              <ThemeToggleIcon size={24} color={theme.colors.surface} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Settings' as any)} 
              style={styles.settingsButton}
            >
              <Text style={{ fontSize: 20, color: theme.colors.surface }}>⚙️</Text>
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
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Traditional Dhikr Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookQuranIcon size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Sacred Remembrance
            </Text>
            <View style={[styles.sectionDivider, { backgroundColor: theme.colors.accent }]} />
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
              <View style={[styles.sectionDivider, { backgroundColor: theme.colors.accent }]} />
            </View>

            {customZikrs.map(zikr => (
              <ZikrCard key={zikr.id} zikr={zikr} isCustom={true} />
            ))}
          </View>
        )}

        {/* Add New Dhikr Button */}
        <View style={styles.addButtonContainer}>
          <Button
            title="Add New Dhikr"
            onPress={() => setModalVisible(true)}
            variant="primary"
            size="large"
            icon={<PlusCircleIcon size={20} color={theme.colors.surface} />}
            fullWidth
            style={styles.addButton}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Enhanced Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <Card
            variant="elevated"
            padding="large"
            style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.modalHeader}
            >
              <MosqueIcon size={24} color={theme.colors.surface} />
              <Text style={[styles.modalTitle, { color: theme.colors.surface }]}>
                Add New Dhikr
              </Text>
              <IslamicStarIcon size={20} color={theme.colors.accent} />
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
                  placeholder="Enter Arabic dhikr"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newZikr.arabic}
                  onChangeText={text => setNewZikr({ ...newZikr, arabic: text })}
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
                  onChangeText={text => setNewZikr({ ...newZikr, translation: text })}
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
                  onChangeText={text => setNewZikr({ ...newZikr, reference: text })}
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
                title="Cancel"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />

              <Button
                title="Add Dhikr"
                onPress={addCustomZikr}
                variant="primary"
                icon={<IslamicStarIcon size={16} color={theme.colors.surface} />}
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
    alignItems: 'center',
    marginHorizontal: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
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
  dashboardButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    flex: 2,
    marginLeft: 10,
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

  // Add Button
  addButtonContainer: {
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  addButton: {
    borderRadius: 16,
  },
  bottomPadding: {
    height: 30,
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
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 10,
  },
  modalScrollView: {
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginVertical: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
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
});

export default ModernHomeScreen;
