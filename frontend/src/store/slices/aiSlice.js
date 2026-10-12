import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendAIMessage = createAsyncThunk('ai/chat', async ({ message, language, context }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/ai/chat', { message, language, context }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return { userMessage: message, aiResponse: data };
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'AI error'); }
});

const aiSlice = createSlice({
  name: 'ai',
  initialState: { messages: [], loading: false, isOpen: false, error: null },
  reducers: {
    toggleAI: (s) => { s.isOpen = !s.isOpen; },
    openAI: (s) => { s.isOpen = true; },
    closeAI: (s) => { s.isOpen = false; },
    clearMessages: (s) => { s.messages = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAIMessage.pending, (s, a) => {
        s.loading = true;
        s.messages.push({ role: 'user', content: a.meta.arg.message, timestamp: Date.now() });
      })
      .addCase(sendAIMessage.fulfilled, (s, a) => {
        s.loading = false;
        s.messages.push({ role: 'assistant', content: a.payload.aiResponse.message, action: a.payload.aiResponse.action, target: a.payload.aiResponse.target, timestamp: Date.now() });
      })
      .addCase(sendAIMessage.rejected, (s, a) => {
        s.loading = false;
        s.messages.push({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: Date.now() });
      });
  },
});

export const { toggleAI, openAI, closeAI, clearMessages } = aiSlice.actions;
export default aiSlice.reducer;
