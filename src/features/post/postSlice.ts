import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Post } from '../../types/Post';
import api from '../../utils/api';
import { v4 as uuidv4 } from 'uuid';
import {returnUserId} from "./../../utils/returnUserId";
import { toast } from 'react-toastify';

interface PostsState {
  allPosts: Post[];
  userPosts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  allPosts: [],
  userPosts: [],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async() => {
  const userId = returnUserId(); 
  const response = await api.get(`/posts`);
  const allPosts: Post[] = response.data;
  const userPosts = allPosts.filter(post => post.userId === userId);
  return { allPosts, userPosts };
});

export const createPost = createAsyncThunk('posts/createPost', async (post: Omit<Post, 'id' | 'userId'>) => {
  const userId = returnUserId();
  const newPost: Post = {
    ...post,
    id: uuidv4(),
    userId: userId || '', // fallback to empty string if userId is not found
  };
  const response = await api.post('/posts', newPost);
  return response.data;
});

export const updatePost = createAsyncThunk('posts/updatePost', async (post: Post) => {
  const response = await api.put(`/posts/${post.id}`, post);
  return response.data;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id: string) => {
  await api.delete(`/posts/${id}`);
  return id;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.allPosts = action.payload.allPosts;
        state.userPosts = action.payload.userPosts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.allPosts.push(action.payload);
        const userId = returnUserId();
        if (action.payload.userId === userId) {
          state.userPosts.push(action.payload);
          toast.success("Blog Posted successfully!");
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.allPosts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.allPosts[index] = action.payload;

        const userIndex = state.userPosts.findIndex(p => p.id === action.payload.id);
        if (userIndex !== -1) {
          state.userPosts[userIndex] = action.payload;
          toast.success("Blog Updated successfully!");
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.allPosts = state.allPosts.filter(p => p.id !== action.payload);
        state.userPosts = state.userPosts.filter(p => p.id !== action.payload);
        toast.success("Blog Deleted successfully!");
      });
  },
});

export default postsSlice.reducer;
