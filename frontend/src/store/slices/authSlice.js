import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = '/api';

const getSavedToken = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined' || token === 'null') {
    localStorage.removeItem('token');
    return null;
  }
  return token;
};

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API}/auth/login`, credentials, { timeout: 15000 });
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || (err.code === 'ECONNABORTED' ? 'Connection timed out. Check backend server.' : 'Login failed. Please check backend connection.');
    return rejectWithValue(msg);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API}/auth/register`, userData, { timeout: 15000 });
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const oauthLoginUser = createAsyncThunk('auth/oauth', async (oauthData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API}/auth/oauth`, oauthData, { timeout: 15000 });
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'OAuth authentication failed');
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const token = getSavedToken();
    if (!token) {
      return rejectWithValue('No token found');
    }
    const { data } = await axios.get(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    return data;
  } catch (err) {
    localStorage.removeItem('token');
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const token = getSavedToken();
    const { data } = await axios.put(`${API}/auth/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000,
    });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Profile update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: getSavedToken(),
    loading: false,
    error: null,
    initialChecked: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.initialChecked = true;
      localStorage.removeItem('token');
    },
    clearError: (state) => { state.error = null; },
    setAuthUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        s.initialChecked = true;
      })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      // Register
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        s.initialChecked = true;
      })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      // OAuth
      .addCase(oauthLoginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(oauthLoginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        s.initialChecked = true;
      })
      .addCase(oauthLoginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      // Fetch Me
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload.user;
        s.initialChecked = true;
      })
      .addCase(fetchMe.rejected, (s) => {
        s.user = null;
        s.token = null;
        s.initialChecked = true;
        localStorage.removeItem('token');
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload.user; });
  },
});

export const { logout, clearError, setAuthUser } = authSlice.actions;
export default authSlice.reducer;
