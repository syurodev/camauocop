import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  value: IShopInfo | null
}

type IShopImage = {
  image: string
}

type IShopPhone = {
  phone: string
}

type IShopName = {
  name: string
}

const initialState: InitialState = {
  value: null
}

export const shopInfo = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setShopInfo: (state, action: PayloadAction<IShopInfo>) => {
      return {
        value: action.payload
      }
    },
    changeShopAvatar: (state, action: PayloadAction<IShopImage>) => {
      if (state.value) {
        state.value.image = action.payload.image;
      }
    },
    changeShopPhone: (state, action: PayloadAction<IShopPhone>) => {
      if (state.value) {
        state.value.phone = action.payload.phone;
      }
    },
    changeShopName: (state, action: PayloadAction<IShopName>) => {
      if (state.value) {
        state.value.name = action.payload.name;
      }
    }
  }
})

export const { setShopInfo, changeShopAvatar, changeShopPhone, changeShopName } = shopInfo.actions
export default shopInfo.reducer