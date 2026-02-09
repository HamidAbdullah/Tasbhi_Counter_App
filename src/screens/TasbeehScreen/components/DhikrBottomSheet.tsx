import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BottomSheet, { type BottomSheetMethods } from '@devvie/bottom-sheet';
import { X, CaretRight } from 'phosphor-react-native';
import { ZikrItem } from '../../../types';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 18, fontFamily: 'Poppins-SemiBold' },
  scrollContent: { paddingBottom: '40%' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  arabic: { flex: 1, fontSize: 18, fontFamily: 'Amiri-Bold' },
  count: { fontSize: 14, fontFamily: 'Poppins-SemiBold', marginRight: 8 },
});

export interface DhikrBottomSheetProps {
  zikrs: ZikrItem[];
  textColor: string;
  primaryColor: string;
  tertiaryColor: string;
  borderColor: string;
  surfaceColor: string;
  backdropColor: string;
  onClose: () => void;
  onSelect: (z: ZikrItem) => void;
}

const DhikrBottomSheet = forwardRef<BottomSheetMethods, DhikrBottomSheetProps>(
  (
    {
      zikrs,
      textColor,
      primaryColor,
      tertiaryColor,
      borderColor,
      surfaceColor,
      backdropColor,
      onClose,
      onSelect,
    },
    ref
  ) => (
    <BottomSheet
      ref={ref}
      height="80%"
      style={{ backgroundColor: surfaceColor }}
      backdropMaskColor={backdropColor}
      closeOnBackdropPress
      onClose={() => {}}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Choose Dhikr</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color={textColor} weight="bold" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {zikrs.map((z) => (
          <TouchableOpacity
            key={z.id}
            style={[styles.row, { borderBottomColor: borderColor }]}
            onPress={() => {
              onSelect(z);
              onClose();
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.arabic, { color: textColor }]} numberOfLines={1}>
              {z.arabic}
            </Text>
            <Text style={[styles.count, { color: primaryColor }]}>{z.recommendedCount}</Text>
            <CaretRight size={20} color={tertiaryColor} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BottomSheet>
  )
);

DhikrBottomSheet.displayName = 'DhikrBottomSheet';
export default DhikrBottomSheet;
