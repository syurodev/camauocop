import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./features/cart-slice"
import productsDetailReducer from "./features/products-slice"
import sessionReducer from "./features/session-slice"
import shopsReducer from "./features/shops-slice"
import ordersReducer from "./features/orders-slice"
import commentReducer from "./features/comment-slice"
import shopInfoReducer from "./features/shop-info-slice"
import adsReducer from "./features/ads-slice"
import { TypedUseSelectorHook, useSelector } from "react-redux"

export const store = configureStore({
  reducer: {
    cartReducer,
    productsDetailReducer,
    sessionReducer,
    shopsReducer,
    ordersReducer,
    shopInfoReducer,
    commentReducer,
    adsReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector