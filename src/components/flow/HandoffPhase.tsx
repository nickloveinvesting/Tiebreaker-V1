import { Share2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function HandoffPhase({ nextPlayerName, nextPlayerColor, onReady }: { nextPlayerName: string; nextPlayerColor: string; onReady: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center p-6 text-center"
    >
      <div 
        className="w-24 h-24 rounded-full border-[4px] border-ink flex items-center justify-center mb-8 shadow-[8px_8px_0_0_#1A1A1A]"
        style={{ backgroundColor: nextPlayerColor }}
      >
        <Share2 size={40} className="text-white" />
      </div>
      <h2 className="text-4xl font-display font-black mb-4">Pass the phone to {nextPlayerName}</h2>
      <p className="text-ink/70 mb-12">No peeking at the answers.</p>
      
      <button 
        onClick={onReady}
        className="w-full py-6 bg-ink text-cream font-black uppercase tracking-wider rounded-[24px] border-[4px] border-ink shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all text-xl"
        style={{ backgroundColor: nextPlayerColor, color: '#1A1A1A' }}
      >
        I'm {nextPlayerName}, I'm Ready
      </button>
    </motion.div>
  );
}
