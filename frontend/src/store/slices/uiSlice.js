import { createSlice } from '@reduxjs/toolkit';
import { sounds } from '../../utils/SoundEffects';

const initialSound = localStorage.getItem('soundEnabled') === 'true';
sounds.enabled = initialSound;

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: localStorage.getItem('theme') || 'light',
    palette: localStorage.getItem('palette') || 'default',
    fontSize: Number(localStorage.getItem('fontSize')) || 14,
    language: localStorage.getItem('language') || 'en',
    sidebarOpen: true,
    soundEnabled: initialSound,
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      sounds.playSwitch();
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
    setPalette: (state, action) => {
      state.palette = action.payload;
      localStorage.setItem('palette', action.payload);
      sounds.playSwitch();
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
      sounds.enabled = state.soundEnabled;
      localStorage.setItem('soundEnabled', String(state.soundEnabled));
      if (state.soundEnabled) sounds.playSuccess();
    },
    increaseFontSize: (state) => {
      if (state.fontSize < 20) { state.fontSize += 1; localStorage.setItem('fontSize', state.fontSize); }
    },
    decreaseFontSize: (state) => {
      if (state.fontSize > 12) { state.fontSize -= 1; localStorage.setItem('fontSize', state.fontSize); }
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
  },
});

export const {
  toggleTheme,
  setTheme,
  setPalette,
  toggleSound,
  increaseFontSize,
  decreaseFontSize,
  setLanguage,
  toggleSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;
