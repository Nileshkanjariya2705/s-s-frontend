import { createSlice } from "@reduxjs/toolkit";
const initialState: { open: boolean } = { open: false };

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarOpen: (state, action) => {
      state.open = action.payload;
    },
  },
});

export default sidebarSlice.reducer;
export const { setSidebarOpen } = sidebarSlice.actions;
