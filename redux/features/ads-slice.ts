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
    },
    updateAdsStatus: (state, action: PayloadAction<{ adsId: string; newStatus: AdvertisementStatus, note: string }>) => {
      const { adsId, newStatus, note } = action.payload;
      const adsToUpdate = state.value.find(ads => ads._id === adsId);

      if (adsToUpdate) {
        adsToUpdate.status = newStatus;
        adsToUpdate.note = note;
      }
    },
  }
})

export const { setAds, pushAd, updateAdsStatus } = ads.actions
export default ads.reducer