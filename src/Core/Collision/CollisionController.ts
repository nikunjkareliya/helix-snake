import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { Position } from '../../Utils/Types.js';
import { CollisionModel } from './CollisionModel.js';
import { CollisionView } from './CollisionView.js';

export class CollisionController {
  private readonly cols: number;
  private readonly rows: number;

  constructor(cols: number, rows: number) {
    void new CollisionModel();
    void new CollisionView();
    this.cols = cols;
    this.rows = rows;
    this.subscribe();
  }

  private subscribe(): void {
    EventBus.on(GameEvents.SNAKE_MOVE, ({ head }) => this.onSnakeMove(head));
  }

  private onSnakeMove(head: Position): void {
    // Wall collision
    if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
      EventBus.emit(GameEvents.SNAKE_COLLISION, Object.freeze({ type: 'WALL' }));
      EventBus.emit(GameEvents.GAME_OVER, Object.freeze({ reason: 'WALL' }));
      return;
    }
    // Self-collision basic detection: naive by listening to all segments would require access; will be refined later
  }
}


