import {configureStore} from '@reduxjs/toolkit';
import loadingReducer from './redux/loadingSlice';
import cachedVideosReducer from './redux/cachedVideoSlice';
import favoriteReducer from './redux/favoriteSlice';

const store = configureStore({
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
  reducer: {
    loader: loadingReducer,
    cachedVideos: cachedVideosReducer,
    favorites: favoriteReducer,
    // Add other reducers here if you have more slices
  },
});

export default store;
