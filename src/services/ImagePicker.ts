import { Alert, Linking } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { PickedImage } from '../store/useImageStore';

// Resize on pick: the model doesn't need a 12 MP photo, and this keeps memory low.
const OPTIONS = {
  mediaType: 'photo' as const,
  selectionLimit: 1,
  maxWidth: 1536,
  maxHeight: 1536,
  quality: 0.9 as const,
};

function toPicked(res: ImagePickerResponse): PickedImage | null {
  if (res.didCancel) return null;

  if (res.errorCode) {
    if (res.errorCode === 'permission') {
      Alert.alert(
        'Permission needed',
        'Allow camera access in Settings to take a photo.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    } else if (res.errorCode === 'camera_unavailable') {
      Alert.alert(
        'Camera not available',
        'This device has no camera, or another app is using it.',
      );
    } else {
      Alert.alert(
        'Could not open the photo',
        res.errorMessage ?? 'Please try again.',
      );
    }
    return null;
  }

  const asset = res.assets?.[0];
  if (!asset?.uri) return null;
  return { uri: asset.uri, width: asset.width ?? 0, height: asset.height ?? 0 };
}

export const pickFromGallery = async () =>
  toPicked(await launchImageLibrary(OPTIONS));
export const takePhoto = async () =>
  toPicked(await launchCamera({ ...OPTIONS, saveToPhotos: false }));
