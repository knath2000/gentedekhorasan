import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen"; // Import SplashScreen
import { useCallback, useEffect, useState } from "react"; // Add useCallback
import { Text, View } from "react-native"; // For displaying errors & View. Removed Platform
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native"; // Removed styled
// import AnimatedBackground from "../src/components/AnimatedBackground"; // Remove AnimatedBackground import
import theme from "../src/theme/theme"; // Adjusted path, removed Theme type import

// SplashScreen.preventAutoHideAsync(); // Moved inside component

export default function RootLayout() {
  SplashScreen.preventAutoHideAsync(); // Call inside component
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);

  useEffect(() => {
    async function prepareApp() { // Renamed for clarity
      try {
        await Font.loadAsync({
          // Arabic Fonts
          "NotoNaskhArabic-Regular": require("../assets/fonts/NotoNaskhArabic-Regular.ttf"),
          "NotoNaskhArabic-Bold": require("../assets/fonts/NotoNaskhArabic-Bold.ttf"),
          // English Fonts
          "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
          "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
          "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
          "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
          // Existing font, keep or remove as needed
          "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (error) {
        setFontError(error as Error);
        console.error("Font loading error:", error);
      } finally {
        setFontsLoaded(true);
        // No need to hide splash screen here if onLayoutRootView is used
        // await SplashScreen.hideAsync();
      }
    }
    prepareApp(); // Call prepareApp
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      // This will hide the splash screen once the fonts are loaded or an error occurs
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) { // Show null only if fonts are not loaded AND no error
    return null;
  }

  // If there's a font error, display it. The splash screen will be hidden by onLayoutRootView.
  if (fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onLayout={onLayoutRootView}>
        <Text>Error loading fonts: {fontError.message}</Text>
      </View>
    );
  }

  // If fonts are loaded and no error, render the app. The splash screen will be hidden by onLayoutRootView.
  const AppContent = (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* You can add other global screens here if needed */}
    </Stack>
  );

  // Reverted to single return path for all platforms
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          {AppContent}
        </View>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

// Removed GlobalPageWrapper and GlobalDeviceFrame styled components
