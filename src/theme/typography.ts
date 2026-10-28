export const fonts = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;

// Don't add fontWeight next to these. The weight is already in the font file.
export const type = {
  h1: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 34, letterSpacing: -0.9 },
  title: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20 },
};