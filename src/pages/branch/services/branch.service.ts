import { AxiosError } from "axios";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "../../../axios/method";
import { ApiParamsType } from "components/table/types";

export const getBranches = async ({
  user_uuid,
  user_entity_uuid,
  apiParams,
}: {
  user_uuid: string;
  user_entity_uuid: string;
  apiParams: ApiParamsType;
}) => {
  try {
    let response = await axiosGet("/branch/get-branches", {
      user_uuid,
      entity_uuid: user_entity_uuid,
      apiParams,
    });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};
export const getSingleBranch = async ({
  branch_uuid,
}: {
  branch_uuid: string;
}) => {
  try {
    let response = await axiosGet("/branch/get-single-branch", {
      branch_uuid,
    });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};
export const getAllStoreUser = async ({
  user_entity_uuid,
}: {
  user_entity_uuid: string;
}) => {
  try {
    let response = await axiosGet("/branch/get-entity-users", {
      entity_uuid: user_entity_uuid,
    });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};
export const updateBranch = async ({
  values,
  user_entity_uuid,
  entity_type,
  branch_uuid,
  branch_owner_uuid
}: {
  values: any;
  user_entity_uuid: string;
  entity_type: string;
  branch_uuid: string;
  branch_owner_uuid: string;
}) => {
  try {
    let response = await axiosPatch("/branch/update-branch", {
      ...values,
      entity_uuid: user_entity_uuid,
      entity_type,
      branch_uuid,
      branch_owner_uuid
    });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};
export const createBranch = async ({
  values,
  user_entity_uuid,
  entity_type,
  branch_owner_uuid
}: {
  values: any;
  user_entity_uuid: string;
  entity_type: string;
  branch_owner_uuid: string;
}) => {
  try {
    let response = await axiosPost("/branch/create-branch", {
      ...values,
      entity_uuid: user_entity_uuid,
      entity_type,
      branch_owner_uuid
    });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};

export const deleteBranch = async (branch_uuid: string) => {
  try {
    let response = await axiosDelete(`/branch/delete-branch/${branch_uuid}`);
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};
