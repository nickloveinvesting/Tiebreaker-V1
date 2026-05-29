import { v4 as uuidv4 } from 'uuid';
import { Player, FoodOption, WatchItem } from '../types';
import { storeInstance } from '../store';

const SEED_PLAYERS: Player[] = [
  { id: uuidv4(), name: 'Lexi', color: '#FF5A47' }, // Coral
  { id: uuidv4(), name: 'Nick', color: '#1FB8A6' }, // Teal
];

const SEED_FOOD: FoodOption[] = [
  // Local Little Elm / DoorDash Places
  { id: uuidv4(), name: 'Towers Tap House', cuisine: 'American', mode: 'out', emoji: '🍻', active: true },
  { id: uuidv4(), name: "Leo's Brunch House", cuisine: 'Breakfast', mode: 'out', emoji: '🥞', active: true },
  { id: uuidv4(), name: "Roma's Italian", cuisine: 'Italian', mode: 'out', emoji: '🍝', active: true },
  { id: uuidv4(), name: 'Casa Mia Latin', cuisine: 'Latin', mode: 'out', emoji: '🌮', active: true },
  { id: uuidv4(), name: 'The Angry Elephant', cuisine: 'Pub/Burger', mode: 'out', emoji: '🐘', active: true },
  { id: uuidv4(), name: 'Sunny Street Cafe', cuisine: 'Brunch', mode: 'out', emoji: '🍳', active: true },
  { id: uuidv4(), name: 'Hula Hut', cuisine: 'Tex-Mex', mode: 'out', emoji: '🍹', active: true },
  { id: uuidv4(), name: 'Palio\'s Pizza Cafe', cuisine: 'Pizza', mode: 'both', emoji: '🍕', active: true },
  { id: uuidv4(), name: 'Kyoto Hibachi', cuisine: 'Sushi/Japanese', mode: 'out', emoji: '🍣', active: true },
  { id: uuidv4(), name: 'Tender Smokehouse', cuisine: 'BBQ', mode: 'out', emoji: '🍖', active: true },
  { id: uuidv4(), name: 'Los Jalapeños', cuisine: 'Mexican', mode: 'out', emoji: '🌯', active: true },
  { id: uuidv4(), name: 'Pita Town', cuisine: 'Mediterranean', mode: 'out', emoji: '🥙', active: true },
  
  // Extra 6-mile radius Local spots (Frisco / The Colony)
  { id: uuidv4(), name: 'Hat Creek Burger Co', cuisine: 'Burger', mode: 'out', emoji: '🍔', active: true },
  { id: uuidv4(), name: 'Rock & Brews', cuisine: 'American', mode: 'out', emoji: '🎸', active: true },
  { id: uuidv4(), name: 'Hard Eight BBQ', cuisine: 'BBQ', mode: 'out', emoji: '🔥', active: true },
  { id: uuidv4(), name: 'Mi Cocina', cuisine: 'Tex-Mex', mode: 'out', emoji: '🍹', active: true },
  { id: uuidv4(), name: 'Torchy\'s Tacos', cuisine: 'Tacos', mode: 'out', emoji: '🌮', active: true },
  { id: uuidv4(), name: 'Cane Rosso', cuisine: 'Pizza', mode: 'out', emoji: '🍕', active: true },
  { id: uuidv4(), name: 'Velvet Taco', cuisine: 'Tacos', mode: 'out', emoji: '🌮', active: true },
  { id: uuidv4(), name: 'Thai Ruby', cuisine: 'Thai', mode: 'out', emoji: '🍜', active: true },
  { id: uuidv4(), name: 'Kiki\'s Mexican', cuisine: 'Mexican', mode: 'out', emoji: '🌮', active: true },
  { id: uuidv4(), name: 'Heritage Pizza', cuisine: 'Pizza', mode: 'out', emoji: '🍕', active: true },
  { id: uuidv4(), name: 'Barley & Board', cuisine: 'American', mode: 'out', emoji: '🍽️', active: true },
  
  // Big Chains on DoorDash
  { id: uuidv4(), name: 'Chick-fil-A', cuisine: 'Fast Food', mode: 'out', emoji: '🐔', active: true },
  { id: uuidv4(), name: 'Whataburger', cuisine: 'Burger', mode: 'out', emoji: '🍔', active: true },
  { id: uuidv4(), name: 'Chipotle', cuisine: 'Mexican', mode: 'out', emoji: '🥑', active: true },
  { id: uuidv4(), name: 'Applebee\'s', cuisine: 'American', mode: 'out', emoji: '🥗', active: true },
  { id: uuidv4(), name: 'Wing Snob', cuisine: 'Wings', mode: 'out', emoji: '🍗', active: true },
  { id: uuidv4(), name: 'Wingstop', cuisine: 'Wings', mode: 'out', emoji: '🍗', active: true },
  { id: uuidv4(), name: 'Raising Cane\'s', cuisine: 'Fast Food', mode: 'out', emoji: '🍗', active: true },
  { id: uuidv4(), name: 'In-N-Out Burger', cuisine: 'Burger', mode: 'out', emoji: '🍔', active: true },
  { id: uuidv4(), name: 'Shake Shack', cuisine: 'Burger', mode: 'out', emoji: '🍔', active: true },
  { id: uuidv4(), name: 'Panera Bread', cuisine: 'Sandwich', mode: 'out', emoji: '🥪', active: true },
  { id: uuidv4(), name: 'Texas Roadhouse', cuisine: 'Steak', mode: 'out', emoji: '🥩', active: true },
  { id: uuidv4(), name: 'Mooyah Burgers', cuisine: 'Burger', mode: 'out', emoji: '🍔', active: true },
  { id: uuidv4(), name: 'Pluckers Wing Bar', cuisine: 'Wings', mode: 'out', emoji: '🍗', active: true },
  { id: uuidv4(), name: 'Jersey Mike\'s', cuisine: 'Sandwich', mode: 'out', emoji: '🥪', active: true },

  // Cooking / General Options
  { id: uuidv4(), name: 'Pasta', cuisine: 'Italian', mode: 'cook', emoji: '🍝', active: true },
  { id: uuidv4(), name: 'Salad', cuisine: 'Healthy', mode: 'cook', emoji: '🥗', active: true },
  { id: uuidv4(), name: 'Steak', cuisine: 'American', mode: 'cook', emoji: '🥩', active: true },
  { id: uuidv4(), name: 'Stir Fry', cuisine: 'Asian', mode: 'cook', emoji: '🍳', active: true },
  { id: uuidv4(), name: 'Soup', cuisine: 'Comfort', mode: 'cook', emoji: '🥣', active: true },
  { id: uuidv4(), name: 'Sandwich', cuisine: 'Deli', mode: 'cook', emoji: '🥪', active: true },
  { id: uuidv4(), name: 'Tacos', cuisine: 'Mexican', mode: 'cook', emoji: '🌮', active: true },
  { id: uuidv4(), name: 'Burgers', cuisine: 'American', mode: 'cook', emoji: '🍔', active: true },
];

const SEED_WATCH: WatchItem[] = [
  { id: uuidv4(), title: 'The Bear', type: 'show', genre: 'Drama', posterUrl: '🐻', active: true },
  { id: uuidv4(), title: 'Dune', type: 'movie', genre: 'Sci-Fi', posterUrl: '🏜️', active: true },
  { id: uuidv4(), title: 'Severance', type: 'show', genre: 'Thriller', posterUrl: '🏢', active: true },
  { id: uuidv4(), title: 'Everything Everywhere', type: 'movie', genre: 'Action', posterUrl: '🥯', active: true },
  { id: uuidv4(), title: 'Stranger Things', type: 'show', genre: 'Horror / Sci-Fi', posterUrl: '🚲', active: true },
  { id: uuidv4(), title: 'Spider-Verse', type: 'movie', genre: 'Animation', posterUrl: '🕷️', active: true },
  { id: uuidv4(), title: 'Succession', type: 'show', genre: 'Drama', posterUrl: '📈', active: true },
  { id: uuidv4(), title: 'Knives Out', type: 'movie', genre: 'Mystery', posterUrl: '🗡️', active: true },
  { id: uuidv4(), title: 'The Office', type: 'show', genre: 'Comedy', posterUrl: '🖨️', active: true },
  { id: uuidv4(), title: 'Parasite', type: 'movie', genre: 'Thriller', posterUrl: '🏠', active: true },
  { id: uuidv4(), title: 'White Lotus', type: 'show', genre: 'Comedy', posterUrl: '🌺', active: true },
  { id: uuidv4(), title: 'Mad Max', type: 'movie', genre: 'Action', posterUrl: '🚗', active: true },
  { id: uuidv4(), title: 'Breaking Bad', type: 'show', genre: 'Drama', posterUrl: '⚗️', active: true },
  { id: uuidv4(), title: 'Interstellar', type: 'movie', genre: 'Sci-Fi', posterUrl: '🚀', active: true },
  { id: uuidv4(), title: 'Game of Thrones', type: 'show', genre: 'Fantasy', posterUrl: '🐉', active: true },
  { id: uuidv4(), title: 'Avengers', type: 'movie', genre: 'Action', posterUrl: '🛡️', active: true },
  { id: uuidv4(), title: 'The Matrix', type: 'movie', genre: 'Sci-Fi', posterUrl: '💊', active: true },
  { id: uuidv4(), title: 'Friends', type: 'show', genre: 'Comedy', posterUrl: '☕', active: true },
  { id: uuidv4(), title: 'Inception', type: 'movie', genre: 'Action', posterUrl: '🌀', active: true },
  { id: uuidv4(), title: 'The Sopranos', type: 'show', genre: 'Drama', posterUrl: '🚬', active: true },
  { id: uuidv4(), title: 'Spirited Away', type: 'movie', genre: 'Animation', posterUrl: '🐉', active: true },
  { id: uuidv4(), title: 'Better Call Saul', type: 'show', genre: 'Drama', posterUrl: '⚖️', active: true }
];

export async function checkAndSeedData() {
  const hasData = await storeInstance.hasData();
  if (!hasData) {
    await storeInstance.seedInitialData(SEED_PLAYERS, SEED_FOOD, SEED_WATCH);
  } else {
    // Overwrite existing players if they are still "Player 1/2"
    const players = await storeInstance.getPlayers();
    if (players.length >= 2 && players[0].name === 'Player 1') {
       players[0].name = 'Lexi';
       await storeInstance.updatePlayer(players[0]);
    }
    if (players.length >= 2 && players[1].name === 'Player 2') {
       players[1].name = 'Nick';
       await storeInstance.updatePlayer(players[1]);
    }

    // Append any new hardcoded seeds if they aren't there for existing users
    const existingFood = await storeInstance.getFoodOptions();
    for (const food of SEED_FOOD) {
      if (!existingFood.some(f => f.name === food.name)) {
        await storeInstance.addFoodOption(food);
      }
    }
  }
}
