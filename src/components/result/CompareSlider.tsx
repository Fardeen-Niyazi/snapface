import React, { useRef, useState } from 'react';
import {
  Image,
  PanResponder,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

const SAMPLE = require('../../assets/images/sample.jpg');

type Props = {
  beforeUri?: string | null;
  afterUri?: string | null;
  style?: StyleProp<ViewStyle>;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/**
 * Original photo on the left, styled result on the right.
 * The left copy is clipped by a resizable overlay; its image keeps the full
 * container size so it never squashes while the slider moves.
 */
export default function CompareSlider({ beforeUri, afterUri, style }: Props) {
  const { colors, radius } = useTheme();
  const [position, setPosition] = useState(0.5);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const widthRef = useRef(1);
  const dragStart = useRef(0.5);

  const setFromX = (x: number) => {
    const next = clamp01(x / Math.max(1, widthRef.current));
    dragStart.current = next;
    setPosition(next);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: event => setFromX(event.nativeEvent.locationX),
      onPanResponderMove: (_event, gesture) =>
        setPosition(
          clamp01(dragStart.current + gesture.dx / widthRef.current),
        ),
    }),
  ).current;

  const before = beforeUri ? { uri: beforeUri } : SAMPLE;
  const after = afterUri ? { uri: afterUri } : before;
  const pct = `${Math.round(position * 100)}%` as `${number}%`;
  const percent = Math.round(position * 100);

  return (
    <View
      {...pan.panHandlers}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Before and after comparison"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      accessibilityActions={[
        { name: 'increment', label: 'Show more of the styled image' },
        { name: 'decrement', label: 'Show more of the original' },
      ]}
      onAccessibilityAction={event => {
        const step = 0.1;
        setPosition(current =>
          clamp01(
            event.nativeEvent.actionName === 'increment'
              ? current + step
              : current - step,
          ),
        );
      }}
      onLayout={event => {
        widthRef.current = event.nativeEvent.layout.width;
        setSize(event.nativeEvent.layout);
      }}
      style={[{ overflow: 'hidden', backgroundColor: colors.surfaceAlt }, style]}
    >
      <Image source={after} resizeMode="cover" style={StyleSheet.absoluteFill} />

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: pct,
          overflow: 'hidden',
        }}
      >
        <Image
          source={before}
          resizeMode="cover"
          style={{ width: size.width, height: size.height }}
        />
      </View>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: pct,
          top: 0,
          bottom: 0,
          width: 2,
          marginLeft: -1,
          backgroundColor: '#FFFFFF',
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: pct,
          top: '50%',
          marginLeft: -18,
          marginTop: -18,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surface,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', gap: 3 }}>
          <View
            style={{
              width: 0,
              height: 0,
              borderTopWidth: 5,
              borderBottomWidth: 5,
              borderRightWidth: 6,
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderRightColor: colors.text,
            }}
          />
          <View
            style={{
              width: 0,
              height: 0,
              borderTopWidth: 5,
              borderBottomWidth: 5,
              borderLeftWidth: 6,
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: colors.text,
            }}
          />
        </View>
      </View>

      {size.width === 0 ? (
        <View style={StyleSheet.absoluteFill} />
      ) : (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: radius.xl, borderWidth: 1, borderColor: colors.line },
          ]}
        />
      )}
    </View>
  );
}
