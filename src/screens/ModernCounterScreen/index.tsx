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
import { useTheme } from '../../contexts/ThemeContext';
import ModernTapTasbih from '../../components/ModernTapTasbih';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CircularProgress from '../../components/ui/CircularProgress';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

type CounterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Counter'>;
type CounterScreenRouteProp = RouteProp<RootStackParamList, 'Counter'>;

const BackIcon = ({ size = 24, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ResetIcon = ({ size = 20, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 3v5h5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ModernCounterScreen: React.FC = () => {
  const navigation = useNavigation<CounterScreenNavigationProp>();
  const route = useRoute<CounterScreenRouteProp>();
  const { zikr } = route.params;
  const { theme } = useTheme();

  const [count, setCount] = useState(0);
  const [tasbihType, setTasbihType] = useState<TasbihType>('tap');
  const [isCompleted, setIsCompleted] = useState(false);
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [showStats, setShowStats] = useState(false);

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
      
      setTimeout(() => {
        Alert.alert(
          'مبارک ہو! 🎉',
          `آپ نے ${zikr.recommendedCount} بار مکمل کر لیا!`,
          [
            { text: 'جاری رکھیں', style: 'cancel' },
            { text: 'ری سیٹ کریں', onPress: handleReset },
          ],
        );
      }, 500);
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

  const goBack = () => {
    navigation.goBack();
  };

  const progress = Math.min(count / zikr.recommendedCount, 1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme === theme ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.primary} 
      />
      
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary, theme.colors.tertiary]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Modern Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.headerButton}>
            <BackIcon size={24} color={theme.colors.surface} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>
              تسبیح کاؤنٹر
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowStats(!showStats)}
            style={styles.headerButton}
          >
            <Text style={[styles.headerButtonText, { color: theme.colors.surface }]}>
              📊
            </Text>
          </TouchableOpacity>
        </View>

        {/* Zikr Text Card */}
        <Card
          variant="elevated"
          padding="large"
          style={[styles.zikrCard, { backgroundColor: theme.colors.surface }]}
        >
          <Animated.View
            style={[
              styles.zikrTextContainer,
              { transform: [{ scale: pulseAnimation }] },
            ]}
          >
            <Text style={[styles.arabicText, { color: theme.colors.text }]}>
              {zikr.arabic}
            </Text>
            {zikr.transliteration && (
              <Text style={[styles.transliterationText, { color: theme.colors.textSecondary }]}>
                {zikr.transliteration}
              </Text>
            )}
            <Text style={[styles.translationText, { color: theme.colors.text }]}>
              {zikr.translation}
            </Text>
          </Animated.View>
        </Card>

        {/* Progress Section */}
        <Card
          variant="outlined"
          padding="medium"
          style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
                Progress
              </Text>
              <Text style={[styles.progressText, { color: theme.colors.primary }]}>
                {count} / {zikr.recommendedCount}
              </Text>
            </View>
            
            {/* Linear Progress Bar */}
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>

            {/* Circular Progress */}
            <View style={styles.circularProgressContainer}>
              <CircularProgress
                progress={progress}
                size={100}
                strokeWidth={6}
                variant="primary"
                showPercentage={true}
              >
                <Text style={[styles.progressPercentage, { color: theme.colors.text }]}>
                  {Math.round(progress * 100)}%
                </Text>
              </CircularProgress>
            </View>
          </View>
        </Card>

        {/* Tasbih Counter */}
        <View style={styles.tasbihContainer}>
          <ModernTapTasbih
            count={count}
            onIncrement={handleIncrement}
            isCompleted={isCompleted}
            targetCount={zikr.recommendedCount}
          />
        </View>

        {/* Counter Display */}
        <Card
          variant="filled"
          padding="medium"
          style={[styles.counterCard, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.counterDisplay}>
            <Text style={[styles.counterText, { color: theme.colors.text }]}>
              {count}
            </Text>
            <Text style={[styles.counterLabel, { color: theme.colors.textSecondary }]}>
              {count === 1 ? 'مرتبہ' : 'مرتبہ'}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Reset"
            onPress={handleReset}
            variant="outline"
            size="medium"
            icon={<ResetIcon size={18} color={theme.colors.error} />}
            style={[styles.actionButton, { borderColor: theme.colors.error }]}
            textStyle={{ color: theme.colors.error }}
          />
        </View>

        {/* Stats Panel (when enabled) */}
        {showStats && (
          <Card
            variant="elevated"
            padding="medium"
            style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}
          >
            <View style={styles.statsContent}>
              <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
                Session Stats
              </Text>
              <View style={styles.statsRow}>
                <Text style={[styles.statsLabel, { color: theme.colors.textSecondary }]}>
                  Current Count:
                </Text>
                <Text style={[styles.statsValue, { color: theme.colors.primary }]}>
                  {count}
                </Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={[styles.statsLabel, { color: theme.colors.textSecondary }]}>
                  Target:
                </Text>
                <Text style={[styles.statsValue, { color: theme.colors.primary }]}>
                  {zikr.recommendedCount}
                </Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={[styles.statsLabel, { color: theme.colors.textSecondary }]}>
                  Remaining:
                </Text>
                <Text style={[styles.statsValue, { color: theme.colors.primary }]}>
                  {Math.max(0, zikr.recommendedCount - count)}
                </Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={[styles.statsLabel, { color: theme.colors.textSecondary }]}>
                  Completion:
                </Text>
                <Text style={[styles.statsValue, { color: theme.colors.primary }]}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
            </View>
          </Card>
        )}

        <View style={styles.bottomPadding} />
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
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 20,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  zikrCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  zikrTextContainer: {
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 36,
  },
  transliterationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  circularProgressContainer: {
    marginTop: 8,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  tasbihContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    minHeight: 300,
  },
  counterCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  counterDisplay: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  counterLabel: {
    fontSize: 16,
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  statsContent: {
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 20,
  },
});

export default ModernCounterScreen;
