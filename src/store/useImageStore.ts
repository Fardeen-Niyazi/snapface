import { create } from 'zustand';

export type PickedImage = { uri: string; width: number; height: number };

type ImageState = {
  image: PickedImage | null; // the original photo
  resultUri: string | null; // the cartoon output
  setImage: (image: PickedImage) => void;
  setResult: (uri: string | null) => void;
  reset: () => void;
};

export const useImageStore = create<ImageState>(set => ({
  image: null,
  resultUri: null,
  setImage: image => set({ image, resultUri: null }), // a new photo clears the old result
  setResult: resultUri => set({ resultUri }),
  reset: () => set({ image: null, resultUri: null }),
}));
