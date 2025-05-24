import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { AccessibilityInfo, ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Theme } from '../theme/theme';
import { Verse } from '../types/quran';
import PlatformSlider from './PlatformSlider';

interface VerseCardProps {
  verse: Verse;
  showTranslation?: boolean;
  isActive?: boolean;
  isPlaying?: boolean;
  isLoading?: boolean;
  isBuffering?: boolean;
  durationMillis?: number;
  positionMillis?: number;
  onPress?: (verseNumber: number) => void;
  onLongPress?: (verse: Verse) => void;
  onSeek?: (positionMillis: number) => void;
  onTogglePlayback?: (verseNumber: number) => void; // New prop for toggling playback
}

const CardContainer = styled(TouchableOpacity).attrs<{ 
  isActive?: boolean;
  isPlaying?: boolean;
}>(props => ({
  activeOpacity: props.onPress ? 0.7 : 1,
}))(({ theme, isActive, isPlaying }: { 
  theme: Theme; 
  isActive?: boolean;
  isPlaying?: boolean;
}) => ({
  borderRadius: theme.radii.md,
  padding: theme.spacing.md,
  marginBottom: theme.spacing.sm,
  flexDirection: 'column',
  borderWidth: isActive ? 2 : 1,
  borderColor: isActive 
    ? isPlaying 
      ? theme.colors.playingGreen // Use new theme color for playing state
      : theme.colors.desertHighlightGold 
    : 'rgba(255, 255, 255, 0.18)',
  overflow: 'hidden',
}));

const VerseContentRow = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  z-index: 1;
  background-color: transparent;
`;

const VerseNumberContainer = styled(View)<{ theme: Theme }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${({ theme }) => theme.colors.desertHighlightGold};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px; 
  z-index: 2; 
`;

const VerseNumberText = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.skyDeepBlue};
  font-family: ${({ theme }) => theme.typography.fonts.englishBold};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm}px;
`;

const TextContainer = styled(View)`
  flex: 1;
  background-color: transparent;
`;

const ArabicText = styled(Text)<{ theme: Theme }>`
  font-family: ${({ theme }) => theme.typography.fonts.arabicRegular};
  font-size: ${({ theme }) => theme.typography.fontSizes.arabicBody}px;
  color: ${({ theme }) => theme.colors.textArabic};
  text-align: right;
  writing-direction: rtl;
  line-height: ${({ theme }) => theme.typography.fontSizes.arabicBody * theme.typography.lineHeights.loose}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px; 
`;

const TranslationText = styled(Text)<{ theme: Theme }>`
  font-family: ${({ theme }) => theme.typography.fonts.englishRegular};
  font-size: ${({ theme }) => theme.typography.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.textEnglish};
  line-height: ${({ theme }) => theme.typography.fontSizes.md * theme.typography.lineHeights.normal}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px; 
  font-style: italic;
`;

const PlaybackContainer = styled(View)<{ theme: Theme }>`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  z-index: 1;
  background-color: transparent;
`;

const SliderContainer = styled(View)`
  width: 100%;
  height: 40px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const BufferingDisplayContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center; 
  height: 40px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px; 
`;

const BufferingDisplayText = styled(Text)<{ theme: Theme }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: ${({ theme }) => theme.spacing.sm}px; 
`;

const TimeText = styled(Text)<{ theme: Theme }>`
  font-family: ${({ theme }) => theme.typography.fonts.englishRegular};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xs}px; 
`;

const formatTime = (millis: number = 0): string => {
  const roundedMillis = Math.round(millis); // Ensure millis is an integer
  const totalSeconds = Math.floor(roundedMillis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 40,
  }
});

const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  showTranslation = false,
  isActive = false, 
  isPlaying = false,
  isLoading = false,
  isBuffering = false,    
  durationMillis = 0,
  positionMillis = 0,
  onPress,
  onLongPress,
  onSeek,
  onTogglePlayback,
}) => {
  const theme = useTheme();
  
  // Ensure millisecond values are integers before use
  const currentPositionMillis = Math.round(positionMillis);
  const currentDurationMillis = Math.round(durationMillis);

  const showPlaybackElements = isActive;

  useEffect(() => {
    if (isActive) {
      let message = '';
      if (isLoading) {
        message = `Loading audio for verse ${verse.numberInSurah}`;
      } else if (isBuffering) {
        message = `Buffering audio for verse ${verse.numberInSurah}`;
      } else if (isPlaying) {
        message = `Playing verse ${verse.numberInSurah}`;
      } else {
        // Only announce "paused" if it was previously playing or loading/buffering
        // This avoids announcing "paused" when a verse is just selected but not yet played.
        if (currentDurationMillis > 0) { // A simple check if audio has been interacted with
             message = `Paused at verse ${verse.numberInSurah}`;
        } else {
            message = `Verse ${verse.numberInSurah} selected`;
        }
      }
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [isActive, isPlaying, isLoading, isBuffering, verse.numberInSurah, currentDurationMillis]);

  const handleCardPress = () => {
    console.log(`[VerseCard] handleCardPress: verse ${verse.numberInSurah}, isActive: ${isActive}, isPlaying: ${isPlaying}`);
    if (isActive) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isActive) {
      console.log(`[VerseCard] Calling onTogglePlayback for verse ${verse.numberInSurah}`);
      onTogglePlayback && onTogglePlayback(verse.numberInSurah);
    } else {
      console.log(`[VerseCard] Calling onPress for verse ${verse.numberInSurah}`);
      onPress && onPress(verse.numberInSurah);
    }
  };

  return (
    <CardContainer
      onPress={handleCardPress}
      onLongPress={() => onLongPress && onLongPress(verse)}
      isActive={isActive}
      isPlaying={isPlaying}
      accessibilityRole="button"
      accessibilityLabel={`Verse ${verse.numberInSurah}${isActive ? (isPlaying ? ', playing' : ', paused') : ''}`}
      accessibilityHint={isActive ? "Double tap to toggle playback" : "Double tap to select this verse"}
      accessibilityState={{ 
        selected: isActive,
        busy: isLoading || isBuffering,
        checked: isPlaying // 'checked' can represent play/pause state for a toggle button
      }}
    >
      <BlurView
        style={[StyleSheet.absoluteFill, { borderRadius: theme.radii.md }]}
        tint="dark"
        intensity={Platform.OS === 'ios' ? 60 : 80}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isActive
              ? isPlaying
                ? 'rgba(35, 70, 55, 0.45)' // Greenish for playing
                : 'rgba(45, 35, 65, 0.45)' // Original purple for active/paused
              : 'rgba(25, 15, 45, 0.30)', // Original for inactive
            borderRadius: theme.radii.md,
          },
        ]}
      />
      <VerseContentRow>
        <VerseNumberContainer theme={theme}>
          <VerseNumberText theme={theme}>{verse.numberInSurah}</VerseNumberText>
        </VerseNumberContainer>
        <TextContainer>
          <ArabicText theme={theme}>{verse.text}</ArabicText>
          {showTranslation && verse.translation && (
            <TranslationText theme={theme}>{verse.translation}</TranslationText>
          )}
        </TextContainer>
      </VerseContentRow>
      
      {showPlaybackElements && (
        <PlaybackContainer
          theme={theme}
          accessibilityLabel={`Audio controls for verse ${verse.numberInSurah}`}
        >
          <SliderContainer>
            {isLoading || isBuffering ? (
              <BufferingDisplayContainer theme={theme}>
                <ActivityIndicator size="small" color={theme.colors.desertHighlightGold} />
                <BufferingDisplayText theme={theme}>
                  {isLoading ? "Loading..." : "Buffering..."}
                </BufferingDisplayText>
              </BufferingDisplayContainer>
            ) : (
              <PlatformSlider
                style={styles.slider}
                value={currentPositionMillis}
                minimumValue={0}
                maximumValue={Math.max(currentDurationMillis || 1, 1)} // Ensure maximumValue is at least 1
                onSlidingComplete={(value) => onSeek && onSeek(Math.round(value))} // Ensure seek value is rounded
                minimumTrackTintColor={theme.colors.desertHighlightGold}
                maximumTrackTintColor={theme.colors.textSecondary}
                thumbTintColor={theme.colors.desertHighlightGold}
                disabled={isLoading || isBuffering}
                accessibilityLabel={`Audio timeline, current position ${formatTime(currentPositionMillis)}`}
                accessibilityHint="Drag to seek through audio"
                accessibilityRole="adjustable" // Correct role for slider
                accessibilityValue={{ // Provide min, max, now, and text for screen readers
                  min: 0,
                  max: currentDurationMillis,
                  now: currentPositionMillis,
                  text: `${formatTime(currentPositionMillis)} of ${formatTime(currentDurationMillis)}`
                }}
              />
            )}
          </SliderContainer>
          <TimeText theme={theme}>
            {`${formatTime(currentPositionMillis)} / ${formatTime(currentDurationMillis)}`}
          </TimeText>
        </PlaybackContainer>
      )}
    </CardContainer>
  );
};

export default VerseCard;