import { Ionicons } from '@expo/vector-icons'; // For share icon
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur'; // Added BlurView import
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Share, StyleSheet, View } from 'react-native'; // Added View, StyleSheet, Platform
import styled, { useTheme } from 'styled-components/native';
import { fetchRandomVerse } from '../services/surahService';
import { Theme } from '../theme/theme'; // Assuming Theme type is correctly defined here

// Aligned with DailyVerse from surahService.ts, plus fullReference
interface DisplayVerse {
  surahName: string;
  surahNumber: number;
  verseNumberInSurah: number;
  arabic: string;
  english: string;
  fullReference: string;
}

const CACHE_KEY = 'verseOfTheDay';
const CACHE_TIMESTAMP_KEY = 'verseOfTheDayTimestamp';

// Explicitly typing theme prop
const VerseOfTheDayContainer = styled(View)(({ theme }: { theme: Theme }) => ({
  // backgroundColor: theme.colors.cardBackground, // Removed for glassmorphism
  padding: 20, // Unitless (React Native handles density)
  borderRadius: 15, // Unitless
  margin: 20, // Unitless
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 }, // Object with unitless numbers
  shadowOpacity: 0.1, // Unitless (0 to 1)
  shadowRadius: 5, // Unitless
  elevation: 3, // Unitless (Android specific)
  borderColor: 'rgba(255, 255, 255, 0.18)', // Subtle border for the glass edge
  borderWidth: 1, // Unitless
  overflow: 'hidden', // Important to clip BlurView to borderRadius
  minHeight: 150, // Reserve space to reduce CLS
}));

const TitleText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg}px;
  font-family: ${({ theme }) => theme.typography.fonts.englishBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 15px;
  text-align: center;
`;

const ArabicText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSizes.arabicBody}px;
  font-family: ${({ theme }) => theme.typography.fonts.arabicRegular};
  color: ${({ theme }) => theme.colors.textArabic};
  text-align: right;
  margin-bottom: 10px;
  line-height: ${({ theme }) => theme.typography.fontSizes.arabicBody * 1.6}px;
`;

const TranslationText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSizes.md}px;
  font-family: ${({ theme }) => theme.typography.fonts.englishRegular};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 10px;
  line-height: ${({ theme }) => theme.typography.fontSizes.md * 1.5}px;
`;

const ReferenceText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm}px;
  font-family: ${({ theme }) => theme.typography.fonts.englishMedium};
  color: ${({ theme }) => theme.colors.accentSapphire}; /* Using accentSapphire as textAccent */
  text-align: center;
  margin-top: 10px;
`;

const ShareButtonContainer = styled.View`
  align-items: flex-end;
  margin-top: 15px;
`;

const ShareButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.buttonPrimaryBackground};
  border-radius: 20px;
`;

const ShareButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm}px;
  font-family: ${({ theme }) => theme.typography.fonts.englishSemiBold};
  color: ${({ theme }) => theme.colors.buttonPrimaryText}; 
  margin-left: 8px; /* This one had px, keeping it as it might be intentional or a specific case */
`;

const LoadingContainer = styled.View`
  justify-content: center;
  align-items: center;
  min-height: 150px; /* React Native typically uses unitless numbers for height/width too */
  background-color: transparent; /* Ensure it doesn't obscure blur */
`;

const ErrorTextStyled = styled.Text` /* Renamed to avoid conflict with RN ErrorText if ever imported */
  font-size: ${({ theme }) => theme.typography.fontSizes.md}px; /* Re-adding px as per request */
  font-family: ${({ theme }) => theme.typography.fonts.englishRegular};
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  background-color: transparent; /* Ensure it doesn't obscure blur */
`;


const VerseOfTheDay: React.FC = () => {
  const [verse, setVerse] = useState<DisplayVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const getVerse = async () => {
      console.log('[VerseOfTheDay] useEffect: getVerse initiated.');
      setLoading(true);
      setError(null);
      try {
        const today = new Date().toDateString();
        const cachedTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
        console.log(`[VerseOfTheDay] Today: ${today}, Cached Timestamp: ${cachedTimestamp}`);
        
        if (cachedTimestamp === today) {
          const cachedVerseData = await AsyncStorage.getItem(CACHE_KEY);
          if (cachedVerseData) {
            console.log('[VerseOfTheDay] Found cached verse for today. Using cache.');
            setVerse(JSON.parse(cachedVerseData));
            setLoading(false);
            return;
          }
          console.log('[VerseOfTheDay] Timestamp matches today, but no cached verse data found.');
        } else {
          console.log('[VerseOfTheDay] No valid cache for today. Fetching new verse.');
        }

        const fetchedVerse = await fetchRandomVerse();
        console.log('[VerseOfTheDay] useEffect: fetchRandomVerse returned:', JSON.stringify(fetchedVerse));

        if (fetchedVerse && fetchedVerse.surahNumber !== 0 && fetchedVerse.arabic !== 'Error loading verse text.' && fetchedVerse.arabic !== 'Error loading verse.') {
          console.log('[VerseOfTheDay] Fetched verse is valid. Setting state and cache.');
          const displayVerseData: DisplayVerse = {
            surahName: fetchedVerse.surahName,
            surahNumber: fetchedVerse.surahNumber,
            verseNumberInSurah: fetchedVerse.verseNumberInSurah,
            arabic: fetchedVerse.arabic,
            english: fetchedVerse.english,
            fullReference: `Surah ${fetchedVerse.surahName} (${fetchedVerse.surahNumber}:${fetchedVerse.verseNumberInSurah})`,
          };
          setVerse(displayVerseData);
          console.log('[VerseOfTheDay] Successfully fetched and processed new verse. Caching it.');
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(displayVerseData));
          await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, today);
        } else {
          console.warn('[VerseOfTheDay] Fetched verse is considered invalid or an error object. Setting error state and clearing cache for today.', fetchedVerse);
          setError(fetchedVerse?.english || 'Could not fetch a verse. Please try again later.');
          // Clear potentially bad cache for today to allow re-fetch on next load today
          await AsyncStorage.removeItem(CACHE_KEY);
          // Optionally, also remove the timestamp to force a full fetch next time,
          // or leave it so it knows it tried and failed for today.
          // For now, let's remove the verse data but keep the timestamp to avoid constant refetching on error.
          // If we want to retry every time the component loads after an error for "today", remove timestamp too:
          // await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY);
        }
      } catch (e: any) {
        console.error('[VerseOfTheDay] useEffect: catch block error during fetch/processing:', e.message, e.stack);
        setError('An error occurred while fetching the verse.');
        // Do not fall back to potentially stale/error cache if a new fetch fails.
        // Let the error state render. Clear today's cache.
        await AsyncStorage.removeItem(CACHE_KEY);
        // await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY); // To force refetch on next open today
      } finally {
        setLoading(false);
      }
    };

    getVerse();
  }, []);

  const onShare = async () => {
    if (!verse) return;
    try {
      const result = await Share.share({
        message: `"${verse.arabic}"\n\n"${verse.english}"\n\n- ${verse.fullReference}\n\nShared from Luminous Verses App`,
      });
      // Optional: handle result.action
    } catch (error: any) {
      Alert.alert('Share Error', error.message);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.buttonPrimaryBackground} />
        </LoadingContainer>
      );
    }

    if (error && !verse) {
      return <ErrorTextStyled>{error}</ErrorTextStyled>;
    }
    
    if (!verse) {
      return <ErrorTextStyled>No verse available at the moment.</ErrorTextStyled>;
    }

    return (
      <>
        <TitleText>Verse of the Day</TitleText>
        <ArabicText>{verse.arabic}</ArabicText>
        <TranslationText>{verse.english}</TranslationText>
        <ReferenceText>{verse.fullReference}</ReferenceText>
        <ShareButtonContainer>
          <ShareButton onPress={onShare}>
            <Ionicons name="share-social-outline" size={20} color={theme.colors.buttonPrimaryText} />
            <ShareButtonText>Share</ShareButtonText>
          </ShareButton>
        </ShareButtonContainer>
      </>
    );
  };

  return (
    <VerseOfTheDayContainer>
      <BlurView
        style={[StyleSheet.absoluteFill, { borderRadius: 15 /* Match container */ }]}
        tint="dark" // 'light', 'dark', 'default' (iOS), or 'regular', 'prominent' (iOS 13+)
        intensity={Platform.OS === 'ios' ? 70 : 90} // Adjust intensity per platform if needed
      />
      {/* Optional: A semi-transparent overlay for a more pronounced effect */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(25, 15, 45, 0.35)', // Slightly darker tint for native blur
            borderRadius: 15
          }
        ]}
      />
      {renderContent()}
    </VerseOfTheDayContainer>
  );
};

export default VerseOfTheDay;