// RendererModel: holds canvas, context, and render-related state

export type RendererDimensions = {
  readonly cssWidth: number;  // in CSS pixels
  readonly cssHeight: number; // in CSS pixels
  readonly devicePixelRatio: number;
};

export class RendererModel {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  private cssWidth: number;
  private cssHeight: number;
  private devicePixelRatio: number;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D canvas context unavailable');

    this.canvas = canvas;
    this.ctx = context;
    this.cssWidth = canvas.clientWidth || canvas.width;
    this.cssHeight = canvas.clientHeight || canvas.height;
    this.devicePixelRatio = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getDimensions(): RendererDimensions {
    return {
      cssWidth: this.cssWidth,
      cssHeight: this.cssHeight,
      devicePixelRatio: this.devicePixelRatio,
    };
  }

  setDimensions(dimensions: RendererDimensions): void {
    this.cssWidth = dimensions.cssWidth;
    this.cssHeight = dimensions.cssHeight;
    this.devicePixelRatio = dimensions.devicePixelRatio;

    // Set the canvas backing store size for crisp rendering
    const pixelWidth = Math.max(1, Math.floor(this.cssWidth * this.devicePixelRatio));
    const pixelHeight = Math.max(1, Math.floor(this.cssHeight * this.devicePixelRatio));
    if (this.canvas.width !== pixelWidth) this.canvas.width = pixelWidth;
    if (this.canvas.height !== pixelHeight) this.canvas.height = pixelHeight;

    // Scale context so drawing uses CSS pixel units
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
  }
}


