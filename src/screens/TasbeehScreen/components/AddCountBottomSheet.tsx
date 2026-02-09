import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import BottomSheet, { type BottomSheetMethods } from '@devvie/bottom-sheet';
import { X } from 'phosphor-react-native';
import Button from '../../../components/ui/Button';

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontFamily: 'Poppins-SemiBold' },
  hint: { fontSize: 13, fontFamily: 'Poppins-Regular', marginBottom: 12 },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  btn: { marginTop: 4 },
});

export interface AddCountBottomSheetProps {
  manualInput: string;
  textColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  borderColor: string;
  surfaceColor: string;
  backdropColor: string;
  onClose: () => void;
  onInputChange: (t: string) => void;
  onAdd: () => void;
}

const AddCountBottomSheet = forwardRef<BottomSheetMethods, AddCountBottomSheetProps>(
  (
    {
      manualInput,
      textColor,
      secondaryColor,
      tertiaryColor,
      borderColor,
      surfaceColor,
      backdropColor,
      onClose,
      onInputChange,
      onAdd,
    },
    ref
  ) => (
    <BottomSheet
      ref={ref}
      height={340}
      style={{ backgroundColor: surfaceColor }}
      backdropMaskColor={backdropColor}
      closeOnBackdropPress
      onClose={() => {}}
    >
      <View style={styles.wrap}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Add count</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={textColor} weight="bold" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.hint, { color: secondaryColor }]}>
          Used a physical tasbeeh? Enter the count to add to today.
        </Text>
        <TextInput
          style={[styles.input, { borderColor: borderColor, color: textColor }]}
          placeholder="e.g. 100"
          placeholderTextColor={tertiaryColor}
          value={manualInput}
          onChangeText={onInputChange}
          keyboardType="number-pad"
        />
        <Button title="Add to count" onPress={onAdd} variant="primary" fullWidth style={styles.btn} />
      </View>
    </BottomSheet>
  )
);

AddCountBottomSheet.displayName = 'AddCountBottomSheet';
export default AddCountBottomSheet;
