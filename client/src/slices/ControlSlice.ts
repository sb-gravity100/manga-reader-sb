import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

interface ControlState {
   zoom: number;
   brightness: number;
   search: string;
}

const initialState = {} as ControlState;

const ControlSlice = createSlice({
   initialState,
   name: 'control',
   reducers: {
      incZoom(state) {
         state.zoom += 1;
      },
      decZoom(state) {
         state.zoom -= 1;
      },
      setZoom(state, action: PayloadAction<number>) {
         state.zoom = action.payload;
      },
      setBrightness(state, action: PayloadAction<number>) {
         state.brightness = action.payload;
      },
      setSearch(state, action: PayloadAction<string>) {
         state.search = action.payload;
      },
      clearSearch(state) {
         state.search = '';
      },
   },
});

export const {
   incZoom,
   decZoom,
   setZoom,
   setBrightness,
   setSearch,
   clearSearch,
} = ControlSlice.actions;

export default ControlSlice.reducer;
