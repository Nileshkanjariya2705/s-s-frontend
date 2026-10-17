import { ApiParamsType } from "components/table/types";
import { axiosDelete, axiosGet } from "../../../../axios/method";

export const deleteProduct = async (user_contact_uuid: string) => {
  try {
    const response = await axiosDelete(
      `/cms/deleteContact/${user_contact_uuid}`
    );
    return response;
  } catch (err: any) {
    return err;
  }
};

export const fetchUserDetails = async (apiParams: ApiParamsType) => {
  try {
    const response = await axiosGet("/cms/getInTouchData", { apiParams });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const fetchSingleUserDetails = async (user_contact_uuid: string) => {
  try {
    const response = await axiosGet(`/cms/getInTouch/${user_contact_uuid}`);
    return response;
  } catch (err: any) {
    return err;
  }
};
