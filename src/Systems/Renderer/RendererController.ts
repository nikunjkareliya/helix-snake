// RendererController: sets up canvas, manages resize, orchestrates drawing

import { RendererModel, RendererDimensions } from './RendererModel.js';
import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { GameState } from '../../Utils/Types.js';
import { RendererView } from './RendererView.js';

export class RendererController {
  private readonly model: RendererModel;
  private readonly view: RendererView;
  private resizeObserver: ResizeObserver | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.model = new RendererModel(canvas);
    this.view = new RendererView(this.model);
    this.applyInitialSizing();
    this.attachResizeHandling();
    this.subscribeToEvents();
  }

  private applyInitialSizing(): void {
    const canvas = this.model.getCanvas();
    // Compute CSS pixel dimensions based on actual element size (centered container)
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width || 800));
    const height = Math.max(1, Math.floor(rect.height || 600));
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const dims: RendererDimensions = { cssWidth: width, cssHeight: height, devicePixelRatio: dpr };
    this.model.setDimensions(dims);
  }

  private attachResizeHandling(): void {
    const canvas = this.model.getCanvas();
    // Use global constructor check to avoid odd type narrowing on window
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.applyInitialSizing());
      this.resizeObserver.observe(canvas);
      return;
    }
    window.addEventListener('resize', () => this.applyInitialSizing());
  }

  clear(color?: string): void {
    this.view.clear(color);
  }

  fillRect(x: number, y: number, width: number, height: number, color: string): void {
    this.view.fillRect(x, y, width, height, color);
  }

  drawText(text: string, x: number, y: number, color: string, size: number, align: CanvasTextAlign): void {
    this.view.drawText(text, x, y, color, size, align);
  }

  drawDebugBaseline(): void {
    // Simple visual to verify rendering
    const canvas = this.model.getCanvas();
    this.view.clear('#0f1218');
    this.view.fillRect(20, 20, 100, 100, '#2bd56f');
    this.view.drawText('Renderer OK', (canvas.clientWidth || canvas.width) / 2, 24, '#e8e8ea', 18, 'center');
  }

  cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    } else {
      window.removeEventListener('resize', () => this.applyInitialSizing());
    }
  }

  private subscribeToEvents(): void {
    EventBus.on(GameEvents.GAME_STATE_CHANGE, ({ state }) => this.renderOverlayForState(state));
    let cellSize = 16;
    EventBus.on(GameEvents.GRID_CONFIG_SET, ({ gridSize }) => { cellSize = gridSize; });
    EventBus.on(GameEvents.GAME_START, () => {
      this.view.clear('#0f1218'); // Clear canvas on game restart
    });
    EventBus.on(GameEvents.SNAKE_INIT, ({ segments }) => {
      for (const seg of segments) {
        this.fillRect(seg.x * cellSize, seg.y * cellSize, cellSize, cellSize, '#2bd56f');
      }
    });
    EventBus.on(GameEvents.SNAKE_MOVE, ({ head, tail }) => {
      if (tail) this.fillRect(tail.x * cellSize, tail.y * cellSize, cellSize, cellSize, '#0f1218');
      this.fillRect(head.x * cellSize, head.y * cellSize, cellSize, cellSize, '#2bd56f');
    });
  }

  private renderOverlayForState(state: GameState): void {
    const canvas = this.model.getCanvas();
    const width = canvas.clientWidth || canvas.width;
    const text = this.buildOverlayText(state);
    if (text) {
      this.view.clear(undefined);
      this.drawText(text, Math.floor(width / 2), 80, '#e8e8ea', 20, 'center');
    }
  }

  private buildOverlayText(state: GameState): string | null {
    switch (state) {
      case GameState.Menu:
        return 'Press Space to Start';
      case GameState.Paused:
        return 'Paused - Press Space to Resume';
      case GameState.GameOver:
        return 'Game Over - Press Space to Restart';
      case GameState.Playing:
      default:
        return null;
    }
  }
}


