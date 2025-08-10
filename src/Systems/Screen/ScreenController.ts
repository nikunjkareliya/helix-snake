import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { GameState, ScreenName } from '../../Utils/Types.js';
import { ScreenModel } from './ScreenModel.js';
import { ScreenView } from './ScreenView.js';
import { RendererController } from '../Renderer/RendererController.js';

export class ScreenController {
  private readonly model: ScreenModel;
  private readonly view: ScreenView;

  constructor(renderer: RendererController) {
    this.model = new ScreenModel();
    this.view = new ScreenView(renderer);
    this.subscribe();
    this.view.render(this.model.getCurrent(), this.model.getFinalScore());
  }

  private subscribe(): void {
    EventBus.on(GameEvents.GAME_STATE_CHANGE, ({ state }) => this.onGameStateChange(state));
    EventBus.on(GameEvents.SCORE_UPDATED, ({ score }) => {
      this.model.setFinalScore(score);
    });
  }

  private onGameStateChange(state: GameState): void {
    let screen: ScreenName = ScreenName.Game;
    if (state === GameState.Menu) screen = ScreenName.Menu;
    if (state === GameState.Paused) screen = ScreenName.Pause;
    if (state === GameState.GameOver) screen = ScreenName.GameOver;
    this.model.setCurrent(screen);
    // Render overlays for non-playing states; during playing we leave drawing to other systems
    if (state !== GameState.Playing) {
      this.view.render(screen, this.model.getFinalScore());
    }
  }
}


