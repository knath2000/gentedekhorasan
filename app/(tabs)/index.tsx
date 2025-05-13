// app/(tabs)/index.tsx
import React from 'react';
import { ImageBackground, Platform, Text, View } from 'react-native'; // Import Platform, ImageBackground, StyleSheet
import styled from 'styled-components/native';
import AnimatedBackground from '../../src/components/AnimatedBackground'; // Import AnimatedBackground
import { Theme } from '../../src/theme/theme'; // Adjust path if necessary

// For web, ScreenContainer will be an ImageBackground
// For native, it will be a View that contains AnimatedBackground
const BaseScreenContainer = styled(Platform.OS === 'web' ? ImageBackground : View)<{ theme: Theme }>`
  flex: 1;
  width: 100%;
  padding-bottom: ${Platform.OS === 'ios' ? 90 : 70}px; /* Added padding for floating tab bar */
  ${Platform.OS === 'web' ? `
    justify-content: center;
    align-items: center;
    background-color: transparent;
  ` : `
    /* Native styles directly - temporarily remove background color for debugging */
    /* background-color: ${ ({ theme }: { theme: Theme }) => theme.colors.background}; */
    /* justifyContent and alignItems are not needed here for native if children are absolute */
  `}
`;

const ScreenText = styled(Text)<{ theme: Theme }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fonts.englishBold};
  text-align: center; /* Ensure text is centered */
  ${Platform.OS === 'web' && `
    /* Add some shadow or outline for better readability on web background image if needed */
    text-shadow: 0px 0px 5px rgba(0,0,0,0.7);
  `}
`;

const webImageSource = require('../../assets/images/webtest.png');

export default function HomeScreen() {
  if (Platform.OS === 'web') {
    return (
      <BaseScreenContainer
        source={webImageSource}
        resizeMode="cover" // Or 'stretch', 'contain'
        // style={styles.fullWidthBackground} // Optional: if more styles needed than styled-component provides
      >
        <ScreenText>Home Screen</ScreenText>
      </BaseScreenContainer>
    );
  }

  // Native rendering
  return (
    <BaseScreenContainer>
      <AnimatedBackground />
      {/* ScreenText needs to be on top of AnimatedBackground */}
      {/* This View will cover the entire BaseScreenContainer and center the text */ }
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
        <ScreenText>Home Screen</ScreenText>
      </View>
    </BaseScreenContainer>
  );
}