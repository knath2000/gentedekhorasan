// src/components/AudioControlBar.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Removed Platform
import { Theme } from '../theme/theme';
import { ThemeConsumer } from './ThemeProvider';

interface AudioControlBarProps {
  isLoading: boolean;
  durationMillis: number;
  positionMillis: number;
  onSkipNext?: () => void; // Skip button remains optional
  onStop: () => void; // Stop button is now the primary action, make required
  // isPlaying, onPlayPause, autoplayEnabled removed as they are no longer used here
}

const AudioControlBar: React.FC<AudioControlBarProps> = ({
  isLoading,
  durationMillis,
  positionMillis,
  onSkipNext,
  onStop, // Use onStop prop
}) => {
  const formatTime = (millis: number): string => {
    if (isNaN(millis) || millis < 0) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <ThemeConsumer>
      {(theme: Theme) => (
        // Main container style updated as per plan
        <View style={[styles.container, { backgroundColor: theme.colors.cardBackground /* Or a specific bar background */, borderRadius: theme.radii.md }]} >
          <View style={styles.controlsContainer}>
            {/* Stop Button */}
            <TouchableOpacity
              disabled={isLoading} // Keep disabled state based on loading
              onPress={onStop} // Use the onStop prop
              style={styles.stopButton} // Use a new style name for clarity
            >
              {/* Always show stop icon, ActivityIndicator removed as stop should always be possible */}
              <Ionicons
                name="stop-circle-outline" // Use a stop icon
                size={28} // Slightly larger for primary action
                color={theme.colors.desertHighlightGold}
              />
            </TouchableOpacity>
            
            {/* Skip Button - Plan Step 1 */}
            {onSkipNext && ( // Conditionally render if prop is provided
              <TouchableOpacity
                disabled={isLoading}
                onPress={onSkipNext}
                style={styles.skipButton}
              >
                <Ionicons
                  name="play-skip-forward"
                  size={24} // Plan uses 24
                  color={theme.colors.desertHighlightGold} // Plan uses theme.colors.primary
                />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Time Display - Simple text without slider - Plan Step 1 */}
          <Text style={[styles.timeText, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.englishRegular }]} >
            {formatTime(positionMillis)} / {formatTime(durationMillis || 0)}
          </Text>
        </View>
      )}
    </ThemeConsumer>
  );
};

// Styles updated as per plan
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // To space out controls and time
    paddingVertical: 10, // Plan uses 10
    paddingHorizontal: 16, // Added some horizontal padding
    // backgroundColor: 'rgba(0, 0, 0, 0.2)', // From plan, but using theme.colors.cardBackground
    // borderRadius: 10, // From plan, but using theme.radii.md
    marginVertical: 8, 
    marginHorizontal: 16, // To give some space around the bar
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopButton: { // Renamed from playButton
    padding: 10,
    marginRight: 15,
  },
  skipButton: { // Plan Step 1
    padding: 10, // Plan uses 10
  },
  timeText: { // Plan Step 1
    fontSize: 14, // Plan uses 14
    // color and fontFamily are set inline using theme
  }
});

export default AudioControlBar;