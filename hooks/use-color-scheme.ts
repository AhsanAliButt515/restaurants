/**
 * Always returns 'light' - app is forced to light theme for now.
 * To support dark mode later, change to: export { useColorScheme } from 'react-native';
 */
export function useColorScheme(): 'light' | 'dark' {
  return 'light';
}
