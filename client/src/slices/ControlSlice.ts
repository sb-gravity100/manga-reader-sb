import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

type PageProps = {
   current: number;
   prev: number;
   next: number;
   first: number;
   last: number;
   total: number;
};

interface ControlState {
   zoom: number;
   brightness: number;
   search: string;
   blur: boolean;
   page: PageProps;
   limit: number;
   refresh: boolean;
   _updateCovers: boolean;
}

const initialState = {
   blur: true,
   zoom: 5,
   page: {
      current: 0,
   },
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
      toggleRefresh(state) {
         state.refresh = !state.refresh;
      },
      toggleCovers(state) {
         state._updateCovers = !state._updateCovers;
      },
      setPage(state, action: PayloadAction<Partial<PageProps>>) {
         Object.assign(state.page, action.payload);
      },
      gotoPage(
         state,
         action: PayloadAction<Exclude<keyof PageProps, 'total' | 'current'>>
      ) {
         state.page.current = state.page[action.payload];
      },
   },
});

export const {
   setZoom,
   setBrightness,
   setSearch,
   clearSearch,
   toggleBlur,
   toggleCovers,
   toggleRefresh,
   setPage,
   gotoPage,
} = ControlSlice.actions;

export default ControlSlice.reducer;
