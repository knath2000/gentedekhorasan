import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { Theme } from '../theme/theme';
import { Surah } from '../types/quran';
// import { Ionicons } from '@expo/vector-icons'; // Assuming you might use icons

const HeaderContainer = styled(View)<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing.lg}px ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.sm}px;
  background-color: transparent; /* Or a gradient from the theme */
  border-bottom-left-radius: ${({ theme }) => theme.radii.lg}px;
  border-bottom-right-radius: ${({ theme }) => theme.radii.lg}px;
  align-items: center;
  /* Add shadow or elevation if needed */
`;

const TopRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const PlaceholderButton = styled(TouchableOpacity)`
  padding: ${({ theme }) => theme.spacing.sm}px;
`;

const PlaceholderIcon = styled(Text)<{ theme: Theme }>`
  font-size: 24px; /* Adjust as needed */
  color: ${({ theme }) => theme.colors.white};
`;


const SurahNameArabic = styled(Text)<{ theme: Theme }>`
  font-family: ${({ theme }) => theme.typography.fonts.arabicBold};
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl}px; /* Larger for header */
  color: ${({ theme }) => theme.colors.desertHighlightGold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const SurahNameEnglish = styled(Text)<{ theme: Theme }>`
  font-family: ${({ theme }) => theme.typography.fonts.englishBold};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl}px;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const SurahInfoText = styled(Text)<{ theme: Theme }>`
  font-family: ${({ theme }) => theme.typography.fonts.englishRegular};
  font-size: ${({ theme }) => theme.typography.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

interface SurahHeaderProps {
  surah: Surah | null; // Allow null for loading state
  onBackPress?: () => void;
  onSettingsPress?: () => void;
}

const SurahHeader: React.FC<SurahHeaderProps> = ({
  surah,
  onBackPress,
  onSettingsPress,
}) => {
  if (!surah) {
    return null; // Or a loading skeleton for the header
  }

  return (
    <HeaderContainer>
      {/* <TopRow>
        <PlaceholderButton onPress={onBackPress}>
          <PlaceholderIcon>{'<'}</PlaceholderIcon>
        </PlaceholderButton>
        <View />
        <PlaceholderButton onPress={onSettingsPress}>
          <PlaceholderIcon>{'⚙️'}</PlaceholderIcon>
        </PlaceholderButton>
      </TopRow> */}
      <SurahNameArabic>{surah.name}</SurahNameArabic>
      <SurahNameEnglish>{surah.englishName}</SurahNameEnglish>
      {/* <SurahInfoText>
        {surah.revelationType} • {surah.numberOfAyahs} Verses
      </SurahInfoText> */}
    </HeaderContainer>
  );
};

export default SurahHeader;