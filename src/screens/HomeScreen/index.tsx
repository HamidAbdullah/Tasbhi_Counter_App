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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path, Circle, G, Polygon, Ellipse } from 'react-native-svg';
import { ZikrItem } from '../../types';
import { AZKAAR } from '../../constants/AzkarData';
import { RootStackParamList } from '../../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Islamic-themed SVG Icons
const MosqueIcon = ({ size = 32, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L8 6v2h8V6l-4-4z" fill={color} />
    <Circle cx="12" cy="4" r="1" fill={color} />
    <Path d="M6 8v12h12V8H6z" fill={color} />
    <Path d="M4 20h16v2H4v-2z" fill={color} />
    <Circle cx="8" cy="12" r="1" fill="#1e7e34" />
    <Circle cx="16" cy="12" r="1" fill="#1e7e34" />
    <Path d="M10 14h4v4h-4v-4z" fill="#1e7e34" />
  </Svg>
);

const TasbihBeadsIcon = ({ size = 24, color = '#1e7e34' }) => (
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

const CrescentIcon = ({ size = 18, color = '#1e7e34' }) => (
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

const PrayerIcon = ({ size = 18, color = '#8B4513' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.5 2 5.5 5 5.5 8.5c0 5.5 6.5 13.5 6.5 13.5s6.5-8 6.5-13.5C18.5 5 15.5 2 12 2z"
      fill={color}
    />
    <Circle cx="12" cy="8.5" r="2.5" fill="#ffffff" />
  </Svg>
);

const BookQuranIcon = ({ size = 20, color = '#1e7e34' }) => (
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
      stroke="#1e7e34"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
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
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleZikrPress(zikr)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isCustom ? ['#2d5a27', '#1e7e34'] : ['#1e7e34', '#2d5a27']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          {isCustom ? <PrayerIcon /> : <BookQuranIcon />}
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardCategory}>
              {isCustom ? 'Personal' : 'Traditional'}
            </Text>
            <IslamicStarIcon size={16} />
          </View>
          <View style={styles.countBadge}>
            <CrescentIcon size={14} />
            <Text style={styles.countText}>{zikr.recommendedCount}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.arabicText}>{zikr.arabic}</Text>
          {zikr.transliteration && (
            <Text style={styles.transliterationText}>
              {zikr.transliteration}
            </Text>
          )}
          <Text style={styles.translationText}>{zikr.translation}</Text>

          {zikr.reference && (
            <Text style={styles.referenceText}>{zikr.reference}</Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Islamic Header */}
      <LinearGradient
        colors={['#1e7e34', '#2d5a27', '#0d4e1a']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <MosqueIcon size={40} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Digital Tasbih</Text>
            <Text style={styles.headerSubtitle}>
              الله أكبر • سُبْحَانَ اللّهِ • الحمد لله
            </Text>
          </View>
          <TasbihBeadsIcon size={36} color="#DAA520" />
        </View>

        {/* Islamic Pattern Border */}
        <View style={styles.headerBorder}>
          {[...Array(8)].map((_, i) => (
            <IslamicStarIcon key={i} size={12} color="#DAA520" />
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Traditional Dhikr Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookQuranIcon size={24} />
            <Text style={styles.sectionTitle}>Sacred Remembrance</Text>
            <View style={styles.sectionDivider} />
          </View>

          {AZKAAR.map(zikr => (
            <ZikrCard key={zikr.id} zikr={zikr} />
          ))}
        </View>

        {/* Custom Dhikr Section */}
        {customZikrs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <PrayerIcon />
              <Text style={styles.sectionTitle}>Personal Collection</Text>
              <View style={styles.sectionDivider} />
            </View>

            {customZikrs.map(zikr => (
              <ZikrCard key={zikr.id} zikr={zikr} isCustom={true} />
            ))}
          </View>
        )}

        {/* Add New Dhikr Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#DAA520', '#B8860B']}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <PlusCircleIcon />
            <Text style={styles.addButtonText}>Add New Dhikr</Text>
            <CrescentIcon size={16} color="#1e7e34" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Enhanced Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#1e7e34', '#2d5a27']}
              style={styles.modalHeader}
            >
              <MosqueIcon size={24} />
              <Text style={styles.modalTitle}>Add New Dhikr</Text>
              <IslamicStarIcon size={20} />
            </LinearGradient>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Arabic Text *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Arabic dhikr"
                  placeholderTextColor="#000"
                  value={newZikr.arabic}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, arabic: text })
                  }
                  multiline
                  textAlign="right"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Transliteration</Text>
                <TextInput
                  style={styles.input}
                  placeholder="English pronunciation (optional)"
                  placeholderTextColor="#000"
                  value={newZikr.transliteration}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, transliteration: text })
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Translation *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="English meaning"
                  placeholderTextColor="#000"
                  value={newZikr.translation}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, translation: text })
                  }
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Reference</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Quran/Hadith reference (optional)"
                  placeholderTextColor="#000"
                  value={newZikr.reference}
                  onChangeText={text =>
                    setNewZikr({ ...newZikr, reference: text })
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Recommended Count</Text>
                <TextInput
                  style={styles.input}
                  placeholder="33"
                  placeholderTextColor="#000"
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
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={addCustomZikr}
              >
                <LinearGradient
                  colors={['#1e7e34', '#2d5a27']}
                  style={styles.saveButtonGradient}
                >
                  <IslamicStarIcon size={16} />
                  <Text style={styles.saveButtonText}>Add Dhikr</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Header Styles
  header: {
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  headerText: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#DAA520',
    fontWeight: '500',
  },
  headerBorder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 20,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1e7e34',
    marginLeft: 10,
    flex: 1,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#DAA520',
    flex: 2,
    marginLeft: 10,
  },

  // Card Styles
  card: {
    marginBottom: 14,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardGradient: {
    borderRadius: 12,
    padding: 16,
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
    color: '#DAA520',
    fontWeight: '600',
    marginRight: 6,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    color: '#DAA520',
    fontWeight: '700',
    marginLeft: 4,
  },
  cardContent: {
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },
  transliterationText: {
    fontSize: 14,
    color: '#DAA520',
    textAlign: 'center',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 14,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  referenceText: {
    fontSize: 11,
    color: '#b8c5b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Add Button
  addButton: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 14,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e7e34',
    marginHorizontal: 10,
  },
  bottomPadding: {
    height: 30,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    maxHeight: '85%',
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
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
    color: '#1e7e34',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 6,
  },
});

export default HomeScreen;
