import { ApiResponse } from "types/generalTypes";
import { axiosGet, axiosPost } from "../../../../axios/method";
import { ApiParamsType } from "components/table/types";

export const getAllPurchaseHistory = async ({
  user_entity_uuid,
  apiParams,
  tab,
}: {
  user_entity_uuid: string;
  apiParams: ApiParamsType;
  tab: string;
}) => {
  try {
    const response = await axiosGet("/purchase-history/fetch-all", {
      user_entity_uuid,
      apiParams,
      tab,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getOrderDetails = async ({
  payment_uuid,
  user_entity_uuid,
  apiParams,
}: {
  payment_uuid: string;
  user_entity_uuid: string;
  apiParams: ApiParamsType;
}) => {
  try {
    const response = await axiosGet("/purchase-history", {
      payment_uuid,
      user_entity_uuid,
      apiParams,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};
export const getStoreOrders = async (user_entity_uuid: string) => {
  try {
    const response = await axiosGet("/purchase-history/orderCount", {
      user_entity_uuid,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const CreateReplacementRequest = async ({
  values,
  payment_uuid,
  supplier_info_uuid,
  requested_by,
}: {
  values: any;
  payment_uuid: string;
  supplier_info_uuid: string;
  requested_by: string;
}) => {
  try {
    const response = await axiosPost("/replacement/create", {
      values,
      payment_uuid,
      supplier_info_uuid,
      requested_by,
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const CreateRefundRequest = async ({
  values,
  order_uuid,
  supplier_info_uuid,
  requested_by,
}: {
  values: any;
  order_uuid: string;
  supplier_info_uuid: string;
  requested_by: string;
}) => {
  try {
    const response = await axiosPost("/refund/create", {
      values,
      order_uuid,
      supplier_info_uuid,
      requested_by,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getReplacementOrderDetails = async ({
  payment_uuid,
  user_entity_uuid,
  apiParams,
}: {
  payment_uuid: string;
  user_entity_uuid: string;
  apiParams: ApiParamsType;
}) => {
  try {
    const response = await axiosGet("/replacement/get-replacement", {
      payment_uuid,
      user_entity_uuid,
      apiParams,
    });
    return response;
  } catch (error) {
    return error as ApiResponse;
  }
};
export const getRefundOrderDetails = async ({
  payment_uuid,
  user_entity_uuid,
  apiParams,
}: {
  payment_uuid: string;
  user_entity_uuid: string;
  apiParams: ApiParamsType;
}) => {
  try {
    const response = await axiosGet("/refund/get-refund", {
      payment_uuid,
      user_entity_uuid,
      apiParams,
    });
    return response;
  } catch (error) {
    return error as ApiResponse;
  }
};
