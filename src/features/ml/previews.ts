import { loadSquarePixels, pixelsToJpegDataUri } from './imageIO';
import { applyToonShader } from './shaders';

export const PREVIEW_SIZE = 256;
const THUMB_SIZE = 192;

// Decoding a photo is the slow part, so keep the last few decoded photos.
const pixelCache = new Map<string, Uint8Array>();
const THUMB_CACHE_LIMIT = 6;
const thumbCache = new Map<string, string>();

async function getPixels(uri: string, size: number): Promise<Uint8Array> {
  const key = `${size}|${uri}`;
  const hit = pixelCache.get(key);
  if (hit) return hit;

  const pixels = await loadSquarePixels(uri, size);
  pixelCache.set(key, pixels);
  if (pixelCache.size > 6) {
    const oldest = pixelCache.keys().next().value;
    if (oldest) pixelCache.delete(oldest);
  }
  return pixels;
}

/** Live Toon preview at 256px. Used only for the shader style. */
export async function renderToonPreview(
  uri: string,
  strength: number,
): Promise<string> {
  const pixels = await getPixels(uri, PREVIEW_SIZE);
  const styled = applyToonShader(pixels, PREVIEW_SIZE, strength);
  return pixelsToJpegDataUri(styled, PREVIEW_SIZE, 86);
}

/**
 * Real Toon thumbnail for the style tile. Model styles use the original photo
 * in the UI, because their models only run when the user taps Create.
 */
export async function renderToonThumbnail(uri: string): Promise<string> {
  const hit = thumbCache.get(uri);
  if (hit) return hit;

  const pixels = await getPixels(uri, THUMB_SIZE);
  const styled = applyToonShader(pixels, THUMB_SIZE, 85);
  const out = pixelsToJpegDataUri(styled, THUMB_SIZE, 84);

  thumbCache.set(uri, out);
  if (thumbCache.size > THUMB_CACHE_LIMIT) {
    const oldest = thumbCache.keys().next().value;
    if (oldest) thumbCache.delete(oldest);
  }
  return out;
}

/** Useful when the picked photo changes and memory should be reclaimed. */
export function clearPreviewCache(): void {
  pixelCache.clear();
  thumbCache.clear();
}
