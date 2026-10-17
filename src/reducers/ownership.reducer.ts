import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOwnerDetails } from "pages/store/dashboard/services/dashboard.service";
import { AddressType } from "types/generalTypes";

export interface OwnershipDetails {
  address: AddressType[];
  store_uuid: string;
  company_name: string;
  cr_number: string;
  tax_number: string;
  iban_number: string;
  is_verified: boolean;
}

const initialState: OwnershipDetails = {
  address: [
    {
      address_uuid: "",
      address: "Ugly Duckling Photography The Walk",
      postal_code: 4871540,
      city: "Dubai",
      state: "Dubai",
      Country: "United Arab Emirates",
      Phone: "9546201540",
      is_default: true,
      isEditable: true,
    },
    {
      address_uuid: "",
      address: "away away away",
      postal_code: 4871970,
      city: "al-mali",
      state: "Sharjah",
      Country: "United Arab Emirates",
      Phone: "9554015540",
      is_default: false,
      isEditable: true,
    },
  ],
  store_uuid: "",
  company_name: "",
  cr_number: "",
  tax_number: "",
  iban_number: "",
  is_verified: false,
};

export const getOwnerShipDetils = createAsyncThunk<OwnershipDetails, void>(
  "/fetch/ownership",
  async () => {
    try {
      const response = await getOwnerDetails();
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

const ownershipSlice = createSlice({
  initialState: initialState,
  name: "ownership",
  reducers: {
    setOwnershipDetails: (state, action: PayloadAction<OwnershipDetails>) => {
      state.address = action.payload.address;
      state.store_uuid = action.payload.store_uuid;
      state.company_name = action.payload.company_name;
      state.cr_number = action.payload.cr_number;
      state.tax_number = action.payload.tax_number;
      state.iban_number = action.payload.iban_number;
      state.is_verified = action.payload.is_verified;
    },
    resetAccount: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOwnerShipDetils.fulfilled, (state, action) => {
      if (action.payload) {
        state.address = action.payload.address;
        state.store_uuid = action.payload.store_uuid;
        state.company_name = action.payload.company_name;
        state.cr_number = action.payload.cr_number;
        state.tax_number = action.payload.tax_number;
        state.iban_number = action.payload.iban_number;
        state.is_verified = action.payload.is_verified;
      } else {
        return { ...initialState };
      }
    });
  },
});

export default ownershipSlice.reducer;
export const { setOwnershipDetails, resetAccount } = ownershipSlice.actions;
