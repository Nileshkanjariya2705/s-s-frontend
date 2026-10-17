import { AxiosError } from "axios";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "../../../axios/method";
import {
  AddressInfo,
  makeAddressDefaultData,
  updateProfileData,
} from "../types/manageProfile.types";

export const getUpdateProfile = async (data: updateProfileData) => {
  try {
    const response = await axiosPatch(
      `${process.env.REACT_APP_API_URL}/manage-profile/personal-details/update`,
      {
        ...data,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};
export const makeAddressDefault = async (data: makeAddressDefaultData) => {
  try {
    const response = await axiosPatch("/manage-profile/set-default", {
      ...data,
    });
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};
export const getSingleAddress = async (address_uuid: string) => {
  try {
    const response = await axiosGet(
      `/manage-profile/get-address/${address_uuid}`
    );
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};
export const deleteAddress = async (uuid: string) => {
  try {
    const response = await axiosDelete(
      `/manage-profile/remove-address/${uuid}`
    );
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};
export const handleUpdateAddress = async (
  data: AddressInfo,
  {
    user_entity_uuid,
    entity_type,
  }: { user_entity_uuid: string; entity_type: string }
) => {
  try {
    const response = await axiosPatch(`/manage-profile/update-address`, {
      ...data,
      user_entity_uuid: user_entity_uuid,
      entity_type: entity_type,
    });
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};
export const handleCreateAddress = async (
  data: AddressInfo,
  {
    user_entity_uuid,
    entity_type,
  }: { user_entity_uuid: string; entity_type: string }
) => {
  try {
    const response = await axiosPost(`/manage-profile/create-address`, {
      ...data,
      user_entity_uuid: user_entity_uuid,
      entity_type: entity_type,
    });
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};
