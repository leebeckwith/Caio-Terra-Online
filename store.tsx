import {configureStore} from '@reduxjs/toolkit';
import loadingReducer from './loader/loadingSlice'; // Path to your loading slice

const store = configureStore({
  reducer: {
    loader: loadingReducer,
    // Add other reducers here if you have more slices
  },
});

export default store;
