import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Download = {
   id: any;
   doujinID: any;
   isSuccess: boolean;
   isError: boolean;
   timeAdded: number;
   timeCompleted: number;
};
type Toast = {
   id: any;
   header: string;
   message: string;
   delay?: number;
   createdAt: number;
};

type DownloadState = {
   results: Download[];
   toasts: Toast[];
};

const initialState = {
   results: [],
   toasts: [],
} as DownloadState;

const Slice = createSlice({
   initialState,
   name: 'Downloads',
   reducers: {
      add(state, action: PayloadAction<number>) {
         var res = {
            id: `${state.results.length}_${Date.now()}`,
            doujinID: action.payload,
            timeAdded: Date.now(),
         } as Download;
         state.results.push(res);
      },
      error(state, action: PayloadAction<number>) {
         var res = state.results.findIndex((e) => e.id === action.payload);
         if (res > -1) {
            state.results[res].isError = true;
            state.results[res].isSuccess = false;
         }
      },
      remove(state, action: PayloadAction<number>) {
         var res = state.results.findIndex((e) => e.id === action.payload);
         if (res > -1) {
            state.results.splice(res, 1);
         }
      },
      completed(state, action: PayloadAction<number>) {
         var res = state.results.findIndex((e) => e.id === action.payload);
         if (res > -1) {
            state.results[res].isError = false;
            state.results[res].isSuccess = true;
         }
      },
      pushToast(state, action: PayloadAction<Omit<Toast, 'id' | 'createdAt'>>) {
         var t = {
            id: `${state.toasts.length}_${Date.now()}`,
            createdAt: Date.now(),
            ...action.payload,
         } as Toast;
         state.toasts.push(t);
      },
   },
});

export default Slice;
export const { add, completed, error, pushToast, remove } = Slice.actions;
