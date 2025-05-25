import React from 'react';
import type { Surah } from '../types/quran';

interface SurahCardProps {
  surah: Surah;
  onPress?: (surah: Surah) => void;
  className?: string;
}

const ReactSurahCard = ({ surah, onPress, className = '' }: SurahCardProps) => {
  const handleClick = () => {
    if (onPress) {
      onPress(surah);
    } else {
      // Default behavior: navigate to reader page
      window.location.href = `/reader/${surah.number}`;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex flex-row items-center overflow-hidden p-4 mb-3 rounded-xl cursor-pointer ${className}`}
    >
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-skyPurple/60 backdrop-blur-xl border border-white/10 rounded-xl"></div>
      
      {/* Number circle */}
      <div className="relative z-10 bg-desertHighlightGold rounded-full w-10 h-10 flex justify-center items-center mr-4">
        <span className="text-skyDeepBlue font-englishBold text-md">{surah.number}</span>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 flex-1">
        {/* Arabic name */}
        <h3 className="text-textArabic font-arabicBold text-2xl text-right mb-1 rtl" dir="rtl">
          {surah.name}
        </h3>
        
        {/* English name */}
        <h4 className="text-textEnglish font-englishSemiBold text-lg">
          {surah.englishName}
        </h4>
        
        {/* Info text */}
        <p className="text-textSecondary font-englishRegular text-sm mt-1">
          Chapter {surah.englishName} • {surah.numberOfAyahs} Verses
        </p>
        
        {/* Revelation type badge */}
        <div 
          className={`px-3 py-1 mt-2 rounded-md text-white font-englishMedium text-xs self-start inline-block
            ${surah.revelationType === 'Meccan' ? 'bg-accentRuby' : 'bg-accentEmerald'}`}
        >
          {surah.revelationType}
        </div>
      </div>
    </div>
  );
};

export default ReactSurahCard;
