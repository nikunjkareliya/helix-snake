import { ScreenName } from '../../Utils/Types.js';

export class ScreenModel {
  private current: ScreenName = ScreenName.Menu;
  private finalScore = 0;

  getCurrent(): ScreenName { return this.current; }
  setCurrent(next: ScreenName): void { this.current = next; }
  
  getFinalScore(): number { return this.finalScore; }
  setFinalScore(score: number): void { this.finalScore = score; }
}


