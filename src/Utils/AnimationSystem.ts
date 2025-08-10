// Animation system for smooth visual effects
// Following cursor rules: concrete classes, no interfaces/abstracts

export type EaseFunction = (t: number) => number;

export class Easing {
  static linear(t: number): number {
    return t;
  }

  static easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  static easeOut(t: number): number {
    return t * (2 - t);
  }

  static easeIn(t: number): number {
    return t * t;
  }

  static bounce(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }
}

export type AnimationData = {
  startValue: number;
  endValue: number;
  duration: number;
  startTime: number;
  easing: EaseFunction;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
};

export class AnimationSystem {
  private animations = new Map<string, AnimationData>();
  private running = false;

  start(): void {
    if (this.running) return;
    this.running = true;
    this.update();
  }

  stop(): void {
    this.running = false;
  }

  animate(
    id: string,
    from: number,
    to: number,
    duration: number,
    onUpdate: (value: number) => void,
    easing: EaseFunction = Easing.easeInOut,
    onComplete?: () => void
  ): void {
    this.animations.set(id, {
      startValue: from,
      endValue: to,
      duration,
      startTime: performance.now(),
      easing,
      onUpdate,
      onComplete
    });
  }

  cancel(id: string): void {
    this.animations.delete(id);
  }

  isAnimating(id: string): boolean {
    return this.animations.has(id);
  }

  clear(): void {
    this.animations.clear();
  }

  private update = (): void => {
    if (!this.running) return;

    const currentTime = performance.now();
    const completedAnimations: string[] = [];

    for (const [id, anim] of this.animations) {
      const elapsed = currentTime - anim.startTime;
      const progress = Math.min(elapsed / anim.duration, 1);
      
      const easedProgress = anim.easing(progress);
      const currentValue = anim.startValue + (anim.endValue - anim.startValue) * easedProgress;
      
      anim.onUpdate(currentValue);

      if (progress >= 1) {
        if (anim.onComplete) anim.onComplete();
        completedAnimations.push(id);
      }
    }

    // Remove completed animations
    completedAnimations.forEach(id => this.animations.delete(id));

    requestAnimationFrame(this.update);
  };
}

// Visual effects utilities
export class VisualEffects {
  private static animationSystem = new AnimationSystem();

  static {
    this.animationSystem.start();
  }

  static scorePopup(renderer: any, x: number, y: number, points: number): void {
    let opacity = 1;
    let offsetY = 0;

    this.animationSystem.animate(
      `score-popup-${Date.now()}`,
      0,
      1,
      1000, // 1 second
      (progress) => {
        opacity = 1 - progress;
        offsetY = progress * 30; // Move up 30 pixels
        
        // Render the floating score
        const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
        renderer.drawText(
          `+${points}`,
          x,
          y - offsetY,
          `#2bd56f${alpha}`,
          14,
          'center'
        );
      },
      Easing.easeOut
    );
  }

  static pulseEffect(renderer: any, x: number, y: number, size: number, color: string, duration = 500): void {
    this.animationSystem.animate(
      `pulse-${x}-${y}-${Date.now()}`,
      0,
      1,
      duration,
      (progress) => {
        const scale = 1 + Math.sin(progress * Math.PI) * 0.3;
        const alpha = 1 - progress;
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
        
        const scaledSize = size * scale;
        const offset = (scaledSize - size) / 2;
        
        renderer.fillRect(
          x - offset,
          y - offset,
          scaledSize,
          scaledSize,
          `${color}${alphaHex}`
        );
      },
      Easing.easeOut
    );
  }

  static screenTransition(renderer: any, width: number, height: number, onComplete?: () => void): void {
    // Fade to black and back
    this.animationSystem.animate(
      'screen-transition',
      0,
      1,
      300,
      (progress) => {
        const alpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
        renderer.fillRect(0, 0, width, height, `#000000${alphaHex}`);
      },
      Easing.easeInOut,
      onComplete
    );
  }
}