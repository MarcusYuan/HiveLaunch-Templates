import { createGame } from './game';

const container = document.getElementById('game-container');

if (container) {
  createGame(container);
}
