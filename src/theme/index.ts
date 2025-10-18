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

export const lightTheme: Theme = {
  colors: {
    primary: '#2d5a27',
    secondary: '#4a7c59',
    tertiary: '#6ba16e',
    background: '#f8fafc',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#1a202c',
    textSecondary: '#4a5568',
    textTertiary: '#718096',
    border: '#e2e8f0',
    error: '#e53e3e',
    warning: '#ed8936',
    success: '#38a169',
    info: '#3182ce',
    accent: '#d69e2e',
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

export const darkTheme: Theme = {
  colors: {
    primary: '#68d391',
    secondary: '#9ae6b4',
    tertiary: '#c6f6d5',
    background: '#0d1117',
    surface: '#161b22',
    card: '#21262d',
    text: '#f7fafc',
    textSecondary: '#a0aec0',
    textTertiary: '#718096',
    border: '#2d3748',
    error: '#fc8181',
    warning: '#fbb6ce',
    success: '#68d391',
    info: '#63b3ed',
    accent: '#f6e05e',
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

export const getTheme = (mode: ThemeMode, systemTheme: 'light' | 'dark'): Theme => {
  if (mode === 'auto') {
    return systemTheme === 'dark' ? lightTheme : lightTheme;
  }
  return mode === 'dark' ? lightTheme : lightTheme;
};
