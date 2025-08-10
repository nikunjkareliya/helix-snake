// Object pooling utility to reduce garbage collection overhead
// Following cursor rules: concrete class, no interfaces/abstracts

export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;
  private maxSize: number;

  constructor(createFn: () => T, resetFn: (obj: T) => void, maxSize = 50) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }

  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
    // If pool is full, let object be garbage collected
  }

  clear(): void {
    this.pool.length = 0;
  }

  getPoolSize(): number {
    return this.pool.length;
  }

  getMaxSize(): number {
    return this.maxSize;
  }
}

// Specific pools for common game objects
export class PositionPool {
  private static pool = new ObjectPool(
    () => ({ x: 0, y: 0 }),
    (pos) => { pos.x = 0; pos.y = 0; },
    100
  );

  static acquire(x = 0, y = 0): { x: number; y: number } {
    const pos = this.pool.acquire();
    pos.x = x;
    pos.y = y;
    return pos;
  }

  static release(pos: { x: number; y: number }): void {
    this.pool.release(pos);
  }

  static clear(): void {
    this.pool.clear();
  }
}