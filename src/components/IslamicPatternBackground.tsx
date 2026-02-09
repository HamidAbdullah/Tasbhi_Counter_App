import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const TILE = 80;
const COLS = Math.ceil(width / TILE) + 2;
const ROWS = Math.ceil(height / TILE) + 2;

// Subtle 8-fold geometric pattern (3–5% opacity)
const OPACITY = 0.045;

interface IslamicPatternBackgroundProps {
  color?: string;
  opacity?: number;
  style?: object;
}

const IslamicPatternBackground: React.FC<IslamicPatternBackgroundProps> = ({
  color = '#0E6F64',
  opacity = OPACITY,
  style,
}) => {
  // Single tile: small 8-pointed star / rosette
  const tilePath = `
    M ${TILE / 2} ${TILE / 2 - 8}
    L ${TILE / 2 + 4} ${TILE / 2 - 4}
    L ${TILE / 2 + 8} ${TILE / 2}
    L ${TILE / 2 + 4} ${TILE / 2 + 4}
    L ${TILE / 2} ${TILE / 2 + 8}
    L ${TILE / 2 - 4} ${TILE / 2 + 4}
    L ${TILE / 2 - 8} ${TILE / 2}
    L ${TILE / 2 - 4} ${TILE / 2 - 4}
    Z
  `;

  const tiles: { x: number; y: number }[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      tiles.push({ x: (col - 1) * TILE, y: (row - 1) * TILE });
    }
  }

  let hex = color.startsWith('#') ? color.slice(1) : color;
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  const r = parseInt(hex.slice(0, 2), 16) || 0;
  const g = parseInt(hex.slice(2, 4), 16) || 0;
  const b = parseInt(hex.slice(4, 6), 16) || 0;
  const fillWithOpacity = `rgba(${r},${g},${b},${opacity})`;

  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <Svg width={width} height={height}>
        <G fill={fillWithOpacity} stroke="none">
          {tiles.map((t, i) => (
            <Path
              key={i}
              d={tilePath}
              transform={`translate(${t.x},${t.y})`}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
};

export default IslamicPatternBackground;
