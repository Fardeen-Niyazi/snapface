import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ActionSheet,
  Button,
  Screen,
  ScreenHeader,
} from '../components/ui';
import { useTheme } from '../theme';
import { Render, useHistoryStore } from '../store';
import { getStyle } from '../features/ml/styles';
import { useRenderActions } from '../hooks/useRenderActions';
import { fileUri } from '../services/renderFiles';
import { TabNav } from '../navigation/types';

function announce(title: string, message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(`${title}. ${message}`, ToastAndroid.LONG);
  } else {
    Alert.alert(title, message);
  }
}

export default function HistoryScreen() {
  const { colors, type, radius } = useTheme();
  const navigation = useNavigation<TabNav>();
  const renders = useHistoryStore(state => state.renders);
  const remove = useHistoryStore(state => state.remove);
  const { busy, download, saveToGallery, share } = useRenderActions();

  const [selected, setSelected] = useState<Render | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const runAction = async (
    render: Render,
    task: (item: Render) => Promise<boolean>,
  ) => {
    setSelected(null);
    setBusyId(render.id);
    try {
      await task(render);
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = (render: Render) => {
    Alert.alert(
      'Delete this portrait?',
      'The JPEG will be removed from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            remove(render.id);
            announce('Deleted', 'The portrait was removed.');
          },
        },
      ],
    );
  };

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
            Portraits you create will show up here.
          </Text>
          <View style={{ marginTop: 12, width: 200 }}>
            <Button
              variant="secondary"
              title="Choose a photo"
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        </View>
      ) : (
        <FlatList
          data={renders}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
          renderItem={({ item }) => {
            const style = getStyle(item.styleId);
            const date = new Date(item.createdAt).toLocaleDateString();
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${style.name} portrait from ${date}. Open actions`}
                onPress={() => setSelected(item)}
                style={{ width: '48%' }}
              >
                <View
                  style={{
                    borderRadius: radius.lg,
                    overflow: 'hidden',
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.line,
                  }}
                >
                  <View style={{ aspectRatio: 1 }}>
                    <Image
                      source={{ uri: fileUri(item.uri) }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                    {busyId === item.id ? (
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0,0,0,0.35)',
                        }}
                      >
                        <ActivityIndicator color="#FFFFFF" />
                      </View>
                    ) : null}
                  </View>
                  <View style={{ padding: 9 }}>
                    <Text
                      style={[type.caption, { color: colors.text }]}
                      numberOfLines={1}
                    >
                      {style.name}
                    </Text>
                    <Text
                      style={[type.caption, { color: colors.textMuted }]}
                      numberOfLines={1}
                    >
                      {date}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}

      <ActionSheet
        visible={selected !== null}
        title={selected ? getStyle(selected.styleId).name : 'Portrait'}
        onClose={() => setSelected(null)}
        actions={
          selected
            ? [
                {
                  label: 'Share',
                  disabled: busy !== null,
                  onPress: () =>
                    void runAction(selected, item => share(item)),
                },
                {
                  label: 'Save to gallery',
                  disabled: busy !== null,
                  onPress: () =>
                    void runAction(selected, item => saveToGallery(item)),
                },
                {
                  label: 'Download',
                  disabled: busy !== null,
                  onPress: () =>
                    void runAction(selected, item => download(item)),
                },
                {
                  label: 'Delete',
                  destructive: true,
                  disabled: busy !== null,
                  onPress: () => {
                    const render = selected;
                    setSelected(null);
                    confirmDelete(render);
                  },
                },
              ]
            : []
        }
      />
    </Screen>
  );
}
