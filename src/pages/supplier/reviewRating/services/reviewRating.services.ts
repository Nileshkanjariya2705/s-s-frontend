import { AxiosError } from "axios";
import { ApiParamsType } from "components/table/types";
import { axiosGet } from "../../../../axios/method";

export const getReviewRating = async (
  supplierId: string,
  apiParams: ApiParamsType
) => {
  try {
    const response = axiosGet("/storeProductReviews/getAll", {
      supplierId,
      apiParams,
    });
    return response;
  } catch (error) {
    return (error as AxiosError).response;
  }
};

export const getSingleReviewRating = async (ratingId: string | undefined) => {
  try {
    const response = axiosGet("/storeProductReviews/getSingle", {
      ratingId,
    });
    return response;
  } catch (error) {
    return (error as AxiosError).response;
  }
};
