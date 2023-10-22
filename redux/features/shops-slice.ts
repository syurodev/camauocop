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
    updateShop: (state, action: PayloadAction<{ shopId: string; fee: number, status: ShopStatus, type: ShopType }>) => {
      const {
        shopId,
        fee,
        status,
        type
      } = action.payload;
      const shopToUpdate = state.value.find(shop => shop._id === shopId);

      if (shopToUpdate) {
        shopToUpdate.status = status;
        shopToUpdate.fee = fee;
        shopToUpdate.type = type;
      }
    },
  }
})

export const { setShops, updateShop } = shops.actions
export default shops.reducer