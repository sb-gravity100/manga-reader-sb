import { configureStore } from '@reduxjs/toolkit';
import {
   useDispatch as useReduxDispatch,
   useSelector as useReduxSelector,
   TypedUseSelectorHook,
} from 'react-redux';
import ApiSlice from './slices/MangaApi';
import DownloadSlice from './slices/DownloadSlice';
import HentaiSlice from './slices/HentaiApi';

const store = configureStore({
   reducer: {
      [ApiSlice.reducerPath]: ApiSlice.reducer,
      [HentaiSlice.reducerPath]: HentaiSlice.reducer,
      downloads: DownloadSlice.reducer,
   },
   middleware: (getDefMid) =>
      getDefMid().concat(ApiSlice.middleware, HentaiSlice.middleware) as any,
});

export type RootState = ReturnType<typeof store.getState>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<typeof store.dispatch>();
export default store;
