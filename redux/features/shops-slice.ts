import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  value: IShopsResponse[]
}

const initialState: InitialState = {
  value: []
}

export const shops = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setShops: (state, action: PayloadAction<IShopsResponse[]>) => {
      return {
        value: action.payload
      }
    },
  }
})

export const { setShops } = shops.actions
export default shops.reducer