import {
  AlphaType,
  ColorType,
  FilterMode,
  ImageFormat,
  MipmapMode,
  Skia,
} from '@shopify/react-native-skia';

/**
 * Decodes a photo, center-crops it to a square and resizes it to size x size.
 * Returns tightly packed RGBA bytes (size * size * 4).
 *
 * EXIF: Skia builds images from encoded data with an SkCodecImageGenerator,
 * which applies the EXIF orientation while decoding. The width/height we read
 * here are therefore already display-oriented, and the pixels we draw are
 * upright. Do not rotate them a second time.
 */
export async function loadSquarePixels(
  uri: string,
  size: number,
): Promise<Uint8Array> {
  const data = await Skia.Data.fromURI(uri);
  const image = Skia.Image.MakeImageFromEncoded(data);
  if (!image) throw new Error('Could not read this photo. Try another one.');

  const side = Math.min(image.width(), image.height());
  const srcX = (image.width() - side) / 2;
  const srcY = (image.height() - side) / 2;

  // Raster offscreen surface: works the same on iOS and Android.
  const surface = Skia.Surface.Make(size, size);
  if (!surface) throw new Error('Could not create a drawing surface.');

  const paint = Skia.Paint();
  paint.setAntiAlias(true);
  surface
    .getCanvas()
    .drawImageRectOptions(
      image,
      Skia.XYWHRect(srcX, srcY, side, side),
      Skia.XYWHRect(0, 0, size, size),
      FilterMode.Linear,
      MipmapMode.None,
      paint,
    );
  surface.flush();

  const pixels = surface.makeImageSnapshot().readPixels(0, 0, {
    width: size,
    height: size,
    colorType: ColorType.RGBA_8888,
    alphaType: AlphaType.Unpremul,
  });
  if (!(pixels instanceof Uint8Array)) {
    throw new Error('Could not read the pixels of this photo.');
  }
  return pixels;
}

/** RGBA bytes -> base64 JPEG (no data: prefix). */
export function pixelsToJpegBase64(
  rgba: Uint8Array,
  size: number,
  quality = 92,
): string {
  const image = Skia.Image.MakeImage(
    {
      width: size,
      height: size,
      alphaType: AlphaType.Opaque,
      colorType: ColorType.RGBA_8888,
    },
    Skia.Data.fromBytes(rgba),
    size * 4,
  );
  if (!image) throw new Error('Could not build the output image.');
  return image.encodeToBase64(ImageFormat.JPEG, quality);
}

/** RGBA bytes -> `data:image/jpeg;base64,...` for <Image> previews. */
export function pixelsToJpegDataUri(
  rgba: Uint8Array,
  size: number,
  quality = 92,
): string {
  return `data:image/jpeg;base64,${pixelsToJpegBase64(rgba, size, quality)}`;
}
