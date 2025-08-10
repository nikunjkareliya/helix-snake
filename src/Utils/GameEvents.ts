// Centralized event names and payload typings. No dependencies.

import { Direction, GameState, Position, PowerUpType } from './Types.js';

// Event name constants
export const GameEvents = {
  // Game lifecycle
  GAME_START: 'GAME_START',
  GAME_PAUSE: 'GAME_PAUSE',
  GAME_RESUME: 'GAME_RESUME',
  GAME_OVER: 'GAME_OVER',
  GAME_STATE_CHANGE: 'GAME_STATE_CHANGE',

  // Input
  SNAKE_DIRECTION_CHANGE: 'SNAKE_DIRECTION_CHANGE',

  // Snake
  SNAKE_MOVE: 'SNAKE_MOVE',
  SNAKE_GROW: 'SNAKE_GROW',
  SNAKE_COLLISION: 'SNAKE_COLLISION',

  // Food
  FOOD_SPAWN: 'FOOD_SPAWN',
  FOOD_EATEN: 'FOOD_EATEN',

  // PowerUp
  POWERUP_SPAWN: 'POWERUP_SPAWN',
  POWERUP_COLLECTED: 'POWERUP_COLLECTED',
  POWERUP_EXPIRED: 'POWERUP_EXPIRED',
} as const;

export type GameEventName = typeof GameEvents[keyof typeof GameEvents];

// Payload types per event
export type EventPayloads = {
  [GameEvents.GAME_START]: Readonly<{ config: { speedMultiplier: number } }>;
  [GameEvents.GAME_PAUSE]: Readonly<{}>;
  [GameEvents.GAME_RESUME]: Readonly<{}>;
  [GameEvents.GAME_OVER]: Readonly<{ reason: 'WALL' | 'SELF' } | {}>;
  [GameEvents.GAME_STATE_CHANGE]: Readonly<{ state: GameState }>;

  [GameEvents.SNAKE_DIRECTION_CHANGE]: Readonly<{ direction: Direction }>;

  [GameEvents.SNAKE_MOVE]: Readonly<{ head: Position; tail?: Position }>;
  [GameEvents.SNAKE_GROW]: Readonly<{}>;
  [GameEvents.SNAKE_COLLISION]: Readonly<{ type: 'WALL' | 'SELF' }>;

  [GameEvents.FOOD_SPAWN]: Readonly<{ position: Position }>;
  [GameEvents.FOOD_EATEN]: Readonly<{ position: Position }>;

  [GameEvents.POWERUP_SPAWN]: Readonly<{ position: Position; type: PowerUpType }>;
  [GameEvents.POWERUP_COLLECTED]: Readonly<{ position: Position; type: PowerUpType }>;
  [GameEvents.POWERUP_EXPIRED]: Readonly<{ type: PowerUpType }>;
};


