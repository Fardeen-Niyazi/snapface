import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, Button, Chip, ScreenHeader } from '../components/ui';
import { useTheme } from '../theme';
import { useImageStore, useHistoryStore, useStudioStore } from '../store';
import { getStyle } from '../features/ml/styles';
import CompareSlider from '../components/result/CompareSlider';
import { useRenderActions } from '../hooks/useRenderActions';
import { fileUri } from '../services/renderFiles';
import { RootStackParamList } from '../navigation/types';

export default function ResultScreen() {
  const { colors, type, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const image = useImageStore(state => state.image);
  const resultUri = useImageStore(state => state.resultUri);
  const styleId = useStudioStore(state => state.styleId);
  const lastMs = useStudioStore(state => state.lastMs);
  const historyItem = useHistoryStore(state =>
    state.renders.find(render => render.uri === resultUri),
  );

  const style = getStyle(styleId);
  const outSize = style.outputSize;
  const engine = style.engine === 'tflite' ? 'TFLite' : 'Skia shader';
  const ms = lastMs ?? historyItem?.ms ?? style.approxMs;

  const { busy, download, saveToGallery, share } = useRenderActions();

  const render = resultUri
    ? {
        uri: resultUri,
        styleId: style.id,
        createdAt: historyItem?.createdAt ?? Date.now(),
      }
    : null;

  const actionsDisabled = !render;

  return (
    <Screen>
      <ScreenHeader
        title="Your portrait"
        left={{
          icon: 'back',
          label: 'Back to Studio',
          onPress: () => navigation.goBack(),
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 12,
          paddingBottom: Math.max(insets.bottom, 8),
        }}
      >
        <View
          style={{
            width: '100%',
            aspectRatio: 1,
            borderRadius: radius.xl,
            overflow: 'hidden',
          }}
        >
          <CompareSlider
            beforeUri={image?.uri}
            afterUri={fileUri(resultUri) ?? image?.uri}
          />
          <View
            pointerEvents="none"
            style={{ position: 'absolute', top: 12, left: 12 }}
          >
            <Chip label="Original" />
          </View>
          <View
            pointerEvents="none"
            style={{ position: 'absolute', top: 12, right: 12 }}
          >
            <Chip dot label={style.name} />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={[type.caption, { color: colors.accent }]}>
            {outSize} x {outSize}
          </Text>
          <Text style={[type.caption, { color: colors.textMuted }]}>
            {engine} - {ms} ms
          </Text>
        </View>

        <Button
          title="Download image"
          icon="download"
          rightLabel="JPG"
          loading={busy === 'download'}
          disabled={actionsDisabled || busy !== null}
          onPress={() => render && void download(render)}
        />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            flex
            variant="secondary"
            title="Save to gallery"
            icon="check"
            loading={busy === 'gallery'}
            disabled={actionsDisabled || busy !== null}
            onPress={() => render && void saveToGallery(render)}
          />
          <Button
            flex
            variant="secondary"
            title="Share"
            icon="share"
            loading={busy === 'share'}
            disabled={actionsDisabled || busy !== null}
            onPress={() => render && void share(render)}
          />
        </View>

        <Button
          variant="secondary"
          title="Try another"
          disabled={busy !== null}
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </Screen>
  );
}
