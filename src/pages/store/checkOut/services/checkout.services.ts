import { AxiosError } from "axios";
import { axiosDelete, axiosGet, axiosPost } from "../../../../axios/method";

export const getOrderData = async (
  purchase_request_id: string | number,
  user_entity_uuid: string,
  supplier_info_uuid: string,
  supplierProdId?: string
) => {
  try {
    const response = await axiosGet(`/order-products/get`, {
      purchase_request_id,
      user_entity_uuid,
      supplier_info_uuid,
      supplierProdId,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};
export const orderAddress = async (orderId: string) => {
  try {
    const response = await axiosGet("/orders/getAddress", { orderId });
    return response;
  } catch (error) {
    return error;
  }
};
export const deleteOrderProduct = async (order_product_id: string) => {
  try {
    const response = await axiosDelete(
      `/order-products/delete/${order_product_id}`
    );
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateOrderQuantity = async (data: any) => {
  try {
    const response = await axiosPost(`/order-products/update`, data);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getUserAddress = async (uuid: string) => {
  try {
    const response = await axiosGet(
      `/manage-profile/get-single-user-address/${uuid}`
    );
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};

export const updateAddressQuantity = async (
  purchaseReqId: string,
  address_id: string,
  supplier_info_uuid: string
) => {
  try {
    const response = await axiosPost(`/orders/update`, {
      purchaseReqId,
      address_id,
      supplier_info_uuid,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const createCharge = async (paymentData: {}) => {
  try {
    const response = await axiosPost(`/payment/charge`, { ...paymentData });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getChargeDetails = async ({
  tapId,
  purchaseReqId,
  supplier_info_uuid,
}: {
  tapId: string;
  purchaseReqId: string;
  supplier_info_uuid: string;
}) => {
  try {
    const response = await axiosGet(`/get/payment/charges`, {
      tapId,
      purchaseReqId,
      supplier_info_uuid,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const sendConfirmationMail = async (order_uuid: string | undefined) => {
  try {
    const response = await axiosGet(`/sendConfirmationMail`, {
      order_uuid,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const sendReplacementStatusMail = async (
  order_uuid: string | undefined
) => {
  try {
    const response = await axiosGet(`/sendReplacementStatusMail`, {
      order_uuid,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const checkPaymentStatus = async ({
  purchaseReqId,
  orderId,
  tapId,
}: {
  purchaseReqId: string | undefined;
  orderId: string;
  tapId: string | null;
}) => {
  try {
    const response = await axiosGet(`/check/payment-status`, {
      purchaseReqId,
      orderId,
      tapId,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const addReviewsAndRatings = async ({
  purchaseReqId,
  supplier_info_uuid,
  reviews,
  orderId,
  rating,
}: {
  purchaseReqId: string | undefined;
  supplier_info_uuid: string | undefined;
  reviews: string;
  orderId: string | null;
  rating: number;
}) => {
  try {
    const response = await axiosPost(`/add-reviews`, {
      purchaseReqId,
      supplier_info_uuid,
      reviews,
      orderId,
      rating,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const directBankTransfer = async (formData: FormData) => {
  try {
    const response = await axiosPost("/bank-transfer", formData);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateReceipt = async (formData: FormData) => {
  try {
    const response = await axiosPost("/update-receipt", formData);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getLatestCharge = async (orderId: string) => {
  try {
    const response = await axiosGet("/orders/vat-charges", { orderId });
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};

export const getCardDropDownValues = async (store_info_uuid: string) => {
  try {
    const response = await axiosGet("/payment/card-list", {
      store_info_uuid,
    });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

export const paymentUsingSavedCard = async (paymentData: {}) => {
  try {
    const response = await axiosPost(`/savecard-payment`, {
      ...paymentData,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};


export const getallBranches = async ({
    user_entity_uuid,
  }: {
    user_entity_uuid: string;
  }) => {
    try {
      let response = await axiosGet("/branch/get-all-branches", {
        entity_uuid: user_entity_uuid,
      });
      return response;
    } catch (error: unknown) {
      return (error as AxiosError).response;
    }
  };
