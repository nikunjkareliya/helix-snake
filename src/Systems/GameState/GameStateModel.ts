import { GameState } from '../../Utils/Types.js';

export class GameStateModel {
  private state: GameState;

  constructor(initialState: GameState = GameState.Menu) {
    this.state = initialState;
  }

  getState(): GameState {
    return this.state;
  }

  setState(next: GameState): void {
    this.state = next;
  }
}


