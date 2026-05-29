import { useEffect, useState } from 'react';
import { store } from '../lib/store';
import { Decision, Player, FoodOption, WatchItem } from '../lib/types';
import AppHeader from '../components/layout/AppHeader';

export default function History() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [options, setOptions] = useState<(FoodOption | WatchItem)[]>([]);

  useEffect(() => {
    async function load() {
      const d = await store.getDecisions();
      const p = await store.getPlayers();
      const f = await store.getFoodOptions();
      const w = await store.getWatchItems();
      
      setDecisions(d.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setPlayers(p);
      setOptions([...f, ...w]);
    }
    load();
  }, []);

  return (
    <div className="flex-1 flex flex-col pb-16 h-full">
      <AppHeader title="History" />
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {decisions.length === 0 ? (
          <div className="text-center text-ink/50 mt-10 font-medium">No decisions yet. Start swiping!</div>
        ) : (
          decisions.map(d => {
            const item = options.find(o => o.id === d.finalPick);
            const winner = d.winnerId ? players.find(p => p.id === d.winnerId) : null;
            
            return (
              <div key={d.id} className="bg-white border-[3px] border-ink p-4 rounded-[24px] shadow-[6px_6px_0_0_#1A1A1A] flex gap-4 items-center">
                <div className="text-4xl bg-cream w-16 h-16 rounded-[16px] border-[3px] border-ink flex items-center justify-center -rotate-3 overflow-hidden shadow-[3px_3px_0_0_#1A1A1A]">
                  {item ? ('emoji' in item ? item.emoji : item.posterUrl) : '?'}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-black text-xl leading-tight tracking-tight">
                    {item ? (item.title || (item as any).name) : 'Unknown'}
                  </h3>
                  <div className="text-[10px] uppercase font-black tracking-widest text-ink/60 mt-1 flex items-center gap-2">
                    <span className="bg-ink/5 px-2 py-1 rounded-md">{new Date(d.date).toLocaleDateString()}</span>
                    <span>{d.domain}</span>
                  </div>
                  <div className="text-sm font-medium mt-2">
                    {d.resolution === 'single_match' ? (
                      <span className="text-teal font-black uppercase tracking-widest text-[10px] bg-teal/10 px-2 py-1 border-[2px] border-teal rounded-full">Mutual Match</span>
                    ) : (
                      <span className="text-coral font-black uppercase tracking-widest text-[10px] bg-coral/10 px-2 py-1 border-[2px] border-coral rounded-full">
                        {winner?.name} won {d.gamePlayed}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
