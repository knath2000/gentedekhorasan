// app/(tabs)/bookmarks.tsx
import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native'; // Removed View
import styled from 'styled-components/native';
import { ScreenBackground } from '../../src/components/ScreenBackground'; // Added ScreenBackground import
import { Theme } from '../../src/theme/theme'; // Adjust path if necessary

// Removed ScreenContainer styled-component

const ScreenText = styled(Text)<{ theme: Theme }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fonts.englishBold};
`;

export default function BookmarksScreen() {
  return (
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