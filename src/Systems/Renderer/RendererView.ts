// RendererView: provides primitive draw operations

import { RendererModel } from './RendererModel.js';

export class RendererView {
  private readonly model: RendererModel;

  constructor(model: RendererModel) {
    this.model = model;
  }

  clear(color: string = '#111318'): void {
    const dims = this.model.getDimensions();
    const ctx = this.model.getContext();
    ctx.save();
    ctx.fillStyle = color;
    ctx.clearRect(0, 0, dims.cssWidth, dims.cssHeight);
    ctx.fillRect(0, 0, dims.cssWidth, dims.cssHeight);
    ctx.restore();
  }

  fillRect(x: number, y: number, w: number, h: number, color: string): void {
    const ctx = this.model.getContext();
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  }

  drawText(text: string, x: number, y: number, color: string = '#e8e8ea', sizePx: number = 16, align: CanvasTextAlign = 'left'): void {
    const ctx = this.model.getContext();
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${sizePx}px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial`;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}


