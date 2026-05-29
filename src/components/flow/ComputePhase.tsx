import { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Star, Swords, Grid3X3, Type, HelpCircle as TriviaIcon } from 'lucide-react';
import { FoodOption, WatchItem } from '../../lib/types';
import clsx from 'clsx';

export default function ComputePhase({ 
  matches, 
  options, 
  onNext,
  isMacro
}: { 
  matches: string[], 
  options: (FoodOption | WatchItem)[], 
  onNext: (game?: 'connect4' | 'wordle' | 'trivia') => void,
  isMacro?: boolean
}) {
  const matchedItems = matches.map(id => options.find(o => o.id === id)).filter(Boolean) as (FoodOption | WatchItem)[];
  
  // Game selection state
  const [selectedGame, setSelectedGame] = useState<'connect4' | 'wordle' | 'trivia'>('connect4');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex flex-col items-center text-center mt-8 mb-8 shrink-0">
        {matches.length === 1 && !isMacro ? (
          <>
            <Star size={64} className="text-coral mb-6 animate-pulse" />
            <h2 className="text-4xl font-display font-black mb-4 bg-coral px-6 py-3 border-[4px] border-ink shadow-[8px_8px_0_0_#1A1A1A] rotate-2">It's a Match!</h2>
            <p className="text-lg font-medium mt-2">You both agreed on exactly one thing.</p>
          </>
        ) : matches.length > 0 ? (
          <>
            <Swords size={64} className="text-teal mb-6" />
            <h2 className="text-4xl font-display font-black mb-4 bg-teal px-6 py-3 border-[4px] border-ink shadow-[8px_8px_0_0_#1A1A1A] -rotate-2">{isMacro ? 'Categories Matched!' : 'Tiebreak!'}</h2>
            <p className="text-lg font-medium mt-2">{isMacro ? `We found ${matches.length} genres you agree on.` : `You matched on ${matches.length} items!`}</p>
          </>
        ) : (
           <>
            <HelpCircle size={64} className="text-ink mb-6" />
            <h2 className="text-4xl font-display font-black mb-4 bg-white px-6 py-3 border-[4px] border-ink shadow-[8px_8px_0_0_#1A1A1A]">No Matches</h2>
            <p className="text-lg font-medium mt-2">You agreed on nothing. {isMacro ? 'Time to start over.' : 'Choose a game to play for the rights to pick from the full list.'}</p>
           </>
        )}
      </div>
      
      {matches.length > 0 && (
         <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
               hidden: {},
               visible: {
                  transition: { staggerChildren: 0.3 } // More noticeable stagger
               }
            }}
            className="flex flex-col gap-4 mb-10 shrink-0 select-none pointer-events-none"
         >
            {matchedItems.map((item, idx) => (
                <motion.div 
                   key={item.id} 
                   variants={{
                      hidden: { scale: 0.5, opacity: 0, y: 50 },
                      visible: { 
                         scale: 1, 
                         opacity: 1, 
                         y: 0,
                         transition: { type: 'spring', bounce: 0.7, duration: 0.8 }
                      }
                   }}
                   className="flex relative items-center gap-4 p-4 bg-white border-[4px] border-ink rounded-[24px] shadow-[6px_6px_0_0_#1A1A1A] transform rotate-1 hover:rotate-0 transition-transform"
                >
                   <div className="absolute -top-3 -left-3 w-8 h-8 bg-coral text-white font-black flex items-center justify-center rounded-full border-[3px] border-ink shadow-[2px_2px_0_0_#1A1A1A] rotate-[-10deg]">
                     {idx + 1}
                   </div>
                   <div className="text-4xl bg-cream w-16 h-16 flex items-center justify-center rounded-[16px] border-[4px] border-ink shadow-[4px_4px_0_0_#1A1A1A] overflow-hidden">
                      {(() => {
                         const visual = 'emoji' in item ? (item as FoodOption).emoji : (item as WatchItem).posterUrl;
                         if (visual?.startsWith('http')) return <img src={visual} className="w-full h-full object-cover" />;
                         return visual;
                      })()}
                   </div>
                   <div className="flex flex-col text-left">
                      <span className="font-display font-black text-2xl leading-tight tracking-tight">{'title' in item ? (item as WatchItem).title : (item as FoodOption).name}</span>
                      <span className="text-xs uppercase font-black text-ink/50 tracking-widest mt-1">{'cuisine' in item ? (item as FoodOption).cuisine : (item as WatchItem).type}</span>
                   </div>
                </motion.div>
            ))}
         </motion.div>
      )}

      {matches.length !== 1 && (
         <div className="mt-8 shrink-0 pb-12 w-full max-w-sm mx-auto">
            {isMacro || matches.length === 0 ? (
               <button 
                  onClick={() => onNext()}
                  className="w-full py-6 mt-4 border-[4px] border-ink bg-white font-black text-xl uppercase tracking-wider rounded-[24px] shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
               >
                 {matches.length > 0 ? "Show Items" : "Continue"}
               </button>
            ) : (
               <>
                <h3 className="font-display font-black text-2xl mb-4 text-center">Solve it with a game</h3>
                
                <div className="flex flex-col gap-3">
                   <button 
                      onClick={() => setSelectedGame('connect4')}
                      className={clsx("flex items-center gap-4 p-4 border-[4px] border-ink rounded-[24px] transition-all text-left group", selectedGame === 'connect4' ? 'bg-coral shadow-[6px_6px_0_0_#1A1A1A] translate-x-[2px] translate-y-[2px]' : 'bg-white hover:bg-black/5 opacity-70')}
                   >
                     <Grid3X3 size={32} className={clsx(selectedGame === 'connect4' ? 'text-ink' : 'text-ink')} />
                     <span className="font-display font-black text-xl">Connect 4</span>
                   </button>
                   <button 
                      onClick={() => setSelectedGame('wordle')}
                      className={clsx("flex items-center gap-4 p-4 border-[4px] border-ink rounded-[24px] transition-all text-left group", selectedGame === 'wordle' ? 'bg-teal shadow-[6px_6px_0_0_#1A1A1A] translate-x-[2px] translate-y-[2px]' : 'bg-white hover:bg-black/5 opacity-70')}
                   >
                     <Type size={32} className={clsx(selectedGame === 'wordle' ? 'text-ink' : 'text-ink')} />
                     <span className="font-display font-black text-xl">Wordle (1v1)</span>
                   </button>
                   <button 
                      onClick={() => setSelectedGame('trivia')}
                      className={clsx("flex items-center gap-4 p-4 border-[4px] border-ink rounded-[24px] transition-all text-left group", selectedGame === 'trivia' ? 'bg-[#FFEB3B] shadow-[6px_6px_0_0_#1A1A1A] translate-x-[2px] translate-y-[2px]' : 'bg-white hover:bg-black/5 opacity-70')}
                   >
                     <TriviaIcon size={32} className={clsx(selectedGame === 'trivia' ? 'text-ink' : 'text-ink')} />
                     <span className="font-display font-black text-xl">Tossup Trivia</span>
                   </button>
                </div>
               </>
            )}
         </div>
      )}

      {(!isMacro && matches.length > 0) && (
          <button 
            onClick={() => onNext(matches.length === 1 ? undefined : selectedGame)}
            className="w-full mt-auto py-6 bg-ink text-cream font-black text-xl uppercase tracking-wider rounded-[24px] border-[4px] border-ink shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all mb-8 shrink-0 max-w-sm mx-auto"
          >
            {matches.length === 1 ? 'Continue' : `Play ${selectedGame === 'connect4' ? 'Connect 4' : selectedGame === 'wordle' ? 'Wordle' : 'Trivia'}`}
          </button>
      )}
    </motion.div>
  );
}
