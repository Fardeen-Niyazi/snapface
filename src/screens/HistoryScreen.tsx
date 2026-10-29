import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { Screen, ScreenHeader } from '../components/ui';
import { useTheme } from '../theme';
import { useHistoryStore } from '../store';
import { getStyle } from '../features/ml/styles';

export default function HistoryScreen() {
  const { colors, type, radius } = useTheme();
  const renders = useHistoryStore(s => s.renders);

  return (
    <Screen>
      <ScreenHeader title="Saved" />
      {renders.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Text style={[type.title, { color: colors.text }]}>
            No saved portraits yet
          </Text>
          <Text
            style={[
              type.body,
              { color: colors.textMuted, textAlign: 'center' },
            ]}
          >
            Portraits you save will show up here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={renders}
          keyExtractor={r => r.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                padding: 10,
                borderRadius: radius.lg,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.line,
              }}
            >
              <Image
                source={{ uri: item.uri }}
                style={{
                  width: '100%',
                  aspectRatio: 1,
                  borderRadius: radius.sm + 2,
                }}
              />
              <Text
                style={[type.caption, { color: colors.text, marginTop: 8 }]}
              >
                {getStyle(item.styleId).name}
              </Text>
              <Text style={[type.caption, { color: colors.textMuted }]}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        />
      )}
    </Screen>
  );
}
