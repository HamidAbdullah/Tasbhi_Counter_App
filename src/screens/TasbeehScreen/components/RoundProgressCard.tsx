import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowCounterClockwise } from 'phosphor-react-native';
import Card from '../../../components/ui/Card';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  resetBtn: { padding: 6 },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 8,
  },
});

interface RoundProgressCardProps {
  currentRoundCount: number;
  roundCount: number;
  count: number;
  completedRounds: number;
  progressFillPct: number;
  textColor: string;
  secondaryColor: string;
  borderColor: string;
  primaryColor: string;
  cardStyle: object;
  onReset: () => void;
}

const RoundProgressCard: React.FC<RoundProgressCardProps> = memo(({
  currentRoundCount,
  roundCount,
  count,
  completedRounds,
  progressFillPct,
  textColor,
  secondaryColor,
  borderColor,
  primaryColor,
  cardStyle,
  onReset,
}) => (
  <Card variant="outlined" padding="medium" style={[styles.card, cardStyle]}>
    <View style={styles.progressRow}>
      <Text style={[styles.progressLabel, { color: textColor }]}>
        {currentRoundCount} / {roundCount}
      </Text>
      <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
        <ArrowCounterClockwise size={18} color={primaryColor} weight="bold" />
      </TouchableOpacity>
    </View>
    <View style={[styles.progressBar, { backgroundColor: borderColor }]}>
      <View
        style={[
          styles.progressFill,
          { width: `${progressFillPct * 100}%`, backgroundColor: primaryColor },
        ]}
      />
    </View>
    <Text style={[styles.totalLabel, { color: secondaryColor }]}>
      Total: {count} {completedRounds > 0 && ` · ${completedRounds} round${completedRounds > 1 ? 's' : ''}`}
    </Text>
  </Card>
));

export default RoundProgressCard;
