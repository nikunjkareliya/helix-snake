import { Position } from '../../Utils/Types.js';
import { RendererController } from '../../Systems/Renderer/RendererController.js';

export class FoodView {
  private readonly renderer: RendererController;
  private readonly cellSize: number;

  constructor(renderer: RendererController, cellSize: number) {
    this.renderer = renderer;
    this.cellSize = cellSize;
  }

  renderFood(pos: Position): void {
    this.renderer.fillRect(pos.x * this.cellSize, pos.y * this.cellSize, this.cellSize, this.cellSize, '#ff5d5d');
  }

  clearFood(pos: Position): void {
    this.renderer.fillRect(pos.x * this.cellSize, pos.y * this.cellSize, this.cellSize, this.cellSize, '#0f1218');
  }
}


