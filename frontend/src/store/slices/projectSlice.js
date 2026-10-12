import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all projects with pagination, searching, filtering, and sorting
export const fetchProjects = createAsyncThunk('projects/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const { data } = await axios.get(`/api/projects?${query}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects');
  }
});

// Fetch single project by ID
export const fetchProjectById = createAsyncThunk('projects/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/projects/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch project details');
  }
});

// Fetch user's own projects
export const fetchMyProjects = createAsyncThunk('projects/fetchMy', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const { data } = await axios.get(`/api/projects/my?${query}`, { headers: authHeader() });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch your projects');
  }
});

// Create new project (Client/Admin)
export const createProject = createAsyncThunk('projects/create', async (projectData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/projects', projectData, { headers: authHeader() });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create project');
  }
});

// Update project (Client/Admin)
export const updateProject = createAsyncThunk('projects/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put(`/api/projects/${id}`, updates, { headers: authHeader() });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update project');
  }
});

// Delete project (Client/Admin)
export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`/api/projects/${id}`, { headers: authHeader() });
    return { id, ...data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete project');
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    myProjects: [],
    current: null,
    loading: false,
    error: null,
    total: 0,
    pagination: {
      page: 1,
      limit: 10,
      totalPages: 1,
      totalCount: 0,
      hasNext: false,
      hasPrev: false,
    },
  },
  reducers: {
    setCurrentProject: (s, a) => { s.current = a.payload; },
    clearProjectError: (s) => { s.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Projects
      .addCase(fetchProjects.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProjects.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.data || a.payload.projects || [];
        s.total = a.payload.total || s.list.length;
        if (a.payload.pagination) {
          s.pagination = a.payload.pagination;
        }
      })
      .addCase(fetchProjects.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      // Fetch Project By ID
      .addCase(fetchProjectById.fulfilled, (s, a) => { s.current = a.payload.project; })
      // Fetch My Projects
      .addCase(fetchMyProjects.pending, (s) => { s.loading = true; })
      .addCase(fetchMyProjects.fulfilled, (s, a) => {
        s.loading = false;
        s.myProjects = a.payload.projects || a.payload.data || [];
      })
      .addCase(fetchMyProjects.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      // Create Project
      .addCase(createProject.fulfilled, (s, a) => {
        if (a.payload.project) {
          s.myProjects.unshift(a.payload.project);
          s.list.unshift(a.payload.project);
        }
      })
      // Update Project
      .addCase(updateProject.fulfilled, (s, a) => {
        const updated = a.payload.project;
        if (updated) {
          s.myProjects = s.myProjects.map(p => p._id === updated._id ? updated : p);
          s.list = s.list.map(p => p._id === updated._id ? updated : p);
          if (s.current?._id === updated._id) s.current = updated;
        }
      })
      // Delete Project
      .addCase(deleteProject.fulfilled, (s, a) => {
        s.myProjects = s.myProjects.filter(p => p._id !== a.payload.id);
        s.list = s.list.filter(p => p._id !== a.payload.id);
        if (s.current?._id === a.payload.id) s.current = null;
      });
  },
});

export const { setCurrentProject, clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
