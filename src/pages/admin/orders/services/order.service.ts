import { AxiosError } from "axios"
import { axiosGet, axiosPost } from "../../../../axios/method"
import { ApiParamsType } from "components/table/types"

export const getOrderInfo = async (apiParams: ApiParamsType) => {
    try {
        const response = await axiosGet("/payment/admin-order-details", {
            apiParams,
        })
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const getOrderDetailInfo = async (orderId: string) => {
    try {
        const response = await axiosGet("/payment/single-admin-order-details", {
            orderId,
        })
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const getRefundOrderDetailInfo = async (orderId: string) => {
    try {
        const response = await axiosGet(
            "/payment/single-admin-refundOrder-details",
            {
                orderId,
            }
        )
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
export const approvePaymentInvoice = async (data: Object) => {
    try {
        const response = await axiosPost("/admin/approve-bank-payment", data)
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
export const approveDeclineInvoice = async (data: Object) => {
    try {
        const response = await axiosPost("/admin/decline-bank-payment", data)
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
export const addReason = async (reason: string, orderId: string) => {
    try {
        const response = await axiosPost(`/orders/cancel/${orderId}`, {
            reason,
        })
        return response
    } catch (error: any) {
        return (error as AxiosError).response
    }
}
export const adminPaymentStatus = async (orderId: string) => {
    try {
        const response = await axiosPost(`/orders/admin-refund-status`, {
            orderId,
        })
        return response
    } catch (error: any) {
        return (error as AxiosError).response
    }
}
