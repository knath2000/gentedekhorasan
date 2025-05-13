import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Theme } from '../theme/theme';
import { Verse } from '../types/quran';
import PlatformSlider from './PlatformSlider';

interface VerseCardProps {
  verse: Verse;
  showTranslation?: boolean;
  isActive?: boolean;         // This prop indicates if the card is the "active" one
  isAudioPlaying?: boolean;   // Is audio currently playing for THIS verse
  isLoadingAudio?: boolean;   // Is audio currently loading for THIS verse
  isBuffering?: boolean;      // Is audio currently buffering for THIS verse
  durationMillis?: number;    
  positionMillis?: number;    
  onPress?: (verse: Verse) => void;
  onLongPress?: (verse: Verse) => void;
  // onSeek is now handled internally by this component if it has the slider
}

const CardContainer = styled(TouchableOpacity).attrs<{ theme: Theme }>(props => ({
  activeOpacity: props.onPress ? 0.7 : 1,
}))<{ theme: Theme; isActive?: boolean }>`
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.skyIndigo : theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.radii.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-width: ${({ isActive }) => (isActive ? '2px' : '0px')};
  border-color: ${({ theme, isActive }) => (isActive ? theme.colors.desertHighlightGold : 'transparent')};
`;

const VerseContent = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  /* margin-bottom is removed as slider will be below if active */
`;

const VerseNumberContainer = styled(View)<{ theme: Theme }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${({ theme }) => theme.colors.desertHighlightGold};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const VerseNumberText = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.skyDeepBlue};
  font-family: ${({ theme }) => theme.typography.fonts.englishBold};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm}px;
`;

const TextContainer = styled(View)`
  flex: 1;
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

// Styles for the playback elements now within VerseCard
const PlaybackContainer = styled(View)<{ theme: Theme }>`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const SliderContainer = styled(View)`
  /* Styles for the slider's container if needed, e.g., padding */
`;

const BufferingDisplayContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center; /* Center buffering text/spinner */
  height: 40px; /* Approx height of slider for consistent layout */
  margin-bottom: ${({ theme }) => theme.spacing.xs}px; /* Space before time text */
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

// Removed PlaybackStatusContainer, PlayingContainer, PlayingIndicator, BufferingContainer, BufferingText
// as their logic is now integrated into PlaybackContainer or handled differently.

const formatTime = (millis: number = 0): string => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  showTranslation = false,
  isActive = false, 
  isAudioPlaying = false,
  isLoadingAudio = false, 
  isBuffering = false,    
  durationMillis = 0,
  positionMillis = 0,
  onPress,
  onLongPress,
  // onSeek is no longer a prop, handled internally
}) => {
  const theme = useTheme();

  const handleInternalSeek = (value: number) => {
    // If ReaderScreen needs to know about seek completion, a new prop could be added.
    // For now, this is internal to the card's slider.
    console.log(`VerseCard: Seek complete for verse ${verse.id} to ${value}`);
    // Potentially call a global seek function if needed:
    // globalSeekFunction(verse.surahId, verse.numberInSurah, value);
  };
  
  // isCurrentPlaying in the plan is equivalent to isActive here for showing controls
  const showPlaybackElements = isActive; 

  return (
    <CardContainer
      onPress={() => onPress && onPress(verse)}
      onLongPress={() => onLongPress && onLongPress(verse)}
      isActive={isActive} 
    >
      <VerseContent theme={theme}>
        <VerseNumberContainer>
          <VerseNumberText>{verse.numberInSurah}</VerseNumberText>
        </VerseNumberContainer>
        <TextContainer>
          <ArabicText>{verse.text}</ArabicText>
          {showTranslation && verse.translation && (
            <TranslationText>{verse.translation}</TranslationText>
          )}
        </TextContainer>
      </VerseContent>
      
      {/* Plan Step 2: Playback elements (slider, buffering) moved into VerseCard */}
      {showPlaybackElements && (
        <PlaybackContainer theme={theme}>
          <SliderContainer>
            {/* Show slider when playing/paused, or buffering text during initial load/buffering */}
            {isLoadingAudio ? ( // Simplified: Only show buffering indicator during initial load
              <BufferingDisplayContainer theme={theme}>
                <ActivityIndicator size="small" color={theme.colors.desertHighlightGold} />
                <BufferingDisplayText theme={theme}>Buffering...</BufferingDisplayText>
              </BufferingDisplayContainer>
            ) : (
              <PlatformSlider
                style={{ width: '100%', height: 40 }} 
                value={positionMillis}
                minimumValue={0}
                maximumValue={Math.max(durationMillis || 1, 1)}
                onSlidingComplete={handleInternalSeek} // Use internal or pass up if needed
                minimumTrackTintColor={theme.colors.desertHighlightGold} // Plan uses theme.colors.primary
                maximumTrackTintColor={theme.colors.textSecondary} // Plan uses theme.colors.grey
                thumbTintColor={theme.colors.desertHighlightGold}    // Plan uses theme.colors.primary
                disabled={isLoadingAudio || isBuffering} // Disable slider if loading or buffering
              />
            )}
          </SliderContainer>
          <TimeText theme={theme}>
            {`${formatTime(positionMillis)} / ${formatTime(durationMillis)}`}
          </TimeText>
        </PlaybackContainer>
      )}
    </CardContainer>
  );
};

export default VerseCard;