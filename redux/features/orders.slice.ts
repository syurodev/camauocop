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
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; newStatus: OrderStatus }>) => {
      const { orderId, newStatus } = action.payload;
      const orderToUpdate = state.value.find(order => order._id === orderId);

      if (orderToUpdate) {
        orderToUpdate.status = newStatus;
      }
    },
  }
})

export const { setOrders, updateOrderStatus } = orders.actions
export default orders.reducer