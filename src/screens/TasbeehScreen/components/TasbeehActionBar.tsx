import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookOpen, Hash, Plus, PencilSimpleLine } from 'phosphor-react-native';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
});

interface TasbeehActionBarProps {
  iconColor: string;
  onDhikr: () => void;
  onCount: () => void;
  onAdd: () => void;
  onCustom: () => void;
}

const TasbeehActionBar: React.FC<TasbeehActionBarProps> = memo(({ iconColor, onDhikr, onCount, onAdd, onCustom }) => (
  <View style={styles.row}>
    <TouchableOpacity style={styles.button} onPress={onDhikr} activeOpacity={0.8}>
      <BookOpen size={18} color={iconColor} weight="duotone" />
      <Text style={styles.buttonText}>Dhikr</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={onCount} activeOpacity={0.8}>
      <Hash size={18} color={iconColor} weight="duotone" />
      <Text style={styles.buttonText}>Count</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={onAdd} activeOpacity={0.8}>
      <Plus size={18} color={iconColor} weight="duotone" />
      <Text style={styles.buttonText}>Add</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={onCustom} activeOpacity={0.8}>
      <PencilSimpleLine size={18} color={iconColor} weight="duotone" />
      <Text style={styles.buttonText}>Custom</Text>
    </TouchableOpacity>
  </View>
));

export default TasbeehActionBar;
