import { Position } from '../../Utils/Types.js';
import { RendererController } from '../../Systems/Renderer/RendererController.js';

export class SnakeView {
  private readonly renderer: RendererController;
  private readonly cellSize: number;

  constructor(renderer: RendererController, cellSize: number) {
    this.renderer = renderer;
    this.cellSize = cellSize;
  }

  renderSegment(pos: Position, color: string): void {
    this.renderer['view'].fillRect(pos.x * this.cellSize, pos.y * this.cellSize, this.cellSize, this.cellSize, color);
  }

  renderSnake(segments: Position[], color: string): void {
    for (const pos of segments) this.renderSegment(pos, color);
  }
}


