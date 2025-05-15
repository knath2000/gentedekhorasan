// src/components/PlatformSlider.tsx

import SliderIOS from '@react-native-community/slider'; // For native
import React, { useEffect, useRef } from 'react'; // Added useEffect, useRef
import { AccessibilityRole, Platform } from 'react-native'; // Import AccessibilityRole
import './PlatformSlider.css'; // Import the CSS file

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
  style?: any; // Keep as any for web style flexibility, or use React.CSSProperties for web part
  // Accessibility Props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole; // Use the imported AccessibilityRole type
  accessibilityValue?: { min?: number; max?: number; now?: number; text?: string };
}

// Web-compatible slider implementation using HTML5 input range
const WebCompatibleSlider: React.FC<PlatformSliderProps> = ({
  value,
  minimumValue,
  maximumValue,
  onValueChange,
  onSlidingComplete,
  minimumTrackTintColor,
  maximumTrackTintColor,
  thumbTintColor,
  disabled,
  style,
  accessibilityLabel,
  accessibilityHint,
  // accessibilityRole, // role attribute is not standard for input[type=range]
  accessibilityValue,
}) => {
  const sliderRef = useRef<HTMLInputElement>(null);
  // const sliderId = useRef(`slider-${Math.random().toString(36).substring(2, 9)}`).current; // ID not strictly needed if class is used

  useEffect(() => {
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      const minTrackColor = minimumTrackTintColor || '#007aff';
      const maxTrackColor = maximumTrackTintColor || '#e6e6e6';
      const thumbColor = thumbTintColor || '#007aff';

      sliderElement.style.setProperty('--minimum-track-color', minTrackColor);
      sliderElement.style.setProperty('--maximum-track-color', maxTrackColor);
      sliderElement.style.setProperty('--thumb-color', thumbColor);
      
      sliderElement.style.setProperty('--value', value.toString());
      sliderElement.style.setProperty('--min', minimumValue.toString());
      sliderElement.style.setProperty('--max', maximumValue.toString());

      // Dynamic background for track fill
      const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;
      // Ensure percentage is within 0-100
      const safePercentage = Math.max(0, Math.min(100, percentage));
      sliderElement.style.background = `linear-gradient(to right, ${minTrackColor} ${safePercentage}%, ${maxTrackColor} ${safePercentage}%)`;
    }
  }, [value, minimumValue, maximumValue, minimumTrackTintColor, maximumTrackTintColor, thumbTintColor]);

  return (
    <input
      ref={sliderRef}
      // id={sliderId} // Not strictly needed
      className="platform-slider" // Apply class for CSS
      type="range"
      min={Math.round(minimumValue)}
      max={Math.round(maximumValue)}
      value={Math.round(value)}
      disabled={disabled}
      aria-label={accessibilityLabel}
      aria-valuemin={accessibilityValue?.min !== undefined ? Math.round(accessibilityValue.min) : undefined}
      aria-valuemax={accessibilityValue?.max !== undefined ? Math.round(accessibilityValue.max) : undefined}
      aria-valuenow={accessibilityValue?.now !== undefined ? Math.round(accessibilityValue.now) : undefined}
      aria-valuetext={accessibilityValue?.text}
      title={accessibilityHint}
      onChange={(e) => {
        const target = e.target as HTMLInputElement;
        // Ensure the value passed up is also an integer if consistency is desired,
        // or keep as float if the consumer expects float and handles rounding.
        // For consistency with native, let's round here.
        onValueChange && onValueChange(Math.round(parseFloat(target.value)));
      }}
      onMouseUp={(e) => {
        const target = e.target as HTMLInputElement;
        onSlidingComplete && onSlidingComplete(Math.round(parseFloat(target.value)));
      }}
      onTouchEnd={(e) => {
        const target = e.target as HTMLInputElement;
        onSlidingComplete && onSlidingComplete(Math.round(parseFloat(target.value)));
      }}
      style={style as React.CSSProperties} // Pass through other styles, cast to CSSProperties for web
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
  return <SliderIOS
    {...props}
    value={Math.round(props.value)}
    minimumValue={Math.round(props.minimumValue)}
    maximumValue={Math.round(props.maximumValue)}
    accessibilityValue={{
      min: props.accessibilityValue?.min !== undefined ? Math.round(props.accessibilityValue.min) : undefined,
      max: props.accessibilityValue?.max !== undefined ? Math.round(props.accessibilityValue.max) : undefined,
      now: props.accessibilityValue?.now !== undefined ? Math.round(props.accessibilityValue.now) : undefined,
      text: props.accessibilityValue?.text,
    }}
  />;
};

export default PlatformSlider;