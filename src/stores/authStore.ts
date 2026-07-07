import { create } from 'zustand';
import { apiClient } from '../services/api/client';

export interface User {
  id: string;
  email: string;
  role: 'CITIZEN' | 'INVESTIGATOR' | 'ADMIN';
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: (token: string, user: User) => {
    apiClient.setAuthToken(token);
    set({ user, isAuthenticated: true, isLoading: false });
  },
  
  logout: () => {
    apiClient.clearAuthToken();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  
  checkAuth: async () => {
    const token = apiClient.getAuthToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    
    try {
      const user = await apiClient.get<User>('/api/v1/auth/me');
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      apiClient.clearAuthToken();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));

// Listen for global unauthorized events
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().logout();
  });
}
