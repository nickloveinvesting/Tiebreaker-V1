import { v4 as uuidv4 } from 'uuid';
import { Player, FoodOption, WatchItem } from '../types';
import { storeInstance } from '../store';

const SEED_PLAYERS: Player[] = [
  { id: uuidv4(), name: 'Player 1', color: '#FF5A47' }, // Coral
  { id: uuidv4(), name: 'Player 2', color: '#1FB8A6' }, // Teal
];

const SEED_FOOD: FoodOption[] = [
  { id: uuidv4(), name: 'Pizza', cuisine: 'Italian', mode: 'out', emoji: '🍕', active: true },
  { id: uuidv4(), name: 'Sushi', cuisine: 'Japanese', mode: 'out', emoji: '🍣', active: true },
  { id: uuidv4(), name: 'Tacos', cuisine: 'Mexican', mode: 'both', emoji: '🌮', active: true },
  { id: uuidv4(), name: 'Burgers', cuisine: 'American', mode: 'both', emoji: '🍔', active: true },
  { id: uuidv4(), name: 'Pasta', cuisine: 'Italian', mode: 'cook', emoji: '🍝', active: true },
  { id: uuidv4(), name: 'Thai Curry', cuisine: 'Thai', mode: 'out', emoji: '🍛', active: true },
  { id: uuidv4(), name: 'Salad', cuisine: 'Healthy', mode: 'cook', emoji: '🥗', active: true },
  { id: uuidv4(), name: 'Indian', cuisine: 'Indian', mode: 'out', emoji: '🥘', active: true },
  { id: uuidv4(), name: 'Steak', cuisine: 'American', mode: 'cook', emoji: '🥩', active: true },
  { id: uuidv4(), name: 'Ramen', cuisine: 'Japanese', mode: 'out', emoji: '🍜', active: true },
  { id: uuidv4(), name: 'Stir Fry', cuisine: 'Asian', mode: 'cook', emoji: '🍳', active: true },
  { id: uuidv4(), name: 'Fried Chicken', cuisine: 'Southern', mode: 'out', emoji: '🍗', active: true },
  { id: uuidv4(), name: 'Korean BBQ', cuisine: 'Korean', mode: 'out', emoji: '🥓', active: true },
  { id: uuidv4(), name: 'Soup', cuisine: 'Comfort', mode: 'cook', emoji: '🥣', active: true },
  { id: uuidv4(), name: 'Sandwich', cuisine: 'Deli', mode: 'both', emoji: '🥪', active: true },
  { id: uuidv4(), name: 'Hot Dog', cuisine: 'American', mode: 'out', emoji: '🌭', active: true },
  { id: uuidv4(), name: 'Dim Sum', cuisine: 'Chinese', mode: 'out', emoji: '🥟', active: true },
  { id: uuidv4(), name: 'Fish & Chips', cuisine: 'British', mode: 'out', emoji: '🐟', active: true },
  { id: uuidv4(), name: 'Bento', cuisine: 'Japanese', mode: 'out', emoji: '🍱', active: true },
  { id: uuidv4(), name: 'Falafel', cuisine: 'Middle Eastern', mode: 'both', emoji: '🧆', active: true }
];

const SEED_WATCH: WatchItem[] = [
  { id: uuidv4(), title: 'The Bear', type: 'show', posterUrl: '🐻', active: true },
  { id: uuidv4(), title: 'Dune', type: 'movie', posterUrl: '🏜️', active: true },
  { id: uuidv4(), title: 'Severance', type: 'show', posterUrl: '🏢', active: true },
  { id: uuidv4(), title: 'Everything Everywhere', type: 'movie', posterUrl: '🥯', active: true },
  { id: uuidv4(), title: 'Stranger Things', type: 'show', posterUrl: '🚲', active: true },
  { id: uuidv4(), title: 'Spider-Verse', type: 'movie', posterUrl: '🕷️', active: true },
  { id: uuidv4(), title: 'Succession', type: 'show', posterUrl: '📈', active: true },
  { id: uuidv4(), title: 'Knives Out', type: 'movie', posterUrl: '🗡️', active: true },
  { id: uuidv4(), title: 'The Office', type: 'show', posterUrl: '🖨️', active: true },
  { id: uuidv4(), title: 'Parasite', type: 'movie', posterUrl: '🏠', active: true },
  { id: uuidv4(), title: 'White Lotus', type: 'show', posterUrl: '🌺', active: true },
  { id: uuidv4(), title: 'Mad Max', type: 'movie', posterUrl: '🚗', active: true },
  { id: uuidv4(), title: 'Breaking Bad', type: 'show', posterUrl: '⚗️', active: true },
  { id: uuidv4(), title: 'Interstellar', type: 'movie', posterUrl: '🚀', active: true },
  { id: uuidv4(), title: 'Game of Thrones', type: 'show', posterUrl: '🐉', active: true },
  { id: uuidv4(), title: 'Avengers', type: 'movie', posterUrl: '🛡️', active: true },
  { id: uuidv4(), title: 'The Matrix', type: 'movie', posterUrl: '💊', active: true },
  { id: uuidv4(), title: 'Friends', type: 'show', posterUrl: '☕', active: true },
  { id: uuidv4(), title: 'Inception', type: 'movie', posterUrl: '🌀', active: true },
  { id: uuidv4(), title: 'The Sopranos', type: 'show', posterUrl: '🚬', active: true },
  { id: uuidv4(), title: 'Spirited Away', type: 'movie', posterUrl: '🐉', active: true },
  { id: uuidv4(), title: 'Better Call Saul', type: 'show', posterUrl: '⚖️', active: true }
];

export async function checkAndSeedData() {
  const hasData = await storeInstance.hasData();
  if (!hasData) {
    await storeInstance.seedInitialData(SEED_PLAYERS, SEED_FOOD, SEED_WATCH);
  }
}
