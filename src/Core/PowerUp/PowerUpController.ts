import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { Position, PowerUpType } from '../../Utils/Types.js';
import { PowerUpModel, PowerUpData } from './PowerUpModel.js';
import { PowerUpView } from './PowerUpView.js';
import { RendererController } from '../../Systems/Renderer/RendererController.js';
import { VisualEffects } from '../../Utils/AnimationSystem.js';

export class PowerUpController {
  private readonly model: PowerUpModel;
  private readonly view: PowerUpView;
  private readonly renderer: RendererController;
  private lastFrameTime = 0;

  constructor(renderer: RendererController, cols: number, rows: number, cellSize: number) {
    this.model = new PowerUpModel();
    this.view = new PowerUpView(renderer, cellSize);
    this.renderer = renderer;
    // Mark parameters as used to satisfy noUnusedParameters while keeping signature for future use
    void cols; void rows;
    this.subscribe();
    this.startUpdateLoop();
  }

  private subscribe(): void {
    // Listen for food spawn events to potentially spawn power-ups instead
    EventBus.on(GameEvents.FOOD_SPAWN, ({ position }) => {
      this.considerPowerUpSpawn(position);
    });

    // Handle power-up collection
    EventBus.on(GameEvents.COLLISION_CHECK_FOOD, ({ position }) => {
      this.checkPowerUpCollision(position);
    });

    // Reset on game start
    EventBus.on(GameEvents.GAME_START, () => {
      this.model.setSpawnedPowerUp(null);
      this.model.setActivePowerUp(null);
      this.model.setSpawnChance(0.15); // Reset spawn chance
    });

    // Handle scoring updates for difficulty progression
    EventBus.on(GameEvents.SCORE_UPDATED, ({ score }) => {
      // Reduce power-up spawn chance by 1% every 200 points (min 5%)
      const reduction = Math.floor(score / 200) * 0.01;
      const newChance = Math.max(0.05, 0.15 - reduction);
      this.model.setSpawnChance(newChance);
    });
  }

  private considerPowerUpSpawn(foodPosition: Position): void {
    // Only spawn power-up if no power-up is currently spawned
    if (this.model.getSpawnedPowerUp()) return;
    
    if (Math.random() < this.model.getSpawnChance()) {
      const powerUpType = this.randomPowerUpType();
      const powerUpData = this.model.createPowerUpData(foodPosition, powerUpType);
      
      this.model.setSpawnedPowerUp(powerUpData);
      this.view.renderPowerUp(powerUpData);
      
      EventBus.emit(GameEvents.POWERUP_SPAWN, Object.freeze({
        position: foodPosition,
        type: powerUpType
      }));
    }
  }

  private checkPowerUpCollision(position: Position): void {
    const spawnedPowerUp = this.model.getSpawnedPowerUp();
    if (!spawnedPowerUp) return;
    
    if (position.x === spawnedPowerUp.position.x && position.y === spawnedPowerUp.position.y) {
      // Collect the power-up
      this.collectPowerUp(spawnedPowerUp);
    }
  }

  private collectPowerUp(powerUp: PowerUpData): void {
    // Show collection effect before clearing
    const x = powerUp.position.x * 16; // Assuming 16px cell size
    const y = powerUp.position.y * 16;
    const color = this.getPowerUpColor(powerUp.type);
    VisualEffects.pulseEffect(this.renderer, x, y, 16, color, 400);
    
    // Clear the spawned power-up
    this.view.clearPowerUp(powerUp.position);
    this.model.setSpawnedPowerUp(null);
    
    // Activate the power-up
    this.activatePowerUp(powerUp);
    
    // Emit collection event
    EventBus.emit(GameEvents.POWERUP_COLLECTED, Object.freeze({
      position: powerUp.position,
      type: powerUp.type
    }));
  }

  private activatePowerUp(powerUp: PowerUpData): void {
    // End any currently active power-up
    const currentActive = this.model.getActivePowerUp();
    if (currentActive) {
      EventBus.emit(GameEvents.POWERUP_EXPIRED, Object.freeze({ type: currentActive.type }));
    }

    // Apply instant effects
    if (powerUp.type === PowerUpType.Shrink) {
      EventBus.emit(GameEvents.SNAKE_SHRINK, Object.freeze({}));
    }

    // Set active power-up for timed effects
    if (powerUp.duration > 0) {
      this.model.setActivePowerUp({
        type: powerUp.type,
        remainingMs: powerUp.duration,
        startTime: performance.now()
      });
    }

    // Emit activation event
    EventBus.emit(GameEvents.POWERUP_ACTIVATED, Object.freeze({
      type: powerUp.type,
      duration: powerUp.duration
    }));
  }

  private startUpdateLoop(): void {
    const update = (currentTime: number) => {
      if (this.lastFrameTime === 0) this.lastFrameTime = currentTime;
      const deltaMs = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;

      this.updateActivePowerUp(deltaMs);
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  private updateActivePowerUp(deltaMs: number): void {
    const activePowerUp = this.model.getActivePowerUp();
    if (!activePowerUp) return;

    // Update timer and check expiration
    const expired = this.model.updateActivePowerUp(deltaMs);
    
    if (expired) {
      EventBus.emit(GameEvents.POWERUP_EXPIRED, Object.freeze({ type: activePowerUp.type }));
    } else {
      // Render active power-up indicator
      const current = this.model.getActivePowerUp();
      if (current) {
        this.view.renderActivePowerUpIndicator(current);
      }
    }
  }

  private randomPowerUpType(): PowerUpType {
    const types = [PowerUpType.Slow, PowerUpType.Shrink, PowerUpType.Ghost];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getPowerUpColor(type: PowerUpType): string {
    switch (type) {
      case PowerUpType.Slow: return '#4da6ff'; // Blue
      case PowerUpType.Shrink: return '#ffeb3b'; // Yellow
      case PowerUpType.Ghost: return '#9c27b0'; // Purple
      default: return '#ffffff';
    }
  }
}