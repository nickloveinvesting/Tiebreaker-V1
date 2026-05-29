import { DataStore } from './DataStore';
import { Player, FoodOption, WatchItem, Decision } from '../types';

const KEYS = {
  PLAYERS: 'tiebreak_players',
  FOOD: 'tiebreak_food',
  WATCH: 'tiebreak_watch',
  DECISIONS: 'tiebreak_decisions',
  INITIALIZED: 'tiebreak_initialized',
};

const isBrowser = typeof window !== 'undefined';

export class LocalStorageStore implements DataStore {
  private getItem<T>(key: string, defaultValue: T): T {
    if (!isBrowser) return defaultValue;
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    try {
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  async getPlayers(): Promise<Player[]> {
    return this.getItem<Player[]>(KEYS.PLAYERS, []);
  }

  async updatePlayer(player: Player): Promise<void> {
    const players = await this.getPlayers();
    const index = players.findIndex(p => p.id === player.id);
    if (index >= 0) {
      players[index] = player;
    } else {
      players.push(player);
    }
    this.setItem(KEYS.PLAYERS, players);
  }

  async getFoodOptions(): Promise<FoodOption[]> {
    return this.getItem<FoodOption[]>(KEYS.FOOD, []);
  }

  async updateFoodOption(option: FoodOption): Promise<void> {
    const items = await this.getFoodOptions();
    const index = items.findIndex(i => i.id === option.id);
    if (index >= 0) {
      items[index] = option;
      this.setItem(KEYS.FOOD, items);
    }
  }

  async addFoodOption(option: FoodOption): Promise<void> {
    const items = await this.getFoodOptions();
    items.push(option);
    this.setItem(KEYS.FOOD, items);
  }

  async getWatchItems(): Promise<WatchItem[]> {
    return this.getItem<WatchItem[]>(KEYS.WATCH, []);
  }

  async updateWatchItem(item: WatchItem): Promise<void> {
    const items = await this.getWatchItems();
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
      this.setItem(KEYS.WATCH, items);
    }
  }

  async addWatchItem(item: WatchItem): Promise<void> {
    const items = await this.getWatchItems();
    items.push(item);
    this.setItem(KEYS.WATCH, items);
  }

  async getDecisions(): Promise<Decision[]> {
    return this.getItem<Decision[]>(KEYS.DECISIONS, []);
  }

  async addDecision(decision: Decision): Promise<void> {
    const decisions = await this.getDecisions();
    decisions.push(decision);
    this.setItem(KEYS.DECISIONS, decisions);
  }

  async resetData(): Promise<void> {
    if (!isBrowser) return;
    localStorage.removeItem(KEYS.PLAYERS);
    localStorage.removeItem(KEYS.FOOD);
    localStorage.removeItem(KEYS.WATCH);
    localStorage.removeItem(KEYS.DECISIONS);
    localStorage.removeItem(KEYS.INITIALIZED);
  }

  async hasData(): Promise<boolean> {
    if (!isBrowser) return false;
    return localStorage.getItem(KEYS.INITIALIZED) === 'true';
  }

  // Admin access to set seed data
  async seedInitialData(players: Player[], food: FoodOption[], watch: WatchItem[]): Promise<void> {
    this.setItem(KEYS.PLAYERS, players);
    this.setItem(KEYS.FOOD, food);
    this.setItem(KEYS.WATCH, watch);
    this.setItem(KEYS.DECISIONS, []);
    this.setItem(KEYS.INITIALIZED, 'true');
  }
}
