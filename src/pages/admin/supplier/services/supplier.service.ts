import { AxiosError } from "axios"
import { ApiParamsType } from "components/table/types"
import { axiosDelete, axiosGet, axiosPost } from "../../../../axios/method"

export const getStoreInfo = async ({
    type,
    apiParams,
}: {
    type: string
    apiParams: ApiParamsType
}) => {
    try {
        const response = await axiosGet("/admin/store-info", {
            type,
            apiParams,
        })
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const getSingleSupplier = async (uuid: string) => {
    try {
        const response = await axiosPost("/supplier/supplierEdit", {
            uuid,
        })
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const supplierUpdate = async (formData: FormData) => {
    try {
        const response = await axiosPost("/supplier/update", formData)
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const deleteSupplierUser = async (uuid: string) => {
    try {
        const response = await axiosDelete(`/supplier/delete/${uuid}`)
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
