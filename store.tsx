import {configureStore} from '@reduxjs/toolkit';
import loadingReducer from './redux/loadingSlice';

const store = configureStore({
  reducer: {
    loader: loadingReducer,
    // Add other reducers here if you have more slices
  },
});

export default store;
