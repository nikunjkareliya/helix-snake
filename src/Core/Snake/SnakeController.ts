import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { Direction, GameConfig, GameState } from '../../Utils/Types.js';
import { SnakeModel } from './SnakeModel.js';
import { SnakeView } from './SnakeView.js';
import { RendererController } from '../../Systems/Renderer/RendererController.js';

export class SnakeController {
  private readonly model: SnakeModel;
  private readonly view: SnakeView;
  private readonly gridCols: number;
  private readonly gridRows: number;
  private readonly wrapWalls: boolean;
  private tickMs: number;
  private accumulatedMs = 0;
  private lastTime = 0;
  private running = false;

  constructor(renderer: RendererController, config: GameConfig) {
    this.gridCols = config.cols;
    this.gridRows = config.rows;
    this.wrapWalls = false; // ghost not active initially
    this.tickMs = config.baseTickMs;

    const initialHead = { x: Math.floor(this.gridCols / 2), y: Math.floor(this.gridRows / 2) };
    this.model = new SnakeModel(initialHead, 4, Direction.Right);
    this.view = new SnakeView(renderer, config.gridSize);

    // Render initial snake
    this.view.renderSnake(this.model.getSegments(), '#2bd56f');
    // Publish initial snake segments for occupancy consumers
    EventBus.emit(GameEvents.SNAKE_INIT, Object.freeze({ segments: this.model.getSegments() }));

    this.subscribe();
  }

  private subscribe(): void {
    EventBus.on(GameEvents.SNAKE_DIRECTION_CHANGE, ({ direction }) => this.onDirection(direction));
    EventBus.on(GameEvents.GAME_STATE_CHANGE, ({ state }) => this.onGameStateChange(state));
    EventBus.on(GameEvents.GAME_SPEED_CHANGED, ({ speedMultiplier }) => {
      this.tickMs = Math.max(20, Math.floor(this.tickMs * speedMultiplier));
    });
  }

  private onDirection(direction: Direction): void {
    this.model.setNextDirection(direction);
  }

  private onGameStateChange(state: GameState): void {
    if (state === GameState.Playing) {
      this.startLoop();
    } else {
      this.stopLoop();
    }
  }

  private startLoop(): void {
    this.running = true;
    this.accumulatedMs = 0;
    this.lastTime = performance.now();
    requestAnimationFrame(this.tick);
  }

  private stopLoop(): void {
    this.running = false;
  }

  private tick = (time: number): void => {
    if (!this.running) return;
    const delta = time - this.lastTime;
    this.lastTime = time;
    this.accumulatedMs += delta;
    while (this.accumulatedMs >= this.tickMs) {
      this.stepOnce();
      this.accumulatedMs -= this.tickMs;
    }
    requestAnimationFrame(this.tick);
  };

  private stepOnce(): void {
    const { newHead, removedTail } = this.model.move(this.gridCols, this.gridRows, this.wrapWalls);
    // Emit minimal dirty rectangle info for Renderer
    EventBus.emit(GameEvents.SNAKE_MOVE, Object.freeze({ head: newHead, tail: removedTail }));
    // Allow another direction change for this tick (Input listens to SNAKE_MOVE)
  }
}


