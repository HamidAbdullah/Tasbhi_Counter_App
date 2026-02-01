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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import HapticFeedback from 'react-native-haptic-feedback';
import {
  ArrowLeft,
  ArrowCounterClockwise,
  Trophy,
} from 'phosphor-react-native';
import { RootStackParamList } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import ModernTapTasbih from '../../components/ModernTapTasbih';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { StorageUtils } from '../../Utils/StorageUtils';

type CounterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Counter'
>;

const BackIcon = ({ size = 24, color = '#ffffff' }) => (
  <ArrowLeft size={size} color={color} weight="bold" />
);

const ResetIcon = ({ size = 20, color = '#ffffff' }) => (
  <ArrowCounterClockwise size={size} color={color} weight="bold" />
);

const ModernCounterScreen: React.FC = () => {
  const navigation = useNavigation<CounterScreenNavigationProp>();
  const route = useRoute();
  const { zikr } = (route as any).params;
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [count, setCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [hasShownLearnMore, setHasShownLearnMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing count on component mount
  React.useEffect(() => {
    loadExistingCount();
  }, []);

  const loadExistingCount = async () => {
    try {
      setIsLoading(true);

      // Add timeout to prevent long loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Loading timeout')), 2000)
      );

      const dataPromise = StorageUtils.getCounterData(zikr.id);
      const existingCount = await Promise.race([dataPromise, timeoutPromise]) as number;

      setCount(existingCount);
    } catch (error) {
      console.error('Error loading existing count:', error);
      // If there's an error or timeout, just start with 0 and make it clickable
      setCount(0);
    } finally {
      setIsLoading(false);
    }
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
      marginTop: 30,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    headerButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      ...theme.typography.h3,
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
      ...theme.typography.arabicLarge,
      textAlign: 'center',
      marginBottom: 10,
    },
    transliterationText: {
      ...theme.typography.body,
      textAlign: 'center',
      marginBottom: 8,
      fontStyle: 'italic',
    },
    translationText: {
      ...theme.typography.bodySmall,
      textAlign: 'center',
    },
    roundsCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 16,
    },
    roundsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    roundsTextContainer: {
      marginLeft: 12,
      alignItems: 'center',
    },
    roundsLabel: {
      ...theme.typography.label,
      marginBottom: 2,
    },
    roundsCount: {
      ...theme.typography.h2,
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
      ...theme.typography.label,
    },
    progressText: {
      ...theme.typography.body,
      fontFamily: theme.typography.button.fontFamily,
    },
    progressBar: {
      width: '100%',
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    totalCountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      gap: 8,
    },
    totalCountLabel: {
      ...theme.typography.caption,
    },
    totalCountValue: {
      ...theme.typography.bodyLarge,
      fontFamily: theme.typography.button.fontFamily,
    },
    tasbihContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      minHeight: 300,
    },
    tapHintContainer: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tapHintText: {
      ...theme.typography.bodyLarge,
      fontFamily: theme.typography.button.fontFamily,
      textAlign: 'center',
      marginBottom: 4,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    tapHintSubText: {
      ...theme.typography.bodySmall,
      textAlign: 'center',
      opacity: 0.9,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
    },
    loadingText: {
      ...theme.typography.bodyLarge,
      textAlign: 'center',
      opacity: 0.8,
    },
  });

  // Subtle pulse animation for tap hint
  useEffect(() => {
    if (count === 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [count, pulseAnimation]);

  // Calculate rounds and current count in round
  const completedRounds = Math.floor(count / zikr.recommendedCount);
  const currentRoundCount = count % zikr.recommendedCount;
  const progress = currentRoundCount / zikr.recommendedCount;

  useEffect(() => {
    if (count > 0 && count % zikr.recommendedCount === 0) {
      // Celebration animation on completing a round
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

      // Show alert only for first two rounds
      if (completedRounds <= 2) {
        setTimeout(() => {
          if (completedRounds === 1) {
            // First round - simple congratulations
            Alert.alert(
              'Congratulations! 🎉',
              `You have completed Round ${completedRounds}!`,
              [
                { text: 'Continue', style: 'cancel' },
                { text: 'Reset', onPress: handleReset },
              ],
            );
          } else if (completedRounds === 2 && !hasShownLearnMore) {
            // Second round - ask about learning more
            Alert.alert(
              'Great Progress! 🎉',
              `You have completed Round ${completedRounds}! Would you like to learn more about continuing rounds?`,
              [
                {
                  text: 'No, Continue',
                  style: 'cancel',
                  onPress: () => setHasShownLearnMore(true),
                },
                {
                  text: 'Learn More',
                  onPress: () => {
                    setHasShownLearnMore(true);
                    Alert.alert(
                      'Multiple Rounds',
                      'You can continue counting as many rounds as you like. The counter will keep tracking your progress and total count!',
                      [{ text: 'Got it!', style: 'default' }],
                    );
                  },
                },
              ],
            );
          }
        }, 500);
      }
    }
  }, [
    count,
    zikr.recommendedCount,
    completedRounds,
    pulseAnimation,
    hasShownLearnMore,
  ]);

  const handleIncrement = async () => {
    // Allow increment even while loading to ensure responsiveness
    const newCount = count + 1;
    setCount(newCount);
    HapticFeedback.trigger('impactLight');

    // Save to Async Storage (non-blocking)
    StorageUtils.saveCounterData(zikr.id, newCount).catch(error => {
      console.error('Error saving counter data:', error);
    });

    // Update daily stats (non-blocking)
    const today = new Date().toISOString().split('T')[0];
    StorageUtils.getDailyStats(today).then(todayStats => {
      const stats = todayStats || { totalCount: 0, totalRounds: 0 };
      stats.totalCount += 1;
      stats.totalRounds = Math.floor(stats.totalCount / zikr.recommendedCount);
      return StorageUtils.saveDailyStats(today, stats);
    }).catch(error => {
      console.error('Error updating daily stats:', error);
    });

    // Update streak (non-blocking)
    StorageUtils.updateStreak().catch(error => {
      console.error('Error updating streak:', error);
    });
  };

  const handleReset = () => {
    Alert.alert('Reset Counter', 'Do you want to reset the counter to zero?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          setCount(0);
          setIsCompleted(false);
          HapticFeedback.trigger('impactMedium');

          // Reset in Async Storage
          try {
            await StorageUtils.resetCounter(zikr.id);
          } catch (error) {
            console.error('Error resetting counter:', error);
          }
        },
      },
    ]);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper withPadding={false}>

      <LinearGradient
        colors={[
          theme.colors.primary,
          theme.colors.secondary,
          theme.colors.tertiary,
        ]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={[styles.header, { marginTop: insets.top }]}>
          <TouchableOpacity onPress={goBack} style={styles.headerButton}>
            <BackIcon size={24} color={theme.colors.surface} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>
              Tasbih Counter
            </Text>
          </View>

          <TouchableOpacity onPress={handleReset} style={styles.headerButton}>
            <ResetIcon size={20} color={theme.colors.surface} />
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
              <Text
                style={[
                  styles.transliterationText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {zikr.transliteration}
              </Text>
            )}
          </Animated.View>
        </Card>

        {/* Rounds Display */}
        {completedRounds > 0 && (
          <Card
            variant="filled"
            padding="medium"
            style={[
              styles.roundsCard,
              {
                backgroundColor: `${theme.colors.accent}20`,
                borderWidth: 1,
                borderColor: theme.colors.accent,
              },
            ]}
          >
            <View style={styles.roundsContainer}>
              <Trophy size={24} color={theme.colors.accent} weight="fill" />
              <View style={styles.roundsTextContainer}>
                <Text
                  style={[styles.roundsLabel, { color: theme.colors.text }]}
                >
                  Completed Rounds
                </Text>
                <Text
                  style={[styles.roundsCount, { color: theme.colors.accent }]}
                >
                  {completedRounds} {completedRounds === 1 ? 'Round' : 'Rounds'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Progress Section */}
        <Card
          variant="outlined"
          padding="medium"
          style={[
            styles.progressCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text
                style={[styles.progressLabel, { color: theme.colors.text }]}
              >
                Current Round Progress
              </Text>
              <Text
                style={[styles.progressText, { color: theme.colors.primary }]}
              >
                {currentRoundCount} / {zikr.recommendedCount}
              </Text>
            </View>

            {/* Progress Bar */}
            <View
              style={[
                styles.progressBar,
                { backgroundColor: theme.colors.border },
              ]}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>

            {/* Total Count */}
            <View style={styles.totalCountContainer}>
              <Text
                style={[
                  styles.totalCountLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Count:
              </Text>
              <Text
                style={[
                  styles.totalCountValue,
                  { color: theme.colors.primary },
                ]}
              >
                {count}
              </Text>
            </View>
          </View>
        </Card>

        {/* Tasbih Counter */}
        <View style={styles.tasbihContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: theme.colors.surface }]}>
                Loading your progress...
              </Text>
            </View>
          ) : (
            <>
              <ModernTapTasbih
                count={currentRoundCount}
                onIncrement={handleIncrement}
                isCompleted={currentRoundCount === zikr.recommendedCount}
                targetCount={zikr.recommendedCount}
              />

              {/* Tap Here Hint - Show only when count is 0 */}
              {count === 0 && (
                <Animated.View
                  style={[
                    styles.tapHintContainer,
                    {
                      opacity: pulseAnimation,
                      transform: [{ scale: pulseAnimation }],
                    },
                  ]}
                >
                  <Text
                    style={[styles.tapHintText, { color: theme.colors.surface }]}
                  >
                    👆 Tap Here to Start
                  </Text>
                  <Text
                    style={[styles.tapHintSubText, { color: theme.colors.surface }]}
                  >
                    Begin your Dhikr journey
                  </Text>
                </Animated.View>
              )}
            </>
          )}
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default ModernCounterScreen;
