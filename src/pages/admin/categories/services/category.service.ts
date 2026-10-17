import { ApiParamsType } from "components/table/types";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "../../../../axios/method";
import { CategoryInterface } from "../types/category.type";

export const createCategory = async (data: CategoryInterface | FormData) => {
  try {
    const response = await axiosPost("/category/create", data);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getAllCategory = async (apiParams: ApiParamsType) => {
  try {
    const response = await axiosGet("/get-all/category", apiParams);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateCategory = async (
  id: string | undefined,
  formData: FormData
) => {
  try {
    const response = await axiosPatch(`/category/update/${id}`, formData);

    return response;
  } catch (err: any) {
    return err;
  }
};

export const getSpecifiCategory = async (urlParam: string | undefined) => {
  try {
    const response = await axiosGet(`/get/category/${urlParam}`);

    // const response = await axiosGet("/get/category/:");
    return response;
  } catch (err: any) {
    return err;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await axiosDelete(`/category/delete/${id}`);
    return response;
  } catch (err: any) {
    return err;
  }
};
