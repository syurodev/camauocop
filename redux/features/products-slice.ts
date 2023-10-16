import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  value: IProductDetail[] | null
}

const initialState: InitialState = {
  value: null
}

export const productsDetail = createSlice({
  name: "productsDetail",
  initialState,
  reducers: {
    setProductsDetail: (state, action: PayloadAction<IProductDetail[]>) => {
      return {
        value: action.payload
      }
    },
    pushProductDetail: (state, action: PayloadAction<IProductDetail>) => {
      state.value && state.value.push(action.payload);
    }
  }
})

export const { setProductsDetail, pushProductDetail } = productsDetail.actions
export default productsDetail.reducer