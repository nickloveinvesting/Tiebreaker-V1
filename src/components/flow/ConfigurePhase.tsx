import { ChefHat, Bike } from 'lucide-react';

export default function ConfigurePhase({ onSelect }: { onSelect: (mode: 'cook' | 'out') => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 text-center pt-10">
      <h2 className="font-display text-4xl font-black tracking-tight">Staying in or ordering out?</h2>
      <div className="flex flex-col gap-4 w-full mt-4">
        <button 
          onClick={() => onSelect('cook')}
          className="flex flex-col items-center justify-center p-8 bg-white border-[4px] border-ink rounded-[24px] shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
        >
          <ChefHat size={48} className="mb-4 text-coral" />
          <span className="font-display font-black text-2xl uppercase">We're Cooking</span>
        </button>
        <button 
          onClick={() => onSelect('out')}
          className="flex flex-col items-center justify-center p-8 bg-white border-[4px] border-ink rounded-[24px] shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
        >
          <Bike size={48} className="mb-4 text-teal" />
          <span className="font-display font-black text-2xl uppercase">Ordering Out</span>
        </button>
      </div>
    </div>
  );
}
