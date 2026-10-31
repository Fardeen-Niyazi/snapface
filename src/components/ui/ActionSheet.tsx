import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

export type SheetAction = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  busy?: boolean;
};

type Props = {
  visible: boolean;
  title: string;
  actions: SheetAction[];
  onClose: () => void;
};

export function ActionSheet({ visible, title, actions, onClose }: Props) {
  const { colors, type, radius, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close action sheet"
          onPress={onClose}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.45)' },
          ]}
        />
        <View
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
            paddingBottom: Math.max(insets.bottom, spacing.md),
            borderTopWidth: 1,
            borderColor: colors.line,
          }}
        >
          <Text
            numberOfLines={1}
            style={[
              type.title,
              { color: colors.text, marginBottom: spacing.md },
            ]}
          >
            {title}
          </Text>

          {actions.map(action => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              accessibilityState={{
                disabled: action.disabled || action.busy,
                busy: action.busy,
              }}
              disabled={action.disabled || action.busy}
              onPress={action.onPress}
              style={({ pressed }) => ({
                minHeight: 50,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: spacing.sm,
                borderRadius: radius.md,
                backgroundColor: pressed ? colors.surfaceAlt : 'transparent',
                opacity: action.disabled ? 0.45 : 1,
              })}
            >
              <Text
                style={[
                  type.body,
                  {
                    color: action.destructive ? colors.danger : colors.text,
                  },
                ]}
              >
                {action.label}
              </Text>
              {action.busy ? (
                <ActivityIndicator
                  size="small"
                  color={action.destructive ? colors.danger : colors.accent}
                />
              ) : null}
            </Pressable>
          ))}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            onPress={onClose}
            style={({ pressed }) => ({
              minHeight: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: spacing.xs,
              borderRadius: radius.md,
              backgroundColor: pressed ? colors.surfaceAlt : colors.surfaceAlt,
            })}
          >
            <Text style={[type.button, { color: colors.text }]}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
