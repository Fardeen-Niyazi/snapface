import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { useStudioStore } from '../../store';
import { Button } from '../ui';

export function ProcessingOverlay({ onCancel }: { onCancel: () => void }) {
  const { colors, type } = useTheme();
  const progress = useStudioStore(state => state.progress);
  const stepLabel = useStudioStore(state => state.stepLabel);
  const percent = Math.round(progress * 100);

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: colors.bg,
          padding: 28,
          justifyContent: 'center',
          gap: 18,
        },
      ]}
    >
      <Text style={[type.h1, { color: colors.text, fontSize: 24 }]}>
        Creating your portrait
      </Text>
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Portrait progress"
        accessibilityValue={{ min: 0, max: 100, now: percent }}
        style={{
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.surfaceAlt,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.accent,
            width: `${percent}%` as `${number}%`,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Text
          accessibilityLiveRegion="polite"
          style={[type.body, { color: colors.textMuted, flex: 1 }]}
        >
          {stepLabel}
        </Text>
        <Text style={[type.caption, { color: colors.text }]}>{percent}%</Text>
      </View>
      <Button variant="secondary" title="Cancel" onPress={onCancel} />
    </View>
  );
}
