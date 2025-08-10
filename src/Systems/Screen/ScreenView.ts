import { RendererController } from '../Renderer/RendererController.js';
import { ScreenName } from '../../Utils/Types.js';

export class ScreenView {
  private readonly renderer: RendererController;
  constructor(renderer: RendererController) { this.renderer = renderer; }

  render(screen: ScreenName, finalScore?: number): void {
    this.renderer.clear('#0f1218');
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
    const width = (canvas?.clientWidth || 800);
    const height = (canvas?.clientHeight || 600);
    
    if (screen === ScreenName.Menu) {
      this.renderMenuScreen(width, height);
    } else if (screen === ScreenName.Pause) {
      this.renderPauseScreen(width, height);
    } else if (screen === ScreenName.GameOver) {
      this.renderGameOverScreen(width, height, finalScore || 0);
    }
  }

  private renderMenuScreen(width: number, height: number): void {
    // Game title
    this.renderer.drawText('HelixSnake', Math.floor(width/2), Math.floor(height/2) - 60, '#2bd56f', 32, 'center');
    
    // Instructions
    this.renderer.drawText('Press Space to Start', Math.floor(width/2), Math.floor(height/2), '#e8e8ea', 18, 'center');
    this.renderer.drawText('Arrow Keys or WASD to Move', Math.floor(width/2), Math.floor(height/2) + 30, '#a8a8aa', 14, 'center');
  }

  private renderPauseScreen(width: number, height: number): void {
    // Semi-transparent overlay
    this.renderer.fillRect(0, 0, width, height, 'rgba(15, 18, 24, 0.8)');
    
    // Pause text
    this.renderer.drawText('PAUSED', Math.floor(width/2), Math.floor(height/2) - 20, '#e8e8ea', 28, 'center');
    this.renderer.drawText('Press Space to Resume', Math.floor(width/2), Math.floor(height/2) + 20, '#a8a8aa', 16, 'center');
  }

  private renderGameOverScreen(width: number, height: number, finalScore: number): void {
    // Game Over title
    this.renderer.drawText('Game Over', Math.floor(width/2), Math.floor(height/2) - 60, '#ff5d5d', 28, 'center');
    
    // Final score
    this.renderer.drawText(`Final Score: ${finalScore}`, Math.floor(width/2), Math.floor(height/2) - 20, '#e8e8ea', 20, 'center');
    
    // Instructions
    this.renderer.drawText('Press Space to Play Again', Math.floor(width/2), Math.floor(height/2) + 20, '#a8a8aa', 16, 'center');
  }
}


