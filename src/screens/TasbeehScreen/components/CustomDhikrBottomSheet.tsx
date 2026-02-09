import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import BottomSheet, { type BottomSheetMethods } from '@devvie/bottom-sheet';
import { X } from 'phosphor-react-native';
import Button from '../../../components/ui/Button';

const ROUND_OPTIONS = [33, 99, 100, 34, 11, 7];

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontFamily: 'Poppins-SemiBold' },
  hint: { fontSize: 13, fontFamily: 'Poppins-Regular', marginBottom: 12 },
  label: { fontSize: 14, fontFamily: 'Poppins-SemiBold', marginBottom: 6, marginTop: 8 },
  textArea: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    minHeight: 72,
    textAlignVertical: 'top',
  },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 52,
    alignItems: 'center',
  },
  optionText: { fontSize: 16, fontFamily: 'Poppins-SemiBold' },
  btn: { marginTop: 4 },
});

export interface CustomDhikrBottomSheetProps {
  arabic: string;
  recommendedCount: number;
  textColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  borderColor: string;
  primaryColor: string;
  surfaceColor: string;
  bgColor: string;
  backdropColor: string;
  onClose: () => void;
  onArabicChange: (t: string) => void;
  onCountSelect: (n: number) => void;
  onSave: () => void;
}

const CustomDhikrBottomSheet = forwardRef<BottomSheetMethods, CustomDhikrBottomSheetProps>(
  (
    {
      arabic,
      recommendedCount,
      textColor,
      secondaryColor,
      tertiaryColor,
      borderColor,
      primaryColor,
      surfaceColor,
      bgColor,
      backdropColor,
      onClose,
      onArabicChange,
      onCountSelect,
      onSave,
    },
    ref
  ) => (
    <BottomSheet
      ref={ref}
      height="75%"
      style={{ backgroundColor: surfaceColor }}
      backdropMaskColor={backdropColor}
      closeOnBackdropPress
      onClose={() => {}}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Add custom verse</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color={textColor} weight="bold" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Text style={[styles.hint, { color: secondaryColor }]}>Add a verse (Arabic only).</Text>
        <Text style={[styles.label, { color: textColor }]}>Verse (Arabic)</Text>
        <TextInput
          style={[styles.textArea, { borderColor: borderColor, color: textColor }]}
          placeholder="Enter Arabic verse..."
          placeholderTextColor={tertiaryColor}
          value={arabic}
          onChangeText={onArabicChange}
          multiline
          numberOfLines={3}
        />
        <Text style={[styles.label, { color: textColor }]}>Recommended count per round</Text>
        <View style={styles.options}>
          {ROUND_OPTIONS.map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.option, { backgroundColor: recommendedCount === n ? primaryColor : bgColor }]}
              onPress={() => onCountSelect(n)}
            >
              <Text style={[styles.optionText, { color: recommendedCount === n ? surfaceColor : textColor }]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Save custom dhikr" onPress={onSave} variant="primary" fullWidth style={styles.btn} />
      </ScrollView>
    </BottomSheet>
  )
);

CustomDhikrBottomSheet.displayName = 'CustomDhikrBottomSheet';
export default CustomDhikrBottomSheet;
