import { RendererController } from '../Renderer/RendererController.js';

export class ScoreView {
  private readonly renderer: RendererController;
  constructor(renderer: RendererController) { this.renderer = renderer; }
  render(score: number): void {
    // Draw score at top-left; simple redraw for now
    this.renderer.fillRect(0, 0, 120, 24, 'rgba(15,18,24,0.8)');
    this.renderer.drawText(`Score: ${score}`, 8, 16, '#e8e8ea', 14, 'left');
  }
}


