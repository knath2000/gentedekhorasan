// app/(tabs)/bookmarks.tsx
import React from 'react';
import { Platform, Text, View } from 'react-native'; // Added Platform
import styled from 'styled-components/native';
import { Theme } from '../../src/theme/theme'; // Adjust path if necessary

const ScreenContainer = styled(View)<{ theme: Theme }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: transparent; /* Changed for floating tab bar */
  padding-bottom: ${Platform.OS === 'ios' ? 90 : 70}px; /* Added padding for floating tab bar */
`;

const ScreenText = styled(Text)<{ theme: Theme }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fonts.englishBold};
`;

export default function BookmarksScreen() {
  return (
    <ScreenContainer>
      <ScreenText>Bookmarks Screen</ScreenText>
    </ScreenContainer>
  );
}