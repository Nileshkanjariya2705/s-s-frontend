import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { TokenType } from "../types/generalTypes"

const defaultValue = localStorage.getItem("S&S_authtoken")
const initialState: TokenType = { token: defaultValue }

const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
            localStorage.setItem("S&S_authtoken", state.token)
        },
    },
})

export default tokenSlice.reducer
export const { setToken } = tokenSlice.actions
