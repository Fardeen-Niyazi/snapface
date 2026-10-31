import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { STYLES, StyleId, isModelStyle } from '../../features/ml/styles';
import { PhotoPreview } from './PhotoPreview';

type Props = {
  selected: StyleId;
  imageUri?: string | null;
  toonThumbUri?: string | null;
  onSelect: (id: StyleId) => void;
};

export function StyleCarousel({
  selected,
  imageUri,
  toonThumbUri,
  onSelect,
}: Props) {
  const { colors, type, radius } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {STYLES.map(style => {
        const active = style.id === selected;
        // Toon gets a real rendered thumbnail. Model styles deliberately show
        // the original photo, because models only run when Create is pressed.
        const thumb =
          style.id === 'toon' ? toonThumbUri ?? imageUri : imageUri;

        return (
          <Pressable
            key={style.id}
            accessibilityRole="button"
            accessibilityLabel={`${style.name} style`}
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(style.id)}
            style={{ width: 78 }}
          >
            <View
              style={{
                width: 78,
                height: 78,
                borderRadius: radius.md + 2,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: active ? colors.accent : 'transparent',
              }}
            >
              <PhotoPreview uri={thumb} style={{ flex: 1 }} />
              {isModelStyle(style) ? (
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
                    style={[
                      type.caption,
                      { fontSize: 9, lineHeight: 11, color: colors.onAccent },
                    ]}
                  >
                    AI
                  </Text>
                </View>
              ) : null}
            </View>
            <Text
              style={[
                type.caption,
                {
                  color: active ? colors.text : colors.textMuted,
                  textAlign: 'center',
                  marginTop: 5,
                },
              ]}
            >
              {style.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
