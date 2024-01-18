import {createSlice} from '@reduxjs/toolkit';

const cachedLessonVideosSlice = createSlice({
  name: 'cachedLessonVideos',
  initialState: [],
  reducers: {
    setCachedLessonVideos: (state, action) => {
      return action.payload;
    },
    clearCachedLessonVideos: () => {
      return [];
    },
  },
});

export const {setCachedLessonVideos, clearCachedLessonVideos} =
  cachedLessonVideosSlice.actions;
export default cachedLessonVideosSlice.reducer;
