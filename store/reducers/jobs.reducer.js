import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const jobsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAllJobs(_, action) {
      const { payload } = action;
      return payload;
    },
  },
});

export const { setAllJobs } = jobsSlice.actions;

export default jobsSlice.reducer;
