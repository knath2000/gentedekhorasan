// src/services/settingsService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for settings
export const SETTINGS_KEYS = {
  AUTOPLAY_ENABLED: 'autoplayEnabled',
  SHOW_TRANSLATION: 'showTranslation',
  // Add other settings keys as needed
};

/**
 * Get the autoplay setting
 * @returns Promise<boolean> - Returns true if autoplay is enabled, false otherwise
 */
export const getAutoplayEnabled = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(SETTINGS_KEYS.AUTOPLAY_ENABLED);
    return value === 'true';
  } catch (error) {
    console.error('Error getting autoplay setting:', error);
    return false; // Default to false on error
  }
};

/**
 * Set the autoplay setting
 * @param enabled - Whether autoplay should be enabled
 * @returns Promise<void>
 */
export const setAutoplayEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEYS.AUTOPLAY_ENABLED, enabled.toString());
  } catch (error) {
    console.error('Error setting autoplay setting:', error);
    throw error; // Re-throw for handling by caller
  }
};

/**
 * Get all app settings
 * @returns Promise<{ [key: string]: any }> - Object containing all settings
 */
export const getAllSettings = async (): Promise<{ [key: string]: any }> => {
  try {
    const settings: { [key: string]: any } = {};

    // Get autoplay setting
    settings.autoplayEnabled = await getAutoplayEnabled();

    // Get other settings as needed
    const showTranslation = await AsyncStorage.getItem(SETTINGS_KEYS.SHOW_TRANSLATION);
    settings.showTranslation = showTranslation === 'true';

    return settings;
  } catch (error) {
    console.error('Error getting all settings:', error);
    return {
      autoplayEnabled: false,
      showTranslation: true, // Assuming default is true for translation
    }; // Default values on error
  }
};