import { Direction, GameState } from '../../Utils/Types.js';

export class InputModel {
  private readonly pressedKeys: Set<string> = new Set();
  private currentGameState: GameState = GameState.Menu;
  private lastDirection: Direction | null = null;
  private canAcceptDirectionChange = true;

  setGameState(state: GameState): void {
    this.currentGameState = state;
  }

  getGameState(): GameState {
    return this.currentGameState;
  }

  setKeyDown(code: string): void {
    this.pressedKeys.add(code);
  }

  setKeyUp(code: string): void {
    this.pressedKeys.delete(code);
  }

  setLastDirection(direction: Direction): void {
    this.lastDirection = direction;
  }

  getLastDirection(): Direction | null {
    return this.lastDirection;
  }

  allowDirectionChange(): void {
    this.canAcceptDirectionChange = true;
  }

  consumeDirectionChange(): void {
    this.canAcceptDirectionChange = false;
  }

  isDirectionChangeAllowed(): boolean {
    return this.canAcceptDirectionChange;
  }
}


