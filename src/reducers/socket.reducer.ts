import { createSlice } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { REACT_APP_BACKEND_URL } from "config";
const socket = io(`${REACT_APP_BACKEND_URL}`,{
  transports: ['websocket'],
});
const initialState: { socket: Socket | null } = { socket: socket };

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload.socket;
    },
    resetSocketDetails: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      state.socket = null;
    },
  },
});

export default socketSlice.reducer;
export const { setSocket, resetSocketDetails } = socketSlice.actions;
