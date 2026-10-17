import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserDetails } from "pages/store/dashboard/services/dashboard.service";
type Entity_type = "STORE" | "SUPPLIER" | null;
const initialState: {
  uuid: string;
  created_at: number;
  email: string;
  image: string;
  phone: string;
  username: string;
  is_active: boolean;
  role: string;
  role_ar: string;
  role_ur: string;
  user_entity_uuid: string;
  entity_type: Entity_type;
  given_permissions: {
    uuid: string;
    name: string;
    permission_type: string;
    granted: boolean;
  }[];
  all_permissions: {
    uuid: string;
    name: string;
    permission_type: string;
  }[];
} = {
  uuid: "",
  created_at: 0,
  email: "",
  image: "",
  phone: "",
  username: "",
  role: "",
  role_ar: "",
  role_ur: "",
  user_entity_uuid: "",
  is_active: false,
  entity_type: null,
  all_permissions: [],
  given_permissions: [],
};
export const handleGetAccountData = createAsyncThunk(
  "/fetch/account",
  async () => {
    try {
      const response = await getUserDetails();
      return response?.data;
    } catch (err) {
      return err;
    }
  }
);
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    handleSetUserDetails: (state, action) => {
      state.email = action.payload.email;
      state.uuid = action.payload.uuid;
      state.role = action.payload.role;
      state.role_ar = action.payload.role_ar;
      state.role_ur = action.payload.role_ur;
      state.created_at = action.payload.created_at;
      state.image = action.payload.image;
      state.phone = action.payload.phone;
      state.username = action.payload.username;
      state.is_active = action.payload.is_active;
      state.user_entity_uuid = action.payload.user_entity_uuid;
      state.entity_type = action.payload.entity_type;
      state.all_permissions = action.payload.all_permissions;
      state.given_permissions = action.payload.given_permissions;
    },
    setUsername: (state, action) => {
      state.email = action.payload.email;
      localStorage.setItem("userEmail", state.email);
    },
    resetAccount: () => {
      return { ...initialState };
    },
    setAccountImg: (state, action) => {
      state.image = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleGetAccountData.fulfilled, (state, action) => {
      if (action.payload) {
        state.created_at = action.payload.created_at;
        state.email = action.payload.email;
        state.uuid = action.payload.uuid;
        state.role = action.payload.role;
        state.role_ar = action.payload.role_ar;
        state.role_ur = action.payload.role_ur;
        state.is_active = action.payload.is_active;
        state.user_entity_uuid = action.payload.user_entity_uuid;
        state.all_permissions = action.payload.all_permissions;
        state.given_permissions = action.payload.given_permissions;
      } else {
        state.email = "";
        state.role = "";
        state.role_ar = "";
        state.role_ur = "";
        state.uuid = "";
        state.username = "";
        state.phone = "";
        state.image = "";
        state.user_entity_uuid = "";
        state.entity_type = null;
        state.all_permissions = [];
        state.given_permissions = [];
      }
    });
  },
});

export default accountSlice.reducer;
export const {
  handleSetUserDetails,
  resetAccount,
  setUsername,
  setAccountImg,
} = accountSlice.actions;
