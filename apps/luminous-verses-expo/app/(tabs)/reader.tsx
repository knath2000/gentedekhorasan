import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Platform, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import AudioControlBar from '../../src/components/AudioControlBar'; // Re-added import
import { ScreenBackground } from '../../src/components/ScreenBackground';
import SurahHeader from '../../src/components/SurahHeader';
import VerseCard from '../../src/components/VerseCard';
import { useAudioPlayer } from '../../src/hooks/useAudioPlayer'; // Step 2: Import useAudioPlayer
import { getAutoplayEnabled, setAutoplayEnabled as saveAutoplaySetting } from '../../src/services/settingsService'; // Added saveAutoplaySetting
import { fetchSurahById, fetchVersesBySurahId } from '../../src/services/surahService';
import { Theme } from '../../src/theme/theme';
import { Surah, Verse } from '../../src/types/quran';

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
  const initialAyahNumber = params.ayahNumber ? Number(params.ayahNumber) : null;

  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();

  const componentUnmountingRef = useRef(false);
  const flatListRef = useRef<FlatList<Verse>>(null); 

  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;
  const MAIN_APP_TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 120 : 85;
  const AUDIO_CONTROLS_BAR_HEIGHT = theme.spacing.xxl * 1.5; 

  const [showTranslation, setShowTranslation] = useState(true);
  const [showAudioControls, setShowAudioControls] = useState(false);
  // Autoplay state is now managed by useQuranAudioPlayer, but we need to initialize it
  const [initialAutoplay, setInitialAutoplay] = useState(false); 
  const routerNavigation = useNavigation();
  
  const listContainerHeight = showAudioControls
    ? windowHeight - insets.top - insets.bottom - AUDIO_CONTROLS_BAR_HEIGHT
    : windowHeight - insets.top - insets.bottom - MAIN_APP_TAB_BAR_HEIGHT + theme.spacing.xl;

  // Step 2: Initialize useAudioPlayer directly
  const {
    activeVerseNumber, // This will be playingVerseNumber from useAudioPlayer
    isLoading: audioIsLoading,
    isPlaying: audioIsPlaying,
    isBuffering: audioIsBuffering,
    error: audioError,
    durationMillis,
    positionMillis,
    autoplayEnabled,
    toggleAudio, // This is the primary control function from useAudioPlayer
    stopAudio,
    seekAudio,
    // setAutoplayEnabled, // This will be handled by dispatching an action to useAudioPlayer if needed, or managed locally
    // resetActiveVerse, // Available from useAudioPlayer if needed
  } = useAudioPlayer(
    initialSurahId,
    surah?.numberOfAyahs || 0,
    initialAutoplay
  );

  // Step 2.1: Manage setAutoplayEnabled locally and sync with useAudioPlayer if it exposes a dispatcher or specific function
  // For now, we'll assume useAudioPlayer's initialAutoplayEnabled is sufficient and local state for settingsService
  const [localAutoplayEnabled, setLocalAutoplayEnabled] = useState(initialAutoplay);

  useEffect(() => {
    // If useAudioPlayer's autoplayEnabled state changes (e.g. due to end of surah), update local state
    // This depends on whether useAudioPlayer's autoplayEnabled is readable and reflects its internal state.
    // For now, we assume initialAutoplay sets it up.
    // If useAudioPlayer had a dispatch for 'SET_AUTOPLAY', we'd call it here.
    // This part might need refinement based on useAudioPlayer's exact API for updating autoplay.
  }, [autoplayEnabled]);


  useEffect(() => {
    componentUnmountingRef.current = false;
    return () => {
      componentUnmountingRef.current = true;
    };
  }, []);

  // Load initial settings (including autoplay for the hook)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedShowTranslation = await AsyncStorage.getItem('showTranslation');
        if (savedShowTranslation !== null) {
          setShowTranslation(savedShowTranslation === 'true');
        }
        const isAutoplayEnabled = await getAutoplayEnabled();
        setInitialAutoplay(isAutoplayEnabled); // Set initialAutoplay for the hook
        // The hook itself will manage the autoplayEnabled state internally after this
        console.log(`ReaderScreen: Loaded initial autoplay setting: ${isAutoplayEnabled}`);
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    };
    loadSettings();
  }, []);

  // Save translation setting
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

  // Load surah and verse data
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

        if (initialAyahNumber && versesData.length >= initialAyahNumber) {
          setTimeout(() => { 
            flatListRef.current?.scrollToIndex({ animated: true, index: initialAyahNumber - 1, viewPosition: 0.5 });
          }, 500);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        console.error("Error loading data for ReaderScreen:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [initialSurahId, initialAyahNumber]); 

  const prevInitialSurahIdRef = useRef<number | undefined>(undefined);

  // Stop audio if surah changes
  useEffect(() => {
    if (prevInitialSurahIdRef.current !== undefined && prevInitialSurahIdRef.current !== initialSurahId) {
      stopAudio(); 
      setShowAudioControls(false);
    }
    prevInitialSurahIdRef.current = initialSurahId;

    return () => {
      if (componentUnmountingRef.current) {
        stopAudio();
        setShowAudioControls(false);
      }
    };
  }, [initialSurahId, stopAudio]); 

  // Alert for audio errors
  useEffect(() => {
    if (audioError) {
      Alert.alert("Audio Error", audioError);
    }
  }, [audioError]);

  // Show/hide audio controls based on playback state
  useEffect(() => {
    if (activeVerseNumber !== null && audioIsPlaying) {
      setShowAudioControls(true);
    } else if (activeVerseNumber === null && !audioIsPlaying) {
      // If activeVerse is cleared (e.g. by stopAudio) and not playing, hide controls
      // setShowAudioControls(false); // This might be too aggressive, let stopAudio handle it.
    }
  }, [activeVerseNumber, audioIsPlaying]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/surahs');
    }
  };

  // Toggle translation and autoplay
  const handleSettingsPress = () => {
    // For this example, settings press will toggle autoplay.
    // Translation toggle can be a separate button or a more complex settings menu.
    const newAutoplayState = !localAutoplayEnabled; // Use localAutoplayEnabled for toggling
    setLocalAutoplayEnabled(newAutoplayState);
    // TODO: If useAudioPlayer has a way to update its internal autoplay state, call it here.
    // e.g., if useAudioPlayer returned a dispatch: dispatch({ type: 'SET_AUTOPLAY', enabled: newAutoplayState });
    // For now, this only affects the initialAutoplay passed to useAudioPlayer on mount/surah change.
    saveAutoplaySetting(newAutoplayState); // Persist setting
    Alert.alert("Autoplay", newAutoplayState ? "Enabled" : "Disabled");
    // setShowTranslation(prev => !prev); // If you want to keep translation toggle here
  };

  // Step 3: Control playback lifecycle explicitly
  const handleVersePress = useCallback((verseNumber: number) => {
    console.log(`[ReaderScreen] handleVersePress: verseNumber ${verseNumber}, current activeVerseNumber from useAudioPlayer: ${activeVerseNumber}, audioIsPlaying: ${audioIsPlaying}`);
    // toggleAudio from useAudioPlayer handles the logic of playing/pausing/resuming
    // It should internally wait for isLoaded before playing a new track.
    toggleAudio(verseNumber);
    // setShowAudioControls(true); // Show controls when a verse is pressed, hook manages active state
  }, [toggleAudio, activeVerseNumber, audioIsPlaying]);

  // Skip to next verse
  const handleSkipNextPress = useCallback(() => {
    // activeVerseNumber from useAudioPlayer reflects the currently *playing* or *last active* verse.
    if (activeVerseNumber !== 0 && surah && activeVerseNumber < surah.numberOfAyahs) { // activeVerseNumber from useAudioPlayer is 0 if nothing is active
      const nextVerseToPlay = activeVerseNumber + 1;
      console.log(`[ReaderScreen] handleSkipNextPress: playing next verse ${nextVerseToPlay}`);
      toggleAudio(nextVerseToPlay);
    } else if (activeVerseNumber !== 0 && surah && activeVerseNumber === surah.numberOfAyahs) {
      console.log(`[ReaderScreen] handleSkipNextPress: end of surah, stopping audio.`);
      stopAudio();
      setShowAudioControls(false);
    } else {
      console.log(`[ReaderScreen] handleSkipNextPress: No active verse or already at end. Active: ${activeVerseNumber}, Surah Ayahs: ${surah?.numberOfAyahs}`);
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
  } as const; 

  const hiddenTabBarStyle = {
    display: 'none',
  } as const; 

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

  // Handle stop button press from AudioControlBar
  const handleStopPress = useCallback(() => {
    stopAudio();
    setShowAudioControls(false);
  }, [stopAudio]);

  // Handle seek from VerseCard's slider
  const handleSeek = useCallback((positionMillis: number) => {
    seekAudio(positionMillis);
  }, [seekAudio]);

  if (loading) {
    return (
      <ScreenBackground>
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <StatusBar barStyle="light-content" />
          <LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.desertHighlightGold} />
          </LoadingContainer>
        </MainContainer>
      </ScreenBackground>
    );
  }

  if (error) {
    return (
      <ScreenBackground>
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <StatusBar barStyle="light-content" />
          {surah && <SurahHeader surah={surah} onBackPress={handleBackPress} onSettingsPress={handleSettingsPress} />}
          <LoadingContainer>
            <ErrorText>{error}</ErrorText>
          </LoadingContainer>
        </MainContainer>
      </ScreenBackground>
    );
  }

  if (!surah) {
    return (
      <ScreenBackground>
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <StatusBar barStyle="light-content" />
          <LoadingContainer>
            <ErrorText>Surah data could not be loaded.</ErrorText>
          </LoadingContainer>
        </MainContainer>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
        <StatusBar barStyle="light-content" />
        <View style={{ height: listContainerHeight }}>
          {verses.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={verses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <VerseCard
                  verse={item}
                  showTranslation={showTranslation}
                  isActive={item.numberInSurah === activeVerseNumber}
                  isPlaying={item.numberInSurah === activeVerseNumber && audioIsPlaying}
                  isLoading={item.numberInSurah === activeVerseNumber && audioIsLoading}
                  isBuffering={item.numberInSurah === activeVerseNumber && audioIsBuffering}
                  durationMillis={item.numberInSurah === activeVerseNumber ? durationMillis : 0}
                  positionMillis={item.numberInSurah === activeVerseNumber ? positionMillis : 0}
                  onPress={handleVersePress}
                  onSeek={handleSeek}
                  onTogglePlayback={handleVersePress} // Use the same handler for toggling
                />
              )}
              ListHeaderComponent={
                surah && <SurahHeader surah={surah} onBackPress={handleBackPress} onSettingsPress={handleSettingsPress} />
              }
              contentContainerStyle={{
                paddingHorizontal: theme.spacing.md,
                paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl * 2 : theme.spacing.xl,
              }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={21}
              initialNumToRender={10}
              getItemLayout={(data, index) => (
                { length: 150, offset: 150 * index, index }
              )}
            />
          ) : (
            <LoadingContainer>
              <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.englishRegular }}>
                {`Verses for Surah ${surah?.englishName || ''} are not available yet.`}
              </Text>
            </LoadingContainer>
          )}
        </View>
        {showAudioControls && surah && (
          <AudioControlBar
            isLoading={audioIsLoading}
            durationMillis={durationMillis}
            positionMillis={positionMillis}
            onSkipNext={handleSkipNextPress}
            onStop={handleStopPress}
          />
        )}
      </MainContainer>
    </ScreenBackground>
  );
}
