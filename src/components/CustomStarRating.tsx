import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface CustomStarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  color?: string;
  emptyColor?: string;
  /** When set, stars are tappable and this is called with 1..maxRating */
  onRatingChange?: (value: number) => void;
}

export const CustomStarRating = ({
  rating,
  maxRating = 5,
  size = 14,
  color = '#264BEB',
  emptyColor = '#CCC',
  onRatingChange,
}: CustomStarRatingProps) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    let fillPercent = 0;
    if (i <= Math.floor(rating)) {
      fillPercent = 100;
    } else if (i === Math.ceil(rating)) {
      fillPercent = (rating % 1) * 100;
    }

    const gradientId = `grad-${i}-${rating}`;

    const starNode = (
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="100%" y2="0">
            <Stop offset={`${fillPercent}%`} stopColor={color} />
            <Stop offset={`${fillPercent}%`} stopColor={emptyColor} />
          </LinearGradient>
        </Defs>
        <Path
          d="M8 0L9.16938 5.17688L13.6569 2.34315L10.8231 6.83062L16 8L10.8231 9.16938L13.6569 13.6569L9.16938 10.8231L8 16L6.83062 10.8231L2.34315 13.6569L5.17688 9.16938L0 8L5.17688 6.83062L2.34315 2.34315L6.83062 5.17688L8 0Z"
          fill={`url(#${gradientId})`}
        />
      </Svg>
    );

    stars.push(
      <View key={i} style={{ marginRight: 5 }}>
        {onRatingChange ? (
          <TouchableOpacity onPress={() => onRatingChange(i)} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            {starNode}
          </TouchableOpacity>
        ) : (
          starNode
        )}
      </View>
    );
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
