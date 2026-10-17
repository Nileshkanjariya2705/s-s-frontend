import { axiosGet, axiosPost } from "../../../axios/method";

export const getChatOrderList = async (
  user_uuid: string,
  searchText: string
) => {
  try {
    const response = await axiosGet("/orders/getAll", {
      user_uuid,
      searchText,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const sendChatMessage = async (formData: FormData) => {
  try {
    const response = await axiosPost("/message/create", formData);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getSpecificChatData = async (
  order_uuid: string,
  user_uuid: string
) => {
  try {
    const response = await axiosGet("/message/getMessage", {
      order_uuid,
      user_uuid,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateLastSeen = async (order_uuid: string, user_uuid: string) => {
  try {
    const response = await axiosPost("/message/updateLastSeen", {
      order_uuid,
      user_uuid,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};
