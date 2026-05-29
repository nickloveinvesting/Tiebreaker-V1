import { useEffect, useState } from 'react';
import { store } from '../lib/store';
import { Decision, Player } from '../lib/types';
import AppHeader from '../components/layout/AppHeader';

export default function Scoreboard() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    async function load() {
      const d = await store.getDecisions();
      const p = await store.getPlayers();
      setDecisions(d);
      setPlayers(p);
    }
    load();
  }, []);

  const scores = players.map(p => ({
    ...p,
    wins: decisions.filter(d => d.winnerId === p.id).length
  })).sort((a, b) => b.wins - a.wins);

  return (
    <div className="flex-1 flex flex-col pb-16 h-full">
      <AppHeader title="Scoreboard" />
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        
        <div className="flex flex-col items-center justify-center my-8">
          <h2 className="text-5xl font-display font-black tracking-tighter text-ink uppercase mb-2">VS</h2>
          <p className="font-medium text-ink/60 tracking-widest uppercase text-sm">All Time Wins</p>
        </div>

        <div className="flex flex-col gap-6">
          {scores.map((player, idx) => (
            <div 
              key={player.id} 
              className="bg-white border-[4px] border-ink p-6 rounded-[32px] shadow-[8px_8px_0_0_#1A1A1A] flex items-center justify-between relative overflow-hidden"
            >
              {idx === 0 && scores.length > 1 && scores[0].wins > scores[1].wins && (
                <div className="absolute top-0 right-0 bg-coral text-white font-black text-xs uppercase tracking-widest px-4 py-1 rounded-bl-[16px] border-b-[4px] border-l-[4px] border-ink">
                  Leading
                </div>
              )}
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-[16px] border-[4px] border-ink flex items-center justify-center font-display font-black text-3xl shadow-[4px_4px_0_0_#1A1A1A]"
                  style={{ backgroundColor: player.color, color: '#fff' }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-display font-black text-3xl leading-none tracking-tight">{player.name}</h3>
              </div>
              <div className="text-6xl font-display font-black text-ink pr-2">
                {player.wins}
              </div>
            </div>
          ))}
        </div>

        {decisions.length === 0 && (
          <div className="text-center text-ink/50 mt-10 font-medium">No games played yet.</div>
        )}
      </div>
    </div>
  );
}
