import type { BibleBook } from '../types/bible';

interface ReactBibleBookCardProps {
  book: BibleBook;
  onPress: (book: BibleBook) => void;
  className?: string;
}

const ReactBibleBookCard = ({ book, onPress, className }: ReactBibleBookCardProps) => {
  return (
    <div
      className={`bg-gradient-to-br from-cardBgStart to-cardBgEnd p-4 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${className}`}
      onClick={() => onPress(book)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-yellow-400 text-gray-800 rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">
            {book.id}
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-englishBold text-textPrimary">{book.name}</h2>
            <p className="text-sm text-textSecondary">{book.testament}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactBibleBookCard;