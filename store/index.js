import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import userReducer from './reducers/user.reducer';
import languagesReducer from './reducers/languages.reducer';
import jobsReducer from './reducers/jobs.reducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    languages: languagesReducer,
    jobs: jobsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({});
    if (process.env.NODE_ENV === 'development') middleware.push(logger);
    return middleware;
  },
});

export default store;
