import { $authStore } from '@clerk/astro/client';
import { useStore } from '@nanostores/preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
<<<<<<< HEAD
import { useAutoScroll } from '../hooks/useAutoScroll'; // Import useAutoScroll
import { usePagination } from '../hooks/usePagination';
import { useVersePlayer } from '../hooks/useVersePlayer';
import { fetchSurahById, fetchVersesForSurah } from '../services/apiClient';
import { aiTranslationsEnabled, audioActive, autoplayEnabled, showTranslation } from '../stores/settingsStore';
=======
import BottomControlPanel from '../features/reader/components/BottomControlPanel'; // Importación corregida
import ReaderSurahHeader from '../features/reader/components/ReaderSurahHeader'; // Importación corregida
import { useAutoScroll } from '../features/reader/hooks/useAutoScroll'; // Importación corregida
import { usePagination } from '../features/reader/hooks/usePagination'; // Importación corregida
import { useVersePlayer } from '../features/reader/hooks/useVersePlayer'; // Importación corregida
import { fetchSurahById, fetchVersesForSurah, getAITranslation } from '../services/apiClient';
import { audioActive, autoplayEnabled, showAITranslation, showTranslation } from '../stores/settingsStore';
>>>>>>> b519158c56c807d0aca03b25983aad5609f1f230
import type { Surah, Verse } from '../types/quran';
import { getVerseKey } from '../utils/audioUtils';
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
  
<<<<<<< HEAD
 // Use showTranslation and autoplayEnabled from the store
 const $showTranslation = useStore(showTranslation);
 const $autoplayEnabled = useStore(autoplayEnabled);
 const $aiTranslationsEnabled = useStore(aiTranslationsEnabled);
=======
  // Use showTranslation, autoplayEnabled, and showAITranslation from the store
  const $showTranslation = useStore(showTranslation);
  const $autoplayEnabled = useStore(autoplayEnabled);
  const $showAITranslation = useStore(showAITranslation); // Nuevo store para traducción de IA
  const auth = useStore($authStore); // OBTENER estado de autenticación

  // Marcar como cliente una vez montado (para hidratación)
  useEffect(() => {
    setIsClient(true);
  }, []);

 const [aiTranslations, setAiTranslations] = useState<Map<string, string>>(new Map());
 const [isLoadingAITranslation, setIsLoadingAITranslation] = useState(false);
 const [aiTranslationError, setAiTranslationError] = useState<string | null>(null);
>>>>>>> b519158c56c807d0aca03b25983aad5609f1f230

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

 // Corregido: useAutoScroll solo devuelve scrollToVerse
 const { scrollToVerse } = useAutoScroll({
   activeVerseIndex,
   verses,
   currentPage,
   versesPerPage,
   goToPage,
   verseRefs: verseRefs.current, // Corregido: pasar .current del ref
 });

 useEffect(() => {
   const loadData = async () => {
     setLoading(true);
     setError(null);
     setSurah(null);
     setVerses([]);
          
     // Stop any playing audio when changing Surahs
     stopAndUnload();

     console.log('loadData: fetching data for surahId:', surahId); // AÑADIR este log
 try {
 const [surahData, versesData] = await Promise.all([
 fetchSurahById(surahId), // No pasar token aquí, es público
 fetchVersesForSurah(surahId) // No pasar token aquí, es público
 ]);

 console.log('loadData: surahData received:', !!surahData, 'versesData.length:', versesData?.length); // AÑADIR este log

 if (!surahData) {
 throw new Error(`Surah with ID ${surahId} not found.`);
 }

 setSurah(surahData);
 setVerses(versesData || []); // Asegurar que sea un array vacío si `versesData` es null/undefined
 // console.log('Loading data for Surah:', surahId); // Ya existe en ReaderContainer.tsx
 // console.log('Verses after fetch:', versesData.length); // Ya existe en ReaderContainer.tsx
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

 // Efecto para cargar la traducción de IA cuando showAITranslation es true o el verso actual cambia (~línea 149)
 useEffect(() => {
   // Solo intentar generar traducción de IA si la opción está activa Y el usuario está autenticado
   if ($showAITranslation && auth.userId && currentVerse && !aiTranslations.has(getVerseKey(currentVerse.surahId, currentVerse.numberInSurah))) {
     const fetchTranslation = async () => {
       setIsLoadingAITranslation(true);
       setAiTranslationError(null);
       try {
         const token = await auth.session?.getToken(); // Obtener el token de Clerk
         if (!token) {
           setAiTranslationError('Authentication required for AI translation.');
           setIsLoadingAITranslation(false);
           return;
         }
         const translation = await getAITranslation(currentVerse.surahId, currentVerse.numberInSurah, currentVerse.verseText, token); // PASAR EL TOKEN
         setAiTranslations(prev => new Map(prev).set(getVerseKey(currentVerse.surahId, currentVerse.numberInSurah), translation));
       } catch (err: any) {
         console.error('Error fetching AI translation:', err);
         setAiTranslationError(err.message || 'Failed to fetch AI translation. Please check status.');
       } finally {
         setIsLoadingAITranslation(false);
       }
     };
     fetchTranslation();
   } else if ($showAITranslation && !auth.userId && currentVerse) {
       // Si la opción de IA está activa pero no hay usuario logueado, mostrar mensaje.
       setAiTranslationError('Sign in to use AI translation.');
       setAiTranslations(prev => { // Clear previous AI translations if user logs out
         const newMap = new Map(prev);
         if (currentVerse) newMap.delete(getVerseKey(currentVerse.surahId, currentVerse.numberInSurah));
         return newMap;
       });
       setIsLoadingAITranslation(false);
   }
 }, [$showAITranslation, currentVerse, aiTranslations, auth.userId, auth.session]); // Añadir auth.userId y auth.session a las dependencias

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

 console.log('ReaderContainer Render - Loading:', loading, 'Error:', error, 'Surah:', surah, 'Verses Length:', verses.length);
 console.log('ReaderContainer render condition: surah exists:', !!surah, 'verses length:', verses.length); // AÑADIR este log
 if (loading) {
   console.log('ReaderContainer: Rendering loading state.');
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
   console.log('ReaderContainer: Rendering error state.', error);
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
   console.log('ReaderContainer: Rendering no data state. Surah:', surah, 'Verses:', verses.length); // Modificar este log para más detalle
   return (
     <div className="w-full">
       <ReaderSurahHeader surah={surah} />
       <div className="bg-skyPurple/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
         <p className="text-textSecondary font-englishRegular">
           {surah ? 'No verses found for this Surah.' : 'Surah data not available. (Check network/console)'}
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
<<<<<<< HEAD
               useAiTranslation={$aiTranslationsEnabled === 'true'}
=======
               showAITranslation={$showAITranslation} // Pasar la prop showAITranslation
               aiTranslation={aiTranslations.get(getVerseKey(verse.surahId, verse.numberInSurah))} // Pasar la traducción de IA
               isLoadingAITranslation={isLoadingAITranslation && currentVerseKey === getVerseKey(verse.surahId, verse.numberInSurah)} // Estado de carga para el verso activo
               aiTranslationError={aiTranslationError && currentVerseKey === getVerseKey(verse.surahId, verse.numberInSurah) ? aiTranslationError : null} // Error para el verso activo
>>>>>>> b519158c56c807d0aca03b25983aad5609f1f230
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
