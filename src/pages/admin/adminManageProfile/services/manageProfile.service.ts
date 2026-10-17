import { AxiosError } from "axios";
import { axiosGet, axiosPost } from "../../../../axios/method";

export const CreateManageProfile = async (data: FormData) => {
  try {
    const response = await axiosPost("/admin/personal-details", data);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getAdminProfileDetails = async () => {
  try {
    const response = await axiosGet("/admin/personal-details/get");
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};
