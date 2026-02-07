export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
    accent: string;
    shadow: string;
    overlay: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    h1: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    h2: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    h3: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    body: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    bodyLarge: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    bodySmall: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    button: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    buttonLarge: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    buttonSmall: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    caption: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    label: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    arabic: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    arabicLarge: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
    arabicSmall: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
    };
  };
  shadows: {
    small: {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    medium: {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    large: {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

// Islamic premium palette
export const ISLAMIC_COLORS = {
  primary: '#0E6F64',       // Emerald Islamic Green
  secondary: '#0B1C2D',     // Midnight Blue (night prayer)
  gold: '#C8A24D',          // Premium subtle gold
  bgLight: '#F6F9F7',
  bgDark: '#07141F',
  textDark: '#0E1B1A',
  textLight: '#E6F2EF',
} as const;

// Light theme — calm, spiritual, minimal
export const lightTheme: Theme = {
  colors: {
    primary: ISLAMIC_COLORS.primary,
    secondary: ISLAMIC_COLORS.secondary,
    tertiary: '#0d5c54',
    background: ISLAMIC_COLORS.bgLight,
    surface: '#ffffff',
    card: '#ffffff',
    text: ISLAMIC_COLORS.textDark,
    textSecondary: '#1a3d38',
    textTertiary: '#4a7c75',
    border: '#c5e0dc',
    error: '#dc2626',
    warning: '#ea580c',
    success: ISLAMIC_COLORS.primary,
    info: '#0284c7',
    accent: ISLAMIC_COLORS.gold,
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontFamily: 'Poppins-Bold',
      lineHeight: 40,
    },

    h2: {
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      lineHeight: 24,
    },
    bodyLarge: {
      fontSize: 18,
      fontFamily: 'Poppins-Regular',
      lineHeight: 28,
    },
    bodySmall: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      lineHeight: 20,
    },
    button: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      lineHeight: 24,
    },
    buttonLarge: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      lineHeight: 28,
    },
    buttonSmall: {
      fontSize: 14,
      fontFamily: 'Poppins-Medium',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      lineHeight: 16,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Poppins-Medium',
      lineHeight: 20,
    },
    arabic: {
      fontSize: 16,
      fontFamily: 'Amiri-Regular',
      lineHeight: 24,
    },
    arabicLarge: {
      fontSize: 20,
      fontFamily: 'Amiri-Bold',
      lineHeight: 28,
    },
    arabicSmall: {
      fontSize: 14,
      fontFamily: 'Amiri-Regular',
      lineHeight: 20,
    },
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

// Dark theme — night prayer vibe, easy on the eyes
export const darkTheme: Theme = {
  colors: {
    primary: '#11998a',
    secondary: ISLAMIC_COLORS.secondary,
    tertiary: '#0d5c54',
    background: ISLAMIC_COLORS.bgDark,
    surface: '#0f2432',
    card: '#132f42',
    text: ISLAMIC_COLORS.textLight,
    textSecondary: '#9ec4be',
    textTertiary: '#5a8a82',
    border: '#1a3d4d',
    error: '#f87171',
    warning: '#fb923c',
    success: '#11998a',
    info: '#38bdf8',
    accent: ISLAMIC_COLORS.gold,
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontFamily: 'Poppins-Bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      lineHeight: 24,
    },
    bodyLarge: {
      fontSize: 18,
      fontFamily: 'Poppins-Regular',
      lineHeight: 28,
    },
    bodySmall: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      lineHeight: 20,
    },
    button: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      lineHeight: 24,
    },
    buttonLarge: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      lineHeight: 28,
    },
    buttonSmall: {
      fontSize: 14,
      fontFamily: 'Poppins-Medium',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      lineHeight: 16,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Poppins-Medium',
      lineHeight: 20,
    },
    arabic: {
      fontSize: 16,
      fontFamily: 'Amiri-Regular',
      lineHeight: 24,
    },
    arabicLarge: {
      fontSize: 20,
      fontFamily: 'Amiri-Bold',
      lineHeight: 28,
    },
    arabicSmall: {
      fontSize: 14,
      fontFamily: 'Amiri-Regular',
      lineHeight: 20,
    },
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export type ThemeMode = 'light' | 'dark' | 'auto';

// Ramadan theme: warmer gold-tinted accents
export const ramadanLightTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#0d6b5c',
    accent: '#D4AF37',
    tertiary: '#b8860b',
  },
};

export const ramadanDarkTheme: Theme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    primary: '#0fa090',
    accent: '#D4AF37',
  },
};

export const getTheme = (
  mode: ThemeMode,
  systemTheme: 'light' | 'dark',
  ramadanMode?: boolean
): Theme => {
  const base = mode === 'auto'
    ? (systemTheme === 'dark' ? darkTheme : lightTheme)
    : (mode === 'dark' ? darkTheme : lightTheme);
  if (ramadanMode) {
    return base === darkTheme ? ramadanDarkTheme : ramadanLightTheme;
  }
  return base;
};
