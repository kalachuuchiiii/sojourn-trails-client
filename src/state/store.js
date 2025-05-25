import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import likerReducer from './likersSlice.js';
import postReducer from './postsSlice.jsx';
const store = configureStore({
  reducer: {
    user: userReducer, 
    liker: likerReducer,
    posts: postReducer
  }
})

export default store;