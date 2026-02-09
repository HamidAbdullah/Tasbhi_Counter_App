import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import BottomSheet, { type BottomSheetMethods } from '@devvie/bottom-sheet';
import { X, CaretRight } from 'phosphor-react-native';
import { ZikrItem } from '../../../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const LIST_MAX_HEIGHT = Math.min(SCREEN_HEIGHT * 0.6, 420);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: SCREEN_HEIGHT,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
    opacity: 0.8,
    letterSpacing: 0.3,
  },
  scrollWrap: {
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.66,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 48,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  arabic: {
    flex: 1,
    fontSize: 19,
    fontFamily: 'Amiri-Bold',
    textAlign: 'right',
    lineHeight: 32,
    letterSpacing: 2,
    marginRight: 14,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 44,
    alignItems: 'center',
  },
  countText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
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
      <View style={styles.wrap}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: textColor }]}>Choose Dhikr</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>Select a verse to count</Text>
          </View>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <X size={24} color={textColor} weight="bold" />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollWrap}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          {zikrs.map((z) => (
            <TouchableOpacity
              key={z.id}
              style={[
                styles.row,
                {
                  borderColor: borderColor,
                  backgroundColor: `${primaryColor}08`,
                },
              ]}
              onPress={() => {
                onSelect(z);
                onClose();
              }}
              activeOpacity={0.75}
            >
              <Text
                style={[styles.arabic, { color: textColor }]}
                numberOfLines={2}
              >
                {z.arabic}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: `${primaryColor}20` }]}>
                <Text style={[styles.countText, { color: primaryColor }]}>{z.recommendedCount}</Text>
              </View>
              <CaretRight size={22} color={tertiaryColor} weight="bold" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  )
);

DhikrBottomSheet.displayName = 'DhikrBottomSheet';
export default DhikrBottomSheet;
