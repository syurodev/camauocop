import { CommentData } from "@/actions/comment"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  value: CommentResponse[]
}

const initialState: InitialState = {
  value: []
}

export const comment = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<CommentResponse[]>) => {
      return {
        value: action.payload
      }
    },
    pushComment: (state, action: PayloadAction<CommentResponse>) => {
      if (state.value) {
        state.value && state.value.push(action.payload);
      }
    }
  }
})

export const { setComments, pushComment } = comment.actions
export default comment.reducer