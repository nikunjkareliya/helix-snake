// Types and enums have no dependencies. Use type aliases (not interfaces) and concrete enums.

export type Position = {
  readonly x: number;
  readonly y: number;
};

export enum Direction {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
}

export enum GameState {
  Menu = 'MENU',
  Playing = 'PLAYING',
  Paused = 'PAUSED',
  GameOver = 'GAME_OVER',
}

export enum ScreenName {
  Menu = 'MENU',
  Game = 'GAME',
  Pause = 'PAUSE',
  GameOver = 'GAME_OVER',
}

export enum PowerUpType {
  Slow = 'SLOW',
  Shrink = 'SHRINK',
  Ghost = 'GHOST',
}

export type SnakeData = {
  readonly segments: Position[];
  readonly direction: Direction;
  readonly nextDirection: Direction;
  readonly isGrowing: boolean;
  readonly powerUpActive: PowerUpType | null;
};

export type GameConfig = {
  readonly gridSize: number; // pixels per cell
  readonly cols: number;
  readonly rows: number;
  readonly baseTickMs: number; // base movement interval in ms
};


