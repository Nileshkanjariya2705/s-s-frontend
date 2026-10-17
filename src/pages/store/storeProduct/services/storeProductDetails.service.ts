import { AxiosError } from "axios";
import { axiosGet, axiosPost } from "../../../../axios/method";
import {
  // PurchaseRequest,
  PurchaseRequestApiType,
} from "../types/storeListing.types";

export const getStoreProductDetail = async (supplierData: {
  supplierId: string | undefined;
  productId: string | undefined;
  storeId: string | undefined;
  supplierProdId: string | undefined;
}) => {
  try {
    const response = await axiosGet(`/store/productDetails`, {
      ...supplierData,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};
export const getPurchaseProductNow = async ({
  uuid,
  user_entity_uuid,
  supplier_uuid,
  price,
  endDate,
  product_uuid,
  quantity,
}: {
  uuid: string;
  user_entity_uuid: string;
  supplier_uuid?: string;
  price?: string;
  endDate?: string;
  product_uuid?: string;
  quantity?: number;
}) => {
  try {
    const response = await axiosPost(`/direct-buy`, {
      requester_uuid: uuid,
      store_info_uuid: user_entity_uuid,
      supplier_uuid: supplier_uuid,
      price: price,
      end_date: endDate,
      product_uuid: product_uuid,
      quantity,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getProductsForOtherSuppliers = async (supplierData: {
  supplierId: string | undefined;
  productId: string | undefined;
}) => {
  try {
    const response = await axiosGet(`/store/otherSupplierProduct`, {
      ...supplierData,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const createPurchseRequest = async (data: PurchaseRequestApiType) => {
  try {
    const response = await axiosPost("/existing-purchase-request", data);
    return response;
  } catch (error: any) {}
};

export const addReviewsRatings = async ({
  product_uuid,
  review_by,
  store_info_uuid,
  supplier_info_uuid,
  reviews,
  rating,
}: {
  product_uuid: string | undefined;
  review_by: string;
  store_info_uuid: string;
  supplier_info_uuid: string | undefined;
  reviews: string | null | undefined;
  rating: number;
}) => {
  try {
    const response = await axiosPost("/storeProductReviews/add", {
      product_uuid,
      review_by,
      store_info_uuid,
      supplier_info_uuid,
      reviews,
      rating,
    });
    return response;
  } catch (error: any) {
    return (error as AxiosError).response;
  }
};
