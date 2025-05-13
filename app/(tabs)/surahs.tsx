import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, ImageBackground, Platform, Text, View } from 'react-native'; // Added Dimensions
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // SafeAreaView itself is not directly used here now
import styled, { useTheme } from 'styled-components/native';
import SurahCard from '../../src/components/SurahCard'; // Ensure this path is correct
import { fetchSurahList } from '../../src/services/surahService';
import { Theme } from '../../src/theme/theme'; // Ensure this path is correct
import { Surah } from '../../src/types/quran';

const backgroundImageSource = require('../../assets/images/iOSbackground.png');

const BackgroundImage = styled(ImageBackground)<{ theme: Theme }>`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background}; /* Fallback */
`;

const MainContainer = styled(View)<{ pt: number; pl: number; pr: number }>`
  flex: 1;
  padding-top: ${({ pt }) => pt}px;
  padding-left: ${({ pl }) => pl}px;
  padding-right: ${({ pr }) => pr}px;
`;

const LoadingContainer = styled(View)<{ theme: Theme }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  /* background-color is transparent by default for View, or set by parent */
`;

const ErrorContainer = styled(View)<{ theme: Theme }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  /* background-color is transparent by default for View, or set by parent */
`;

const ErrorText = styled(Text)<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSizes.md}px;
  text-align: center;
  font-family: ${({ theme }) => theme.typography.fonts.englishRegular};
`;

export default function SurahsScreen() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;

  // Define a fixed tab bar height (adjust if your tab bar height is different or get dynamically if possible)
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70; // This might need to be more dynamic if tab bar height changes

  const listContainerHeight = windowHeight - insets.top - insets.bottom - TAB_BAR_HEIGHT + theme.spacing.md;

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSurahList();
        setSurahs(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load surahs. Please try again.');
        console.error('Error loading surahs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
  }, []);

  const handleSurahPress = (surah: Surah) => {
    router.push({
      pathname: '/(tabs)/reader',
      params: { surahId: surah.number },
    });
  };

  if (loading) {
    return (
      <BackgroundImage source={backgroundImageSource} resizeMode="cover">
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.desertHighlightGold} />
          </LoadingContainer>
        </MainContainer>
      </BackgroundImage>
    );
  }

  if (error) {
    return (
      <BackgroundImage source={backgroundImageSource} resizeMode="cover">
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        </MainContainer>
      </BackgroundImage>
    );
  }

  return (
    <BackgroundImage
      source={backgroundImageSource}
      resizeMode="cover"
    >
      <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
        <View style={{ height: listContainerHeight }}>
          <FlatList
            ListHeaderComponent={<View style={{ height: theme.spacing.xl }} />} // Standard top padding within the list
            data={surahs}
            keyExtractor={(item) => item.number.toString()}
            renderItem={({ item }) => (
              <SurahCard surah={item} onPress={handleSurahPress} />
            )}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.md,
              paddingBottom: theme.spacing.md, // Small margin at the end of the list content
            }}
            // scrollIndicatorInsets are not strictly needed here as the parent View controls the visible area
            initialNumToRender={5}
            windowSize={10}
          />
        </View>
      </MainContainer>
    </BackgroundImage>
  );
}