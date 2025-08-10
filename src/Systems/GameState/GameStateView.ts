import { GameState } from '../../Utils/Types.js';

export class GameStateView {
  buildOverlayText(state: GameState): string | null {
    switch (state) {
      case GameState.Menu:
        return 'Press Space to Start';
      case GameState.Paused:
        return 'Paused - Press Space to Resume';
      case GameState.GameOver:
        return 'Game Over - Press Space to Restart';
      case GameState.Playing:
      default:
        return null;
    }
  }
}


