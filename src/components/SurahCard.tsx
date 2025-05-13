import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { Theme } from '../theme/theme';
import { Surah } from '../types/quran';

interface SurahCardProps {
  surah: Surah;
  onPress: (surah: Surah) => void;
}

const CardContainer = styled(TouchableOpacity)<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.radii.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
`;

const NumberContainer = styled(View)<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.colors.desertHighlightGold};
  border-radius: ${({ theme }) => theme.radii.full}px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const NumberText = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.skyDeepBlue};
  font-family: ${({ theme }) => theme.typography.fonts.englishBold};
  font-size: ${({ theme }) => theme.typography.fontSizes.md}px;
`;

const ContentContainer = styled(View)`
  flex: 1;
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
`;

const RevelationText = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.typography.fonts.englishMedium};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs}px;
`;

const SurahCard: React.FC<SurahCardProps> = ({ surah, onPress }) => {
  return (
    <CardContainer onPress={() => onPress(surah)}>
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