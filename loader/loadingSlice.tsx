import {createSlice} from '@reduxjs/toolkit';

interface LoadingState {
  value: boolean;
}

const initialState: LoadingState = {
  value: false, // Default value for loading state
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      //console.log('dispatched: ' + action.payload);
      state.value = action.payload; // Set loading state to the provided payload
    },
  },
});

export const {setLoading} = loadingSlice.actions;

export default loadingSlice.reducer;
