import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { GameState } from '../../Utils/Types.js';
import { GameStateModel } from './GameStateModel.js';
// GameStateView currently provides helper text builders; not directly used here to keep Renderer decoupled
import { GameStateView } from './GameStateView.js';

export class GameStateController {
  private readonly model: GameStateModel;

  constructor() {
    this.model = new GameStateModel(GameState.Menu);
    // Instantiate to preserve module completeness; avoid retaining a field to keep it unused
    void new GameStateView();

    // Emit initial state
    EventBus.emit(GameEvents.GAME_STATE_CHANGE, Object.freeze({ state: this.model.getState() }));

    // Respond to high-level game intent from InputController
    EventBus.on(GameEvents.GAME_START, () => this.start());
    EventBus.on(GameEvents.GAME_PAUSE, () => this.pause());
    EventBus.on(GameEvents.GAME_RESUME, () => this.resume());
  }

  start(): void {
    if (this.model.getState() !== GameState.Menu && this.model.getState() !== GameState.GameOver) return;
    this.model.setState(GameState.Playing);
    EventBus.emit(GameEvents.GAME_STATE_CHANGE, Object.freeze({ state: this.model.getState() }));
  }

  pause(): void {
    if (this.model.getState() !== GameState.Playing) return;
    this.model.setState(GameState.Paused);
    EventBus.emit(GameEvents.GAME_STATE_CHANGE, Object.freeze({ state: this.model.getState() }));
  }

  resume(): void {
    if (this.model.getState() !== GameState.Paused) return;
    this.model.setState(GameState.Playing);
    EventBus.emit(GameEvents.GAME_STATE_CHANGE, Object.freeze({ state: this.model.getState() }));
  }

  gameOver(): void {
    this.model.setState(GameState.GameOver);
    EventBus.emit(GameEvents.GAME_STATE_CHANGE, Object.freeze({ state: this.model.getState() }));
  }

  getState(): GameState {
    return this.model.getState();
  }
}


