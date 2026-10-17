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
