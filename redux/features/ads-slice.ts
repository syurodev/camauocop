import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  value: Ads[]
}

const initialState: InitialState = {
  value: []
}

export const ads = createSlice({
  name: "ads",
  initialState,
  reducers: {
    setAds: (state, action: PayloadAction<Ads[]>) => {
      return {
        value: action.payload
      }
    },
    pushAd: (state, action: PayloadAction<Ads>) => {
      state.value && state.value.push(action.payload);
    }
  }
})

export const { setAds, pushAd } = ads.actions
export default ads.reducer