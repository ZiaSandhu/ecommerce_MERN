import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'localforage';

import productReducer from './productSlice';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import orderReducer from './orderSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  product: productReducer,
  cart: cartReducer,
  user: userReducer,
  order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
