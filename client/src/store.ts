import { configureStore } from '@reduxjs/toolkit';
import {
   useDispatch as useReduxDispatch,
   useSelector as useReduxSelector,
   TypedUseSelectorHook,
} from 'react-redux';
import ApiSlice from './slices/MangaApi';

const store = configureStore({
   reducer: {
      [ApiSlice.reducerPath]: ApiSlice.reducer,
   },
   middleware: (getDefMid) => getDefMid().concat(ApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<typeof store.dispatch>();
export default store;
