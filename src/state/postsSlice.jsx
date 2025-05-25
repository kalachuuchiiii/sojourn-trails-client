import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  savedPosts: [], 
  currentPage: 0
}

const postsSlice = createSlice({
  name: "posts", 
  initialState, 
  reducers: {
    savePosts: (state, action) => {
      state.savedPosts = action.payload.posts;
      state.currentPage = action.payload.currentPage
      console.log("saved")
    }
    
  }
})


export const { savePosts } = postsSlice.actions; 
export default postsSlice.reducer;
