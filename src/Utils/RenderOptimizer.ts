// Rendering optimization utilities to minimize canvas redraws
// Following cursor rules: concrete classes, performance-focused

export type DirtyRect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export class RenderOptimizer {
  private dirtyRegions: DirtyRect[] = [];
  private fullRedrawRequested = false;
  private lastFrameTime = 0;
  private frameCount = 0;
  private fpsHistory: number[] = [];

  markDirty(x: number, y: number, width: number, height: number): void {
    if (this.fullRedrawRequested) return;
    
    this.dirtyRegions.push({ x, y, width, height });
  }

  markFullRedraw(): void {
    this.fullRedrawRequested = true;
    this.dirtyRegions.length = 0;
  }

  getDirtyRegions(): DirtyRect[] {
    return [...this.dirtyRegions];
  }

  shouldFullRedraw(): boolean {
    return this.fullRedrawRequested || this.dirtyRegions.length > 20; // Too many regions, redraw all
  }

  clearDirtyRegions(): void {
    this.dirtyRegions.length = 0;
    this.fullRedrawRequested = false;
  }

  updateFrameStats(currentTime: number): void {
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = currentTime;
      return;
    }

    const deltaTime = currentTime - this.lastFrameTime;
    const fps = 1000 / deltaTime;
    
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > 60) {
      this.fpsHistory.shift(); // Keep only last 60 frames
    }
    
    this.lastFrameTime = currentTime;
    this.frameCount++;
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    const sum = this.fpsHistory.reduce((acc, fps) => acc + fps, 0);
    return sum / this.fpsHistory.length;
  }

  getFrameCount(): number {
    return this.frameCount;
  }

  reset(): void {
    this.clearDirtyRegions();
    this.frameCount = 0;
    this.fpsHistory.length = 0;
    this.lastFrameTime = 0;
  }
}

// Grid-based rendering optimization for tile games
export class GridRenderOptimizer {
  private dirtyCells = new Set<string>();
  private cellSize: number;
  private cols: number;
  private rows: number;

  constructor(cellSize: number, cols: number, rows: number) {
    this.cellSize = cellSize;
    this.cols = cols;
    this.rows = rows;
  }

  markCellDirty(x: number, y: number): void {
    if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
      this.dirtyCells.add(`${x},${y}`);
    }
  }

  getDirtyCells(): Array<{ x: number; y: number }> {
    const cells: Array<{ x: number; y: number }> = [];
    for (const cellKey of this.dirtyCells) {
      const [x, y] = cellKey.split(',').map(Number);
      cells.push({ x, y });
    }
    return cells;
  }

  getDirtyRects(): DirtyRect[] {
    const rects: DirtyRect[] = [];
    for (const cellKey of this.dirtyCells) {
      const [x, y] = cellKey.split(',').map(Number);
      rects.push({
        x: x * this.cellSize,
        y: y * this.cellSize,
        width: this.cellSize,
        height: this.cellSize
      });
    }
    return rects;
  }

  clearDirtyCells(): void {
    this.dirtyCells.clear();
  }

  getCellCount(): number {
    return this.dirtyCells.size;
  }
}