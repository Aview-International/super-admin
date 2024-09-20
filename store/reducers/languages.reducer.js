import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  countriesAndCodes: [],
  supportedLanguages: [],
};

const languagesSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {
    setCountriesAndCodes(state, action) {
      const { payload } = action;
      return { ...state, countriesAndCodes: payload };
    },
    setSupportedLanguages(state, action) {
      const { payload } = action;
      return { ...state, supportedLanguages: payload };
    },
  },
});

export const { setCountriesAndCodes, setSupportedLanguages } =
  languagesSlice.actions;

export default languagesSlice.reducer;
