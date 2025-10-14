import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../../App';
import { CounterData } from '../../types';
import Card from '../../components/ui/Card';
import CircularProgress from '../../components/ui/CircularProgress';
import Button from '../../components/ui/Button';

const { width } = Dimensions.get('window');

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

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

const StatsIcon = ({ size = 24, color = '#4a7c59' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth={2}/>
    <Path d="M9 9h6v6H9z" fill={color}/>
    <Path d="M21 15h-6v6h6v-6z" fill={color}/>
    <Path d="M21 3h-6v6h6V3z" fill={color}/>
  </Svg>
);

const TrophyIcon = ({ size = 24, color = '#DAA520' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6 9v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6 9h12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="15" r="3" stroke={color} strokeWidth={2}/>
  </Svg>
);

const CalendarIcon = ({ size = 24, color = '#4a7c59' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth={2}/>
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);

const TargetIcon = ({ size = 24, color = '#4a7c59' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2}/>
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth={2}/>
    <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth={2}/>
  </Svg>
);

interface DashboardStats {
  totalCount: number;
  totalRounds: number;
  dailyGoal: number;
  dailyProgress: number;
  weeklyCount: number;
  monthlyCount: number;
  streak: number;
  favoriteZikr: string;
}

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalCount: 0,
    totalRounds: 0,
    dailyGoal: 1000,
    dailyProgress: 0,
    weeklyCount: 0,
    monthlyCount: 0,
    streak: 0,
    favoriteZikr: 'SubhanAllah',
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load counter data from AsyncStorage
      const counterData = await AsyncStorage.getItem('tasbih_counter_data');
      const counters: CounterData[] = counterData ? JSON.parse(counterData) : [];

      // Calculate total counts and rounds
      const totalCount = counters.reduce((sum, counter) => sum + counter.count, 0);
      const totalRounds = counters.reduce((sum, counter) => sum + Math.floor(counter.count / 100), 0);

      // Mock daily progress (in real app, this would be calculated from daily data)
      const dailyProgress = Math.min(totalCount % 1000, 1000);

      // Mock weekly and monthly counts
      const weeklyCount = Math.floor(totalCount * 0.3);
      const monthlyCount = Math.floor(totalCount * 0.1);

      setStats({
        totalCount,
        totalRounds,
        dailyGoal: 1000,
        dailyProgress,
        weeklyCount,
        monthlyCount,
        streak: Math.floor(totalCount / 500), // Mock streak calculation
        favoriteZikr: 'سُبْحَانَ اللهِ',
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    progress?: number;
    variant?: 'primary' | 'secondary' | 'accent';
  }> = ({ icon, title, value, subtitle, progress, variant = 'primary' }) => (
    <Card variant="elevated" padding="medium" style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: `${theme.colors[variant]}20` }]}>
          {icon}
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
          <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.statSubtitle, { color: theme.colors.textTertiary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(progress * 100, 100)}%`,
                  backgroundColor: theme.colors[variant],
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      )}
    </Card>
  );

  const dailyProgressPercentage = stats.dailyProgress / stats.dailyGoal;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <BackIcon size={24} color={theme.colors.surface} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <StatsIcon size={28} color={theme.colors.surface} />
            <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>
              Dashboard
            </Text>
          </View>

          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Progress Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Today's Progress
          </Text>
          
          <Card variant="elevated" padding="large" style={[styles.dailyCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.dailyContent}>
              <CircularProgress
                progress={dailyProgressPercentage}
                size={120}
                strokeWidth={8}
                variant="primary"
                showPercentage={true}
              >
                <View style={styles.dailyStats}>
                  <Text style={[styles.dailyCount, { color: theme.colors.text }]}>
                    {stats.dailyProgress}
                  </Text>
                  <Text style={[styles.dailyGoal, { color: theme.colors.textSecondary }]}>
                    / {stats.dailyGoal}
                  </Text>
                </View>
              </CircularProgress>
              
              <View style={styles.dailyInfo}>
                <Text style={[styles.dailyTitle, { color: theme.colors.text }]}>
                  Daily Goal
                </Text>
                <Text style={[styles.dailySubtitle, { color: theme.colors.textSecondary }]}>
                  {stats.dailyProgress >= stats.dailyGoal ? 'Goal Achieved! 🎉' : `${stats.dailyGoal - stats.dailyProgress} more to go`}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Statistics
          </Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              icon={<TrophyIcon size={20} color={theme.colors.accent} />}
              title="Total Count"
              value={stats.totalCount.toLocaleString()}
              subtitle="All time"
              variant="accent"
            />
            
            <StatCard
              icon={<TargetIcon size={20} color={theme.colors.primary} />}
              title="Rounds Completed"
              value={stats.totalRounds}
              subtitle="Complete cycles"
              variant="primary"
            />
            
            <StatCard
              icon={<CalendarIcon size={20} color={theme.colors.secondary} />}
              title="Weekly Count"
              value={stats.weeklyCount.toLocaleString()}
              subtitle="This week"
              variant="secondary"
            />
            
            <StatCard
              icon={<StatsIcon size={20} color={theme.colors.info} />}
              title="Current Streak"
              value={`${stats.streak} days`}
              subtitle="Consistent practice"
              variant="primary"
            />
          </View>
        </View>

        {/* Monthly Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Monthly Overview
          </Text>
          
          <Card variant="outlined" padding="medium" style={[styles.monthlyCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.monthlyContent}>
              <View style={styles.monthlyStat}>
                <Text style={[styles.monthlyValue, { color: theme.colors.primary }]}>
                  {stats.monthlyCount.toLocaleString()}
                </Text>
                <Text style={[styles.monthlyLabel, { color: theme.colors.textSecondary }]}>
                  This Month
                </Text>
              </View>
              
              <View style={styles.monthlyDivider} />
              
              <View style={styles.monthlyStat}>
                <Text style={[styles.monthlyValue, { color: theme.colors.secondary }]}>
                  {stats.favoriteZikr}
                </Text>
                <Text style={[styles.monthlyLabel, { color: theme.colors.textSecondary }]}>
                  Most Used
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          
          <View style={styles.actionsGrid}>
            <Button
              title="Start Counting"
              onPress={() => navigation.navigate('Home' as any)}
              variant="primary"
              size="large"
              fullWidth
              style={styles.actionButton}
            />
            
            <View style={styles.actionsRow}>
              <Button
                title="Leaderboard"
                onPress={() => navigation.navigate('Leaderboard' as any)}
                variant="secondary"
                size="large"
                fullWidth
                style={styles.actionButton}
              />
              
              <Button
                title="Settings"
                onPress={() => navigation.navigate('Settings' as any)}
                variant="outline"
                size="large"
                fullWidth
                style={styles.actionButton}
              />
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerRight: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  dailyCard: {
    borderRadius: 16,
  },
  dailyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyStats: {
    alignItems: 'center',
  },
  dailyCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dailyGoal: {
    fontSize: 14,
  },
  dailyInfo: {
    flex: 1,
    marginLeft: 20,
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  dailySubtitle: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 44) / 2,
    borderRadius: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    textAlign: 'right',
  },
  monthlyCard: {
    borderRadius: 12,
  },
  monthlyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  monthlyStat: {
    alignItems: 'center',
  },
  monthlyValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  monthlyLabel: {
    fontSize: 12,
  },
  monthlyDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  actionsGrid: {
    gap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
  },
  bottomPadding: {
    height: 30,
  },
});

export default DashboardScreen;
