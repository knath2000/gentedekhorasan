// app/(tabs)/index.tsx
import React from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import AnimatedBackground from '../../src/components/AnimatedBackground';
// import ResumeReadingButton from '../../src/components/ResumeReadingButton'; // Removed
import VerseOfTheDay from '../../src/components/VerseOfTheDay';
import { Theme } from '../../src/theme/theme';

const BaseScreenContainer = styled(View)<{ theme: Theme }>`
  flex: 1;
  width: 100%;
  /* Native styles can be added here if needed */
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
  position: 'absolute'; /* Always absolute for native overlay */
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
<<<<<<< HEAD
`;

=======
  ${Platform.OS === 'web' && `
    text-shadow: 0px 1px 6px rgba(0,0,0,0.9); /* Adjusted for better contrast */
  `}
`;

const webImageSource = Platform.OS === 'web'
  ? require('../../assets/images/webtest.webp')
  : require('../../assets/images/webtest.webp'); // Fallback for bundler, native uses AnimatedBackground

>>>>>>> 6782f209f2ec1abb8fff5d8bb212e5ef19bceef8
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  // Adjust paddingBottom for the tab bar height
  const tabBarHeight = Platform.OS === 'ios' ? 90 : 70; 

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