// src/components/PlatformSlider.tsx

import SliderIOS from '@react-native-community/slider'; // For native
import React from 'react';
import { Platform } from 'react-native';
// The plan mentions a hypothetical 'react-native-web-slider' but implements a custom one.
// I will proceed with the custom HTML input implementation as detailed.

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
  style?: any;
}

// Web-compatible slider implementation using HTML5 input range
const WebCompatibleSlider: React.FC<PlatformSliderProps> = ({
  value,
  minimumValue,
  maximumValue,
  onValueChange,
  onSlidingComplete,
  minimumTrackTintColor, // Note: These color props are not directly applicable to native HTML range input without CSS tricks
  maximumTrackTintColor, // These will be ignored by the basic HTML input but are kept for prop compatibility
  thumbTintColor,        // These will be ignored by the basic HTML input
  disabled,
  style,
}) => {
  // Implement using HTML5 input range slider
  // This avoids the ReactDOM.findDOMNode issues
  return (
    <input
      type="range"
      min={minimumValue}
      max={maximumValue}
      value={value}
      disabled={disabled}
      onChange={(e) => {
        const target = e.target as HTMLInputElement;
        onValueChange && onValueChange(parseFloat(target.value));
      }}
      onMouseUp={(e) => {
        const target = e.target as HTMLInputElement;
        onSlidingComplete && onSlidingComplete(parseFloat(target.value));
      }}
      onTouchEnd={(e) => {
        const target = e.target as HTMLInputElement;
        onSlidingComplete && onSlidingComplete(parseFloat(target.value));
      }}
      style={{
        width: '100%', // Ensure it takes full width of its container
        height: 40,    // Match typical touch target height
        ...style,
        // Basic styling to make it somewhat resemble the native one.
        // More advanced styling would require CSS or a styled-component wrapper for the input.
        accentColor: thumbTintColor || minimumTrackTintColor || 'blue', // Tries to color the track/thumb
      }}
    />
  );
};

// Platform-specific implementation
const PlatformSlider: React.FC<PlatformSliderProps> = (props) => {
  if (Platform.OS === 'web') {
    // Use web-compatible slider for web platform
    return <WebCompatibleSlider {...props} />;
  }
  
  // Use React Native Community Slider for native platforms
  // Renamed import to SliderIOS to avoid conflict if WebSlider was a real import
  return <SliderIOS {...props} />;
};

export default PlatformSlider;