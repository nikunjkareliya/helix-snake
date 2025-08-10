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

  // Renderer/grid config
  GRID_CONFIG_SET: 'GRID_CONFIG_SET',
  GAME_SPEED_CHANGED: 'GAME_SPEED_CHANGED',
  SCORE_UPDATED: 'SCORE_UPDATED',

  // Input
  SNAKE_DIRECTION_CHANGE: 'SNAKE_DIRECTION_CHANGE',

  // Snake
  SNAKE_INIT: 'SNAKE_INIT',
  SNAKE_MOVE: 'SNAKE_MOVE',
  SNAKE_GROW: 'SNAKE_GROW',
  SNAKE_COLLISION: 'SNAKE_COLLISION',

  // Food
  FOOD_SPAWN: 'FOOD_SPAWN',
  FOOD_EATEN: 'FOOD_EATEN',
  
  // Collision
  COLLISION_CHECK_FOOD: 'COLLISION_CHECK_FOOD',

  // PowerUp
  POWERUP_SPAWN: 'POWERUP_SPAWN',
  POWERUP_COLLECTED: 'POWERUP_COLLECTED',
  POWERUP_ACTIVATED: 'POWERUP_ACTIVATED',
  POWERUP_EXPIRED: 'POWERUP_EXPIRED',
  
  // Snake effects
  SNAKE_SHRINK: 'SNAKE_SHRINK',
} as const;

export type GameEventName = typeof GameEvents[keyof typeof GameEvents];

// Payload types per event
export type EventPayloads = {
  [GameEvents.GAME_START]: Readonly<{ config: { speedMultiplier: number } }>;
  [GameEvents.GAME_PAUSE]: Readonly<{}>;
  [GameEvents.GAME_RESUME]: Readonly<{}>;
  [GameEvents.GAME_OVER]: Readonly<{ reason: 'WALL' | 'SELF' } | {}>;
  [GameEvents.GAME_STATE_CHANGE]: Readonly<{ state: GameState }>;
  [GameEvents.GRID_CONFIG_SET]: Readonly<{ gridSize: number; cols: number; rows: number }>;
  [GameEvents.GAME_SPEED_CHANGED]: Readonly<{ speedMultiplier: number }>;
  [GameEvents.SCORE_UPDATED]: Readonly<{ score: number }>;

  [GameEvents.SNAKE_DIRECTION_CHANGE]: Readonly<{ direction: Direction }>;

  [GameEvents.SNAKE_INIT]: Readonly<{ segments: Position[] }>;
  [GameEvents.SNAKE_MOVE]: Readonly<{ head: Position; tail?: Position }>;
  [GameEvents.SNAKE_GROW]: Readonly<{}>;
  [GameEvents.SNAKE_COLLISION]: Readonly<{ type: 'WALL' | 'SELF' }>;

  [GameEvents.FOOD_SPAWN]: Readonly<{ position: Position }>;
  [GameEvents.FOOD_EATEN]: Readonly<{ position: Position }>;
  
  [GameEvents.COLLISION_CHECK_FOOD]: Readonly<{ position: Position }>;

  [GameEvents.POWERUP_SPAWN]: Readonly<{ position: Position; type: PowerUpType }>;
  [GameEvents.POWERUP_COLLECTED]: Readonly<{ position: Position; type: PowerUpType }>;
  [GameEvents.POWERUP_ACTIVATED]: Readonly<{ type: PowerUpType; duration: number }>;
  [GameEvents.POWERUP_EXPIRED]: Readonly<{ type: PowerUpType }>;
  
  [GameEvents.SNAKE_SHRINK]: Readonly<{}>;
};


