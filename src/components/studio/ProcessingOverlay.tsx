import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { useStudioStore } from '../../store';
import { Button } from '../ui';

export function ProcessingOverlay({ onCancel }: { onCancel: () => void }) {
  const { colors, type } = useTheme();
  const progress = useStudioStore(s => s.progress);
  const stepLabel = useStudioStore(s => s.stepLabel);

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
            width: `${Math.round(progress * 100)}%` as `${number}%`,
          }}
        />
      </View>
      <Text style={[type.body, { color: colors.textMuted }]}>{stepLabel}</Text>
      <Button variant="secondary" title="Cancel" onPress={onCancel} />
    </View>
  );
}
