import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserSession {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  isVerified: boolean;
  avatarUrl: string;
}

interface FeedState {
  activeTab: 'recommended' | 'following' | 'trending' | 'reels' | 'close_friends' | 'saved_reels' | 'nearby';
  posts: any[];
  isCreateModalOpen: boolean;
  isAuthModalOpen: boolean;
  isEditProfileModalOpen: boolean;
  authMode: 'login' | 'register' | 'forgot';
  currentUser: UserSession | null;
  theme: 'dark' | 'light';
  isVideoCallActive: boolean;
  activeCallUser: any | null;
}

const getSavedSession = (): UserSession | null => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('aura_active_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return null;
};

const getSavedTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('aura_theme_preference');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  }
  return 'dark';
};

const initialState: FeedState = {
  activeTab: 'recommended',
  posts: [],
  isCreateModalOpen: false,
  isAuthModalOpen: !getSavedSession(), // Open Auth Modal immediately if not logged in!
  isEditProfileModalOpen: false,
  authMode: 'login',
  currentUser: getSavedSession(),
  theme: getSavedTheme(),
  isVideoCallActive: false,
  activeCallUser: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<FeedState['activeTab']>) => {
      state.activeTab = action.payload;
    },
    setPosts: (state, action: PayloadAction<any[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<any>) => {
      state.posts.unshift(action.payload);
    },
    setCreateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload;
    },
    setAuthModalOpen: (state, action: PayloadAction<{ open: boolean; mode?: 'login' | 'register' | 'forgot' }>) => {
      state.isAuthModalOpen = action.payload.open;
      if (action.payload.mode) {
        state.authMode = action.payload.mode;
      }
    },
    setEditProfileModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditProfileModalOpen = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<UserSession | null>) => {
      state.currentUser = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('aura_active_session', JSON.stringify(action.payload));
          state.isAuthModalOpen = false;
        } else {
          localStorage.removeItem('aura_active_session');
          state.isAuthModalOpen = true;
          state.authMode = 'login';
        }
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('aura_theme_preference', state.theme);
        if (state.theme === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
        }
      }
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthModalOpen = true;
      state.authMode = 'login';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aura_active_session');
        localStorage.removeItem('aura_access_token');
      }
    },
    setVideoCallActive: (state, action: PayloadAction<{ active: boolean; user?: any }>) => {
      state.isVideoCallActive = action.payload.active;
      state.activeCallUser = action.payload.user || null;
    },
  },
});

export const {
  setActiveTab,
  setPosts,
  addPost,
  setCreateModalOpen,
  setAuthModalOpen,
  setEditProfileModalOpen,
  setCurrentUser,
  toggleTheme,
  logoutUser,
  setVideoCallActive,
} = feedSlice.actions;

export default feedSlice.reducer;
