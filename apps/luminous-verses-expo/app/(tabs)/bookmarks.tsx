// app/(tabs)/bookmarks.tsx
import { ImageBackground, Platform, StyleSheet, Text } from 'react-native'; // Removed View, Added ImageBackground
import styled from 'styled-components/native';
import { ScreenBackground } from '../../src/components/ScreenBackground'; // Added ScreenBackground import
import { Theme } from '../../src/theme/theme'; // Adjust path if necessary

const webImageSource = require('../../assets/images/webtest.webp');

// Removed ScreenContainer styled-component

const ScreenText = styled(Text)<{ theme: Theme }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fonts.englishBold};
`;

export default function BookmarksScreen() {
  if (Platform.OS === 'web') {
    return (
      <ImageBackground
        source={webImageSource}
        resizeMode="cover"
        style={[styles.container, { flex: 1, width: '100%' }]} // Ensure full coverage
      >
        <ScreenText>Bookmarks Screen</ScreenText>
      </ImageBackground>
    );
  }
  return ( // Native
    <ScreenBackground style={styles.container}>
      <ScreenText>Bookmarks Screen</ScreenText>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 90 : 70, // Added padding for floating tab bar
  },
});