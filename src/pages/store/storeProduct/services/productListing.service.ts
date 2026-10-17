import { ApiParamsType } from "components/table/types";
import { axiosGet, axiosPost } from "../../../../axios/method";

export const getCategoryListing = async (apiParams: ApiParamsType) => {
  try {
    const response = await axiosGet("/category/listing", {
      apiParams,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getCategoryProductListing = async (apiParams: ApiParamsType) => {
  try {
    const response = await axiosGet("/product/category-wise", {
      apiParams,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};
export const getCategoryWiseProduct = async (data: any) => {
  try {
    const response = await axiosPost(`/category-wise-product`, {
      data,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getProductListing = async () => {
  try {
    const response = await axiosGet("/category/all");
    return response;
  } catch (error) {}
};
