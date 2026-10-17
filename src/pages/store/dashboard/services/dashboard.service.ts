import { AxiosError } from "axios";
import { axiosGet } from "../../../../axios/method";

export const getUserDetails = async () => {
  try {
    let { data } = await axiosGet("/account/details");
    if (data && data !== null) {
      return data;
    }
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

export const getOwnerDetails = async () => {
  try {
    let { data } = await axiosGet("/account/ownership");
    if (data && data !== null) {
      return data;
    }
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

export const getStoreDashboardDetail = async (store_uuid:string) => {
  try {
    const response = await axiosGet("/store/purchasedProduct", {store_uuid});
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};