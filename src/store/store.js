import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { combineReducers } from 'redux';
import userReducer from './userSlice'; // Assuming you have a userSlice.js file

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // only persist 'user' slice
};

const rootReducer = combineReducers({
  user: userReducer,
  // add other reducers here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
