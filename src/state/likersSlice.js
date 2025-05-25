import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  isLikerModalOpen: false,
  likerIds: []
}

const likerSlice = createSlice({
  name: "liker",
  initialState,
  reducers: {
    viewLikers: (state, action) => {
      state.likerIds = action.payload.likerIds;
      state.isLikerModalOpen = true;

    },
    closeLikers: (state) => {

      state.likerIds = [];
      state.isLikerModalOpen = false;
    },

  }
})

export default likerSlice.reducer;
export const { viewLikers, closeLikers } = likerSlice.actions;

