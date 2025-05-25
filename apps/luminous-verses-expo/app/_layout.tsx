import { Stack } from "expo-router";
import { View } from "react-native"; // For displaying errors & View. Removed Platform
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native"; // Removed styled
import theme from "../src/theme/theme"; // Adjusted path, removed Theme type import

export default function RootLayout() {
  const AppContent = (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          {AppContent}
        </View>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
