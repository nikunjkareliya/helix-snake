import { Position } from '../../Utils/Types.js';

export class FoodModel {
  private position: Position | null = null;

  getPosition(): Position | null {
    return this.position ? { ...this.position } : null;
  }

  setPosition(pos: Position): void {
    this.position = pos;
  }
}


