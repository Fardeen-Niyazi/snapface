import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { STYLES, StyleId } from '../../features/ml/styles';
import { mockTint } from '../../features/ml/runPipeline';
import { PhotoPreview } from './PhotoPreview';

type Props = {
  selected: StyleId;
  uri?: string | null;
  onSelect: (id: StyleId) => void;
};

const TAG = { shader: 'FAST', tflite: 'AI', hybrid: '3D' } as const;

export function StyleCarousel({ selected, uri, onSelect }: Props) {
  const { colors, type, radius } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {STYLES.map(s => {
        const on = s.id === selected;
        return (
          <Pressable
            key={s.id}
            accessibilityRole="button"
            accessibilityLabel={`${s.name} style`}
            accessibilityState={{ selected: on }}
            onPress={() => onSelect(s.id)}
            style={{ width: 78 }}
          >
            <View
              style={{
                width: 78,
                height: 78,
                borderRadius: radius.md + 2,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: on ? colors.accent : 'transparent',
              }}
            >
              <PhotoPreview
                uri={uri}
                tint={mockTint(s.id)}
                tintOpacity={0.3}
                style={{ flex: 1 }}
              />
              <View
                style={{
                  position: 'absolute',
                  right: 5,
                  bottom: 5,
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                  borderRadius: 5,
                  backgroundColor: colors.accent,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Inter-Bold',
                    fontSize: 8,
                    color: colors.onAccent,
                  }}
                >
                  {TAG[s.engine]}
                </Text>
              </View>
            </View>
            <Text
              style={[
                type.caption,
                {
                  color: on ? colors.text : colors.textMuted,
                  textAlign: 'center',
                  marginTop: 5,
                },
              ]}
            >
              {s.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
