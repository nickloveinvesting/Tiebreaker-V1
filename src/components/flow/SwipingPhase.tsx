import { useState } from 'react';
import { FoodOption, WatchItem } from '../../lib/types';
import SwipeCard from '../swipe/SwipeCard';
import { ThumbsDown, ThumbsUp, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SwipingPhase({ 
  playerId, 
  playerName, 
  playerColor,
  deck, 
  options, 
  onSwipe, 
  onUndo,
  onComplete 
}: { 
  playerId: string;
  playerName: string;
  playerColor: string;
  deck: string[];
  options: (FoodOption | WatchItem)[];
  onSwipe: (id: string, vote: 'yes' | 'no') => void;
  onUndo?: (id: string) => void;
  onComplete: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (id: string, vote: 'yes' | 'no') => {
    onSwipe(id, vote);
    if (currentIndex + 1 >= deck.length) {
      setTimeout(onComplete, 300);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevOptionId = deck[prevIndex];
      setCurrentIndex(prevIndex);
      if (onUndo) {
        onUndo(prevOptionId);
      }
    }
  };

  const currentOptionId = deck[currentIndex];

  return (
    <div className="flex-1 flex flex-col h-full bg-cream relative p-4 pb-[env(safe-area-inset-bottom)]">
      
      <div className="text-center py-4 flex justify-between items-center z-10">
        <span className="font-black uppercase tracking-widest text-xs" style={{ color: playerColor }}>
          {playerName}'s Turn
        </span>
        <span className="font-black text-ink/40 text-xs">
          {currentIndex + 1} / {deck.length}
        </span>
      </div>

      <div className="relative flex-1 w-full max-w-sm mx-auto flex items-center justify-center mt-4">
        <AnimatePresence>
          {deck.map((id, index) => {
            if (index < currentIndex) return null; // Already swiped
            if (index > currentIndex + 2) return null; // Don't render too many unseen
            
            const item = options.find(o => o.id === id);
            if (!item) return null;

            return (
              <div key={id} className="absolute inset-0 z-0">
                <SwipeCard 
                  item={item} 
                  active={index === currentIndex} 
                  playerColor={playerColor}
                  onSwipe={handleSwipe} 
                />
              </div>
            );
          }).reverse()}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-8 py-8 mt-auto z-10 mb-8 items-center">
        <button 
          onClick={() => currentOptionId && handleSwipe(currentOptionId, 'no')}
          className="w-20 h-20 rounded-full border-[4px] border-ink bg-red-500 flex items-center justify-center shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all text-white shrink-0"
        >
          <ThumbsDown size={36} strokeWidth={4} />
        </button>

        <button 
          onClick={handleUndo}
          disabled={currentIndex === 0}
          className="w-14 h-14 rounded-full border-[3px] border-ink bg-cream flex items-center justify-center shadow-[4px_4px_0_0_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none shrink-0"
          title="Undo previous swipe"
        >
          <RotateCcw size={24} strokeWidth={3} className="text-ink" />
        </button>

        <button 
          onClick={() => currentOptionId && handleSwipe(currentOptionId, 'yes')}
          className="w-20 h-20 rounded-full border-[4px] border-ink bg-green-500 flex items-center justify-center shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all text-white shrink-0"
        >
          <ThumbsUp size={36} strokeWidth={4} />
        </button>
      </div>

    </div>
  );
}
