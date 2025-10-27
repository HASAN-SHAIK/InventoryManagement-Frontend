import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { combineReducers } from 'redux';
import userReducer from './userSlice'; 
import orderReducer from './orderSlice'; 
import expireReducer from "redux-persist-transform-expire";
import { getToken, isTokenValid } from '../utils/auth';

const expireTransform = expireReducer("user", {
  expireSeconds: process.env.TOKEN_EXPIRY,
  expiredState: {
    userDetails: null
  },
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'order'], 
  transforms: [expireTransform], 
};

const rootReducer = combineReducers({
  user: userReducer,
  order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store, null, () => {
  const token = getToken();
  if (!isTokenValid(token)) {
    // purge persisted state so app doesn't auto-login with expired/invalid data
    persistor.purge();
  }
});

export default store;

