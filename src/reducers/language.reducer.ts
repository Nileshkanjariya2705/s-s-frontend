import { createSlice } from "@reduxjs/toolkit";
interface Ilanguage {
  language: "en" | "ar" | "ur";
  page: string;
}
const initialState: Ilanguage = {
  language: "en" ,
  page: "/",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      localStorage.setItem("S&S_Lang", action.payload.language);
      state.language = action.payload.language;
      state.page = action.payload.page;
    },
  },
});

export default languageSlice.reducer;
export const { setLanguage } = languageSlice.actions;
