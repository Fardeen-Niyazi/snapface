import { create } from 'zustand';
import { Image } from 'react-native';

export type PickedImage = { uri: string; width: number; height: number };

const SAMPLE = Image.resolveAssetSource(
  require('../assets/images/sample.jpg'),
);

type ImageState = {
  image: PickedImage | null; // the original photo
  resultUri: string | null; // the cartoon output
  setImage: (image: PickedImage) => void;
  setResult: (uri: string | null) => void;
  reset: () => void;
};

export const useImageStore = create<ImageState>(set => ({
  image: {
    uri: SAMPLE.uri,
    width: SAMPLE.width,
    height: SAMPLE.height,
  },
  resultUri: null,
  setImage: image => set({ image, resultUri: null }), // a new photo clears the old result
  setResult: resultUri => set({ resultUri }),
  reset: () => set({ image: null, resultUri: null }),
}));
