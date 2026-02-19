/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */


import { AppColors } from '@/types/theme';
import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors: AppColors = {
  light: {
    text: '#11181C',
    background: '#fff',
    inputBorder: '#fff',
    tint: tintColorLight,
    tailorBlue: '#264BEB',
    white: '#FFFFFF',
    black: '#0B0B0B',
    grey: '#F1F1F0',
    splash: '#F1F1F0',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#007AFF',
    secondary: '#5856D6',
    error: '#FF3B30',
    success: '#4CD964',
    warning: '#FFCC00',
    border: '#C7C7CC',
    card: '#F2F2F7',
    notification: '#FF3B30',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tailorBlue: '#0A84FF',
    white: '#FFFFFF',
    black: '#0B0B0B',
    grey: '#F1F1F0',
    inputBorder: '#fff',
    tint: tintColorDark,
    splash: '#151718',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FFD60A',
    border: '#38383A',
    card: '#1C1C1E',
    notification: '#FF453A',
  },
};


export const Space = {
  xs: 0,
  s: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const CornorRadius = {
  CornorRadius: 24
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
