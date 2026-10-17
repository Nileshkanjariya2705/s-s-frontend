import { AxiosError } from "axios";
import { axiosGet, axiosPost } from "../../../../axios/method";
import { getStoreInfoType } from "../types/store.type";

export const getStoreInfo = async ({ type, apiParams }: getStoreInfoType) => {
  try {
    const response = await axiosGet("/admin/store-info", { type, apiParams });
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};

export const getSingleStoreInfo = async (data: { uuid: string }) => {
  try {
    const response = await axiosPost("/store", data);
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};

export const updateStoreInfo = async (data: FormData) => {
  try {
    const response = await axiosPost("/store/updateStoreInfo", data);
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};

export const deleteStoreInfo = async (data: { uuid: string }) => {
  try {
    const response = await axiosPost("/store/deleteStoreInfo", data);
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};
