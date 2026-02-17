import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  testID?: string;
  /** When false, button shrinks to fit content instead of full width */
  fullWidth?: boolean;
}

export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  testID,
  fullWidth = true,
}: ButtonProps) => {
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  const containerStyles = [
    styles.button,
    isSecondary && styles.buttonSecondary,
    isOutline && styles.buttonOutline,
    !fullWidth && styles.buttonAuto,
    ...(Array.isArray(style) ? style : style ? [style] : []),
    (disabled || loading) && styles.buttonDisabled,
  ];

  const titleStyles = [
    styles.buttonText,
    isOutline && styles.buttonTextOutline,
    ...(Array.isArray(textStyle) ? textStyle : textStyle ? [textStyle] : []),
  ];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? '#000' : '#fff'} />
      ) : (
        <Text style={titleStyles}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonAuto: {
    width: 'auto',
    alignSelf: 'flex-start',
  },
  buttonSecondary: {
    backgroundColor: '#264BEB',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextOutline: {
    color: '#000',
  },
});
