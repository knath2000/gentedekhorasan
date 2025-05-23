import React from 'react';
import { ImageBackground, StyleSheet, ViewProps } from 'react-native';

const nativeImage = require('../../assets/images/iOSbackground.png');

interface ScreenBackgroundProps extends ViewProps {
  children: React.ReactNode;
}

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ children, style, ...rest }) => {
  return (
    <ImageBackground
      source={nativeImage}
      style={[styles.background, style]}
      resizeMode="cover"
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