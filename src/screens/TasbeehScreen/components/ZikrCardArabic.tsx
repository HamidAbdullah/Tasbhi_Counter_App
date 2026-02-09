import React, { memo } from 'react';
import { Text, StyleSheet } from 'react-native';
import Card from '../../../components/ui/Card';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  arabic: {
    fontSize: 22,
    fontFamily: 'Amiri-Bold',
    textAlign: 'center',
    lineHeight: 36,
  },
});

interface ZikrCardArabicProps {
  arabic: string;
  textColor: string;
  cardStyle: object;
}

const ZikrCardArabic: React.FC<ZikrCardArabicProps> = memo(({ arabic, textColor, cardStyle }) => (
  <Card variant="elevated" padding="medium" style={[styles.card, cardStyle]}>
    <Text style={[styles.arabic, { color: textColor }]}>{arabic}</Text>
  </Card>
));

export default ZikrCardArabic;
