import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Download = {
   id: any;
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
            id: action.payload,
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
      completed(state, action: PayloadAction<number>) {
         var res = state.results.findIndex((e) => e.id === action.payload);
         if (res > -1) {
            state.results[res].isError = true;
            state.results[res].isSuccess = false;
         }
      },
      saveHistory(state) {
         var hist = localStorage.getItem('doujin-download-history');
         if (hist) {
            state.results = state.results.concat(JSON.parse(hist));
         }
         localStorage.setItem(
            'doujin-download-history',
            JSON.stringify(state.results)
         );
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
export const { saveHistory, add, completed, error, pushToast } = Slice.actions;
