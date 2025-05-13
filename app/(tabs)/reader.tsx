import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, ImageBackground, Platform, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import AudioControlBar from '../../src/components/AudioControlBar';
import SurahHeader from '../../src/components/SurahHeader';
import VerseCard from '../../src/components/VerseCard';
import { useAudioPlayer } from '../../src/hooks/useAudioPlayer';
import { getAutoplayEnabled } from '../../src/services/settingsService';
import { fetchSurahById, fetchVersesBySurahId } from '../../src/services/surahService';
import { Theme } from '../../src/theme/theme';
import { Surah, Verse } from '../../src/types/quran';

const backgroundImageSource = require('../../assets/images/iOSbackground.png');

const BackgroundImage = styled(ImageBackground)<{ theme: Theme }>`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background}; /* Fallback */
`;

const LoadingContainer = styled(View)<{ theme: Theme }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const ErrorText = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSizes.md}px;
  text-align: center;
  font-family: ${({ theme }) => theme.typography.fonts.englishRegular};
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const MainContainer = styled(View)<{ pt: number; pl: number; pr: number }>`
  flex: 1;
  padding-top: ${({ pt }) => pt}px;
  padding-left: ${({ pl }) => pl}px;
  padding-right: ${({ pr }) => pr}px;
`;

export default function ReaderScreen() {
  const params = useLocalSearchParams();
  const initialSurahId = params.surahId ? Number(params.surahId) : 1;

  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();

  const componentUnmountingRef = useRef(false);
  const manuallyStoppedRef = useRef(false);

  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;
  const MAIN_APP_TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 120 : 85;
  // AudioControlBar height might change with new design, adjust if necessary
  const AUDIO_CONTROLS_BAR_HEIGHT = theme.spacing.xxl * 1.5; 

  const [showTranslation, setShowTranslation] = useState(true);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);
  const routerNavigation = useNavigation();
  
  const listContainerHeight = showAudioControls
    ? windowHeight - insets.top - insets.bottom - AUDIO_CONTROLS_BAR_HEIGHT
    : windowHeight - insets.top - insets.bottom - MAIN_APP_TAB_BAR_HEIGHT + theme.spacing.xl;

  const {
    playingVerseNumber,
    activeVerseNumber, // Directly use activeVerseNumber from the hook
    isLoading: audioLoading,
    error: audioError,
    isPlaying: isAudioPlaying,
    durationMillis,
    positionMillis,
    isBuffering, // Keep for VerseCard
    toggleAudio,
    stopAudio,
    resetActiveVerse,
    // seekAudio, // Available if needed
  } = useAudioPlayer(initialSurahId, surah?.numberOfAyahs || 0, autoplayEnabled);

  useEffect(() => {
    return () => {
      componentUnmountingRef.current = true;
    };
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedShowTranslation = await AsyncStorage.getItem('showTranslation');
        if (savedShowTranslation !== null) {
          setShowTranslation(savedShowTranslation === 'true');
        }
        const isAutoplayEnabled = await getAutoplayEnabled();
        setAutoplayEnabled(isAutoplayEnabled);
        console.log(`ReaderScreen: Loaded autoplay setting: ${isAutoplayEnabled}`);
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('showTranslation', showTranslation.toString());
      } catch (e) {
        console.error('Error saving translation settings:', e);
      }
    };
    saveSettings();
  }, [showTranslation]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const surahData = await fetchSurahById(initialSurahId);
        if (!surahData) {
          throw new Error(`Surah with ID ${initialSurahId} not found.`);
        }
        setSurah(surahData);
        const versesData = await fetchVersesBySurahId(initialSurahId);
        setVerses(versesData);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        console.error("Error loading data for ReaderScreen:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [initialSurahId]);

  useEffect(() => {
    return () => {
      if (componentUnmountingRef.current) {
        console.log('ReaderScreen: Component unmounting, calling stopAudio.');
        stopAudio();
      } else if (!manuallyStoppedRef.current) {
         console.log("ReaderScreen: Effect cleanup for initialSurahId change (not unmount), calling stopAudio.");
         stopAudio();
      } else {
        console.log("ReaderScreen: Effect cleanup called but not unmounting and manually stopped - skipping audio cleanup.");
      }
    };
  }, [initialSurahId, stopAudio]); // Added stopAudio to dependencies

  useEffect(() => {
    if (audioError) {
      Alert.alert("Audio Error", audioError);
    }
  }, [audioError]);

  // Removed useEffect that synced hookActiveVerseNumber to local activeVerseNumber

  useEffect(() => {
    // activeVerseNumber from the hook now drives UI for showing controls if a verse is active/playing
    if (activeVerseNumber > 0 && isAudioPlaying) {
      setShowAudioControls(true);
    }
    // setShowAudioControls(false) is handled by handleStopPress
  }, [playingVerseNumber, isAudioPlaying]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/surahs');
    }
  };

  const handleSettingsPress = () => {
    setShowTranslation(prev => !prev);
  };

  const handleVersePress = useCallback((verse: Verse) => {
    const verseNumber = verse.numberInSurah;
    manuallyStoppedRef.current = false;
    setShowAudioControls(true); 
    toggleAudio(verseNumber);
  }, [toggleAudio]);

  const handlePlayPausePress = useCallback(() => {
    if (activeVerseNumber > 0) {
      toggleAudio(activeVerseNumber);
    }
  }, [toggleAudio, activeVerseNumber]);

  const handleSkipNextPress = useCallback(() => {
    // This logic assumes that if audio is playing, it's for activeVerseNumber.
    // And if not playing, it will start the next one.
    // Or if playing, it will stop current and play next.
    // The useAudioPlayer hook should handle the "stop current and play next" internally if needed.
    if (activeVerseNumber > 0 && surah && activeVerseNumber < surah.numberOfAyahs) {
      const nextVerseToPlay = activeVerseNumber + 1;
      console.log(`ReaderScreen: Skip next pressed. Current active: ${activeVerseNumber}, attempting to play: ${nextVerseToPlay}`);
      manuallyStoppedRef.current = false; // Allow autoplay to potentially continue after this manual skip if enabled
      toggleAudio(nextVerseToPlay); // toggleAudio will handle stopping current and playing next, hook will update activeVerseNumber
      // setActiveVerseNumber(nextVerseToPlay); // No longer needed, hook updates activeVerseNumber
      setShowAudioControls(true);
    } else {
      console.log("ReaderScreen: Skip next pressed, but no active verse or at end of surah.");
      // Optionally stop audio if at the end
      if (surah && activeVerseNumber === surah.numberOfAyahs) {
        stopAudio();
        setShowAudioControls(false);
      }
    }
  }, [activeVerseNumber, surah, toggleAudio, stopAudio]);


  const defaultTabBarStyle = {
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  };

  const hiddenTabBarStyle = {
    display: 'none',
  };

  useEffect(() => {
    if (showAudioControls) {
      routerNavigation.setOptions({ tabBarStyle: hiddenTabBarStyle });
    } else {
      routerNavigation.setOptions({ tabBarStyle: defaultTabBarStyle });
    }
    return () => {
      routerNavigation.setOptions({ tabBarStyle: defaultTabBarStyle });
    };
  }, [showAudioControls, routerNavigation, defaultTabBarStyle, hiddenTabBarStyle]);

  const handleStopPress = useCallback(() => {
    manuallyStoppedRef.current = true;
    stopAudio();
    setShowAudioControls(false);
    // setActiveVerseNumber(0); // No longer needed, hook's activeVerseNumber will become 0
    resetActiveVerse(); // Call hook's reset function
  }, [stopAudio, resetActiveVerse]);

  if (loading) {
    return (
      <BackgroundImage source={backgroundImageSource} resizeMode="cover">
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <StatusBar barStyle="light-content" />
          <LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.desertHighlightGold} />
          </LoadingContainer>
        </MainContainer>
      </BackgroundImage>
    );
  }

  if (error) {
    return (
      <BackgroundImage source={backgroundImageSource} resizeMode="cover">
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <StatusBar barStyle="light-content" />
          {surah && <SurahHeader surah={surah} onBackPress={handleBackPress} onSettingsPress={handleSettingsPress} />}
          <LoadingContainer>
            <ErrorText>{error}</ErrorText>
          </LoadingContainer>
        </MainContainer>
      </BackgroundImage>
    );
  }

  if (!surah) {
    return (
      <BackgroundImage source={backgroundImageSource} resizeMode="cover">
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <StatusBar barStyle="light-content" />
          <LoadingContainer>
            <ErrorText>Surah data could not be loaded.</ErrorText>
          </LoadingContainer>
        </MainContainer>
      </BackgroundImage>
    );
  }

  return (
    <BackgroundImage source={backgroundImageSource} resizeMode="cover">
      <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
        <StatusBar barStyle="light-content" />
        <View style={{ height: listContainerHeight }}>
          {verses.length > 0 ? (
            <FlatList
              data={verses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <VerseCard
                  verse={item}
                  showTranslation={showTranslation}
                  isActive={item.numberInSurah === activeVerseNumber}
                  // Props for VerseCard's internal slider and status indicators
                  // Use activeVerseNumber directly from the hook
                  isAudioPlaying={item.numberInSurah === activeVerseNumber && isAudioPlaying}
                  isLoadingAudio={item.numberInSurah === activeVerseNumber && audioLoading}
                  isBuffering={item.numberInSurah === activeVerseNumber && isBuffering}
                  durationMillis={item.numberInSurah === activeVerseNumber ? durationMillis : 0}
                  positionMillis={item.numberInSurah === activeVerseNumber ? positionMillis : 0}
                  onPress={handleVersePress}
                  // onSeek prop is now handled by VerseCard internally if it has a slider
                />
              )}
              ListHeaderComponent={
                <SurahHeader surah={surah} onBackPress={handleBackPress} onSettingsPress={handleSettingsPress} />
              }
              contentContainerStyle={{
                paddingHorizontal: theme.spacing.md,
                paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl * 2 : theme.spacing.xl,
              }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={21}
              initialNumToRender={10}
            />
          ) : (
            <LoadingContainer>
              <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.englishRegular }}>
                {`Verses for Surah ${surah.englishName} are not available yet.`}
              </Text>
            </LoadingContainer>
          )}
        </View>
        {showAudioControls && surah && (
          <AudioControlBar
            // Updated props for AudioControlBar
            isLoading={audioLoading}
            durationMillis={durationMillis} // Still needed for time display
            positionMillis={positionMillis} // Still needed for time display
            onSkipNext={handleSkipNextPress}
            onStop={handleStopPress} // Pass the correct stop handler
            // isPlaying, onPlayPause, autoplayEnabled removed
          />
        )}
      </MainContainer>
    </BackgroundImage>
  );
}
