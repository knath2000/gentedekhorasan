import { $authStore } from '@clerk/astro/client';
import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { fetchSurahById } from '../services/apiClient';
import { bookmarks, removeBookmark, updateBookmarkNote } from '../stores/bookmarkStore';
import type { Bookmark } from '../types/quran'; // Importar Bookmark desde types/quran

interface BookmarkListContainerProps {
  // No props needed as it fetches from store
}

const BookmarkListContainer = ({}: BookmarkListContainerProps) => {
  const $bookmarks = useStore(bookmarks); // Usar el átomo directamente
  const auth = useStore($authStore); // Mover la llamada al hook al nivel superior
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [surahNames, setSurahNames] = useState<Record<number, string>>({});

  // Obtener los marcadores ordenados
  const sortedBookmarks = $bookmarks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  useEffect(() => {
    const loadSurahNames = async () => {
      const uniqueSurahIds = Array.from(new Set(sortedBookmarks.map((b: Bookmark) => b.surahId)));
      const names: Record<number, string> = {};
      for (const id of uniqueSurahIds) {
        if (!surahNames[id]) { // Solo cargar si no está ya en caché
          const surah = await fetchSurahById(id as number); // Cast a number
          if (surah) {
            names[id as number] = surah.englishName; // Cast a number
          }
        }
      }
      setSurahNames(prevNames => ({ ...prevNames, ...names }));
    };
    loadSurahNames();
  }, [sortedBookmarks]); // Depende de los marcadores ordenados para recargar nombres si se añaden nuevas suras

  const handleEditNote = (bookmark: Bookmark) => {
    if (!bookmark.id) {
      console.warn('Bookmark ID is undefined, cannot edit note.');
      return;
    }
    setEditingNoteId(bookmark.id);
    setCurrentNote(bookmark.notes || '');
  };

  const handleSaveNote = async (bookmarkId: string) => {
    if (!auth.userId) { // Usar la variable auth del nivel superior
      console.warn('No user ID available, cannot update bookmark note.');
      return;
    }
    
    try {
      await updateBookmarkNote(auth.userId, bookmarkId, currentNote);
      setEditingNoteId(null);
      setCurrentNote('');
    } catch (error) {
      console.error('Error updating bookmark note:', error);
      // Optionalmente mostrar un mensaje de error al usuario
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setCurrentNote('');
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    if (!auth.userId) { // Usar la variable auth del nivel superior
      console.warn('No user ID available, cannot delete bookmark.');
      return;
    }
    if (confirm('Are you sure you want to delete this bookmark?')) {
      removeBookmark(auth.userId, bookmarkId);
    }
  };

  if (sortedBookmarks.length === 0) {
    return (
      <div className="bg-skyPurple/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center mt-8">
        <p className="text-textSecondary font-englishRegular">
          No bookmarks saved yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 mt-8 pb-20 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {sortedBookmarks.map((bookmark: Bookmark) => (
        <div key={bookmark.id} className="bg-skyPurple/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 relative">
          <div className="flex justify-between items-start mb-2">
            <a 
              href={`/reader/${bookmark.surahId}#verse-${bookmark.verseNumber}`} 
              className="text-desertWarmOrange hover:underline font-englishBold text-lg"
            >
              {bookmark.surahName || `Surah ${bookmark.surahId}`}:{bookmark.verseNumber}
            </a>
            <span className="text-textSecondary text-xs">
              {new Date(bookmark.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-textArabic font-arabicRegular text-xl text-right mb-2 leading-relaxed" dir="rtl">
            {bookmark.verseText}
          </p>
          <p className="text-textSecondary font-englishRegular text-sm italic text-center mb-4">
            {bookmark.translation}
          </p>

          {editingNoteId === bookmark.id ? (
            <div className="mt-2">
              <textarea
                className="w-full p-2 rounded bg-skyDeepBlue/40 text-textPrimary border border-white/10 focus:outline-none focus:ring-2 focus:ring-desertWarmOrange"
                rows={3}
                value={currentNote}
                onInput={(e) => setCurrentNote((e.target as HTMLTextAreaElement).value)}
                placeholder="Add your notes here..."
              ></textarea>
              <div className="flex justify-end space-x-2 mt-2">
                <button 
                  onClick={handleCancelEdit} 
                  className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveNote(bookmark.id!)} // Usar ! para afirmar que no es undefined
                  className="px-3 py-1 bg-desertWarmOrange text-skyDeepBlue rounded-full text-sm hover:bg-desertHighlightGold transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-textPrimary text-sm italic whitespace-pre-wrap">
                {bookmark.notes || 'No notes yet. Click to add.'}
              </p>
              <div className="flex justify-end space-x-2 mt-2">
                <button 
                  onClick={() => handleEditNote(bookmark)} 
                  className="px-3 py-1 bg-skyDeepBlue/40 text-textPrimary rounded-full text-sm hover:bg-skyDeepBlue/60 transition-colors"
                >
                  Edit Note
                </button>
                <button
                  onClick={() => handleDeleteBookmark(bookmark.id!)} // Usar ! para afirmar que no es undefined
                  className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookmarkListContainer;