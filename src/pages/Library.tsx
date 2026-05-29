import React, { useEffect, useState } from 'react';
import { store } from '../lib/store';
import { FoodOption, WatchItem } from '../lib/types';
import AppHeader from '../components/layout/AppHeader';
import { clsx } from 'clsx';
import { Check, Plus, X, Navigation, Film } from 'lucide-react';

export default function Library() {
  const [tab, setTab] = useState<'eat' | 'watch'>('eat');
  const [food, setFood] = useState<FoodOption[]>([]);
  const [watch, setWatch] = useState<WatchItem[]>([]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('');
  const [newDetail, setNewDetail] = useState('');
  
  const [loadingLive, setLoadingLive] = useState(false);

  useEffect(() => {
    async function load() {
      setFood(await store.getFoodOptions());
      setWatch(await store.getWatchItems());
    }
    load();
  }, []);

  const toggleFoodActive = async (option: FoodOption) => {
    const updated = { ...option, active: !option.active };
    await store.updateFoodOption(updated);
    setFood(food.map(f => f.id === option.id ? updated : f));
  };

  const toggleWatchActive = async (item: WatchItem) => {
    const updated = { ...item, active: !item.active };
    await store.updateWatchItem(updated);
    setWatch(watch.map(w => w.id === item.id ? updated : w));
  };

  const fetchLiveFood = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingLive(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`/api/places/nearby?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        let currentFood = [...food];
        for (const item of data) {
           if (!currentFood.find(f => f.id === item.id)) {
             await store.addFoodOption(item);
             currentFood.push(item);
           }
        }
        setFood(currentFood);
      } catch (err: any) {
        alert("Failed to fetch restaurants: " + err.message);
      } finally {
        setLoadingLive(false);
      }
    }, (err) => {
      setLoadingLive(false);
      alert("Failed to get location: " + err.message);
    });
  };

  const fetchLiveWatch = async () => {
    setLoadingLive(true);
    try {
      const res = await fetch(`/api/tmdb/trending`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      let currentWatch = [...watch];
      for (const item of data) {
         if (!currentWatch.find(w => w.id === item.id)) {
           await store.addWatchItem(item);
           currentWatch.push(item);
         }
      }
      setWatch(currentWatch);
    } catch (err: any) {
      alert("Failed to fetch movies/shows: " + err.message);
    } finally {
      setLoadingLive(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmoji) return;

    if (tab === 'eat') {
      const newOption: FoodOption = {
        id: 'food_' + Date.now(),
        name: newName,
        emoji: newEmoji,
        cuisine: newDetail || 'General',
        mode: 'cook', // By default, could be added to both or specific
        active: true
      };
      await store.addFoodOption(newOption);
      setFood([...food, newOption]);
    } else {
      const isMovie = (newDetail || 'movie').toLowerCase().includes('movie');
      const newOption: WatchItem = {
        id: 'watch_' + Date.now(),
        title: newName,
        posterUrl: newEmoji,
        genre: 'General',
        type: isMovie ? 'movie' : 'show',
        active: true
      };
      await store.addWatchItem(newOption);
      setWatch([...watch, newOption]);
    }

    setIsAdding(false);
    setNewName('');
    setNewEmoji('');
    setNewDetail('');
  };

  return (
    <div className="flex-1 flex flex-col pb-16 h-full">
      <AppHeader title="Library" />
      
      <div className="flex p-4 pb-0 gap-2 shrink-0 items-end">
        <button 
          onClick={() => setTab('eat')}
          className={clsx("flex-1 py-3 font-black uppercase tracking-widest text-xs rounded-t-[16px] border-[3px] border-b-0 border-ink transition-colors", tab === 'eat' ? 'bg-coral text-ink' : 'bg-ink/5 text-ink/50 border-transparent')}
        >
          Food
        </button>
        <button 
          onClick={() => setTab('watch')}
          className={clsx("flex-1 py-3 font-black uppercase tracking-widest text-xs rounded-t-[16px] border-[3px] border-b-0 border-ink transition-colors", tab === 'watch' ? 'bg-teal text-ink' : 'bg-ink/5 text-ink/50 border-transparent')}
        >
          Watch
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white border-t-[3px] border-ink w-full relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1A1A1A22_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {tab === 'eat' && (
           <div className="relative z-10 flex justify-center mb-2">
             <button
               onClick={fetchLiveFood}
               disabled={loadingLive}
               className="flex items-center gap-2 px-6 py-3 bg-coral text-ink border-[3px] border-ink rounded-[16px] shadow-[4px_4px_0_0_#1A1A1A] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#1A1A1A] transition-all font-black uppercase tracking-widest text-xs disabled:opacity-50"
             >
               <Navigation size={16} strokeWidth={3} />
               {loadingLive ? 'Scanning...' : 'Find Restaurants Near Me'}
             </button>
           </div>
        )}
        
        {tab === 'watch' && (
           <div className="relative z-10 flex justify-center mb-2">
             <button
               onClick={fetchLiveWatch}
               disabled={loadingLive}
               className="flex items-center gap-2 px-6 py-3 bg-teal text-white border-[3px] border-ink rounded-[16px] shadow-[4px_4px_0_0_#1A1A1A] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#1A1A1A] transition-all font-black uppercase tracking-widest text-xs disabled:opacity-50 text-ink"
             >
               <Film size={16} strokeWidth={3} className="text-ink" />
               <span className="text-ink">{loadingLive ? 'Syncing...' : 'Trending on Netflix/Hulu/HBO'}</span>
             </button>
           </div>
        )}
        
        {tab === 'eat' && food.map(f => (
          <div key={f.id} className="relative z-10 flex items-center justify-between p-3 border-[3px] border-ink rounded-[24px] bg-white shadow-[4px_4px_0_0_#1A1A1A]">
            <div className="flex items-center gap-3">
               <div className="text-3xl bg-cream w-12 h-12 flex items-center justify-center rounded-[12px] border-[3px] border-ink shadow-[2px_2px_0_0_#1A1A1A] overflow-hidden">
                 {f.emoji?.startsWith('http') ? <img src={f.emoji} className="w-full h-full object-cover" /> : f.emoji}
               </div>
              <div className="flex flex-col">
                <span className={clsx("font-display font-black text-lg leading-tight transition-opacity tracking-tight", !f.active && "opacity-40 line-through")}>{f.name}</span>
                <span className="text-[10px] uppercase font-black text-ink/50 tracking-widest">{f.cuisine} • {f.mode}</span>
              </div>
            </div>
            <button 
              onClick={() => toggleFoodActive(f)}
              className={clsx("w-8 h-8 rounded-full border-[3px] border-ink flex items-center justify-center transition-colors shadow-[2px_2px_0_0_#1A1A1A]", f.active ? 'bg-coral text-white' : 'bg-cream text-transparent')}
            >
              <Check size={16} strokeWidth={3} />
            </button>
          </div>
        ))}

        {tab === 'watch' && watch.map(w => (
          <div key={w.id} className="relative z-10 flex items-center justify-between p-3 border-[3px] border-ink rounded-[24px] bg-white shadow-[4px_4px_0_0_#1A1A1A]">
            <div className="flex items-center gap-3">
              <div className="text-3xl bg-cream w-12 h-12 flex items-center justify-center rounded-[12px] border-[3px] border-ink shadow-[2px_2px_0_0_#1A1A1A] overflow-hidden">
                {w.posterUrl?.startsWith('http') ? <img src={w.posterUrl} className="w-full h-full object-cover" /> : w.posterUrl}
              </div>
              <div className="flex flex-col">
                <span className={clsx("font-display font-black text-lg leading-tight transition-opacity tracking-tight", !w.active && "opacity-40 line-through")}>{w.title}</span>
                <span className="text-[10px] uppercase font-black text-ink/50 tracking-widest">{w.type}</span>
              </div>
            </div>
            <button 
              onClick={() => toggleWatchActive(w)}
              className={clsx("w-8 h-8 rounded-full border-[3px] border-ink flex items-center justify-center transition-colors shadow-[2px_2px_0_0_#1A1A1A]", w.active ? 'bg-teal text-white' : 'bg-cream text-transparent')}
            >
              <Check size={16} strokeWidth={3} />
            </button>
          </div>
        ))}
        
        <div className="py-4 flex justify-center sticky bottom-0 z-20">
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white border-[3px] border-ink rounded-full shadow-[4px_4px_0_0_#1A1A1A] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#1A1A1A] transition-all font-black uppercase tracking-widest text-xs"
          >
            <Plus size={16} strokeWidth={3} />
            Add {tab === 'eat' ? 'Food' : 'Watch'} Option
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 bg-ink/80 flex justify-center items-end sm:items-center p-4">
          <form 
            onSubmit={handleAdd}
            className="bg-cream w-full max-w-sm border-[4px] border-ink rounded-[32px] p-6 shadow-[12px_12px_0_0_#1A1A1A] animate-in slide-in-from-bottom flex flex-col gap-4 relative"
          >
            <button type="button" onClick={() => setIsAdding(false)} className="absolute top-4 right-4 p-2 text-ink hover:text-ink/70">
              <X size={24} strokeWidth={3} />
            </button>
            <h2 className="font-display font-black text-2xl tracking-tighter pr-8">
              New {tab === 'eat' ? 'Food' : 'Watch'}
            </h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-black tracking-widest text-ink/70">{tab === 'eat' ? 'Name' : 'Title'}</label>
              <input 
                autoFocus
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-white border-[3px] border-ink rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-[3px] focus:ring-ink"
                placeholder={tab === 'eat' ? 'e.g. Sushi' : 'e.g. The Matrix'}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/3">
                <label className="text-xs uppercase font-black tracking-widest text-ink/70">{tab === 'eat' ? 'Emoji' : 'Emoji/Icon'}</label>
                <input 
                  required
                  value={newEmoji}
                  onChange={e => setNewEmoji(e.target.value)}
                  className="w-full bg-white border-[3px] border-ink rounded-xl px-4 py-3 font-bold text-center text-xl focus:outline-none focus:ring-[3px] focus:ring-ink"
                  placeholder="🍣"
                  maxLength={4}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-xs uppercase font-black tracking-widest text-ink/70">{tab === 'eat' ? 'Cuisine / Detail' : 'Type / Genre'}</label>
                <input 
                  value={newDetail}
                  onChange={e => setNewDetail(e.target.value)}
                  className="w-full bg-white border-[3px] border-ink rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-[3px] focus:ring-ink"
                  placeholder={tab === 'eat' ? 'e.g. Japanese' : 'e.g. Sci-Fi'}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="mt-4 w-full py-4 bg-ink text-white font-black text-lg uppercase tracking-wider rounded-[16px] border-[3px] border-ink shadow-[4px_4px_0_0_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
            >
              Add Option
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
