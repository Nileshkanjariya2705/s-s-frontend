import { ApiParamsType } from "components/table/types";
import { axiosGet, axiosDelete, axiosPost } from "../../../../axios/method";
import { AxiosError } from "axios";
import { PurchaseReqType } from "../types/purchaseRequest.types";

export const getAllPurchaseRequest = async (
  apiParams: ApiParamsType,
  requester_uuid: string
) => {
  try {
    const response = await axiosGet("/purchase-request/getAll", {
      apiParams,
      requester_uuid,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const supplierDeleteProduct = async (uuid: string) => {
  try {
    const response = await axiosDelete(`/purchase-request/delete/${uuid}`);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getAllUnits = async () => {
  try {
    let response = await axiosGet("/purchaseRequest/getUnit");
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

export const createDirectPurchaseRequest = async (data: PurchaseReqType) => {
  try {
    let response = await axiosPost("/direct-purchase-request", { ...data });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

export const purchaseRequestView = async (
  apiParams: ApiParamsType,
  purchaseReqId: string,
  tab: string
) => {
  try {
    const response = await axiosGet(`/purchase-request-products/get`, {
      apiParams,
      purchaseReqId,
      tab,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const purchaseRequestData = async (purchaseReqId: string) => {
  try {
    const response = await axiosGet(`/purchase-request/get`, {
      purchaseReqId,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const storePurchaseRequestData = async (
  purchaseReqId: string,
  store_info_uuid: string
) => {
  try {
    const response = await axiosGet(`/store/purchase-request`, {
      purchaseReqId,
      store_info_uuid,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const deletePurchaseReqQuote = async (
  purchaseReqId: string,
  supplier_info_uuid: string,
  tab: string,
  uuid: string
) => {
  try {
    const resposne = await axiosGet(
      `/purchase-request-products/rejectSuppQuote`,
      {
        purchaseReqId,
        supplier_info_uuid,
        tab,
        uuid,
      }
    );
    return resposne;
  } catch (error: any) {
    return error;
  }
};

export const updateExpiredStatus = async (purchaseReqId: string[]) => {
  try {
    const resposne = await axiosPost(`/purchase-request/expired`, {
      purchaseReqId,
    });
    return resposne;
  } catch (error: any) {
    return error;
  }
};

export const checkoutOrderCreate = async (
  created_by: string,
  purchase_request_uuid: string,
  supplier_id: string
) => {
  try {
    const response = await axiosPost(`/orders/create`, {
      created_by,
      purchase_request_uuid,
      supplier_id,
    });
    return response;
  } catch (error: any) {
    return error;
  }
};

export const updatePurchaseRequest = async (data: PurchaseReqType) => {
  try {
    let response = await axiosPost("/update-purchase-request", { ...data });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

export const closePurchaseRequest = async (purchaseReqId: string) => {
  try {
    const resposne = await axiosGet(`/purchase-request/completed`, {
      purchaseReqId,
    });
    return resposne;
  } catch (error: any) {
    return error;
  }
};
