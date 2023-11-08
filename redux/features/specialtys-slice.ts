import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  value: SpecialtysData[]
}

const initialState: InitialState = {
  value: []
}

export const specialtys = createSlice({
  name: "specialtys",
  initialState,
  reducers: {
    setSpecialtys: (state, action: PayloadAction<SpecialtysData[]>) => {
      return {
        value: action.payload
      }
    },
    pushSpecialty: (state, action: PayloadAction<SpecialtysData>) => {
      if (state.value) {
        state.value && state.value.push(action.payload);
      }
    },
  }
})

export const { setSpecialtys, pushSpecialty } = specialtys.actions
export default specialtys.reducer