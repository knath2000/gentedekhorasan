// src/components/PlatformSlider.tsx
import SliderIOS from '@react-native-community/slider';
import React from 'react';
import { AccessibilityRole, StyleProp, ViewStyle } from 'react-native';

// Unified props interface
export interface PlatformSliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  onValueChange?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>; // Changed to StyleProp<ViewStyle> for native
  // Accessibility Props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityValue?: { min?: number; max?: number; now?: number; text?: string };
}

const PlatformSlider: React.FC<PlatformSliderProps> = (props) => {
  // Use React Native Community Slider for native platforms
  return <SliderIOS
    {...props}
    // Ensure values passed to native component are rounded as per .clinerules #20 & #28
    value={Math.round(props.value)}
    minimumValue={Math.round(props.minimumValue)}
    maximumValue={Math.round(props.maximumValue)}
    accessibilityValue={props.accessibilityValue ? {
      min: props.accessibilityValue.min !== undefined ? Math.round(props.accessibilityValue.min) : undefined,
      max: props.accessibilityValue.max !== undefined ? Math.round(props.accessibilityValue.max) : undefined,
      now: props.accessibilityValue.now !== undefined ? Math.round(props.accessibilityValue.now) : undefined,
      text: props.accessibilityValue.text,
    } : undefined}
  />;
};

export default PlatformSlider;