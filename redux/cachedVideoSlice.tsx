import {createSlice} from '@reduxjs/toolkit';

const cachedVideosSlice = createSlice({
  name: 'cachedVideos',
  initialState: [],
  reducers: {
    setCachedVideos: (state, action) => {
      return action.payload;
    },
    clearCachedVideos: (state) => {
      return [];
    },
  },
});

export const { setCachedVideos, clearCachedVideos } = cachedVideosSlice.actions;
export default cachedVideosSlice.reducer;
