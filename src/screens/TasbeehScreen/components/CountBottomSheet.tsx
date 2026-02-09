import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { type BottomSheetMethods } from '@devvie/bottom-sheet';

const ROUND_OPTIONS = [33, 99, 100, 34, 11, 7];

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingBottom: 24 },
  title: { fontSize: 18, fontFamily: 'Poppins-SemiBold', marginBottom: 12 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 64,
    alignItems: 'center',
  },
  optionText: { fontSize: 16, fontFamily: 'Poppins-SemiBold' },
  done: { alignItems: 'center', paddingVertical: 8 },
});

export interface CountBottomSheetProps {
  roundCount: number;
  textColor: string;
  primaryColor: string;
  surfaceColor: string;
  bgColor: string;
  backdropColor: string;
  onClose: () => void;
  onSelect: (n: number) => void;
}

const CountBottomSheet = forwardRef<BottomSheetMethods, CountBottomSheetProps>(
  (
    {
      roundCount,
      textColor,
      primaryColor,
      surfaceColor,
      bgColor,
      backdropColor,
      onClose,
      onSelect,
    },
    ref
  ) => (
    <BottomSheet
      ref={ref}
      height={320}
      style={{ backgroundColor: surfaceColor }}
      backdropMaskColor={backdropColor}
      closeOnBackdropPress
      onClose={() => {}}
    >
      <View style={styles.wrap}>
        <Text style={[styles.title, { color: textColor }]}>Round count</Text>
        <View style={styles.options}>
          {ROUND_OPTIONS.map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.option, { backgroundColor: roundCount === n ? primaryColor : bgColor }]}
              onPress={() => {
                onSelect(n);
                onClose();
              }}
            >
              <Text style={[styles.optionText, { color: roundCount === n ? surfaceColor : textColor }]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={onClose} style={styles.done}>
          <Text style={[styles.optionText, { color: primaryColor }]}>Done</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  )
);

CountBottomSheet.displayName = 'CountBottomSheet';
export default CountBottomSheet;
