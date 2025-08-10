import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { Position } from '../../Utils/Types.js';
import { FoodModel } from './FoodModel.js';
import { FoodView } from './FoodView.js';
import { RendererController } from '../../Systems/Renderer/RendererController.js';

export class FoodController {
  private readonly model: FoodModel;
  private readonly view: FoodView;
  private readonly cols: number;
  private readonly rows: number;

  constructor(renderer: RendererController, cols: number, rows: number, cellSize: number) {
    this.model = new FoodModel();
    this.view = new FoodView(renderer, cellSize);
    this.cols = cols;
    this.rows = rows;
    this.subscribe();
  }

  private subscribe(): void {
    EventBus.on(GameEvents.SNAKE_MOVE, ({ head }) => this.onSnakeMove(head));
    EventBus.on(GameEvents.SNAKE_INIT, () => {
      // Spawn initial food after snake is drawn
      this.spawn();
    });
    EventBus.on(GameEvents.GAME_STATE_CHANGE, () => {
      // Renderer clears on state changes; ensure food is visible afterwards
      const pos = this.model.getPosition();
      if (pos) {
        this.view.renderFood(pos);
      } else {
        this.spawn();
      }
    });
  }

  private onSnakeMove(head: Position): void {
    const foodPos = this.model.getPosition();
    if (!foodPos) return;
    if (head.x === foodPos.x && head.y === foodPos.y) {
      EventBus.emit(GameEvents.FOOD_EATEN, Object.freeze({ position: foodPos }));
      this.view.clearFood(foodPos);
      this.spawn();
    }
  }

  private spawn(): void {
    const pos = this.randomEmptyCell();
    this.model.setPosition(pos);
    this.view.renderFood(pos);
    EventBus.emit(GameEvents.FOOD_SPAWN, Object.freeze({ position: pos }));
  }

  private randomEmptyCell(): Position {
    // Simple random placement inside bounds
    const x = Math.max(0, Math.min(this.cols - 1, Math.floor(Math.random() * this.cols)));
    const y = Math.max(0, Math.min(this.rows - 1, Math.floor(Math.random() * this.rows)));
    return { x, y };
  }
}


