import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { Position, PowerUpType } from '../../Utils/Types.js';
import { CollisionModel } from './CollisionModel.js';
import { CollisionView } from './CollisionView.js';

export class CollisionController {
  private readonly cols: number;
  private readonly rows: number;
  private snakeSegments: Position[] = [];
  private ghostModeActive = false;

  constructor(cols: number, rows: number) {
    void new CollisionModel();
    void new CollisionView();
    this.cols = cols;
    this.rows = rows;
    this.subscribe();
  }

  private subscribe(): void {
    EventBus.on(GameEvents.SNAKE_INIT, ({ segments }) => {
      this.snakeSegments = segments.slice();
    });
    
    EventBus.on(GameEvents.SNAKE_MOVE, ({ head, tail }) => {
      // Update snake segments
      this.snakeSegments.unshift(head);
      if (tail) {
        this.snakeSegments.pop();
      }
      this.checkCollisions(head);
    });

    // Handle power-up effects for ghost mode
    EventBus.on(GameEvents.POWERUP_ACTIVATED, ({ type }) => {
      if (type === PowerUpType.Ghost) {
        this.ghostModeActive = true;
      }
    });

    EventBus.on(GameEvents.POWERUP_EXPIRED, ({ type }) => {
      if (type === PowerUpType.Ghost) {
        this.ghostModeActive = false;
      }
    });

    EventBus.on(GameEvents.GAME_START, () => {
      this.ghostModeActive = false; // Reset ghost mode on game start
    });
  }

  private checkCollisions(head: Position): void {
    // Skip collisions if ghost mode is active
    if (!this.ghostModeActive) {
      // Wall collision
      if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
        EventBus.emit(GameEvents.SNAKE_COLLISION, Object.freeze({ type: 'WALL' }));
        EventBus.emit(GameEvents.GAME_OVER, Object.freeze({ reason: 'WALL' }));
        return;
      }

      // Self-collision: check if head collides with body (skip first segment which is the head)
      for (let i = 1; i < this.snakeSegments.length; i++) {
        const segment = this.snakeSegments[i];
        if (head.x === segment.x && head.y === segment.y) {
          EventBus.emit(GameEvents.SNAKE_COLLISION, Object.freeze({ type: 'SELF' }));
          EventBus.emit(GameEvents.GAME_OVER, Object.freeze({ reason: 'SELF' }));
          return;
        }
      }
    }

    // Food collision - check if head is at same position as food or power-up
    this.checkFoodCollision(head);
  }

  private checkFoodCollision(head: Position): void {
    // This will be refined when food position is properly tracked
    // For now, emit a temporary event that food system can listen to
    EventBus.emit(GameEvents.COLLISION_CHECK_FOOD, Object.freeze({ position: head }));
  }
}


