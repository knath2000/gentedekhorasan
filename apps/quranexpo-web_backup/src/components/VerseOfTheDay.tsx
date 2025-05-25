import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import type { DisplayVerse } from '../types/quran';
import { fetchRandomVerse } from '../services/surahService';

// Inline SVG for Share Icon
const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="mr-2"
    width="18px"
    height="18px"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
);

// Cache key constants
const CACHE_KEY = 'verseOfTheDay';
const CACHE_TIMESTAMP_KEY = 'verseOfTheDayTimestamp';

const VerseOfTheDay = () => {
  const [verse, setVerse] = useState<DisplayVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getVerse = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if we have a cached verse for today
        const today = new Date().toDateString();
        
        // Check localStorage for cached data if available
        if (typeof window !== 'undefined') {
          // We'll disable caching during development to ensure we test the API properly
          const isDevelopment = import.meta.env.DEV;
          const cachedTimestamp = isDevelopment ? null : localStorage.getItem(CACHE_TIMESTAMP_KEY);
          
          if (cachedTimestamp === today && !isDevelopment) {
            const cachedVerseData = localStorage.getItem(CACHE_KEY);
            if (cachedVerseData) {
              try {
                const parsedData = JSON.parse(cachedVerseData);
                setVerse(parsedData);
                setLoading(false);
                return;
              } catch (parseError) {
                console.error("Failed to parse cached verse data:", parseError);
                // Continue to fetch new verse
              }
            }
          }
        }

        // Fetch a new verse if cache is not available or expired
        const fetchedVerse = await fetchRandomVerse();
        
        if (fetchedVerse && fetchedVerse.surahNumber !== 0) {
          console.log("Fetched verse:", fetchedVerse);
          setVerse(fetchedVerse);
          
          // Cache the verse if localStorage is available
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify(fetchedVerse));
              localStorage.setItem(CACHE_TIMESTAMP_KEY, today);
            } catch (storageError) {
              console.warn("Could not cache verse:", storageError);
              // Continue without caching
            }
          }
        } else {
          // If we got a malformed response, set an error
          setError('Could not fetch a verse. Please try again later.');
        }
      } catch (e) {
        console.error('Failed to fetch or cache verse of the day:', e);
        // Set a more descriptive error message based on the error
        if (e instanceof Error) {
          setError(`Error fetching verse: ${e.message}`);
        } else {
          setError('An error occurred while fetching the verse. Please try again later.');
        }
        
        // No fallback to cached verse on API error - as requested
        // Clear any existing verse to ensure only the error is shown
        setVerse(null);
      } finally {
        setLoading(false);
      }
    };

    getVerse();
  }, []);

  // Handle share functionality
  const handleShare = async () => {
    if (!verse) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Verse of the Day - Luminous Verses',
          text: `"${verse.arabic}"\n\n"${verse.english}"\n\n- ${verse.fullReference}\n\nShared from Luminous Verses Web App`,
          // url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        const textToCopy = `"${verse.arabic}"\n\n"${verse.english}"\n\n- ${verse.fullReference}\n\nShared from Luminous Verses Web App`;
        await navigator.clipboard.writeText(textToCopy);
        alert('Verse copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing verse:', error);
    }
  };

  return (
    <div class="w-full flex flex-col flex-1 overflow-y-auto">
      
      {/* Simple scrollable container with padding to ensure content stops above the red line */}
      <div class="max-h-[calc(100vh-70px)] overflow-y-auto mx-auto"> {/* 70px = 60px navbar + 10px buffer */}
        {/* Enhanced Glassmorphism container */}
        <div class="w-full max-w-md p-6 rounded-xl shadow-xl relative overflow-hidden mx-auto"> {/* Added mx-auto here */}
          {/* Backdrop blur layer */}
          <div class="absolute inset-0 glassmorphism"></div>

          {/* Content - ensure it's above the blur layer */}
          <div class="relative z-10">
            <h2 class="text-2xl font-englishBold text-textPrimary text-center mb-5">
              Verse of the Day
            </h2>

            {loading && (
              <div class="flex justify-center items-center min-h-[200px]">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-desertWarmOrange"></div>
              </div>
            )}

            {error && !verse && (
              <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
                <div class="flex items-center">
                  <svg class="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <p>{error}</p>
                </div>
                <div class="mt-3">
                  <button
                    onClick={() => window.location.reload()}
                    class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && verse && (
              <>
                <div class="mb-4">
                  <p dir="rtl" class="text-arabicBody font-arabicRegular text-textArabic text-right leading-relaxed">
                    {verse.arabic}
                  </p>
                </div>

                <div class="mb-5">
                  <p class="text-md font-englishRegular text-textSecondary leading-normal">
                    {verse.english}
                  </p>
                </div>

                <div class="text-center mb-6">
                  <p class="text-sm font-englishMedium text-accentSapphire">
                    {verse.fullReference}
                  </p>
                </div>

                <div class="flex justify-end">
                  <button
                    type="button"
                    onClick={handleShare}
                    class="flex items-center px-5 py-2.5 bg-desertWarmOrange text-buttonPrimaryText font-englishSemiBold text-sm rounded-full hover:bg-desertWarmOrange/90 transition-colors duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-desertHighlightGold focus:ring-opacity-50"
                  >
                    <ShareIcon />
                    Share
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Extra padding at the bottom to ensure last item is fully visible */}
        <div class="h-4"></div>
      </div>
    </div>
  );
};

export default VerseOfTheDay;
