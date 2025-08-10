import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { GameConfig, GameState } from '../../Utils/Types.js';
import { GameModel } from './GameModel.js';
import { GameView } from './GameView.js';

export class GameController {
  private readonly model: GameModel;

  constructor(config: GameConfig) {
    this.model = new GameModel(config);
    void new GameView();
    this.subscribe();
    EventBus.emit(
      GameEvents.GRID_CONFIG_SET,
      Object.freeze({ gridSize: config.gridSize, cols: config.cols, rows: config.rows })
    );
  }

  private subscribe(): void {
    EventBus.on(GameEvents.GAME_START, ({ config }) => {
      this.model.setSpeedMultiplier(config.speedMultiplier ?? 1);
      EventBus.emit(GameEvents.GAME_STATE_CHANGE, Object.freeze({ state: GameState.Playing }));
      EventBus.emit(GameEvents.GAME_SPEED_CHANGED, Object.freeze({ speedMultiplier: config.speedMultiplier ?? 1 }));
    });
    EventBus.on(GameEvents.GAME_PAUSE, () => EventBus.emit(GameEvents.GAME_STATE_CHANGE, Object.freeze({ state: GameState.Paused })));
    EventBus.on(GameEvents.GAME_RESUME, () => EventBus.emit(GameEvents.GAME_STATE_CHANGE, Object.freeze({ state: GameState.Playing })));
    EventBus.on(GameEvents.GAME_OVER, () => EventBus.emit(GameEvents.GAME_STATE_CHANGE, Object.freeze({ state: GameState.GameOver })));
  }
}


