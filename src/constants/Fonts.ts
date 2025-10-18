// Font families organized by usage
export const FONT_FAMILIES = {
  // Primary font for English text
  primary: 'Poppins-Regular',
  
  // Arabic font for Islamic text
  arabic: 'Amiri-Regular',
  
  // Secondary font for UI elements
  secondary: 'Inter-Regular',
} as const;

// Font weights mapped to actual font files
export const FONT_WEIGHTS = {
  light: {
    primary: 'Poppins-Light',
    arabic: 'Amiri-Regular', // Amiri doesn't have light weight
    secondary: 'Inter-Regular', // Inter doesn't have light weight
  },
  regular: {
    primary: 'Poppins-Regular',
    arabic: 'Amiri-Regular',
    secondary: 'Inter-Regular',
  },
  medium: {
    primary: 'Poppins-Medium',
    arabic: 'Amiri-Regular', // Amiri doesn't have medium weight
    secondary: 'Inter-Regular', // Inter doesn't have medium weight
  },
  semiBold: {
    primary: 'Poppins-SemiBold',
    arabic: 'Amiri-Bold', // Using bold as closest to semiBold
    secondary: 'Inter-Regular', // Inter doesn't have semiBold weight
  },
  bold: {
    primary: 'Poppins-Bold',
    arabic: 'Amiri-Bold',
    secondary: 'Inter-Regular', // Inter doesn't have bold weight
  },
} as const;

// Typography scale with consistent sizing
export const TYPOGRAPHY = {
  // Headings
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: FONT_WEIGHTS.bold.primary,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: FONT_WEIGHTS.bold.primary,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: FONT_WEIGHTS.semiBold.primary,
  },
  
  // Body text
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONT_WEIGHTS.regular.primary,
  },
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: FONT_WEIGHTS.regular.primary,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONT_WEIGHTS.regular.primary,
  },
  
  // UI elements
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONT_WEIGHTS.semiBold.primary,
  },
  buttonLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: FONT_WEIGHTS.semiBold.primary,
  },
  buttonSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONT_WEIGHTS.medium.primary,
  },
  
  // Captions and labels
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FONT_WEIGHTS.regular.primary,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONT_WEIGHTS.medium.primary,
  },
  
  // Arabic text
  arabic: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONT_WEIGHTS.regular.arabic,
  },
  arabicLarge: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: FONT_WEIGHTS.bold.arabic,
  },
  arabicSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONT_WEIGHTS.regular.arabic,
  },
} as const;

// Legacy exports for backward compatibility
export const FONTS = {
  arabic: {
    regular: FONT_WEIGHTS.regular.arabic,
    bold: FONT_WEIGHTS.bold.arabic,
  },
  primary: {
    light: FONT_WEIGHTS.light.primary,
    regular: FONT_WEIGHTS.regular.primary,
    medium: FONT_WEIGHTS.medium.primary,
    semiBold: FONT_WEIGHTS.semiBold.primary,
    bold: FONT_WEIGHTS.bold.primary,
  },
  secondary: {
    regular: FONT_WEIGHTS.regular.secondary,
    medium: FONT_WEIGHTS.medium.secondary,
    semiBold: FONT_WEIGHTS.semiBold.secondary,
    bold: FONT_WEIGHTS.bold.secondary,
  },
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};