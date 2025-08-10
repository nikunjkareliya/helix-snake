import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { Direction, GameState } from '../../Utils/Types.js';
import { InputModel } from './InputModel.js';
import { InputView } from './InputView.js';

export class InputController {
  private readonly model: InputModel;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private keyupHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor() {
    this.model = new InputModel();
    void new InputView();
    this.subscribeToGameState();
    this.attachListeners();
  }

  private subscribeToGameState(): void {
    EventBus.on(GameEvents.GAME_STATE_CHANGE, ({ state }) => {
      this.model.setGameState(state);
      // Allow one direction change at the start of each Playing phase
      if (state === GameState.Playing) this.model.allowDirectionChange();
    });
  }

  private attachListeners(): void {
    this.keydownHandler = (e: KeyboardEvent) => {
      const code = e.code;
      if (code.startsWith('Arrow') || code === 'Space') e.preventDefault();
      this.model.setKeyDown(code);

      // Handle Space: toggle pause/resume or start
      if (code === 'Space') {
        const state = this.model.getGameState();
        if (state === GameState.Menu || state === GameState.GameOver) {
          EventBus.emit(GameEvents.GAME_START, Object.freeze({ config: { speedMultiplier: 1 } }));
        } else if (state === GameState.Playing) {
          EventBus.emit(GameEvents.GAME_PAUSE, Object.freeze({}));
        } else if (state === GameState.Paused) {
          EventBus.emit(GameEvents.GAME_RESUME, Object.freeze({}));
        }
      }

      // Handle direction changes
      if (!this.model.isDirectionChangeAllowed()) return;
      const direction = this.mapKeyToDirection(code);
      if (direction == null) return;
      EventBus.emit(GameEvents.SNAKE_DIRECTION_CHANGE, Object.freeze({ direction }));
      this.model.setLastDirection(direction);
      this.model.consumeDirectionChange();
    };

    this.keyupHandler = (e: KeyboardEvent) => {
      this.model.setKeyUp(e.code);
    };

    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }

  private mapKeyToDirection(code: string): Direction | null {
    switch (code) {
      case 'ArrowUp':
        return Direction.Up;
      case 'ArrowRight':
        return Direction.Right;
      case 'ArrowDown':
        return Direction.Down;
      case 'ArrowLeft':
        return Direction.Left;
      default:
        return null;
    }
  }

  cleanup(): void {
    if (this.keydownHandler) window.removeEventListener('keydown', this.keydownHandler);
    if (this.keyupHandler) window.removeEventListener('keyup', this.keyupHandler);
    this.keydownHandler = null;
    this.keyupHandler = null;
  }
}


