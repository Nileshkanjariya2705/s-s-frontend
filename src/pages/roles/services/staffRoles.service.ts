import { AxiosError } from "axios";
import { axiosDelete, axiosGet, axiosPost } from "../../../axios/method";
import { ApiParamsType } from "components/table/types";

export const getPermission = async (entity_type: string) => {
  try {
    let response = await axiosGet("/permission/getPermission", {
      entity_type,
    });
    return response;
  } catch (error: unknown) {
    return (error as AxiosError).response;
  }
};
export const createRolePermission = async (data: any) => {
    try {
        let response = await axiosPost("/roles/create", { data })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const updateRolePermission = async (data: any) => {
    try {
        let response = await axiosPost("/roles/update", { data })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const getAllRole = async (
    userId: string,
    role: string,
    apiParams: ApiParamsType
) => {
    try {
        let response = await axiosGet("/roles/getRoles", {
            userId,
            roleName:role,
            apiParams,
        })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const deleteRole = async (deleteId: string) => {
    try {
        let response = await axiosDelete(`/roles/${deleteId}`)
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const getSingleRolePermission = async (
    roleId: string | undefined,
    entity_type: string
) => {
    try {
        let response = await axiosGet(`/roles/edit/${roleId}`, { entity_type })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
