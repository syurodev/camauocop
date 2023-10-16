import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./features/cart-slice"
import productsDetailReducer from "./features/products-slice"
import sessionReducer from "./features/session-slice"
import { TypedUseSelectorHook, useSelector } from "react-redux"

export const store = configureStore({
  reducer: {
    cartReducer,
    productsDetailReducer,
    sessionReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector