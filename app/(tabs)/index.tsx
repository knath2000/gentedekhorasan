// app/(tabs)/index.tsx
import React from 'react';
import { ImageBackground, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import AnimatedBackground from '../../src/components/AnimatedBackground';
// import ResumeReadingButton from '../../src/components/ResumeReadingButton'; // Removed
import VerseOfTheDay from '../../src/components/VerseOfTheDay';
import { Theme } from '../../src/theme/theme';

const BaseScreenContainer = styled(Platform.OS === 'web' ? ImageBackground : View)<{ theme: Theme }>`
  flex: 1;
  width: 100%;
  /* padding-bottom is handled by ScrollView contentContainerStyle or specific layout */
  ${Platform.OS === 'web' ? `
    background-color: transparent; /* Ensure ImageBackground shows */
  ` : `
    /* Native styles */
  `}
`;

// This will wrap the content on top of the background
const ContentOverlay = styled(ScrollView).attrs<{ pt: number, pb: number }>(props => ({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: props.pt + 20, // Add some top padding
    paddingBottom: props.pb + 20, // Add some bottom padding
    paddingHorizontal: 10,
  },
}))<{ theme: Theme; pt: number; pb: number }>`
  position: ${Platform.OS !== 'web' ? 'absolute' : 'relative'}; /* Corrected platform check */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1; /* Ensure content is on top of AnimatedBackground for native */
  width: 100%;
  height: 100%;
`;


const WelcomeText = styled(Text)<{ theme: Theme }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl}px; /* Larger for a greeting */
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fonts.englishBold};
  text-align: center;
  margin-bottom: 20px; /* Space before resume button */
  ${Platform.OS === 'web' && `
    text-shadow: 0px 1px 6px rgba(0,0,0,0.9); /* Adjusted for better contrast */
  `}
`;

const webImageSource = Platform.OS === 'web'
  ? require('../../assets/images/webtest.webp')
  : require('../../assets/images/webtest.webp'); // Fallback for bundler, native uses AnimatedBackground

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  // Adjust paddingBottom for the tab bar height
  // This is a common pattern, ensure it matches your actual tab bar height
  const tabBarHeight = Platform.OS === 'ios' ? 90 : 70; 


  if (Platform.OS === 'web') {
    return (
      <BaseScreenContainer
        source={webImageSource}
        resizeMode="cover"
      >
        <ContentOverlay pt={insets.top} pb={insets.bottom + tabBarHeight}>
          <WelcomeText>Luminous Verses</WelcomeText>
          {/* <ResumeReadingButton /> Removed */}
          <VerseOfTheDay />
        </ContentOverlay>
      </BaseScreenContainer>
    );
  }

  // Native rendering
  return (
    <BaseScreenContainer>
      <AnimatedBackground />
      <ContentOverlay pt={insets.top} pb={insets.bottom + tabBarHeight}>
        <WelcomeText>Luminous Verses</WelcomeText>
        {/* <ResumeReadingButton /> Removed */}
        <VerseOfTheDay />
      </ContentOverlay>
    </BaseScreenContainer>
  );
}