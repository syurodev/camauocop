import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Session } from "next-auth"

type InitialState = {
  value: Session | null
}

const initialState: InitialState = {
  value: null
}

export const session = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session>) => {
      return {
        value: action.payload
      }
    },
  }
})

export const { setSession } = session.actions
export default session.reducer