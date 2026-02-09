import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
});

interface TasbeehHeaderProps {
  titleColor: string;
  subtitleColor: string;
}

const TasbeehHeader: React.FC<TasbeehHeaderProps> = memo(({ titleColor, subtitleColor }) => (
  <View style={styles.header}>
    <Text style={[styles.headerTitle, { color: titleColor }]}>Tasbeeh</Text>
    <Text style={[styles.headerSubtitle, { color: subtitleColor }]}>Count your remembrance</Text>
  </View>
));

export default TasbeehHeader;
