import { useEffect, useState } from 'react';
import {
  renderToonPreview,
  renderToonThumbnail,
} from '../../features/ml/previews';

/**
 * Debounced 256px Toon preview plus a real Toon thumbnail for the style tile.
 * The thumbnail is generated even when another style is selected, so the Toon
 * tile always shows the real effect.
 */
export function useToonPreview(
  uri: string | null | undefined,
  strength: number,
  live: boolean,
) {
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [thumbUri, setThumbUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPreviewUri(null);

    if (!uri) {
      setThumbUri(null);
      return;
    }

    renderToonThumbnail(uri)
      .then(data => {
        if (!cancelled) setThumbUri(data);
      })
      .catch(() => {
        if (!cancelled) setThumbUri(null);
      });

    return () => {
      cancelled = true;
    };
  }, [uri]);

  useEffect(() => {
    if (!uri || !live) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      renderToonPreview(uri, strength)
        .then(data => {
          if (!cancelled) setPreviewUri(data);
        })
        .catch(() => {
          // Preview is a convenience; the full run shows the real error.
        });
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [uri, strength, live]);

  return { previewUri, thumbUri };
}
