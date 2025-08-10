// Entry point: initialize Renderer system

import { RendererController } from './Systems/Renderer/RendererController.js';
import { GameStateController } from './Systems/GameState/GameStateController.js';
import { InputController } from './Systems/Input/InputController.js';

function bootstrap(): void {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
  if (!canvas) throw new Error('Canvas element #gameCanvas not found');
  const renderer = new RendererController(canvas);
  renderer.drawDebugBaseline();

  // Initialize GameState system (no direct coupling to Renderer)
  const gameState = new GameStateController();

  // Initialize Input system (emits events; controllers listen)
  const input = new InputController();

  // Expose for manual testing in console (non-production aid)
  // @ts-expect-error attach for debug only
  window.__renderer = renderer;
  // @ts-expect-error attach for debug only
  window.__gameState = gameState;
  // @ts-expect-error attach for debug only
  window.__input = input;
}
// Ensure DOM is ready before bootstrapping
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}


