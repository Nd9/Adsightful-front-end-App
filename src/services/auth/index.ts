import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  companyName: string;
  companyUrl: string;
  createdAt: string;
  audienceStrategies: string[]; // IDs of saved strategies
}

// Simple in-memory/localStorage store for the demo
// In a real app, this would connect to a proper backend
class AuthService {
  private currentUser: User | null = null;
  private localStorageKey = 'adsightful_user';

  constructor() {
    // Try to load user from localStorage on init
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem(this.localStorageKey);
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem(this.localStorageKey);
      }
    }
  }

  private saveUserToStorage(): void {
    if (this.currentUser) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem(this.localStorageKey);
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async login(email: string, companyName: string, companyUrl: string): Promise<User> {
    // Create new user or update existing
    const user: User = {
      id: uuidv4(),
      email,
      companyName,
      companyUrl,
      createdAt: new Date().toISOString(),
      audienceStrategies: []
    };

    this.currentUser = user;
    this.saveUserToStorage();
    return user;
  }

  logout(): void {
    this.currentUser = null;
    this.saveUserToStorage();
  }

  updateUserDetails(updates: Partial<User>): User | null {
    if (!this.currentUser) return null;

    this.currentUser = {
      ...this.currentUser,
      ...updates
    };

    this.saveUserToStorage();
    return this.currentUser;
  }

  // Add an audience strategy ID to the user's saved strategies
  saveAudienceStrategy(strategyId: string): boolean {
    if (!this.currentUser) return false;

    if (!this.currentUser.audienceStrategies.includes(strategyId)) {
      this.currentUser.audienceStrategies.push(strategyId);
      this.saveUserToStorage();
    }
    
    return true;
  }

  // Remove an audience strategy from the user's saved strategies
  removeAudienceStrategy(strategyId: string): boolean {
    if (!this.currentUser) return false;

    const index = this.currentUser.audienceStrategies.indexOf(strategyId);
    if (index !== -1) {
      this.currentUser.audienceStrategies.splice(index, 1);
      this.saveUserToStorage();
      return true;
    }
    
    return false;
  }
}

// Export a singleton instance
export const authService = new AuthService(); 