// src/theme/theme.ts

// Color Palette: Desert Oasis at Night
// Deep blues, purples for the night sky
// Sandy golds, warm oranges for desert glows
// Jewel-like colors for interactive elements

export const colors = {
  // Night Sky
  skyDeepBlue: '#0B0724', // Very dark, almost black blue
  skyPurple: '#2C1D5D', // Deep purple
  skyIndigo: '#4A3F8E', // Lighter indigo for gradients

  // Desert Glows
  desertSandGold: '#D4A373', // Sandy gold
  desertWarmOrange: '#E09F3E', // Warm orange, less intense
  desertHighlightGold: '#FFD700', // Brighter gold for highlights

  // Jewel Accents
  accentEmerald: '#50C878', // Vibrant green
  accentRuby: '#E0115F', // Deep red
  accentSapphire: '#0F52BA', // Bright blue
  accentAmethyst: '#9966CC', // Rich purple
  playingGreen: '#4CAF50', // Green for active playing state
 
  // Text Colors
  textPrimary: '#F5F5F5', // Off-white for primary text on dark backgrounds
  textSecondary: '#A9A9A9', // Light grey for secondary text
  textArabic: '#FFFFFF', // Pure white for Arabic script for clarity
  textEnglish: '#E0E0E0', // Slightly softer white for English

  // UI Elements
  background: '#0B0724', // Same as skyDeepBlue for overall background
  cardBackground: 'rgba(44, 29, 93, 0.5)', // Semi-transparent skyPurple for cards
  tabBarBackground: '#1C1240', // A slightly lighter dark purple for tab bar
  activeTabIcon: '#FFD700', // desertHighlightGold
  inactiveTabIcon: '#A9A9A9', // textSecondary
  buttonPrimaryBackground: '#E09F3E', // desertWarmOrange
  buttonPrimaryText: '#0B0724', // skyDeepBlue (for contrast on warm orange)
  buttonSecondaryBackground: '#4A3F8E', // skyIndigo
  buttonSecondaryText: '#F5F5F5', // textPrimary

  // Utility Colors
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  error: '#D32F2F', // Standard error red
  success: '#388E3C', // Standard success green
};

export const typography = {
  fonts: {
    arabicRegular: 'NotoNaskhArabic-Regular',
    arabicBold: 'NotoNaskhArabic-Bold',
    englishRegular: 'Montserrat-Regular',
    englishMedium: 'Montserrat-Medium',
    englishSemiBold: 'Montserrat-SemiBold',
    englishBold: 'Montserrat-Bold',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    '3xl': 30,
    '4xl': 36,
    arabicHeading: 28,
    arabicBody: 22,
    arabicSubtext: 18,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.75,
  },
};

export const theme = {
  colors,
  typography,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },
  shadows: {
    subtle: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    strong: '0px 8px 16px rgba(0, 0, 0, 0.2)',
  },
};

export type Theme = typeof theme;

// It's good practice to create a styled-components declaration file
// to get type support for your theme.
// Create a file named `styled.d.ts` in your `src` directory with:
/*
import 'styled-components';
import { Theme } from './theme/theme'; // Adjust path if necessary

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
*/

export default theme;