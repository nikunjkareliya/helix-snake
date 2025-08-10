import { Position, PowerUpType } from '../../Utils/Types.js';

export type PowerUpData = {
  readonly position: Position;
  readonly type: PowerUpType;
  readonly duration: number; // in milliseconds
  readonly points: number;
};

export type ActivePowerUp = {
  readonly type: PowerUpType;
  readonly remainingMs: number;
  readonly startTime: number;
};

export class PowerUpModel {
  private spawnedPowerUp: PowerUpData | null = null;
  private activePowerUp: ActivePowerUp | null = null;
  private spawnChance = 0.15; // 15% chance to spawn instead of food

  getSpawnedPowerUp(): PowerUpData | null {
    return this.spawnedPowerUp;
  }

  setSpawnedPowerUp(powerUp: PowerUpData | null): void {
    this.spawnedPowerUp = powerUp;
  }

  getActivePowerUp(): ActivePowerUp | null {
    return this.activePowerUp;
  }

  setActivePowerUp(powerUp: ActivePowerUp | null): void {
    this.activePowerUp = powerUp;
  }

  getSpawnChance(): number {
    return this.spawnChance;
  }

  setSpawnChance(chance: number): void {
    this.spawnChance = Math.max(0.05, Math.min(1.0, chance)); // Clamp between 5% and 100%
  }

  updateActivePowerUp(deltaMs: number): boolean {
    if (!this.activePowerUp) return false;
    
    const newRemainingMs = this.activePowerUp.remainingMs - deltaMs;
    if (newRemainingMs <= 0) {
      this.activePowerUp = null;
      return true; // Power-up expired
    }
    
    this.activePowerUp = {
      ...this.activePowerUp,
      remainingMs: newRemainingMs
    };
    return false; // Still active
  }

  createPowerUpData(position: Position, type: PowerUpType): PowerUpData {
    let duration: number;
    let points: number;
    
    switch (type) {
      case PowerUpType.Slow:
        duration = 5000; // 5 seconds
        points = 50;
        break;
      case PowerUpType.Shrink:
        duration = 0; // Instant effect
        points = 100;
        break;
      case PowerUpType.Ghost:
        duration = 3000; // 3 seconds
        points = 150;
        break;
      default:
        duration = 0;
        points = 0;
    }
    
    return { position, type, duration, points };
  }
}

