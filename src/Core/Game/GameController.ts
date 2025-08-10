import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { GameConfig, GameState, PowerUpType } from '../../Utils/Types.js';
import { GameModel } from './GameModel.js';
import { GameView } from './GameView.js';

export class GameController {
  private readonly model: GameModel;
  private baseSpeedMultiplier = 1;
  private slowPowerUpActive = false;

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
    
    // Handle difficulty progression based on score
    EventBus.on(GameEvents.SCORE_UPDATED, ({ score }) => {
      this.updateDifficulty(score);
    });

    // Handle power-up effects
    EventBus.on(GameEvents.POWERUP_ACTIVATED, ({ type }) => {
      this.onPowerUpActivated(type);
    });

    EventBus.on(GameEvents.POWERUP_EXPIRED, ({ type }) => {
      this.onPowerUpExpired(type);
    });
  }

  private updateDifficulty(score: number): void {
    // Increase speed by 5% every 100 points, cap at 200% (0.5x multiplier)
    const speedIncrease = Math.floor(score / 100) * 0.05;
    this.baseSpeedMultiplier = Math.max(0.5, 1 - speedIncrease); // Lower multiplier = faster speed
    
    this.updateSpeedMultiplier();
  }

  private updateSpeedMultiplier(): void {
    let finalMultiplier = this.baseSpeedMultiplier;
    
    // Apply slow power-up effect (30% speed reduction)
    if (this.slowPowerUpActive) {
      finalMultiplier = finalMultiplier * 1.3; // Increase multiplier to slow down
    }
    
    if (finalMultiplier !== this.model.getSpeedMultiplier()) {
      this.model.setSpeedMultiplier(finalMultiplier);
      EventBus.emit(GameEvents.GAME_SPEED_CHANGED, Object.freeze({ speedMultiplier: finalMultiplier }));
    }
  }

  private onPowerUpActivated(type: PowerUpType): void {
    if (type === PowerUpType.Slow) {
      this.slowPowerUpActive = true;
      this.updateSpeedMultiplier();
    }
  }

  private onPowerUpExpired(type: PowerUpType): void {
    if (type === PowerUpType.Slow) {
      this.slowPowerUpActive = false;
      this.updateSpeedMultiplier();
    }
  }
}


