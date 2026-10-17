import { ApiParamsType } from "components/table/types";
import { axiosGet, axiosPost } from "../../../axios/method";

export const getAllNotification = async (
  uuid: string,
  params: ApiParamsType
) => {
  try {
    const response = await axiosGet("/notification-receiver/get-all", {
      uuid,
      params,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getNotificationCount = async (uuid: string) => {
  try {
    const response = await axiosGet(
      "/notification-receiver/get-notification-count",
      {
        uuid,
      }
    );
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateNotification = async (uuid: string) => {
  try {
    const response = await axiosGet(
      "/notification-receiver/update-notification",
      {
        uuid,
      }
    );
    return response;
  } catch (err: any) {
    return err;
  }
};

export const deleteNotification = async (deleteIds: string[]) => {
  try {
    const response = await axiosPost(
      "/notification-receiver/delete-notification",
      {deleteIds}
    );
    return response;
  } catch (err: any) {
    return err;
  }
};
