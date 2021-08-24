import { configureStore } from '@reduxjs/toolkit'
import ReactRedux from 'react-redux'
import ControlReducer from './slices/ControlSlice'
import ApiSlice from './slices/MangaApi'

const store = configureStore({
   reducer: {
      controls: ControlReducer,
      [ApiSlice.reducerPath]: ApiSlice.reducer
   },
   middleware: getDefMid => getDefMid().concat(ApiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>

export const useSelector: ReactRedux.TypedUseSelectorHook<RootState> = ReactRedux.useSelector
export const useDispatch = () => ReactRedux.useDispatch<RootState>()
