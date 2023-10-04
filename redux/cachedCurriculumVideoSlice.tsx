import {createSlice} from '@reduxjs/toolkit';

const cachedCurriculumVideosSlice = createSlice({
  name: 'cachedCurriculumVideos',
  initialState: [],
  reducers: {
    setCachedCurriculumVideos: (state, action) => {
      return action.payload;
    },
    clearCachedCurriculumVideos: (state) => {
      return [];
    },
  },
});

export const {setCachedCurriculumVideos, clearCachedCurriculumVideos} =
  cachedCurriculumVideosSlice.actions;
export default cachedCurriculumVideosSlice.reducer;
