import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Theme } from '../theme/theme';
import { Surah } from '../types/quran';

interface SurahCardProps {
  surah: Surah;
  onPress: (surah: Surah) => void;
}

// Changed to object syntax for styles
const CardContainer = styled(TouchableOpacity)(({ theme }: { theme: Theme }) => ({
  // backgroundColor: theme.colors.cardBackground, // Removed for glassmorphism
  borderRadius: theme.radii.md, // RN handles unitless numbers for density
  padding: theme.spacing.md,
  marginBottom: theme.spacing.sm,
  flexDirection: 'row',
  alignItems: 'center',
  borderColor: 'rgba(255, 255, 255, 0.18)', // Subtle border for the glass edge
  borderWidth: 1, // Unitless
  overflow: 'hidden', // Important to clip BlurView to borderRadius
}));

const NumberContainer = styled(View)<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.colors.desertHighlightGold};
  border-radius: ${({ theme }) => theme.radii.full}px; /* Assuming full is a number */
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
  /* Ensure this is above the blur/overlay if it ever overlaps due to complex layouts */
  z-index: 1; 
`;

const NumberText = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.skyDeepBlue};
  font-family: ${({ theme }) => theme.typography.fonts.englishBold};
  font-size: ${({ theme }) => theme.typography.fontSizes.md}px;
`;

const ContentContainer = styled(View)`
  flex: 1;
  /* Ensure this is above the blur/overlay */
  z-index: 1; 
  background-color: transparent; /* Explicitly transparent */
`;

const ArabicName = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.textArabic};
  font-family: ${({ theme }) => theme.typography.fonts.arabicBold};
  font-size: ${({ theme }) => theme.typography.fontSizes.arabicHeading}px;
  text-align: right;
  writing-direction: rtl;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const EnglishName = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.textEnglish};
  font-family: ${({ theme }) => theme.typography.fonts.englishSemiBold};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg}px;
`;

const InfoText = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.typography.fonts.englishRegular};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const RevelationBadge = styled(View)<{ theme: Theme; type: 'Meccan' | 'Medinan' }>`
  background-color: ${({ theme, type }) => type === 'Meccan' ? theme.colors.accentRuby : theme.colors.accentEmerald};
  border-radius: ${({ theme }) => theme.radii.sm}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  align-self: flex-start;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  /* Ensure this is above the blur/overlay */
  z-index: 1; 
`;

const RevelationText = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.typography.fonts.englishMedium};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs}px;
`;

const SurahCard: React.FC<SurahCardProps> = ({ surah, onPress }) => {
  const theme = useTheme(); // Get theme for dynamic borderRadius

  return (
    <CardContainer onPress={() => onPress(surah)}>
      {Platform.OS !== 'web' && (
        <BlurView
          style={[StyleSheet.absoluteFill, { borderRadius: theme.radii.md }]}
          tint="dark"
          intensity={Platform.OS === 'ios' ? 60 : 80} // Slightly less intense for cards
        />
      )}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: Platform.OS === 'web'
              ? 'rgba(40, 25, 70, 0.65)' // Web fallback
              : 'rgba(25, 15, 45, 0.30)', // Native overlay
            borderRadius: theme.radii.md,
          },
        ]}
      />
      <NumberContainer>
        <NumberText>{surah.number}</NumberText>
      </NumberContainer>
      <ContentContainer>
        <ArabicName>{surah.name}</ArabicName>
        <EnglishName>{surah.englishName}</EnglishName>
        <InfoText>
          {surah.englishNameTranslation} • {surah.numberOfAyahs} Verses
        </InfoText>
        <RevelationBadge type={surah.revelationType}>
          <RevelationText>{surah.revelationType}</RevelationText>
        </RevelationBadge>
      </ContentContainer>
    </CardContainer>
  );
};

export default SurahCard;