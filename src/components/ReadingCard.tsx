import React, { useState } from 'react';
import { BookOpen, RefreshCw, BookmarkCheck, Feather } from 'lucide-react';
import type { Quote } from '../types';
import { getRandomQuote } from '../utils/quotes';
import { audioManager } from '../utils/audio';

interface ReadingCardProps {
  isZenMode: boolean;
}

export const ReadingCard: React.FC<ReadingCardProps> = ({ isZenMode }) => {
  const [quote, setQuote] = useState<Quote>(getRandomQuote());
  const [bookTitle, setBookTitle] = useState('Dönüşüm');
  const [author, setAuthor] = useState('Franz Kafka');
  const [currentPage, setCurrentPage] = useState('42');
  const [isEditing, setIsEditing] = useState(false);

  const handleNextQuote = () => {
    audioManager.playSoftClick();
    setQuote(getRandomQuote());
  };

  if (isZenMode) return null;

  return (
    <div className="max-w-md w-full glass-panel rounded-3xl p-5 md:p-6 border border-white/10 shadow-2xl space-y-4 animate-fade-in pointer-events-auto">
      {/* Book Tracker */}
      <div className="flex items-start justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            {isEditing ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="Kitap Adı"
                  className="bg-black/40 border border-white/20 rounded px-2 py-0.5 text-xs text-white font-medium"
                />
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Yazar"
                  className="bg-black/40 border border-white/20 rounded px-2 py-0.5 text-[11px] text-zinc-300 block"
                />
              </div>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-white tracking-wide">{bookTitle || 'Okuduğun Kitap'}</h3>
                <p className="text-xs text-zinc-400 font-serif italic">{author || 'Yazar'}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">Sayfa:</span>
              <input
                type="text"
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                className="w-12 bg-black/40 border border-white/20 rounded px-1.5 py-0.5 text-xs text-center text-amber-300 font-mono"
              />
              <button
                onClick={() => {
                  setIsEditing(false);
                  audioManager.playSoftClick();
                }}
                className="p-1 rounded-lg bg-amber-500/30 text-amber-200 text-xs"
              >
                Tamam
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
                audioManager.playSoftClick();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-colors"
              title="Kitap ve sayfa bilgisi düzenle"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-amber-300">s. {currentPage}</span>
            </button>
          )}
        </div>
      </div>

      {/* Quote Section */}
      <div className="relative pt-1">
        <div className="flex items-start gap-2.5">
          <Feather className="w-4 h-4 text-amber-400/70 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-stone-200 font-serif leading-relaxed italic">
              "{quote.text}"
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-amber-300/80 font-medium">
                — {quote.author} {quote.book && <span className="text-zinc-500">({quote.book})</span>}
              </span>
              <button
                onClick={handleNextQuote}
                className="p-1 rounded-md text-zinc-500 hover:text-amber-300 hover:bg-white/5 transition-colors"
                title="Yeni alıntı getir"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
