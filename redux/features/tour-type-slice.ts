import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  value: TourTypeData[]
}

const initialState: InitialState = {
  value: []
}

export const tourType = createSlice({
  name: "tourType",
  initialState,
  reducers: {
    setTourTypes: (state, action: PayloadAction<TourTypeData[]>) => {
      return {
        value: action.payload
      }
    },
    pushTourType: (state, action: PayloadAction<TourTypeData>) => {
      if (state.value) {
        state.value && state.value.push(action.payload);
      }
    }
  }
})

export const { setTourTypes, pushTourType } = tourType.actions
export default tourType.reducer