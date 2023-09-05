import {createSlice} from '@reduxjs/toolkit';

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: [] as string[],
  reducers: {
    toggleFavorite: (state, action) => {
      const videoId = action.payload;
      if (state.includes(videoId)) {
        return state.filter((id) => id !== videoId);
      } else {
        return [...state, videoId];
      }
    },
    updateFavorites: (state, action) => {
      return action.payload;
    },
    clearFavorites: (state) => {
      return [];
    },
  },
});

export const { toggleFavorite, updateFavorites, clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
