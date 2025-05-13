// app/(tabs)/settings.tsx
import React, { useEffect, useState } from 'react';
import { ImageBackground, Platform, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeConsumer } from '../../src/components/ThemeProvider';
import { getAutoplayEnabled, setAutoplayEnabled as saveAutoplaySetting } from '../../src/services/settingsService';

export default function SettingsScreen() {
  // Don't use any theme hooks directly in the component
  const insets = useSafeAreaInsets();
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const enabled = await getAutoplayEnabled();
        setAutoplayEnabled(enabled);
        console.log('SettingsScreen: Loaded autoplay setting:', enabled);
      } catch (e) {
        console.error('Error loading autoplay setting:', e);
      }
    }
    loadSettings();
  }, []);

  const handleAutoplayToggle = async (value: boolean) => {
    setAutoplayEnabled(value);
    try {
      await saveAutoplaySetting(value);
      console.log(`Settings: Autoplay ${value ? 'enabled' : 'disabled'}`);
    } catch (e) {
      console.error('Error saving autoplay setting:', e);
    }
  };

  // Use ThemeConsumer to safely access theme
  return (
    <ThemeConsumer>
      {(theme) => ( // theme object is now available here
        <ImageBackground
          source={require('../../assets/images/iOSbackground.png')} // Using consistent background for now
          style={[
            styles.backgroundImage, // Changed from container to backgroundImage
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom, // Adjusted for safe area
              paddingLeft: insets.left,
              paddingRight: insets.right,
            }
          ]}
          imageStyle={styles.imageStyle} // Ensures image covers full background
        >
          <View style={styles.titleContainer}>
            <Text style={[styles.screenTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.englishBold }]}>
              Settings
            </Text>
          </View>

          <View style={[styles.settingsSection, { backgroundColor: theme.colors.cardBackground, borderRadius: theme.radii.md }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.desertHighlightGold, fontFamily: theme.typography.fonts.englishBold }]}>
              Playback Options
            </Text>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.englishRegular }]}>
                  Autoplay Verses
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.englishRegular }]}>
                  Automatically play the next verse after the current one finishes
                </Text>
              </View>
              <Switch
                value={autoplayEnabled}
                onValueChange={handleAutoplayToggle}
                trackColor={{ false: theme.colors.textSecondary || '#767577', true: theme.colors.desertHighlightGold }}
                thumbColor={Platform.OS === 'ios' ? undefined : autoplayEnabled ? theme.colors.desertSandGold : theme.colors.white}
                ios_backgroundColor={theme.colors.textSecondary || '#767577'}
              />
            </View>
          </View>
        </ImageBackground>
      )}
    </ThemeConsumer>
  );
}

// Use regular StyleSheet instead of styled-components to avoid CSS issues
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  imageStyle: { // Style for the actual image within ImageBackground
    resizeMode: 'cover',
  },
  titleContainer: { // Container to center title and add padding
    alignItems: 'center',
    marginTop: 24, // From theme.spacing.lg
    marginBottom: 24, // From theme.spacing.lg
  },
  screenTitle: {
    fontSize: 20, // From theme.typography.fontSizes.xl
    // fontFamily and color are set inline using theme
  },
  settingsSection: {
    // backgroundColor and borderRadius are set inline using theme
    padding: 16, // From theme.spacing.md
    marginHorizontal: 16, // To make it 90% width-like with padding
    // width: '90%', // Not needed if using marginHorizontal
  },
  sectionTitle: {
    fontSize: 18, // From theme.typography.fontSizes.lg
    // fontFamily and color are set inline using theme
    marginBottom: 16, // From theme.spacing.md
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8, // From theme.spacing.sm
  },
  settingLabelContainer: {
    flex: 1,
    marginRight: 16, // From theme.spacing.md
  },
  settingLabel: {
    fontSize: 16, // From theme.typography.fontSizes.md
    // fontFamily and color are set inline using theme
  },
  settingDescription: {
    fontSize: 14, // From theme.typography.fontSizes.sm
    // fontFamily and color are set inline using theme
    marginTop: 4, // From theme.spacing.xs
  },
});