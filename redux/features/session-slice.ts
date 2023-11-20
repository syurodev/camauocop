import { IUserInfoSchema } from "@/components/card/ChangeUserInfo"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Session } from "next-auth"

type InitialState = {
  value: Session | null
}

type IUserAvatar = {
  image: string
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
    updateAvatar: (state, action: PayloadAction<IUserAvatar>) => {
      if (state.value) {
        state.value.user.image = action.payload.image;
      }
    },
    updateInfo: (state, action: PayloadAction<IUserInfoSchema>) => {
      if (state.value) {
        state.value.user.username = action.payload.username || "";
        state.value.user.phone = action.payload.phone || "";
        state.value.user.email = action.payload.email || "";
      }
    }
  }
})

export const { setSession, updateAvatar, updateInfo } = session.actions
export default session.reducer