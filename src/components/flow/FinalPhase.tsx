import { Player, FoodOption, WatchItem } from '../../lib/types';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import clsx from 'clsx';

export default function FinalPhase({ 
  winnerId, 
  players, 
  candidateSet, 
  options, 
  optionId,
  onPick,
  onDone
}: { 
  winnerId: string | null;
  players: Player[];
  candidateSet?: string[];
  options: (FoodOption | WatchItem)[];
  optionId?: string;
  onPick?: (id: string) => void;
  onDone: () => void;
}) {

  if (optionId) {
    const item = options.find(o => o.id === optionId);
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-8 relative"
      >
        <div className="absolute inset-0 bg-coral/20 pointer-events-none" />
        <Trophy size={64} className="text-coral" />
        <h2 className="text-2xl font-display font-medium uppercase tracking-widest text-ink/70">The Final Decision</h2>
        
        <div className="bg-white border-[4px] border-ink rounded-[32px] p-8 shadow-[12px_12px_0_0_#1A1A1A] flex flex-col items-center w-full relative z-10">
          <div className="text-8xl mb-4">{'emoji' in item! ? (item as FoodOption).emoji : (item as WatchItem).posterUrl}</div>
          <h3 className="text-4xl font-display font-black leading-tight tracking-tighter">{'title' in item! ? (item as WatchItem).title : (item as FoodOption).name}</h3>
        </div>

        <button 
          onClick={onDone}
          className="w-full mt-4 py-6 bg-ink text-cream font-black text-xl uppercase tracking-wider rounded-[24px] border-[4px] border-ink shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all relative z-10"
        >
          Finish
        </button>
      </motion.div>
    );
  }

  // Pick mode
  const winner = players.find(p => p.id === winnerId);
  const candidates = candidateSet!.map(id => options.find(o => o.id === id)!);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col p-4 bg-cream h-full overflow-y-auto"
    >
      <div className="text-center my-6">
        <h2 className="text-2xl font-display font-black" style={{ color: winner?.color }}>
          {winner?.name}, make the call
        </h2>
        <p className="text-ink/70 mt-2 font-medium">Choose the final winner from the remaining options.</p>
      </div>

      <div className="flex flex-col gap-3 pb-[env(safe-area-inset-bottom)] mb-20">
        {candidates.map(c => (
          <button 
            key={c.id}
            onClick={() => onPick && onPick(c.id)}
            className="flex items-center gap-4 bg-white border-[4px] border-ink p-4 rounded-[24px] shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-y-[6px] active:translate-x-[6px] active:shadow-none transition-all text-left"
          >
            <div className="text-4xl">{'emoji' in c ? (c as FoodOption).emoji : (c as WatchItem).posterUrl}</div>
            <div>
              <div className="font-black text-lg leading-tight tracking-tight">{'title' in c ? (c as WatchItem).title : (c as FoodOption).name}</div>
              <div className="text-sm text-ink/60 uppercase tracking-widest font-black mt-1">
                {'cuisine' in c ? (c as FoodOption).cuisine : (c as WatchItem).type}
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
