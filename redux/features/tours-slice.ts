import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  value: TourData[]
}

const initialState: InitialState = {
  value: []
}

export const tours = createSlice({
  name: "tours",
  initialState,
  reducers: {
    setTours: (state, action: PayloadAction<TourData[]>) => {
      return {
        value: action.payload
      }
    },
    pushTour: (state, action: PayloadAction<TourData>) => {
      if (state.value) {
        state.value && state.value.push(action.payload);
      }
    },
    updateTourStatus: (state, action: PayloadAction<{ tourId: string; newStatus: TourismsStatus }>) => {
      const { tourId, newStatus } = action.payload;
      const tourToUpdate = state.value.find(tour => tour._id === tourId);

      if (tourToUpdate) {
        tourToUpdate.status = newStatus;
      }
    },
  }
})

export const { setTours, pushTour, updateTourStatus } = tours.actions
export default tours.reducer