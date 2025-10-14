import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import HapticFeedback from 'react-native-haptic-feedback';
import { RootStackParamList } from '../../../App';
import { TasbihType } from '../../types';
import RealisticTasbih from '../../components/RealisticTasbih';
import TapTasbih from '../../components/TapTasbih';

type CounterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Counter'
>;
type CounterScreenRouteProp = RouteProp<RootStackParamList, 'Counter'>;

const { width, height } = Dimensions.get('window');

const CounterScreen: React.FC = () => {
  const navigation = useNavigation<CounterScreenNavigationProp>();
  const route = useRoute<CounterScreenRouteProp>();
  const { zikr } = route.params;

  const [count, setCount] = useState(0);
  const [tasbihType, setTasbihType] = useState<TasbihType>('realistic');
  const [isCompleted, setIsCompleted] = useState(false);
  const [pulseAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    if (count === zikr.recommendedCount && !isCompleted) {
      setIsCompleted(true);
      // Celebration animation
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      HapticFeedback.trigger('notificationSuccess');
      Alert.alert(
        'مبارک ہو! 🎉',
        `آپ نے ${zikr.recommendedCount} بار مکمل کر لیا!`,
        [
          { text: 'جاری رکھیں', style: 'cancel' },
          { text: 'ری سیٹ کریں', onPress: handleReset },
        ],
      );
    }
  }, [count, zikr.recommendedCount, isCompleted, pulseAnimation]);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    HapticFeedback.trigger('impactLight');
  };

  const handleReset = () => {
    Alert.alert('ری سیٹ کریں', 'کیا آپ کاؤنٹر کو صفر کرنا چاہتے ہیں؟', [
      { text: 'منسوخ', style: 'cancel' },
      {
        text: 'ری سیٹ',
        style: 'destructive',
        onPress: () => {
          setCount(0);
          setIsCompleted(false);
          HapticFeedback.trigger('impactMedium');
        },
      },
    ]);
  };

  const switchTasbihType = () => {
    setTasbihType(prev => (prev === 'realistic' ? 'tap' : 'realistic'));
    HapticFeedback.trigger('impactLight');
  };

  const goBack = () => {
    navigation.goBack();
  };

  const progress = Math.min(count / zikr.recommendedCount, 1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f2f23" />
      <LinearGradient
        colors={['#0f2f23', '#1a4d3a', '#2d5a4a']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>تسبیح کاؤنٹر</Text>
          </View>

          <TouchableOpacity
            onPress={switchTasbihType}
            style={styles.switchButton}
          >
            <Text style={styles.switchButtonText}>
              {tasbihType === 'realistic' ? '⚡' : '📿'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Zikr Text */}
        <View style={styles.zikrContainer}>
          <Animated.View
            style={[
              styles.zikrTextContainer,
              { transform: [{ scale: pulseAnimation }] },
            ]}
          >
            <Text style={styles.arabicText}>{zikr.arabic}</Text>
            {zikr.transliteration && (
              <Text style={styles.transliterationText}>
                {zikr.transliteration}
              </Text>
            )}
            <Text style={styles.translationText}>{zikr.translation}</Text>
          </Animated.View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#4a7c59', '#6ba16e']}
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.progressText}>
            {count} / {zikr.recommendedCount}
          </Text>
        </View>
ĳ
        {/* Tasbih Counter */}
        <View style={styles.tasbihContainer}>
          {/* {tasbihType === 'realistic' ? (
            <RealisticTasbih
              count={count}
              onIncrement={handleIncrement}
              isCompleted={isCompleted}
            />
          ) : ( */}
            <TapTasbih
              count={count}
              onIncrement={handleIncrement}
              isCompleted={isCompleted}
            />
          {/* )} */}
        </View>

        {/* Counter Display */}
        <View style={styles.counterDisplay}>
          <Text style={styles.counterText}>{count}</Text>
          <Text style={styles.counterLabel}>
            {count === 1 ? 'مرتبہ' : 'مرتبہ'}
          </Text>
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#d73527', '#b92c20']}
            style={styles.resetButtonGradient}
          >
            <Text style={styles.resetButtonText}>ری سیٹ</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  switchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchButtonText: {
    fontSize: 20,
  },
  zikrContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  zikrTextContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 36,
  },
  transliterationText: {
    fontSize: 16,
    color: '#b0d4c1',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 14,
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 20,
  },
  progressContainer: {
    paddingHorizontal: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tasbihContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  counterDisplay: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  counterLabel: {
    fontSize: 16,
    color: '#b0d4c1',
    marginTop: 5,
  },
  resetButton: {
    marginHorizontal: 40,
    marginBottom: 30,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  resetButtonGradient: {
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});


export default CounterScreen;