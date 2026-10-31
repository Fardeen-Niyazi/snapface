import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: IconName;
  rightLabel?: string; // small text on the right, e.g. "JPG · 1.2 MB"
  loading?: boolean;
  disabled?: boolean;
  flex?: boolean; // true = share a row equally with another button
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  rightLabel,
  loading,
  disabled,
  flex,
}: Props) {
  const { colors, type, radius, sizes } = useTheme();
  const primary = variant === 'primary';
  const fg = primary ? colors.onAccent : colors.text;
  const off = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      disabled={off}
      onPress={onPress}
      style={({ pressed }) => ({
        height: sizes.button,
        borderRadius: radius.md,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: rightLabel ? 'space-between' : 'center',
        gap: 8,
        flex: flex ? 1 : undefined,
        backgroundColor: primary ? colors.accent : colors.surface,
        borderWidth: primary ? 0 : 1,
        borderColor: colors.line,
        opacity: off ? 0.5 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          icon && <Icon name={icon} color={fg} />
        )}
        <Text style={[type.button, { color: fg }]}>{title}</Text>
      </View>
      {rightLabel ? (
        <Text style={[type.caption, { color: fg, opacity: 0.7 }]}>
          {rightLabel}
        </Text>
      ) : null}
    </Pressable>
  );
}
