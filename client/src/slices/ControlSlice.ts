import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

interface ControlState {
   zoom: number;
   brightness: number;
   search: string;
   blur: boolean;
   page: number;
   limit: number;
}

const initialState = {
   blur: true,
   zoom: 5,
   page: 0,
   limit: 10,
   brightness: 100,
   search: '',
} as ControlState;

const ControlSlice = createSlice({
   initialState,
   name: 'control',
   reducers: {
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
      toggleBlur(state) {
         state.blur = !state.blur;
      },
   },
});

export const { setZoom, setBrightness, setSearch, clearSearch, toggleBlur } =
   ControlSlice.actions;

export default ControlSlice.reducer;
