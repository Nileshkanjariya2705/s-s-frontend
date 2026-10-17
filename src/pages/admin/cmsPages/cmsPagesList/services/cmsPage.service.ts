import { AxiosError } from "axios"
import { axiosGet } from "../../../../../axios/method"

export const getCmsPagesInfo = async () => {
    try {
        const response = await axiosGet("/cms/getPages")
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
export const getDataSourceCount = async () => {
  try {
    const response = await axiosGet("/cms/data-source-count");
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};
