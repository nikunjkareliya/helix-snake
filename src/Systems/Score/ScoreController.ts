import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { ScoreModel } from './ScoreModel.js';
import { ScoreView } from './ScoreView.js';
import { RendererController } from '../Renderer/RendererController.js';

export class ScoreController {
  private readonly model: ScoreModel;
  private readonly view: ScoreView;
  private currentSpeedMultiplier = 1;

  constructor(renderer: RendererController) {
    this.model = new ScoreModel();
    this.view = new ScoreView(renderer);
    this.subscribe();
    this.view.render(this.model.getScore());
  }

  private subscribe(): void {
    EventBus.on(GameEvents.FOOD_EATEN, () => {
      // Base food points: 10
      let points = 10;
      
      // Speed bonus: additional points based on current speed
      const speedBonus = Math.floor((1 - this.currentSpeedMultiplier) * 20); // Max +10 points at max speed
      points += speedBonus;
      
      // Apply difficulty multiplier
      points = Math.floor(points * this.model.getDifficultyMultiplier());
      
      this.model.addPoints(points);
      this.model.onFoodEatenRecalc();
      EventBus.emit(GameEvents.SCORE_UPDATED, Object.freeze({ score: this.model.getScore() }));
      this.view.render(this.model.getScore());
    });

    EventBus.on(GameEvents.GAME_START, () => {
      this.currentSpeedMultiplier = 1;
      this.model.reset();
      this.view.render(this.model.getScore());
      EventBus.emit(GameEvents.SCORE_UPDATED, Object.freeze({ score: 0 }));
    });

    EventBus.on(GameEvents.GAME_SPEED_CHANGED, ({ speedMultiplier }) => {
      this.currentSpeedMultiplier = speedMultiplier;
    });

    // Future: Add power-up scoring
    EventBus.on(GameEvents.POWERUP_COLLECTED, ({ type }) => {
      let bonusPoints = 0;
      switch (type) {
        case 'SLOW': bonusPoints = 50; break;
        case 'SHRINK': bonusPoints = 100; break;
        case 'GHOST': bonusPoints = 150; break;
      }
      if (bonusPoints > 0) {
        this.model.addPoints(bonusPoints);
        EventBus.emit(GameEvents.SCORE_UPDATED, Object.freeze({ score: this.model.getScore() }));
        this.view.render(this.model.getScore());
      }
    });
  }
}


