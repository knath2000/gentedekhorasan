import { useRouter } from 'expo-router';
import Head from 'next/head'; // Import Head for structured data
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, ImageBackground, Platform, Text, View } from 'react-native'; // Removed ImageBackground, Added ImageBackground
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import { ScreenBackground } from '../../src/components/ScreenBackground'; // Added ScreenBackground import
import SurahCard from '../../src/components/SurahCard';
import { fetchSurahList } from '../../src/services/surahService';
import { Theme } from '../../src/theme/theme';
import { Surah } from '../../src/types/quran';

const webImageSource = require('../../assets/images/webtest.webp');

// Removed backgroundImageSource and BackgroundImage styled-component

const MainContainer = styled(View)<{ pt: number; pl: number; pr: number }>`
  flex: 1;
  padding-top: ${({ pt }) => pt}px;
  padding-left: ${({ pl }) => pl}px;
  padding-right: ${({ pr }) => pr}px;
  /* Ensure content is visible on potentially dark/image backgrounds */
  /* background-color: rgba(0,0,0,0.1); /* Optional: slight dimming if text readability is an issue */
`;

const LoadingContainer = styled(View)<{ theme: Theme }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const ErrorContainer = styled(View)<{ theme: Theme }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: transparent;
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

  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
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
    if (Platform.OS === 'web') {
      return (
        <ImageBackground
          source={webImageSource}
          resizeMode="cover"
          style={{ flex: 1, width: '100%' }}
        >
          <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
            <LoadingContainer>
              <ActivityIndicator size="large" color={theme.colors.desertHighlightGold} />
            </LoadingContainer>
          </MainContainer>
        </ImageBackground>
      );
    }
    return ( // Native
      <ScreenBackground>
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.desertHighlightGold} />
          </LoadingContainer>
        </MainContainer>
      </ScreenBackground>
    );
  }

  if (error) {
    if (Platform.OS === 'web') {
      return (
        <ImageBackground
          source={webImageSource}
          resizeMode="cover"
          style={{ flex: 1, width: '100%' }}
        >
          <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
            <ErrorContainer>
              <ErrorText>{error}</ErrorText>
            </ErrorContainer>
          </MainContainer>
        </ImageBackground>
      );
    }
    return ( // Native
      <ScreenBackground>
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        </MainContainer>
      </ScreenBackground>
    );
  }

  return (
    Platform.OS === 'web' ? (
      <ImageBackground
        source={webImageSource}
        resizeMode="cover"
        style={{ flex: 1, width: '100%' }}
      >
        <Head>
          <title>Surahs - Luminous Verses</title>
          <meta name="description" content="Browse and select from the 114 Surahs (chapters) of the Holy Quran." />
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Surahs - Chapters of the Quran",
                "description": "Browse and select from the 114 Surahs (chapters) of the Holy Quran.",
                "url": "https://onlyquranexpo.vercel.app/surahs",
                "mainEntity": {
                  "@type": "ItemList",
                  "numberOfItems": ${surahs.length},
                  "itemListOrder": "http://schema.org/ItemListOrderAscending",
                  "itemListElement": [
                    ${surahs.map((surah, index) => `{
                      "@type": "ListItem",
                      "position": ${index + 1},
                      "url": "https://onlyquranexpo.vercel.app/reader?surahId=${surah.number}",
                      "item": {
                        "@type": "Chapter",
                        "@id": "https://onlyquranexpo.vercel.app/reader?surahId=${surah.number}#chapter",
                        "name": "${surah.name}",
                        "alternativeHeadline": "${surah.englishName}",
                        "chapterNumber": ${surah.number},
                        "url": "https://onlyquranexpo.vercel.app/reader?surahId=${surah.number}"
                        // Could add isPartOf Book schema here if needed
                      }
                    }`).join(',\n                  ')}
                  ]
                }
              }
            `}
          </script>
        </Head>
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <View style={{ height: listContainerHeight }}>
            <FlatList
              ListHeaderComponent={<View style={{ height: theme.spacing.xl }} />}
              data={surahs}
              keyExtractor={(item) => item.number.toString()}
              renderItem={({ item }) => (
                <SurahCard surah={item} onPress={handleSurahPress} />
              )}
              contentContainerStyle={{
                paddingHorizontal: theme.spacing.md,
                paddingBottom: theme.spacing.md,
              }}
              initialNumToRender={5}
              windowSize={10}
            />
          </View>
        </MainContainer>
      </ImageBackground>
    ) : ( // Native
      <ScreenBackground>
        <Head>
          <title>Surahs - Luminous Verses</title>
          <meta name="description" content="Browse and select from the 114 Surahs (chapters) of the Holy Quran." />
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Surahs - Chapters of the Quran",
                "description": "Browse and select from the 114 Surahs (chapters) of the Holy Quran.",
                "url": "https://onlyquranexpo.vercel.app/surahs",
                "mainEntity": {
                  "@type": "ItemList",
                  "numberOfItems": ${surahs.length},
                  "itemListOrder": "http://schema.org/ItemListOrderAscending",
                  "itemListElement": [
                    ${surahs.map((surah, index) => `{
                      "@type": "ListItem",
                      "position": ${index + 1},
                      "url": "https://onlyquranexpo.vercel.app/reader?surahId=${surah.number}",
                      "item": {
                        "@type": "Chapter",
                        "@id": "https://onlyquranexpo.vercel.app/reader?surahId=${surah.number}#chapter",
                        "name": "${surah.name}",
                        "alternativeHeadline": "${surah.englishName}",
                        "chapterNumber": ${surah.number},
                        "url": "https://onlyquranexpo.vercel.app/reader?surahId=${surah.number}"
                        // Could add isPartOf Book schema here if needed
                      }
                    }`).join(',\n                  ')}
                  ]
                }
              }
            `}
          </script>
        </Head>
        <MainContainer pt={insets.top} pl={insets.left} pr={insets.right}>
          <View style={{ height: listContainerHeight }}>
            <FlatList
              ListHeaderComponent={<View style={{ height: theme.spacing.xl }} />}
              data={surahs}
              keyExtractor={(item) => item.number.toString()}
              renderItem={({ item }) => (
                <SurahCard surah={item} onPress={handleSurahPress} />
              )}
              contentContainerStyle={{
                paddingHorizontal: theme.spacing.md,
                paddingBottom: theme.spacing.md,
              }}
              initialNumToRender={5}
              windowSize={10}
            />
          </View>
        </MainContainer>
      </ScreenBackground>
    )
  );
}