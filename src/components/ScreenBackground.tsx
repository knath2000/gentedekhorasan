import Image from 'next/image'; // Import Next.js Image component
import React from 'react';
import { ImageBackground, Platform, StyleSheet, View, ViewProps } from 'react-native'; // Added View

// Define the image sources
const webImage = require('../../assets/images/webtest.webp'); // Use the webp image
const nativeImage = require('../../assets/images/iOSbackground.webp'); // Using iOSbackground for native on other screens for now

interface ScreenBackgroundProps extends ViewProps {
  children: React.ReactNode;
}

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ children, style, ...rest }) => {
  // For web, use Next.js Image component
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.background, style]} {...rest}>
        <Image
          src={webImage.src} // Use .src for Next.js Image with require
          alt="Background image"
          fill // Use fill to cover the container
          style={StyleSheet.absoluteFillObject} // Position absolutely to cover the View
          priority // Prioritize loading for LCP
        />
        {children}
      </View>
    );
  }

  // For native, use ImageBackground
  return (
    <ImageBackground
      source={nativeImage}
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