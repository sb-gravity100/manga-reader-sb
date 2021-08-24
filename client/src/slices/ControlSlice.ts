import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ControlState {
   zoom: number;
   brightness: number;
}

const initialState = {} as ControlState

const ControlSlice = createSlice({
   initialState,
   name: 'control',
   reducers: {
      incZoom(state) {
         state.zoom += 1
      },
      decZoom(state) {
         state.zoom -= 1
      },
      setZoom(state, action: PayloadAction<number>) {
         state.zoom = action.payload
      },
      setBrightness(state, action: PayloadAction<number>) {
         state.brightness = action.payload
      },
   }
})

export const { incZoom, decZoom, setZoom, setBrightness } = ControlSlice.actions

export default ControlSlice.reducer
