export interface ColorTheme {
  splash: string;
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  primary: string;
  secondary: string;
  error: string;
  success: string;
  warning: string;
  border: string;
  card: string;
  notification: string;
  inputBorder: string;
}

export type ThemeType = 'light' | 'dark';

export interface AppColors {
  light: ColorTheme;
  dark: ColorTheme;
}
