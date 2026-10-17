import { AxiosError } from "axios";
import { axiosGet, axiosPatch, axiosPost } from "../../../axios/method";
import { ApiParamsType } from "components/table/types";
import { StaffMemberInfo } from "../types/staff.type";

export const getStaffMember = async ({
  user_uuid,
  user_entity_uuid,
  apiParams,
}: {
  user_uuid: string;
  user_entity_uuid: string;
  apiParams: ApiParamsType;
}) => {
  try {
    let response = await axiosGet("/staff/fetch-staff", {
      user_uuid,
      user_entity_uuid,
      apiParams,
    });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};
export const getSingleStaffMember = async (user_uuid: string) => {
  try {
    let response = await axiosGet("/staff/single-member", {
      user_uuid,
    });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

export const getRoles = async (userId: string, roleName: string) => {
  try {
    let response = await axiosGet("/roles/get-Roles-list", {
      userId,
      roleName,
    });
    return response;
  } catch (error) {
    return (error as AxiosError).response;
  }
};
export const updateMemeberUser = async (
  values: StaffMemberInfo,
  entity_uuid: string,
  varient: string
) => {
  try {
    let response = await axiosPatch("/staff/update-member", {
      ...values,
      entity_uuid,
      varient,
    });
    return response;
  } catch (error) {
    return (error as AxiosError).response;
  }
};
export const createMemeberUser = async (
  values: StaffMemberInfo,
  entity_uuid: string,
  varient: string
) => {
  try {
    let response = await axiosPost("/staff/create-member", {
      ...values,
      entity_uuid,
      varient,
    });
    return response;
  } catch (error) {
    return (error as AxiosError).response;
  }
};