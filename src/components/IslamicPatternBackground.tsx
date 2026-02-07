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

  const hexColor = color.startsWith('#') ? color : `#${color}`;
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
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
