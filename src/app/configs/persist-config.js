import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';

const basePersistConfig = {
  storage,
  stateReconciler: autoMergeLevel2
};

export const rootPersistConfig = {
  ...basePersistConfig,
  key: 'root',
  blacklist: ['auth']
};
