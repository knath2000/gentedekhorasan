import { useEffect, useRef, useState } from 'react';
import { setSurahSortOrder, surahSortOrder, type SurahSortOrder } from '../stores/settingsStore';

interface SortMenuProps {}

export const sortOptionsMap: Record<SurahSortOrder, string> = {
  canonical: 'Orden Canónico',
  revelation: 'Orden de Revelación',
  'length-asc': 'Longitud (Ascendente)',
  'length-desc': 'Longitud (Descendente)',
  'revelation-location': 'Lugar de Revelación',
};

export default function SortMenu({}: SortMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [currentSortOrder, setCurrentSortOrder] = useState(surahSortOrder.get());

  useEffect(() => {
    const unsubscribe = surahSortOrder.listen(order => {
      setCurrentSortOrder(order);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: SurahSortOrder) => {
    setSurahSortOrder(option);
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left z-10" ref={menuRef}>
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-cardBackground px-3 py-2 text-sm font-semibold text-textPrimary shadow-sm ring-1 ring-inset ring-white/10 hover:bg-skyPurple/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-skyDeepBlue focus:ring-desertHighlightGold transition-colors duration-200"
          id="sort-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={toggleMenu}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(true);
              // Focus the first item when opening with keyboard
              setTimeout(() => {
                menuRef.current?.querySelector<HTMLButtonElement>('[role="option"]')?.focus();
              }, 0);
            }
          }}
        >
          Ordenar por
          <span className="-mr-1 h-5 w-5 text-textSecondary">▼</span>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-cardBackground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="listbox"
          aria-labelledby="sort-menu-button"
          tabIndex={-1} // Make the menu focusable
          onKeyDown={(e) => {
            const options = Array.from(menuRef.current?.querySelectorAll('[role="option"]') || []) as HTMLButtonElement[];
            const focusedIndex = options.indexOf(document.activeElement as HTMLButtonElement);

            if (e.key === 'ArrowDown') {
              e.preventDefault();
              const nextIndex = (focusedIndex + 1) % options.length;
              options[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              const prevIndex = (focusedIndex - 1 + options.length) % options.length;
              options[prevIndex].focus();
            } else if (e.key === 'Home') {
              e.preventDefault();
              options[0].focus();
            } else if (e.key === 'End') {
              e.preventDefault();
              options[options.length - 1].focus();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              setIsOpen(false);
              document.getElementById('sort-menu-button')?.focus(); // Return focus to button
            } else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (document.activeElement && document.activeElement.getAttribute('role') === 'option') {
                (document.activeElement as HTMLButtonElement).click();
              }
            }
          }}
        >
          <div className="py-1" role="none">
            {Object.entries(sortOptionsMap).map(([key, label], index) => (
              <button
                key={key}
                onClick={() => handleOptionClick(key as SurahSortOrder)}
                className={`${
                  currentSortOrder === key ? 'font-bold text-desertHighlightGold bg-skyPurple' : 'text-textPrimary'
                } group flex w-full items-center px-4 py-2 text-base hover:bg-skyPurple hover:text-textPrimary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-skyDeepBlue focus:ring-desertHighlightGold`}
                role="option"
                aria-selected={currentSortOrder === key}
                tabIndex={-1} // Make options focusable by script, not tab key
              >
                {label}
                {currentSortOrder === key && (
                  <span className="ml-auto text-desertHighlightGold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}