import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Crown, 
  Star,
  Calendar,
  Clock
} from 'phosphor-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../../App';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const { width } = Dimensions.get('window');

type LeaderboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Leaderboard'>;

const BackIcon = ({ size = 24, color = '#ffffff' }) => (
  <ArrowLeft size={size} color={color} weight="bold" />
);

const TrophyIcon = ({ size = 24, color = '#DAA520' }) => (
  <Trophy size={size} color={color} weight="fill" />
);

const MedalIcon = ({ size = 24, color = '#C0C0C0' }) => (
  <Medal size={size} color={color} weight="fill" />
);

const CrownIcon = ({ size = 24, color = '#FFD700' }) => (
  <Crown size={size} color={color} weight="fill" />
);

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
  totalCount: number;
  rank: number;
  lastUpdated: Date;
  isCurrentUser?: boolean;
}

type LeaderboardType = 'daily' | 'weekly' | 'monthly' | 'alltime';

const LeaderboardScreen: React.FC = () => {
  const navigation = useNavigation<LeaderboardScreenNavigationProp>();
  const { theme } = useTheme();
  
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('daily');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [leaderboardType]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, this would come from Firebase
      const mockData: LeaderboardEntry[] = [
        {
          userId: '1',
          displayName: 'Ahmed Hassan',
          dailyCount: 2500,
          weeklyCount: 15000,
          monthlyCount: 60000,
          totalCount: 250000,
          rank: 1,
          lastUpdated: new Date(),
        },
        {
          userId: '2',
          displayName: 'Fatima Ali',
          dailyCount: 2300,
          weeklyCount: 14000,
          monthlyCount: 55000,
          totalCount: 220000,
          rank: 2,
          lastUpdated: new Date(),
        },
        {
          userId: '3',
          displayName: 'Muhammad Khan',
          dailyCount: 2100,
          weeklyCount: 13000,
          monthlyCount: 50000,
          totalCount: 200000,
          rank: 3,
          lastUpdated: new Date(),
        },
        {
          userId: 'current',
          displayName: 'You',
          dailyCount: 1800,
          weeklyCount: 11000,
          monthlyCount: 45000,
          totalCount: 180000,
          rank: 5,
          lastUpdated: new Date(),
          isCurrentUser: true,
        },
        {
          userId: '4',
          displayName: 'Aisha Rahman',
          dailyCount: 1900,
          weeklyCount: 12000,
          monthlyCount: 48000,
          totalCount: 190000,
          rank: 4,
          lastUpdated: new Date(),
        },
        {
          userId: '5',
          displayName: 'Omar Sheikh',
          dailyCount: 1700,
          weeklyCount: 10000,
          monthlyCount: 42000,
          totalCount: 170000,
          rank: 6,
          lastUpdated: new Date(),
        },
      ];

      // Sort by the selected type
      const sortedData = mockData.sort((a, b) => {
        switch (leaderboardType) {
          case 'daily':
            return b.dailyCount - a.dailyCount;
          case 'weekly':
            return b.weeklyCount - a.weeklyCount;
          case 'monthly':
            return b.monthlyCount - a.monthlyCount;
          default:
            return b.totalCount - a.totalCount;
        }
      });

      // Update ranks
      const rankedData = sortedData.map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

      setLeaderboardData(rankedData);
      
      // Find current user rank
      const currentUser = rankedData.find(item => item.isCurrentUser);
      setCurrentUserRank(currentUser?.rank || 0);

    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return <CrownIcon size={24} color="#FFD700" />;
    } else if (rank === 2) {
      return <MedalIcon size={24} color="#C0C0C0" />;
    } else if (rank === 3) {
      return <MedalIcon size={24} color="#CD7F32" />;
    }
    return <TrophyIcon size={20} color={theme.colors.accent} />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return theme.colors.primary;
  };

  const getCurrentValue = (entry: LeaderboardEntry) => {
    switch (leaderboardType) {
      case 'daily':
        return entry.dailyCount.toLocaleString();
      case 'weekly':
        return entry.weeklyCount.toLocaleString();
      case 'monthly':
        return entry.monthlyCount.toLocaleString();
      default:
        return entry.totalCount.toLocaleString();
    }
  };

  const LeaderboardItem: React.FC<{ item: LeaderboardEntry; index: number }> = ({ item, index }) => (
    <Card
      variant="outlined"
      padding="medium"
      style={[
        styles.leaderboardItem,
        { 
          backgroundColor: item.isCurrentUser ? `${theme.colors.primary}10` : theme.colors.surface,
          borderColor: item.isCurrentUser ? theme.colors.primary : theme.colors.border,
        }
      ]}
    >
      <View style={styles.itemContent}>
        <View style={styles.rankSection}>
          <View style={[styles.rankBadge, { backgroundColor: getRankColor(item.rank) }]}>
            <Text style={[styles.rankText, { color: theme.colors.surface }]}>
              {item.rank}
            </Text>
          </View>
          {getRankIcon(item.rank)}
        </View>

        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { color: theme.colors.surface }]}>
              {item.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {item.displayName}
              {item.isCurrentUser && ' (You)'}
            </Text>
            <View style={styles.lastUpdatedRow}>
              <Clock size={12} color={theme.colors.textSecondary} weight="bold" />
              <Text style={[styles.lastUpdated, { color: theme.colors.textSecondary }]}>
                Last updated: {item.lastUpdated.toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.scoreSection}>
          <Text style={[styles.scoreValue, { color: theme.colors.primary }]}>
            {getCurrentValue(item)}
          </Text>
          <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>
            {leaderboardType === 'daily' ? 'Today' : 
             leaderboardType === 'weekly' ? 'This Week' :
             leaderboardType === 'monthly' ? 'This Month' : 'All Time'}
          </Text>
        </View>
      </View>
    </Card>
  );

  const typeButtons = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'alltime', label: 'All Time' },
  ];

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
            <TrophyIcon size={28} color={theme.colors.surface} />
            <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>
              Leaderboard
            </Text>
          </View>

          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* Type Selector */}
      <View style={styles.typeSelector}>
        {typeButtons.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.typeButton,
              {
                backgroundColor: leaderboardType === key ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setLeaderboardType(key as LeaderboardType)}
          >
            <Text
              style={[
                styles.typeButtonText,
                {
                  color: leaderboardType === key ? theme.colors.surface : theme.colors.text,
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Current User Rank */}
      {currentUserRank > 0 && (
        <Card
          variant="elevated"
          padding="medium"
          style={[styles.userRankCard, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.userRankContent}>
            <TrophyIcon size={24} color={theme.colors.accent} />
            <Text style={[styles.userRankText, { color: theme.colors.text }]}>
              Your Rank: #{currentUserRank}
            </Text>
          </View>
        </Card>
      )}

      {/* Leaderboard List */}
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.userId}
        renderItem={({ item, index }) => <LeaderboardItem item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
  typeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  userRankCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  userRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userRankText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: '20%',
  },
  leaderboardItem: {
    marginBottom: 12,
    borderRadius: 12,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankSection: {
    alignItems: 'center',
    marginRight: 16,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4a7c59',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  lastUpdatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  lastUpdated: {
    fontSize: 12,
    marginLeft: 4,
  },
  scoreSection: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 12,
  },
});

export default LeaderboardScreen;
