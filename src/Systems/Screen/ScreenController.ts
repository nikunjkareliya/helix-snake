import { EventBus } from '../../Utils/EventBus.js';
import { GameEvents } from '../../Utils/GameEvents.js';
import { GameState, ScreenName } from '../../Utils/Types.js';
import { ScreenModel } from './ScreenModel.js';
import { ScreenView } from './ScreenView.js';
import { RendererController } from '../Renderer/RendererController.js';
import { VisualEffects } from '../../Utils/AnimationSystem.js';

export class ScreenController {
  private readonly model: ScreenModel;
  private readonly view: ScreenView;
  private readonly renderer: RendererController;

  constructor(renderer: RendererController) {
    this.model = new ScreenModel();
    this.view = new ScreenView(renderer);
    this.renderer = renderer;
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
    // Add smooth transition for major state changes
    if (state === GameState.GameOver || state === GameState.Menu) {
      const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
      if (canvas) {
        VisualEffects.screenTransition(
          this.renderer,
          canvas.clientWidth || 800,
          canvas.clientHeight || 600,
          () => {
            this.model.setCurrent(screen);
            this.renderOverlayIfNeeded(state, screen);
          }
        );
        return;
      }
    }
    
    this.model.setCurrent(screen);
    this.renderOverlayIfNeeded(state, screen);
  }

  private renderOverlayIfNeeded(state: GameState, screen: ScreenName): void {
    if (state === GameState.Menu) {
      this.view.render(screen, this.model.getFinalScore());
    } else if (state === GameState.Paused) {
      this.view.render(screen, this.model.getFinalScore());
    } else if (state === GameState.GameOver) {
      this.view.render(screen, this.model.getFinalScore());
    }
    // Don't render overlay for Playing state
  }
}


