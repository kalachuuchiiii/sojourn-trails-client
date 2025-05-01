import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: {},
  authenticated: false,
  isDoneSessionLooking: false
}


const userSlice = createSlice({
  name: 'user', 
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, authenticated } = action.payload;
      state.user = user; 
      state.authenticated = authenticated;
      state.isDoneSessionLooking = true;    
    },
    clearState: () => {
      return initialState;
    }
  }, 
  extraReducers: (builder) => {
  }
})

export default userSlice.reducer;
export const { setUser, clearState } = userSlice.actions;