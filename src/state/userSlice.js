import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: {},
  authenticated: false,
  isDoneSessionLooking: false,
  userFriendRequestList: []
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
    }, 
    newSentRequest: (state, action) => {
      state.user = {...state.user, sentRequests: [...state.user.sentRequests, action.payload.requestRecepient]}
    }
  }, 
  extraReducers: (builder) => {
  }
})

export default userSlice.reducer;
export const { setUser, clearState, newSentRequest } = userSlice.actions;