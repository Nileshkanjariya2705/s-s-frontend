import { AxiosError } from "axios";
import { axiosDelete, axiosGet, axiosPost } from "../../../../axios/method";
import { ApiParamsType } from "components/table/types";

export const saveCard = async (data: object) => {
  try {
    const response = await axiosPost("/save-card", data);
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

export const editCardName = async (data: object) => {
  try {
    const response = await axiosPost("/edit-card", data);
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

export const getCardListing = async (
  store_info_uuid: string,
  apiParams: ApiParamsType
) => {
  try {
    const response = await axiosGet("/save-card/listing", {
      store_info_uuid,
      apiParams,
    });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

export const deleteCard = async (id: string, name: string) => {
  try {
    const response = await axiosDelete(`/save-card/delete/${id}/${name}`);
    return response;
  } catch (err: any) {
    return err;
  }
};
