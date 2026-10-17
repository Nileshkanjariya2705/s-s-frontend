import { AxiosError } from "axios"
import { axiosGet, axiosPost } from "../../../../axios/method"
import { ApiParamsType } from "components/table/types"

export const getOrders = async (
    supplierId: string,
    apiParams: ApiParamsType
) => {
    try {
        const response = axiosGet("/payment/getAll", {
            supplierId,
            apiParams,
        })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const getSingleOrder = async (
    orderId: string | undefined,
    requestType?: string
) => {
    try {
        const response = axiosGet("/payment/getSingleDetail", {
            orderId,
            requestType,
        })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const updateOrderStatus = async (
    orderId: string | undefined,
    status: string,
    store_info_uuid: string
) => {
    try {
        const response = axiosPost(`/orders/updateStatus/${orderId}`, {
            status,
            store_info_uuid,
        })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const updateReplacementOrderStatus = async (
    orderId: string | undefined,
    replacement_status: string,
    store_info_uuid: string
) => {
    try {
        const response = axiosPost(`/orders/updateReplaceStatus/${orderId}`, {
            replacement_status,
            store_info_uuid,
        })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const updateReqStatus = async (data: any) => {
    try {
        const response = axiosPost(`/replacement/updateReqStatus`, data)
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const requestReplaced = async (orderId: string | undefined) => {
    try {
        const response = axiosGet(`/replacement/get`, { orderId })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const updateRefundReqStatus = async (data: any) => {
    try {
        const response = axiosPost(`/refund/updateRefundReqStatus`, data)
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const requestRefund = async (orderId: string | undefined) => {
    try {
        const response = axiosGet(`/refund/get`, { orderId })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
