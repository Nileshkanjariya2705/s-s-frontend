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

export const getSuppDashDetail = async (supplier_uuid:string,supplier_info_uuid:string) => {
  try {
    const response = await axiosGet("/supplier/suppDetail", {supplier_uuid,supplier_info_uuid});
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

