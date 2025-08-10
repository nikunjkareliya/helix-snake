// Typed EventBus singleton with compile-time safety based on GameEvents payload map.
// Concrete class, no interfaces/abstracts.

import { EventPayloads } from './GameEvents.js';

type EventKey = keyof EventPayloads;
type Listener<E extends EventKey> = (payload: EventPayloads[E]) => void;

class EventBusClass {
  private listeners: Map<EventKey, Set<Function>> = new Map();

  on<E extends EventKey>(eventName: E, callback: Listener<E>): void {
    let set = this.listeners.get(eventName);
    if (!set) {
      set = new Set();
      this.listeners.set(eventName, set);
    }
    set.add(callback as unknown as Function);
  }

  off<E extends EventKey>(eventName: E, callback: Listener<E>): void {
    const set = this.listeners.get(eventName);
    if (!set) return;
    set.delete(callback as unknown as Function);
    if (set.size === 0) this.listeners.delete(eventName);
  }

  emit<E extends EventKey>(eventName: E, payload: EventPayloads[E]): void {
    const set = this.listeners.get(eventName);
    if (!set) return;
    // Emit readonly payload; callers should pass immutable objects
    for (const fn of Array.from(set)) {
      // Defensive try/catch to prevent one listener from breaking others
      try {
        (fn as Listener<E>)(payload);
      } catch (error) {
        // In production, we could route to a logger; avoid console noise per rules
      }
    }
  }

  clearAll(): void {
    this.listeners.clear();
  }
}

export const EventBus = new EventBusClass();


