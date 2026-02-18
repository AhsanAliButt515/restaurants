import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface TextFieldProps extends TextInputProps {
  /** Label text shown above the input */
  title?: string;
  /** Container style (wrapper around label + input) */
  containerStyle?: ViewStyle | ViewStyle[];
  /** Style for the label text */
  titleStyle?: TextStyle | TextStyle[];
  /** Extra style for the underlying TextInput */
  inputStyle?: TextStyle | TextStyle[];
  /** Style applied only to the placeholder text */
  placeholderStyle?: TextStyle;
}

/**
 * Common input component with configurable title and placeholder styling.
 *
 * Defaults:
 * - Title font size: 24
 * - Placeholder font size: 24
 */
export const TextField: React.FC<TextFieldProps> = ({
  title,
  containerStyle,
  titleStyle,
  inputStyle,
  placeholder,
  multiline = false,
  placeholderTextColor = 'rgba(0,0,0,0.4)',
  placeholderStyle,
  style,
  ...rest
}) => {
  const mergedContainer = [
    styles.container,
    ...(Array.isArray(containerStyle)
      ? containerStyle
      : containerStyle
        ? [containerStyle]
        : []),
  ];

  const mergedTitle = [
    styles.title,
    ...(Array.isArray(titleStyle) ? titleStyle : titleStyle ? [titleStyle] : []),
    styles.fontFamily,
  ];

  const mergedInput = [
    styles.input,
    multiline && styles.multilineInput,
    ...(Array.isArray(style) ? style : style ? [style] : []),
    ...(Array.isArray(inputStyle) ? inputStyle : inputStyle ? [inputStyle] : []),
    styles.fontFamilyRegular,
  ];

  // React Native does not have a direct placeholder style prop,
  // so we emulate fontSize/color/weight changes by:
  // 1) Using placeholderTextColor for color
  // 2) Letting the main input fontSize be 24 by default
  const effectivePlaceholderColor =
    placeholderStyle?.color ?? placeholderTextColor;

  return (
    <View style={mergedContainer}>
      {title ? <Text style={mergedTitle}>{title}</Text> : null}
      <TextInput
        {...rest}
        style={mergedInput}
        placeholder={placeholder}
        placeholderTextColor={effectivePlaceholderColor}
        multiline={multiline}
      />
    </View>
  );
};

const FONT_ROBERT_R = 'Robert-R';
const FONT_ROBERT_B = 'Robert-B';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  fontFamilyRegular: {
    fontFamily: FONT_ROBERT_R,
  },
  fontFamily: {
    fontFamily: FONT_ROBERT_B,
  },
  title: {
    fontSize: 24,
  },
  input: {
    fontSize: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

