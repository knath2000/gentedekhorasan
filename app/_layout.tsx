import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen"; // Import SplashScreen
import Head from 'next/head'; // Import Head from next/head
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
        // Temporary cache clearing logic has been removed.

        await Font.loadAsync({
          // Arabic Fonts
          "NotoNaskhArabic-Regular": require("../assets/fonts/NotoNaskhArabic-Regular.woff2"),
          "NotoNaskhArabic-Bold": require("../assets/fonts/NotoNaskhArabic-Bold.woff2"),
          // English Fonts
          "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.woff2"),
          "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.woff2"),
          "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.woff2"),
          "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.woff2"),
          // Existing font, keep or remove as needed
          "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.woff2"),
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
        <Head>
          <title>Luminous Verses - Quran Explorer</title>
          <meta name="description" content="Explore the Quran with Luminous Verses. Read, listen, and discover the divine message." />
          {/* Add other meta tags as needed, e.g., Open Graph, Twitter */}
          <meta property="og:title" content="Luminous Verses - Quran Explorer" />
          <meta property="og:description" content="Explore the Quran with Luminous Verses. Read, listen, and discover the divine message." />
          <meta property="og:type" content="website" />
          {/* <meta property="og:image" content="/assets/images/og-image.jpg" /> */}
          <meta name="twitter:card" content="summary_large_image" />
          {/* <meta name="twitter:image" content="/assets/images/og-image.jpg" /> */}
<script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "WebSite",
                    "@id": "https://onlyquranexpo.vercel.app/#website",
                    "url": "https://onlyquranexpo.vercel.app/",
                    "name": "Luminous Verses",
                    "description": "Explore the Quran with Luminous Verses. Read, listen, and discover the divine message.",
                    "publisher": {
                      "@type": "Organization",
                      "name": "Luminous Verses"
                      // Add logo, url if available
                    },
                    "inLanguage": "en"
                    // Consider adding potentialAction for search
                  },
                  {
                    "@type": "Book",
                    "@id": "https://onlyquranexpo.vercel.app/#quran",
                    "name": "The Quran",
                    "alternativeHeadline": "Al-Qur'an al-Karim",
                    "inLanguage": ["ar", "en"],
                    "genre": "Religious Text",
                    "url": "https://onlyquranexpo.vercel.app/",
                    "isPartOf": {
                       "@id": "https://onlyquranexpo.vercel.app/#website"
                    }
                    // We can add hasPart for chapters later if needed
                  }
                ]
              }
            `}
          </script>
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "WebSite",
                    "@id": "https://onlyquranexpo.vercel.app/#website",
                    "url": "https://onlyquranexpo.vercel.app/",
                    "name": "Luminous Verses",
                    "description": "Explore the Quran with Luminous Verses. Read, listen, and discover the divine message.",
                    "publisher": {
                      "@type": "Organization",
                      "name": "Luminous Verses"
                      // Add logo, url if available
                    },
                    "inLanguage": "en"
                    // Consider adding potentialAction for search
                  },
                  {
                    "@type": "Book",
                    "@id": "https://onlyquranexpo.vercel.app/#quran",
                    "name": "The Quran",
                    "alternativeHeadline": "Al-Qur'an al-Karim",
                    "inLanguage": ["ar", "en"],
                    "genre": "Religious Text",
                    "url": "https://onlyquranexpo.vercel.app/",
                    "isPartOf": {
                       "@id": "https://onlyquranexpo.vercel.app/#website"
                    }
                    // We can add hasPart for chapters later if needed
                  }
                ]
              }
            `}
          </script>
        </Head>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          {AppContent}
        </View>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

// Removed GlobalPageWrapper and GlobalDeviceFrame styled components
