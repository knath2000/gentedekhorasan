import { h } from 'preact';
import type { Surah } from '../types/quran';

interface ReaderSurahHeaderProps {
  surah: Surah | null;
}

const ReaderSurahHeader = ({ surah }: ReaderSurahHeaderProps) => {
  if (!surah) {
    return (
      <div className="py-6 px-4 text-center mb-4">
        <div className="h-8 w-1/2 mx-auto bg-desertHighlightGold/30 rounded animate-pulse mb-2"></div>
        <div className="h-6 w-1/3 mx-auto bg-white/30 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 text-center mb-4">
      <h1 
        className="font-arabicBold text-4xl text-desertHighlightGold mb-2"
        dir="rtl"
      >
        {surah.name}
      </h1>
      <h2 className="font-englishBold text-2xl text-white">
        {surah.englishName}
      </h2>
    </div>
  );
};

export default ReaderSurahHeader;