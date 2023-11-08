import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  value: TransportationData[]
}

const initialState: InitialState = {
  value: []
}

export const transportation = createSlice({
  name: "transportation",
  initialState,
  reducers: {
    setTransportations: (state, action: PayloadAction<TransportationData[]>) => {
      return {
        value: action.payload
      }
    },
    pushTransportation: (state, action: PayloadAction<TransportationData>) => {
      if (state.value) {
        state.value && state.value.push(action.payload);
      }
    }
  }
})

export const { setTransportations, pushTransportation } = transportation.actions
export default transportation.reducer