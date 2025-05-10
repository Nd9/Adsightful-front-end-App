import { v4 as uuidv4 } from 'uuid';
import { AudienceBrief } from '../../types/audience';

export interface SavedStrategy {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  audienceBrief: AudienceBrief;
}

class AudienceStrategyService {
  private strategies: Record<string, SavedStrategy> = {};
  private localStorageKey = 'adsightful_audience_strategies';

  constructor() {
    this.loadStrategiesFromStorage();
  }

  private loadStrategiesFromStorage(): void {
    const storedStrategies = localStorage.getItem(this.localStorageKey);
    if (storedStrategies) {
      try {
        this.strategies = JSON.parse(storedStrategies);
      } catch (e) {
        console.error('Failed to parse stored strategies', e);
        localStorage.removeItem(this.localStorageKey);
      }
    }
  }

  private saveStrategiesToStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.strategies));
  }

  // Get all strategies for a user
  getUserStrategies(userId: string): SavedStrategy[] {
    return Object.values(this.strategies).filter(
      strategy => strategy.userId === userId
    );
  }

  // Get a specific strategy by ID
  getStrategyById(id: string): SavedStrategy | null {
    return this.strategies[id] || null;
  }

  // Save a new audience strategy
  saveStrategy(
    userId: string,
    name: string,
    description: string,
    audienceBrief: AudienceBrief
  ): SavedStrategy {
    const now = new Date().toISOString();
    const strategy: SavedStrategy = {
      id: uuidv4(),
      userId,
      name,
      description,
      createdAt: now,
      updatedAt: now,
      audienceBrief
    };

    this.strategies[strategy.id] = strategy;
    this.saveStrategiesToStorage();
    return strategy;
  }

  // Update an existing strategy
  updateStrategy(
    id: string,
    updates: Partial<Omit<SavedStrategy, 'id' | 'userId' | 'createdAt'>>
  ): SavedStrategy | null {
    const strategy = this.strategies[id];
    if (!strategy) return null;

    this.strategies[id] = {
      ...strategy,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveStrategiesToStorage();
    return this.strategies[id];
  }

  // Delete a strategy
  deleteStrategy(id: string): boolean {
    if (!this.strategies[id]) return false;

    delete this.strategies[id];
    this.saveStrategiesToStorage();
    return true;
  }
}

// Export a singleton instance
export const audienceStrategyService = new AudienceStrategyService(); 