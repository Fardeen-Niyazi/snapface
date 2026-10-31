import ReactNativeBlobUtil from 'react-native-blob-util';

// Resolved on first use, not at import time: blob-util reads native constants
// lazily, and touching them while the bundle is still loading can crash on the
// New Architecture before the native module is registered.
const rendersDir = () => `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/renders`;

export function plainPath(uri: string): string {
  return uri.startsWith('file://') ? uri.slice('file://'.length) : uri;
}

/** RN <Image> needs a scheme; stores keep plain absolute paths. */
export function fileUri(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (
    path.startsWith('file://') ||
    path.startsWith('content://') ||
    path.startsWith('data:') ||
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('asset://')
  ) {
    return path;
  }
  return `file://${path}`;
}

export function stripDataUri(data: string): string {
  if (!data.startsWith('data:')) return data;
  const comma = data.indexOf(',');
  return comma >= 0 ? data.slice(comma + 1) : data;
}

export function makeRenderId(createdAt = Date.now()): string {
  return `${createdAt}-${Math.random().toString(36).slice(2, 8)}`;
}

async function ensureRendersDir(): Promise<string> {
  const dir = rendersDir();
  const exists = await ReactNativeBlobUtil.fs.exists(dir);
  if (!exists) await ReactNativeBlobUtil.fs.mkdir(dir);
  return dir;
}

/**
 * Writes a JPEG into the app's private storage. Accepts base64 or a data URI.
 * Returns the plain absolute file path (no scheme).
 */
export async function saveRenderFile(
  jpeg: string,
  id: string,
): Promise<string> {
  const dir = await ensureRendersDir();
  const path = `${dir}/${id}.jpg`;
  await ReactNativeBlobUtil.fs.writeFile(
    path,
    stripDataUri(jpeg),
    'base64',
  );
  return path;
}

/** Best effort: a missing file should never break history cleanup. */
export async function deleteRenderFile(uri: string): Promise<void> {
  if (!uri) return;
  try {
    await ReactNativeBlobUtil.fs.unlink(plainPath(uri));
  } catch {
    // Already deleted, or the path belongs to a picker cache. Ignore.
  }
}
