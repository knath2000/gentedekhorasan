// app/(tabs)/settings.tsx
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Switch, Text, View } from 'react-native'; // Removed ImageBackground
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenBackground } from '../../src/components/ScreenBackground'; // Added ScreenBackground import
import { ThemeConsumer } from '../../src/components/ThemeProvider';
import { getAutoplayEnabled, setAutoplayEnabled as saveAutoplaySetting } from '../../src/services/settingsService';

export default function SettingsScreen() {
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

  return (
    <ThemeConsumer>
      {(theme) => (
        <ScreenBackground
          style={[
            styles.backgroundContainer, // Use a more generic name for the style on ScreenBackground
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            }
          ]}
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
        </ScreenBackground>
      )}
    </ThemeConsumer>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: { // Renamed from backgroundImage to be more generic for ScreenBackground
    flex: 1,
    width: '100%',
    // resizeMode is handled by ScreenBackground's internal ImageBackground
  },
  // imageStyle is no longer needed here as ScreenBackground handles its internal ImageBackground's imageStyle
  titleContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 20,
  },
  settingsSection: {
    padding: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 4,
  },
});