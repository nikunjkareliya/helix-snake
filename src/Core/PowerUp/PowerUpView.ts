import { Position, PowerUpType } from '../../Utils/Types.js';
import { RendererController } from '../../Systems/Renderer/RendererController.js';
import { PowerUpData, ActivePowerUp } from './PowerUpModel.js';

export class PowerUpView {
  private readonly renderer: RendererController;
  private readonly cellSize: number;

  constructor(renderer: RendererController, cellSize: number) {
    this.renderer = renderer;
    this.cellSize = cellSize;
  }

  renderPowerUp(powerUp: PowerUpData): void {
    const color = this.getPowerUpColor(powerUp.type);
    const x = powerUp.position.x * this.cellSize;
    const y = powerUp.position.y * this.cellSize;
    
    // Render power-up with distinctive visual
    this.renderer.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4, color);
    
    // Add inner highlight
    this.renderer.fillRect(x + 4, y + 4, this.cellSize - 8, this.cellSize - 8, '#ffffff');
  }

  clearPowerUp(position: Position): void {
    const x = position.x * this.cellSize;
    const y = position.y * this.cellSize;
    this.renderer.fillRect(x, y, this.cellSize, this.cellSize, '#0f1218');
  }

  renderActivePowerUpIndicator(activePowerUp: ActivePowerUp): void {
    // Render active power-up indicator in top-right corner
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
    const width = (canvas?.clientWidth || 800);
    
    const color = this.getPowerUpColor(activePowerUp.type);
    const name = this.getPowerUpName(activePowerUp.type);
    const timeLeft = Math.ceil(activePowerUp.remainingMs / 1000);
    
    // Background
    this.renderer.fillRect(width - 150, 0, 150, 30, 'rgba(15,18,24,0.8)');
    
    // Power-up indicator
    this.renderer.fillRect(width - 145, 5, 20, 20, color);
    this.renderer.drawText(`${name}: ${timeLeft}s`, width - 120, 18, '#e8e8ea', 12, 'left');
  }

  private getPowerUpColor(type: PowerUpType): string {
    switch (type) {
      case PowerUpType.Slow: return '#4da6ff'; // Blue
      case PowerUpType.Shrink: return '#ffeb3b'; // Yellow
      case PowerUpType.Ghost: return '#9c27b0'; // Purple
      default: return '#ffffff';
    }
  }

  private getPowerUpName(type: PowerUpType): string {
    switch (type) {
      case PowerUpType.Slow: return 'SLOW';
      case PowerUpType.Shrink: return 'SHRINK';
      case PowerUpType.Ghost: return 'GHOST';
      default: return 'UNKNOWN';
    }
  }
}
