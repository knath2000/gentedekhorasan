import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { fetchRandomVerse } from '../services/surahService'; // Assuming this function exists
import { Theme } from '../theme/theme';

interface DailyVerseProps { }

interface DailyVerseData {
  arabic: string;
  english: string;
  surahName: string;
  surahNumber: number;
  verseNumberInSurah: number;
}

const VerseCard = styled(View)<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.colors.skyPurple};
  border-radius: ${({ theme }) => theme.radii.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin: ${({ theme }) => theme.spacing.md}px;
`;

const ArabicText = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.textArabic};
  font-family: ${({ theme }) => theme.typography.fonts.arabicBold};
  font-size: ${({ theme }) => theme.typography.fontSizes.arabicHeading}px;
  text-align: center;
`;

const EnglishTranslation = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.textEnglish};
  font-family: ${({ theme }) => theme.typography.fonts.englishRegular};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const SourceText = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.typography.fonts.englishRegular};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm}px;
  text-align: right;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const DailyVerse: React.FC<DailyVerseProps> = () => {
  const [verse, setVerse] = useState<DailyVerseData>({
    arabic: 'Loading...',
    english: 'Loading...',
    surahName: 'Loading...',
    surahNumber: 0,
    verseNumberInSurah: 0,
  });

  useEffect(() => {
    const loadVerse = async () => {
      try {
        const randomVerse = await fetchRandomVerse();
        setVerse(randomVerse);
      } catch (error) {
        console.error("Error fetching random verse:", error);
        setVerse({
          arabic: 'Error loading verse.',
          english: 'Error loading verse.',
          surahName: 'Error loading verse.',
          surahNumber: 0,
          verseNumberInSurah: 0,
        });
      }
    };

    loadVerse();
  }, []);

  return (
    <VerseCard>
      <ArabicText>{verse.arabic}</ArabicText>
      <EnglishTranslation>{verse.english}</EnglishTranslation>
      <SourceText>{verse.surahName} ({verse.surahNumber}) : {verse.verseNumberInSurah}</SourceText>
    </VerseCard>
  );
};

export default DailyVerse;