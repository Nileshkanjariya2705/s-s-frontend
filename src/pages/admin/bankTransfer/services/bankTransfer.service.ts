import { AxiosError } from "axios";
import { axiosGet, axiosPost } from "../../../../axios/method";
import { ApiParamsType } from "components/table/types";

export const adminBankTransfer = async (apiParams: ApiParamsType) => {
  try {
    const response = await axiosGet("/admin/bank-transfer/list", {
      apiParams,
    });
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};

export const getOrderDetailInfo = async (orderId: string) => {
  try {
    const response = await axiosGet("/payment/single-admin-order-details", {
      orderId,
    });
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};

export const approvePaymentInvoice = async (data: Object) => {
  try {
    const response = await axiosPost("/admin/approve-bank-payment", data);
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};
export const approveDeclineInvoice = async (data: Object) => {
  try {
    const response = await axiosPost("/admin/decline-bank-payment", data);
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};
