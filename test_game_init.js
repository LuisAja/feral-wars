const fs = require('fs');

// Mock DOM elements
const mockEl = {
  style: {},
  innerHTML: '',
  textContent: '',
  appendChild: () => {},
  querySelectorAll: () => [],
  classList: { add: () => {}, remove: () => {} }
};

global.document = {
  getElementById: (id) => mockEl,
  querySelector: () => mockEl,
  querySelectorAll: () => [mockEl],
  addEventListener: () => {},
  createElement: () => mockEl
};
global.window = { gameMode: 'VS_AI', addEventListener: () => {} };
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

try {
  let cardsCode = fs.readFileSync('cards.js', 'utf-8');
  cardsCode = cardsCode.replace('const CARD_DATABASE =', 'global.CARD_DATABASE =');
  eval(cardsCode);
  eval(fs.readFileSync('effects.js', 'utf-8'));
  eval(fs.readFileSync('deckbuilder.js', 'utf-8'));

  let gameCode = fs.readFileSync('game.js', 'utf-8');
  gameCode = gameCode.replace('const gameState =', 'global.gameState =');
  eval(gameCode);

  console.log("Cargados archivos JS con éxito. Total cartas DB:", global.CARD_DATABASE.length);
  initGame();
  console.log("¡initGame() EJECUTADO CON ÉXITO Y TOTALMENTE VÁLIDO!");
  console.log("Cartas en mano Jugador:", global.gameState.player.hand.length);
  console.log("Cartas en mano Enemigo:", global.gameState.enemy.hand.length);
  console.log("HP Jugador:", global.gameState.player.hp, "HP Enemigo:", global.gameState.enemy.hp);
} catch (e) {
  console.error("❌ ERROR EN INITGAME:", e.stack || e);
}
