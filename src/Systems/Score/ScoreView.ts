import { RendererController } from '../Renderer/RendererController.js';

export class ScoreView {
  private readonly renderer: RendererController;
  constructor(renderer: RendererController) { this.renderer = renderer; }
  render(score: number): void {
    // Draw score at top-left; simple redraw for now
    this.renderer['view'].fillRect(0, 0, 120, 24, 'rgba(15,18,24,0.6)');
    this.renderer['view'].drawText(`Score: ${score}`, 8, 4, '#e8e8ea', 14, 'left');
  }
}


