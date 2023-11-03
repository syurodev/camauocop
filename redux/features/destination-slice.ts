import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  value: DestinationData[]
}

const initialState: InitialState = {
  value: []
}

export const destination = createSlice({
  name: "destination",
  initialState,
  reducers: {
    setDestinations: (state, action: PayloadAction<DestinationData[]>) => {
      return {
        value: action.payload
      }
    },
    pushDestination: (state, action: PayloadAction<DestinationData>) => {
      if (state.value) {
        state.value && state.value.push(action.payload);
      }
    }
  }
})

export const { setDestinations, pushDestination } = destination.actions
export default destination.reducer