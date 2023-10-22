import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type IProductInCart = {
  productId: string,
  addedDate: string
}

type InitialState = {
  value: IProductInCart[] | null
}

const initialState: InitialState = {
  value: []
}

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<IProductInCart[]>) => {
      return {
        value: action.payload
      }
    },
    pushCartItem: (state, action: PayloadAction<IProductInCart>) => {
      state.value && state.value.push(action.payload);
    }
  }
})

export const { setCartItems, pushCartItem } = cart.actions
export default cart.reducer