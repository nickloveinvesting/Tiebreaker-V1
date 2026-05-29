import { Player, FoodOption, WatchItem, Decision } from '../types';

export interface DataStore {
  // Players
  getPlayers(): Promise<Player[]>;
  updatePlayer(player: Player): Promise<void>;
  
  // Options
  getFoodOptions(): Promise<FoodOption[]>;
  updateFoodOption(option: FoodOption): Promise<void>;
  addFoodOption(option: FoodOption): Promise<void>;
  
  getWatchItems(): Promise<WatchItem[]>;
  updateWatchItem(item: WatchItem): Promise<void>;
  addWatchItem(item: WatchItem): Promise<void>;
  
  // Decisions
  getDecisions(): Promise<Decision[]>;
  addDecision(decision: Decision): Promise<void>;
  
  // Admin
  resetData(): Promise<void>;
  hasData(): Promise<boolean>;
}
