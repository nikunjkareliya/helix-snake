import { GameConfig } from '../../Utils/Types.js';

export class GameModel {
  private readonly config: GameConfig;
  private speedMultiplier: number = 1;

  constructor(config: GameConfig) {
    this.config = config;
  }

  getConfig(): GameConfig { return this.config; }
  getTickMs(): number { return Math.floor(this.config.baseTickMs * this.speedMultiplier); }
  getSpeedMultiplier(): number { return this.speedMultiplier; }
  setSpeedMultiplier(mult: number): void { this.speedMultiplier = Math.max(0.1, mult); }
}


