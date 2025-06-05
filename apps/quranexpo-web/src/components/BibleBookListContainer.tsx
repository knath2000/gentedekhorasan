import { useEffect, useState } from 'preact/hooks';
import { fetchBibleBookList } from '../services/apiClient';
import type { BibleBook } from '../types/bible';
import ReactBibleBookCard from './ReactBibleBookCard';

const BibleBookListContainer = () => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookData = await fetchBibleBookList();
        setBooks(bookData);
      } catch (err: any) {
        console.error('Error loading Bible books:', err);
        setError(err.message || 'Failed to load Bible books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const handleBookPress = (book: BibleBook) => {
    console.log(`Book ${book.id} - ${book.name} selected`);
    // Navigate to a future reader page: /bible-reader/${book.id}
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-desertWarmOrange"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full px-4 overflow-y-auto scrollbar-hide pt-16">
      <h1 className="text-3xl font-englishBold text-textPrimary text-center tracking-wide">
        New Testament
      </h1>
      <div className="text-center text-sm text-textSecondary mt-1 mb-4">
        {books.length > 0 ? `${books.length} books loaded.` : 'No books loaded'}
      </div>
      <div className="space-y-4">
        {books.map((book, index) => (
          <div key={book.id} className={`animate-list-item animate-item-${Math.min(index, 19)}`}>
            <ReactBibleBookCard
              book={book}
              onPress={handleBookPress}
              className=""
            />
          </div>
        ))}
      </div>
      <div className="h-4"></div>
    </div>
  );
};

export default BibleBookListContainer;