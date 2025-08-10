import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { ScoreModel } from './ScoreModel.js';
import { ScoreView } from './ScoreView.js';
import { RendererController } from '../Renderer/RendererController.js';

export class ScoreController {
  private readonly model: ScoreModel;
  private readonly view: ScoreView;

  constructor(renderer: RendererController) {
    this.model = new ScoreModel();
    this.view = new ScoreView(renderer);
    this.subscribe();
    this.view.render(this.model.getScore());
  }

  private subscribe(): void {
    EventBus.on(GameEvents.FOOD_EATEN, () => {
      // Base +10, multiplied by current difficulty (per spec)
      this.model.addPoints(10);
      this.model.onFoodEatenRecalc();
      EventBus.emit(GameEvents.SCORE_UPDATED, Object.freeze({ score: this.model.getScore() }));
      this.view.render(this.model.getScore());
    });

    EventBus.on(GameEvents.GAME_START, () => {
      this.model.reset();
      this.view.render(this.model.getScore());
    });
  }
}


