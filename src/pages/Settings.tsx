import { useEffect, useState } from 'react';
import { store } from '../lib/store';
import { Player } from '../lib/types';
import AppHeader from '../components/layout/AppHeader';

export default function Settings() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    store.getPlayers().then(setPlayers);
  }, []);

  const updatePlayerName = async (id: string, name: string) => {
    const updated = players.map(p => p.id === id ? { ...p, name } : p);
    setPlayers(updated);
    const pInfo = updated.find(p => p.id === id);
    if (pInfo) {
      await store.updatePlayer(pInfo);
    }
  };

  const resetData = async () => {
    if (confirm("Reset everything? This deletes all history.")) {
      await store.resetData();
      window.location.href = '/';
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-16 h-full bg-cream">
      <AppHeader title="Settings" backTo="/" />
      
      <div className="p-6 flex flex-col gap-8">
        
        <section>
          <h2 className="font-display font-black text-2xl mb-4 tracking-tighter">Players</h2>
          <div className="flex flex-col gap-4">
            {players.map((p, i) => (
              <div key={p.id} className="relative z-10 p-4 border-[3px] border-ink rounded-[24px] bg-white shadow-[6px_6px_0_0_#1A1A1A]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full border-[3px] border-ink shadow-[2px_2px_0_0_#1A1A1A]" style={{ backgroundColor: p.color }} />
                  <span className="font-black text-sm uppercase tracking-widest text-ink/50">Player {i + 1}</span>
                </div>
                <input 
                  type="text" 
                  value={p.name}
                  onChange={(e) => updatePlayerName(p.id, e.target.value)}
                  className="w-full text-2xl font-display font-black tracking-tight bg-transparent outline-none border-b-[3px] border-ink/20 focus:border-ink transition-colors pb-1"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 pt-8 border-t-[3px] border-ink border-dashed">
          <h2 className="font-display font-black text-2xl mb-4 text-red-600 tracking-tighter">Danger Zone</h2>
          <button 
            onClick={resetData}
            className="w-full py-4 bg-white text-red-600 font-black uppercase tracking-wider rounded-[24px] border-[4px] border-red-600 shadow-[8px_8px_0_0_#DC2626] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
          >
            Reset All Data
          </button>
          <p className="text-center text-xs text-ink/50 mt-4 px-4 leading-relaxed">
            This clears history, custom options, names, and the scoreboard. Default seed data will reload on the next app start.
          </p>
        </section>
        
      </div>
    </div>
  );
}
