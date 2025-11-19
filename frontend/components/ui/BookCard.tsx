import React from 'react';
import { Book } from '../../types';
import { Eye } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div 
      className="group flex flex-col cursor-pointer gap-4"
      onClick={() => onClick(book)}
    >
      {/* Image Container with Overflow Hidden for Zoom Effect */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md shadow-sm transition-all duration-500 group-hover:shadow-xl ring-1 ring-stone-900/5">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Overlay & Button - Smooth Fade */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
           <button className="bg-white text-zen-ink px-6 py-2 rounded-full font-sans text-xs font-bold tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-lg flex items-center gap-2">
             <Eye size={14} /> EXPLORAR
           </button>
        </div>

        {/* Subtle Badge Top Right */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <span className="bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm text-zen-ink">
            {book.publishedYear}
          </span>
        </div>
      </div>

      {/* Minimalist Text Content (No borders, clean typography) */}
      <div className="flex flex-col space-y-1">
        <h3 className="font-serif font-medium text-lg text-zen-ink leading-tight group-hover:text-indigo-deep transition-colors duration-300">
          {book.title}
        </h3>
        <p className="text-sm text-stone-500">{book.author}</p>
        <div className="flex items-center gap-2 pt-1">
           <div className="h-px w-4 bg-sakura-vivid/50"></div>
           <p className="text-[10px] text-stone-400 font-mono tracking-wider uppercase truncate">
             {book.university}
           </p>
        </div>
      </div>
    </div>
  );
};