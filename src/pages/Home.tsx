import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../lib/store';
import { Player, Decision } from '../lib/types';
import AppHeader from '../components/layout/AppHeader';
import { Utensils, Tv } from 'lucide-react';

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [lastPick, setLastPick] = useState<Decision | null>(null);
  const [wins, setWins] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadData() {
      const p = await store.getPlayers();
      const d = await store.getDecisions();
      
      setPlayers(p);
      if (d.length > 0) {
        setLastPick(d[d.length - 1]);
      }
      
      const counts: Record<string, number> = {};
      d.forEach(dec => {
        if (dec.winnerId) {
          counts[dec.winnerId] = (counts[dec.winnerId] || 0) + 1;
        }
      });
      setWins(counts);
    }
    loadData();
  }, []);

  if (players.length < 2) return null;

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader title="Tiebreak" />
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-8">
        
        {/* Scoreboard */}
        <div className="border-[3px] border-ink rounded-2xl overflow-hidden shadow-[6px_6px_0_0_#1A1A1A] bg-white flex mt-4">
          <div className="flex-1 p-4 border-r-[3px] border-ink flex flex-col items-center justify-center">
            <span className="text-4xl font-display font-black" style={{ color: players[0].color }}>{wins[players[0].id] || 0}</span>
            <span className="text-xs uppercase font-black tracking-wider">{players[0].name}</span>
          </div>
          <div className="flex-1 p-4 flex flex-col items-center justify-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-[14px] bg-white border-[3px] border-ink rounded-full p-1 z-10 w-7 h-7 flex items-center justify-center">
              <span className="text-[10px] font-black">VS</span>
            </div>
            <span className="text-4xl font-display font-black" style={{ color: players[1].color }}>{wins[players[1].id] || 0}</span>
            <span className="text-xs uppercase font-black tracking-wider">{players[1].name}</span>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-4">
          <h2 className="font-display text-3xl font-black tracking-tighter leading-tight italic">What are we<br/>deciding tonight?</h2>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            to="/play/eat"
            className="group flex items-center justify-center gap-3 p-6 rounded-[24px] border-[4px] border-ink bg-coral text-ink shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
            style={{ backgroundColor: 'var(--color-coral)' }}
          >
            <Utensils size={32} strokeWidth={2.5} />
            <span className="font-display font-black text-4xl uppercase tracking-tighter">Eat</span>
          </Link>
          
          <Link 
            to="/play/watch"
            className="group flex items-center justify-center gap-3 p-6 rounded-[24px] border-[4px] border-ink bg-teal text-ink shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
            style={{ backgroundColor: 'var(--color-teal)' }}
          >
            <Tv size={32} strokeWidth={2.5} />
            <span className="font-display font-black text-4xl uppercase tracking-tighter">Watch</span>
          </Link>
        </div>

        {/* Last Pick */}
        {lastPick && (
          <div className="mt-auto px-2 py-4">
            <p className="text-center text-sm font-medium text-ink/70">
              Last time, {lastPick.winnerId ? players.find(p => p.id === lastPick.winnerId)?.name + ' won and chose ' : 'you both agreed on '} 
              <span className="font-black text-ink underline decoration-2 underline-offset-2">item {lastPick.finalPick}</span>
              {/* Note: In a real app we'd fetch the name based on id */}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
