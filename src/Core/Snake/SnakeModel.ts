import { Direction, Position, PowerUpType } from '../../Utils/Types.js';

export type SnakeInternalState = {
  segments: Position[];
  direction: Direction;
  nextDirection: Direction;
  isGrowing: boolean;
  powerUpActive: PowerUpType | null;
};

export class SnakeModel {
  private state: SnakeInternalState;

  constructor(initialHead: Position, initialLength: number, initialDirection: Direction) {
    const segments: Position[] = [];
    for (let i = 0; i < initialLength; i += 1) {
      // Build tail behind the head opposite to direction
      let dx = 0, dy = 0;
      if (initialDirection === Direction.Right) dx = -i;
      else if (initialDirection === Direction.Left) dx = i;
      else if (initialDirection === Direction.Down) dy = -i;
      else if (initialDirection === Direction.Up) dy = i;
      segments.push({ x: initialHead.x + dx, y: initialHead.y + dy });
    }
    this.state = {
      segments,
      direction: initialDirection,
      nextDirection: initialDirection,
      isGrowing: false,
      powerUpActive: null,
    };
  }

  getSegments(): Position[] { return this.state.segments.slice(); }
  getHead(): Position { return this.state.segments[0]; }
  getDirection(): Direction { return this.state.direction; }
  getNextDirection(): Direction { return this.state.nextDirection; }
  setNextDirection(dir: Direction): void { this.state.nextDirection = dir; }
  setGrowing(growing: boolean): void { this.state.isGrowing = growing; }

  move(gridCols: number, gridRows: number, wrap: boolean): { newHead: Position; removedTail?: Position } {
    // Commit nextDirection if it is not reversing
    if (!this.isReverse(this.state.direction, this.state.nextDirection)) {
      this.state.direction = this.state.nextDirection;
    }
    const head = this.getHead();
    const delta = this.directionDelta(this.state.direction);
    let newX = head.x + delta.x;
    let newY = head.y + delta.y;

    if (wrap) {
      newX = (newX + gridCols) % gridCols;
      newY = (newY + gridRows) % gridRows;
    }

    const newHead: Position = { x: newX, y: newY };
    this.state.segments.unshift(newHead);

    let removedTail: Position | undefined;
    if (!this.state.isGrowing) {
      removedTail = this.state.segments.pop();
    } else {
      this.state.isGrowing = false;
    }
    return { newHead, removedTail };
  }

  private isReverse(current: Direction, next: Direction): boolean {
    return (current === Direction.Up && next === Direction.Down)
      || (current === Direction.Down && next === Direction.Up)
      || (current === Direction.Left && next === Direction.Right)
      || (current === Direction.Right && next === Direction.Left);
  }

  private directionDelta(dir: Direction): Position {
    switch (dir) {
      case Direction.Up: return { x: 0, y: -1 };
      case Direction.Down: return { x: 0, y: 1 };
      case Direction.Left: return { x: -1, y: 0 };
      case Direction.Right: return { x: 1, y: 0 };
      default: return { x: 0, y: 0 };
    }
  }
}


