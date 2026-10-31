import {
  AlphaType,
  ColorType,
  FilterMode,
  MipmapMode,
  Skia,
  TileMode,
} from '@shopify/react-native-skia';
import type { SkRuntimeEffect } from '@shopify/react-native-skia';

/**
 * Toon shader. `scale` is imageSize / 512 so blur radius and Sobel offsets
 * cover the same visual distance at 256px previews and 512px output.
 *
 * Pipeline: blurred colour -> 5 posterized levels -> slight saturation boost
 * -> Sobel edges -> dark ink lines.
 */
const TOON_SOURCE = `
uniform shader image;
uniform float strength;
uniform float scale;

float luma(float3 c) {
  return dot(c, float3(0.299, 0.587, 0.114));
}

float3 blurred(float2 p) {
  float r = 1.5 * scale;
  float3 c = image.eval(p).rgb * 2.0;
  c += image.eval(p + float2(r, 0.0)).rgb;
  c += image.eval(p - float2(r, 0.0)).rgb;
  c += image.eval(p + float2(0.0, r)).rgb;
  c += image.eval(p - float2(0.0, r)).rgb;
  return c / 6.0;
}

float edgeAt(float2 p) {
  float r = 2.0 * scale;
  float tl = luma(image.eval(p + float2(-r, -r)).rgb);
  float t  = luma(image.eval(p + float2(0.0, -r)).rgb);
  float tr = luma(image.eval(p + float2(r, -r)).rgb);
  float l  = luma(image.eval(p + float2(-r, 0.0)).rgb);
  float rr = luma(image.eval(p + float2(r, 0.0)).rgb);
  float bl = luma(image.eval(p + float2(-r, r)).rgb);
  float b  = luma(image.eval(p + float2(0.0, r)).rgb);
  float br = luma(image.eval(p + float2(r, r)).rgb);
  float gx = -tl - 2.0 * l - bl + tr + 2.0 * rr + br;
  float gy = -tl - 2.0 * t - tr + bl + 2.0 * b + br;
  return clamp(length(float2(gx, gy)) * 2.5, 0.0, 1.0);
}

half4 main(float2 p) {
  float3 src = image.eval(p).rgb;
  float3 posterized = floor(blurred(p) * 4.0 + 0.5) / 4.0;
  float g = luma(posterized);
  float3 saturated = clamp(mix(float3(g), posterized, 1.18), 0.0, 1.0);
  float ink = smoothstep(0.08, 0.65, edgeAt(p));
  float3 toon = mix(saturated, float3(0.035), ink);
  return half4(mix(src, toon, strength), 1.0);
}
`;

let toonEffect: SkRuntimeEffect | null = null;

function getToonEffect(): SkRuntimeEffect {
  if (toonEffect) return toonEffect;
  const made = Skia.RuntimeEffect.Make(TOON_SOURCE);
  if (!made) {
    throw new Error(
      'The Toon shader failed to compile. Check the Metro/Skia log for the SkSL error.',
    );
  }
  toonEffect = made;
  return made;
}

/**
 * Applies the Toon shader to square RGBA pixels and returns RGBA bytes.
 * Encoding is intentionally left to the caller so pipeline timing only covers
 * the shader itself.
 */
export function applyToonShader(
  rgba: Uint8Array,
  size: number,
  strength: number,
): Uint8Array {
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
  if (!image) throw new Error('Could not build the shader input image.');

  const imageShader = image.makeShaderOptions(
    TileMode.Clamp,
    TileMode.Clamp,
    FilterMode.Linear,
    MipmapMode.None,
  );

  const s = Math.max(0, Math.min(1, strength / 100));
  const scale = size / 512;
  const shader = getToonEffect().makeShaderWithChildren(
    [s, scale],
    [imageShader],
  );

  const surface = Skia.Surface.Make(size, size);
  if (!surface) throw new Error('Could not create a drawing surface.');

  const paint = Skia.Paint();
  paint.setShader(shader);
  surface.getCanvas().drawRect(Skia.XYWHRect(0, 0, size, size), paint);
  surface.flush();

  const pixels = surface.makeImageSnapshot().readPixels(0, 0, {
    width: size,
    height: size,
    colorType: ColorType.RGBA_8888,
    alphaType: AlphaType.Unpremul,
  });
  if (!(pixels instanceof Uint8Array)) {
    throw new Error('Could not read the shader output.');
  }
  return pixels;
}
