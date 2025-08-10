import { EventBus } from './EventBus.js';
import { GameEvents } from './GameEvents.js';

export class EventDebugger {
  private eventCounts = new Map<string, number>();
  private eventHistory: Array<{ event: string; timestamp: number; data: any }> = [];
  private enabled = false;

  enable(): void {
    this.enabled = true;
    this.attachListeners();
    console.log('🐛 EventDebugger enabled - monitoring all game events');
  }

  disable(): void {
    this.enabled = false;
    console.log('🐛 EventDebugger disabled');
  }

  getEventCounts(): Map<string, number> {
    return new Map(this.eventCounts);
  }

  getRecentEvents(count = 10): Array<{ event: string; timestamp: number; data: any }> {
    return this.eventHistory.slice(-count);
  }

  private attachListeners(): void {
    Object.values(GameEvents).forEach(eventName => {
      EventBus.on(eventName, (data) => {
        if (!this.enabled) return;
        
        this.eventCounts.set(eventName, (this.eventCounts.get(eventName) || 0) + 1);
        this.eventHistory.push({
          event: eventName,
          timestamp: performance.now(),
          data: data
        });

        // Keep only last 100 events to prevent memory leaks
        if (this.eventHistory.length > 100) {
          this.eventHistory.shift();
        }

        console.log(`📡 ${eventName}:`, data);
      });
    });
  }

  logSystemStatus(): void {
    if (!this.enabled) return;
    
    console.group('🎮 System Integration Status');
    console.log('Event counts:', Object.fromEntries(this.eventCounts));
    console.log('Recent events:', this.getRecentEvents(5));
    console.groupEnd();
  }
}

// Global instance for easy debugging
export const eventDebugger = new EventDebugger();

// Expose to window for manual debugging
declare global {
  interface Window {
    __eventDebugger: EventDebugger;
  }
}

if (typeof window !== 'undefined') {
  window.__eventDebugger = eventDebugger;
}