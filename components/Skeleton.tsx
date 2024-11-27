import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, DimensionValue } from 'react-native';

type SkeletonProps = {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
};

export const Skeleton = ({
  width,
  height,
  borderRadius = 15, 
}: SkeletonProps) => {
  const shimmerVal = useRef(new Animated.Value(0.5)).current;

  const startAnimation = useCallback(() => {
    Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerVal, {
            toValue: 1,
            duration: 1000, 
            useNativeDriver: true,
          }),
          Animated.timing(shimmerVal, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
    ).start();
  }, [shimmerVal]);


  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const animatedStyle = {
    opacity: shimmerVal,
    width,
    height,
    borderRadius,
    backgroundColor: '#d6d6d6',
    margin: 5,
  };

  return <Animated.View style={animatedStyle} />;
};