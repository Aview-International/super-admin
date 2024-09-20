import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import userReducer from './reducers/user.reducer';
import languagesReducer from './reducers/languages.reducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    languages: languagesReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({});
    if (process.env.NODE_ENV === 'development') middleware.push(logger);
    return middleware;
  },
});

export default store;
