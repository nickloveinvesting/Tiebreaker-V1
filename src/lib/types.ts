export type Player = {
  id: string;
  name: string;
  color: string;
};

export type FoodOption = {
  id: string;
  name: string;
  cuisine: string;
  mode: 'cook' | 'out' | 'both';
  emoji?: string;
  active: boolean;
};

export type WatchItem = {
  id: string;
  title: string;
  type: 'movie' | 'show';
  posterUrl?: string;
  active: boolean;
};

export type Decision = {
  id: string;
  date: string; // ISO
  domain: 'eat' | 'watch';
  mode?: 'cook' | 'out';
  deck: string[];
  swipes: Record<string, Record<string, 'yes' | 'no'>>; // playerId -> optionId -> vote
  matches: string[];
  resolution: 'single_match' | 'tiebreak_game' | 'no_match_game';
  gamePlayed?: 'connect4' | 'wordle' | 'trivia';
  winnerId?: string;
  finalPick: string;
};
