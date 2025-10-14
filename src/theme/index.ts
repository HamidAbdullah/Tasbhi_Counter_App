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
      fontWeight: string;
      lineHeight: number;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    h3: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    body: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    button: {
      fontSize: number;
      fontWeight: string;
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
    primary: '#1e7e34',
    secondary: '#2d5a27',
    tertiary: '#4a7c59',
    background: '#f8f9fa',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#e0e0e0',
    error: '#d73527',
    warning: '#f39c12',
    success: '#27ae60',
    info: '#3498db',
    accent: '#DAA520',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
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
      fontWeight: '700',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
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
    primary: '#4a7c59',
    secondary: '#6ba16e',
    tertiary: '#8bc34a',
    background: '#0d1117',
    surface: '#161b22',
    card: '#21262d',
    text: '#f0f6fc',
    textSecondary: '#8b949e',
    textTertiary: '#6e7681',
    border: '#30363d',
    error: '#f85149',
    warning: '#f0883e',
    success: '#3fb950',
    info: '#58a6ff',
    accent: '#ffa500',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
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
      fontWeight: '700',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
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
    return systemTheme === 'dark' ? darkTheme : lightTheme;
  }
  return mode === 'dark' ? darkTheme : lightTheme;
};
