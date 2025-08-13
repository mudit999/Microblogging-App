import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../../types/User';
import api from '../../utils/api';
import { toast } from 'react-toastify';

interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
}

const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  error: null,
  loading: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const res = await api.get(`/users?username=${credentials.username}&password=${credentials.password}`);
      if (res.data.length === 0) throw new Error('Invalid credentials');
      return res.data[0];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload)); // persist user
        toast.success("User Login successfully!");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
