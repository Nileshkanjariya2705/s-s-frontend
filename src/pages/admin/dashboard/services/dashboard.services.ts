import { ApiParamsType } from "components/table/types";
import { axiosGet } from "../../../../axios/method";
import { AxiosError } from "axios";

export const dashboardServices = async (apiParams: ApiParamsType) => {
  try {
    const response = await axiosGet(`/transaction`, apiParams);
    return response?.data?.data;
  } catch (err: any) {
    return err;
  }
};

export const getGeneralReport = async () => {
  try {
    const response = await axiosGet(`/admin-transaction`);
    return response?.data?.data;
  } catch (err: any) {
    return err;
  }
};

export const monthlySelling = async (
  from: string,
  to: string,
  lang: string
) => {
  try {
    const response = await axiosGet(`/month-wise-data`, { from, to, lang });
    return response;
  } catch (error) {
    return (error as AxiosError).response;
  }
};
