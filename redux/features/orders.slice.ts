import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  value: IOrders[] | []
}

const initialState: InitialState = {
  value: []
}

export const orders = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<IOrders[]>) => {
      return {
        value: action.payload
      }
    },
  }
})

export const { setOrders } = orders.actions
export default orders.reducer