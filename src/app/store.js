import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH, PAUSE,
  PERSIST, persistReducer, persistStore, PURGE,
  REGISTER, REHYDRATE
} from 'redux-persist';
import counterReducer from '../features/Counter/counterSlice';
import { counterPersistConfig } from './configs';


//#region config store redux & redux-persist
const rootReducer = {
  counter: persistReducer(counterPersistConfig, counterReducer)
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store)
//#endregion

