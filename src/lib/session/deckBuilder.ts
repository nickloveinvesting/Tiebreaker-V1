import { FoodOption, WatchItem, Decision } from '../types';

export function buildFoodDeck(options: FoodOption[], mode: 'cook' | 'out', pastDecisions: Decision[]): string[] {
  // Filter by mode and active
  let valid = options.filter(o => o.active && (o.mode === mode || o.mode === 'both'));
  
  // Find last 3 eat decisions
  const recentEat = pastDecisions
    .filter(d => d.domain === 'eat')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  const recentlyPicked = new Set(recentEat.map(d => d.finalPick));
  
  // Exclude them
  valid = valid.filter(v => !recentlyPicked.has(v.id));
  
  // Shuffle
  valid.sort(() => Math.random() - 0.5);
  
  // Cap at 12
  return valid.slice(0, 12).map(o => o.id);
}

export function buildWatchDeck(items: WatchItem[], pastDecisions: Decision[]): string[] {
  let valid = items.filter(i => i.active);
  
  const recentWatch = pastDecisions
    .filter(d => d.domain === 'watch')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  const recentlyPicked = new Set(recentWatch.map(d => d.finalPick));
  
  valid = valid.filter(v => !recentlyPicked.has(v.id));
  
  valid.sort(() => Math.random() - 0.5);
  
  return valid.slice(0, 12).map(o => o.id);
}
