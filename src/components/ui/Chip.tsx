import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme';

type Props = { label: string; dot?: boolean };

export function Chip({ label, dot }: Props) {
  const { colors, type, radius } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: radius.sm,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.line,
        opacity: 0.92,
      }}
    >
      {dot ? (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.accent,
          }}
        />
      ) : null}
      <Text style={[type.caption, { color: colors.text }]}>{label}</Text>
    </View>
  );
}
