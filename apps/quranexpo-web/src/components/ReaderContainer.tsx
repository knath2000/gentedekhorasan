import { useStore } from '@nanostores/preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useAutoScroll } from '../hooks/useAutoScroll'; // Import useAutoScroll
import { usePagination } from '../hooks/usePagination';
import { useVersePlayer } from '../hooks/useVersePlayer';
import { fetchSurahById, fetchVersesForSurah } from '../services/apiClient';
import { aiTranslationsEnabled, audioActive, autoplayEnabled, showTranslation } from '../stores/settingsStore';
import type { Surah, Verse } from '../types/quran';
import { getVerseKey } from '../utils/audioUtils';
import BottomControlPanel from './BottomControlPanel';
import ReaderSurahHeader from './ReaderSurahHeader';
import { ReaderVerseCard } from './ReaderVerseCard';

interface ReaderContainerProps {
 surahId: number;
}

const ReaderContainer = ({ surahId }: ReaderContainerProps) => {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // Estado para controlar la hidratación
  
 // Estado para controlar si el modal de descripción está abierto
 const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  
 // Función para manejar el cambio de estado del modal desde ReaderSurahHeader
 const handleModalStateChange = (isOpen: boolean) => {
 setIsDescriptionModalOpen(isOpen);
 };
  
 // Use showTranslation and autoplayEnabled from the store
 const $showTranslation = useStore(showTranslation);
 const $autoplayEnabled = useStore(autoplayEnabled);
 const $aiTranslationsEnabled = useStore(aiTranslationsEnabled);

 // Audio player state and functions
 const {
 status,
 error: audioError,
 currentVerseKey,
 activeVerseIndex, // Get activeVerseIndex from useVersePlayer
 togglePlayPause,
 stopAndUnload,
 duration,
 currentTime,
 seek,
 setVerseIndex,
 skipToNextVerse,
 onSeekChange,
 playVerse,
  } = useVersePlayer(verses);

 const isPlaying = status === 'playing';
 const isLoadingAudio = status === 'loading';
 const $audioActive = useStore(audioActive);
 
 // Obtener el verso actual de forma segura usando useMemo
 const currentVerse = useMemo(() => {
   if (!verses || !currentVerseKey) return null;
   return verses.find((v: Verse) => getVerseKey(v.surahId, v.numberInSurah) === currentVerseKey);
 }, [verses, currentVerseKey]);

 // Hook de paginación
 const {
 currentPage,
 totalPages,
 versesPerPage,
 currentVerses,
 firstVerseIndex,
 lastVerseIndex,
 goToPage,
 goToNextPage,
 goToPreviousPage,
 totalVerses: totalVersesCount,
 } = usePagination(verses);

 // Auto-scroll refs and hook
 const verseRefs = useRef<Map<number, HTMLDivElement>>(new Map());

 const setVerseRef = useCallback((index: number, element: HTMLDivElement | null) => {
   if (element) {
     verseRefs.current.set(index, element);
   } else {
     verseRefs.current.delete(index);
   }
 }, []);

 const { isVerseInCurrentPage, scrollToVerse } = useAutoScroll({
   activeVerseIndex,
   verses,
   currentPage,
   versesPerPage,
   goToPage,
   verseRefs,
 });

 useEffect(() => {
   setIsClient(true); // Marcar como cliente una vez montado
   const loadData = async () => {
     setLoading(true);
     setError(null);
     setSurah(null);
     setVerses([]);
          
     // Stop any playing audio when changing Surahs
     stopAndUnload();

 try {
 const [surahData, versesData] = await Promise.all([
 fetchSurahById(surahId),
 fetchVersesForSurah(surahId)
 ]);

 if (!surahData) {
 throw new Error(`Surah with ID ${surahId} not found.`);
 }

 setSurah(surahData);
 setVerses(versesData);
 console.log('Loading data for Surah:', surahId);
 console.log('Verses after fetch:', versesData.length);
 } catch (err: any) {
 console.error('Error loading Surah data:', err);
 setError(err.message || 'Failed to load Surah data. Please try again.');
 } finally {
 setLoading(false);
 }
 };

 if (surahId >0 && surahId <=114) {
 loadData();
 } else {
 setError('Invalid Surah ID. Please enter a number between1 and114.');
 setLoading(false);
 }
 }, [surahId]);

 const handleVerseAudioToggle = (verse: Verse) => {
 const index = verses.findIndex((v: Verse) =>
 v.surahId === verse.surahId && v.numberInSurah === verse.numberInSurah
 );

 if (index !== -1) {
 setVerseIndex(index);
 const verseKey = getVerseKey(verse.surahId, verse.numberInSurah);
 const isCurrentVerse = verseKey === currentVerseKey;

 if (!isCurrentVerse) {
 playVerse(verse.surahId, verse.numberInSurah);
 } else {
 togglePlayPause();
 }
 }
 };

 if (loading) {
 return (
 <div className="w-full">
 <ReaderSurahHeader surah={null} />
 <div className="flex justify-center items-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-desertWarmOrange"></div>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="w-full">
 <ReaderSurahHeader surah={surah} />
 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
 <div className="flex items-center">
 <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="002424">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M129v2m04h.01m-6.9384h13.856c1.5402.502-1.6671.732-3L13.7324c-.77-1.333-2.694-1.333-3.4640L3.3416c-.771.333.19231.7323z"></path>
 </svg>
 <p>{error}</p>
 </div>
 <div className="mt-3">
 <button
 onClick={() => window.location.reload()}
 className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded text-sm"
 >
 Try Again
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (!surah || verses.length ===0) {
 return (
 <div className="w-full">
 <ReaderSurahHeader surah={surah} />
 <div className="bg-skyPurple/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
 <p className="text-textSecondary font-englishRegular">
 {surah ? 'No verses found for this Surah.' : 'Surah data not available.'}
 </p>
 </div>
 </div>
 );
 }

 return (
   <div className="w-full flex flex-col relative h-full">
     <div className={`flex-1 overflow-y-auto space-y-4 pb-40 relative verse-container`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
       <div className="opacity-0 animate-fade-in animation-delay-[100ms] relative">
         <ReaderSurahHeader
           surah={surah}
           onModalStateChange={handleModalStateChange}
         />
       </div>
       {currentVerses.map((verse: Verse, index: number) => {
         const verseKey = getVerseKey(verse.surahId, verse.numberInSurah);
         const isActiveAudio = currentVerseKey === verseKey;

         return (
           <div key={verse.id} className={`animate-list-item animate-item-${Math.min(index, 19)}`}>
             <ReaderVerseCard
               ref={(el: HTMLDivElement | null) => setVerseRef(firstVerseIndex + index, el)} // Pass ref to ReaderVerseCard
               verse={verse}
               showTranslation={$showTranslation}
               useAiTranslation={$aiTranslationsEnabled === 'true'}
               isActiveAudio={isActiveAudio}
               isPlayingAudio={isActiveAudio && isPlaying}
               isLoadingAudio={isLoadingAudio}
               audioError={audioError}
               onAudioPress={() => handleVerseAudioToggle(verse)}
               currentTime={currentTime}
               duration={duration}
               onSeek={onSeekChange}
               className="last:mb-0"
             />
           </div>
         );
       })}
       <div className="h-4"></div>
     </div>

     {(totalVersesCount > 7 || $audioActive) && (
       <BottomControlPanel
         isModalOpen={isDescriptionModalOpen}
         isAudioActive={$audioActive && (isPlaying || (!!currentVerseKey && !isLoadingAudio && !audioError))}
         onStop={stopAndUnload}
         onSkip={skipToNextVerse}
         currentSurahName={surah?.englishName}
         currentSurahNumber={surah?.number}
         currentVerseNumber={currentVerse?.numberInSurah}
         totalVerses={surah?.numberOfAyahs}
         currentPage={currentPage}
         totalPages={totalPages}
         goToPreviousPage={goToPreviousPage}
         goToNextPage={goToNextPage}
         showNavigation={totalVersesCount > 7}
       />
     )}
   </div>
 );
};

export default ReaderContainer;
