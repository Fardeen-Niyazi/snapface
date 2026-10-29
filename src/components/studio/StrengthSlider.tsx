import React, { useRef } from 'react';
import { PanResponder, Text, View } from 'react-native';
import { useTheme } from '../../theme';

type Props = { value: number; onChange: (v: number) => void };
const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

export function StrengthSlider({ value, onChange }: Props) {
  const { colors, type } = useTheme();
  const width = useRef(1);
  const start = useRef(value);
  const cb = useRef(onChange);
  cb.current = onChange;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: e => {
        const v = clamp((e.nativeEvent.locationX / width.current) * 100);
        start.current = v;
        cb.current(v);
      },
      onPanResponderMove: (_, g) =>
        cb.current(clamp(start.current + (g.dx / width.current) * 100)),
    }),
  ).current;

  const pct = `${value}%` as `${number}%`;

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[type.caption, { color: colors.textMuted }]}>
          Style strength
        </Text>
        <Text style={[type.caption, { color: colors.accent }]}>{value}%</Text>
      </View>
      <View
        {...pan.panHandlers}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Style strength"
        accessibilityValue={{ min: 0, max: 100, now: value }}
        onLayout={e => {
          width.current = e.nativeEvent.layout.width;
        }}
        style={{ height: 32, justifyContent: 'center' }}
      >
        <View
          pointerEvents="none"
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.surfaceAlt,
          }}
        >
          <View
            style={{
              width: pct,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.accent,
            }}
          />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: pct,
            marginLeft: -10,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            borderWidth: 2,
            borderColor: colors.accent,
          }}
        />
      </View>
    </View>
  );
}
