import { Platform, PermissionsAndroid } from 'react-native';
import {
  CameraRoll,
  iosRequestAddOnlyGalleryPermission,
} from '@react-native-camera-roll/camera-roll';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { StyleId, getStyle } from '../features/ml/styles';
import { fileUri, plainPath } from './renderFiles';

export type ActionRender = {
  uri: string;
  styleId: StyleId;
  createdAt: number;
};

export type ActionResult = {
  title: string;
  message: string;
};

export class PermissionDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionDeniedError';
  }
}

const pad = (value: number) => String(value).padStart(2, '0');

/** yyyyMMdd_HHmmss in the user's local time. */
export function timestamp(ms: number): string {
  const date = new Date(ms);
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `_${pad(date.getHours())}${pad(date.getMinutes())}${pad(
      date.getSeconds(),
    )}`
  );
}

/** Snapface_<Style>_<yyyyMMdd_HHmmss>.jpg */
export function exportName(render: ActionRender): string {
  const style = getStyle(render.styleId).name.replace(/[^A-Za-z0-9]/g, '');
  return `Snapface_${style}_${timestamp(render.createdAt)}.jpg`;
}

async function ensureAndroidWritePermission(): Promise<void> {
  if (Platform.OS !== 'android') return;
  // Android 10 (API 29) and newer use MediaStore; no storage permission.
  if (Number(Platform.Version) >= 29) return;

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'Allow Snapface to save images',
      message: 'Snapface needs permission to save your portrait to Downloads.',
      buttonPositive: 'Allow',
      buttonNegative: 'Not now',
    },
  );

  if (result !== PermissionsAndroid.RESULTS.GRANTED) {
    throw new PermissionDeniedError(
      'Storage permission is needed to save the image to Downloads.',
    );
  }
}

async function ensureIosPhotoPermission(): Promise<void> {
  if (Platform.OS !== 'ios') return;
  const status = await iosRequestAddOnlyGalleryPermission();
  if (status !== 'granted' && status !== 'limited') {
    throw new PermissionDeniedError(
      'Photo access is needed to save the image. You can allow it in Settings.',
    );
  }
}

const GALLERY_ALBUM = 'Snapface';

/**
 * Android:
 * - 10+: MediaStore Images with parentFolder "Snapface" -> Pictures/Snapface.
 * - 9 and older: public Pictures/Snapface directory + storage permission.
 * iOS: add-only Photos permission, then CameraRoll.
 */
async function saveToPhotos(render: ActionRender): Promise<ActionResult> {
  const source = plainPath(render.uri);
  const name = exportName(render);

  if (Platform.OS === 'ios') {
    await ensureIosPhotoPermission();
    await CameraRoll.saveAsset(fileUri(render.uri) ?? render.uri, {
      type: 'photo',
    });
    return { title: 'Saved', message: 'Saved to Photos.' };
  }

  await ensureAndroidWritePermission();

  if (Number(Platform.Version) >= 29) {
    await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
      {
        name,
        parentFolder: GALLERY_ALBUM,
        mimeType: 'image/jpeg',
      },
      'Image',
      source,
    );
  } else {
    const dir = `${ReactNativeBlobUtil.fs.dirs.PictureDir}/${GALLERY_ALBUM}`;
    if (!(await ReactNativeBlobUtil.fs.exists(dir))) {
      await ReactNativeBlobUtil.fs.mkdir(dir);
    }
    const destination = `${dir}/${name}`;
    await ReactNativeBlobUtil.fs.cp(source, destination);
    try {
      await ReactNativeBlobUtil.fs.scanFile([{ path: destination }]);
    } catch {
      // The file is still in Pictures/Snapface even if the media scan fails.
    }
  }

  return { title: 'Saved', message: `Saved to Pictures/${GALLERY_ALBUM}.` };
}

/**
 * Downloads use the public folder:
 * - Android 10+: MediaStore Downloads (no permission).
 * - Android 9 and older: public Downloads directory + storage permission.
 * - iOS: Photos, because iOS has no public Downloads folder.
 */
export async function downloadRender(
  render: ActionRender,
): Promise<ActionResult> {
  const name = exportName(render);
  const source = plainPath(render.uri);

  if (Platform.OS === 'ios') {
    return saveToPhotos(render);
  }

  await ensureAndroidWritePermission();

  if (Number(Platform.Version) >= 29) {
    await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
      {
        name,
        parentFolder: '',
        mimeType: 'image/jpeg',
      },
      'Download',
      source,
    );
  } else {
    const destination = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${name}`;
    await ReactNativeBlobUtil.fs.cp(source, destination);
    try {
      await ReactNativeBlobUtil.fs.scanFile([{ path: destination }]);
    } catch {
      // The file is still in Downloads even if the media scan fails.
    }
  }

  return { title: 'Downloaded', message: `Saved to Downloads/${name}.` };
}

export async function saveRenderToGallery(
  render: ActionRender,
): Promise<ActionResult> {
  return saveToPhotos(render);
}

export async function shareRender(
  render: ActionRender,
): Promise<ActionResult | null> {
  const result = await Share.open({
    url: fileUri(render.uri) ?? render.uri,
    type: 'image/jpeg',
    filename: exportName(render).replace(/\.jpg$/, ''),
    failOnCancel: false,
  });

  if (result.dismissedAction) return null;
  return { title: 'Shared', message: 'The system share sheet is open.' };
}
