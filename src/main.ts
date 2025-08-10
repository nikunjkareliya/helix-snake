// Entry point: initialize Renderer system

import { RendererController } from './Systems/Renderer/RendererController.js';
import { GameStateController } from './Systems/GameState/GameStateController.js';
import { InputController } from './Systems/Input/InputController.js';
import { GameController } from './Core/Game/GameController.js';
import { SnakeController } from './Core/Snake/SnakeController.js';
import { FoodController } from './Core/Food/FoodController.js';
import { CollisionController } from './Core/Collision/CollisionController.js';
import { PowerUpController } from './Core/PowerUp/PowerUpController.js';
import { ScoreController } from './Systems/Score/ScoreController.js';
import { ScreenController } from './Systems/Screen/ScreenController.js';
import { GameConfig } from './Utils/Types.js';

function bootstrap(): void {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
  if (!canvas) throw new Error('Canvas element #gameCanvas not found');
  const renderer = new RendererController(canvas);
  renderer.drawDebugBaseline();

  // Initialize GameState system (no direct coupling to Renderer)
  const gameState = new GameStateController();

  // Initialize Input system (emits events; controllers listen)
  const input = new InputController();

  // Initialize core systems
  const rect = canvas.getBoundingClientRect();
  const gridSize = 16;
  const config: GameConfig = { gridSize, cols: Math.floor((rect.width||800)/gridSize), rows: Math.floor((rect.height||600)/gridSize), baseTickMs: 160 };
  const game = new GameController(config);
  const snake = new SnakeController(renderer, config);
  const food = new FoodController(renderer, config.cols, config.rows, config.gridSize);
  const collision = new CollisionController(config.cols, config.rows);
  const powerUp = new PowerUpController(renderer, config.cols, config.rows, config.gridSize);
  const score = new ScoreController(renderer);
  const screen = new ScreenController(renderer);

  // Expose for manual testing in console (non-production aid)
  // @ts-expect-error attach for debug only
  window.__renderer = renderer;
  // @ts-expect-error attach for debug only
  window.__gameState = gameState;
  // @ts-expect-error attach for debug only
  window.__input = input;
  // @ts-expect-error attach for debug only
  window.__game = game;
  // @ts-expect-error attach for debug only
  window.__snake = snake;
  // @ts-expect-error attach for debug only
  window.__food = food;
  // @ts-expect-error attach for debug only
  window.__collision = collision;
  // @ts-expect-error attach for debug only
  window.__powerUp = powerUp;
  // @ts-expect-error attach for debug only
  window.__score = score;
  // @ts-expect-error attach for debug only
  window.__screen = screen;
}
// Ensure DOM is ready before bootstrapping
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}


