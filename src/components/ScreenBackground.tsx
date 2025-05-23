import React from 'react';
import { ImageBackground, StyleSheet, ViewProps } from 'react-native'; // Removed Platform

// Define the image sources
const nativeImage = require('../../assets/images/iOSbackground.png'); // Using iOSbackground for native on other screens for now

interface ScreenBackgroundProps extends ViewProps {
  children: React.ReactNode;
}

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ children, style, ...rest }) => {
  const backgroundSource = nativeImage;

  return (
    <ImageBackground
      source={backgroundSource}
      style={[styles.background, style]} // Allow overriding or extending styles
      resizeMode="cover" // Ensure the image covers the background
      {...rest}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
});