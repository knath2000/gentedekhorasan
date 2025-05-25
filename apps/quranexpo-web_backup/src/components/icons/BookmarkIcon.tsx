import { h } from 'preact';

interface BookmarkIconProps {
  size?: number;
  className?: string;
  filled?: boolean; // Para indicar si el icono debe estar relleno o outline
}

export const BookmarkIcon = ({ size = 24, className = '', filled = false }: BookmarkIconProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={filled ? "currentColor" : "none"} 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path 
        d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
    </svg>
  );
};