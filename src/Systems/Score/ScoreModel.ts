export class ScoreModel {
  private score = 0;
  private difficultyMultiplier = 1; // increases every 100 points by +5%

  getScore(): number { return this.score; }
  addPoints(points: number): void { this.score += Math.max(0, Math.floor(points)); }
  reset(): void { this.score = 0; this.difficultyMultiplier = 1; }
  getDifficultyMultiplier(): number { return this.difficultyMultiplier; }
  onFoodEatenRecalc(): void {
    // Increase difficulty every 100 points by 5%
    const levels = Math.floor(this.score / 100);
    this.difficultyMultiplier = 1 + levels * 0.05;
  }
}


