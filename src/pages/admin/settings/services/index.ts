import { AxiosError } from "axios";
import { BankCommissionType, OrdCommissionType } from "../types";
import { axiosPost } from "../../../../axios/method";

export const createDefaultOrdComission = async (data: OrdCommissionType) => {
  try {
    const response = await axiosPost("/admin-settings/default-ord-commission", {
      ...data,
    });
    return response;
  } catch (error) {
    return (error as AxiosError).response;
  }
};
export const createDefaultBankCommission = async (data: BankCommissionType) => {
  try {
    const response = await axiosPost(
      "/admin-settings/default-bank-commission",
      {
        ...data,
      }
    );
    return response;
  } catch (error) {
    return (error as AxiosError).response;
  }
};
