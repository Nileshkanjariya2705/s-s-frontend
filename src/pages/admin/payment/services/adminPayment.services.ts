import { AxiosError } from "axios"
import { axiosGet, axiosPost, axiosPut } from "../../../../axios/method"
import {
    OrderRefundTime,
    OrderReplacementTime,
    PaymentListType,
} from "../types/paymentList.type"
import { ApiParamsType } from "components/table/types"
import { VatPercentType } from "pages/admin/settings/types"

export const createVatCharges = async (data: PaymentListType) => {
    try {
        const response = await axiosPost("/admin-settings/vat-charges", data)
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
export const createReplacementDays = async (data: OrderReplacementTime) => {
    try {
        const response = await axiosPost("/admin-settings/replace-days", {
            ...data,
        })
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
export const createRefundDays = async (data: OrderRefundTime) => {
    try {
        const response = await axiosPost("/admin-settings/refund-days", {
            ...data,
        })
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
export const getLatestCharge = async () => {
    try {
        const response = await axiosGet("/admin-settings/vat-charges")
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const getAdminSettingData = async () => {
    try {
        const response = await axiosGet("/admin-settings/adminData")
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}
export const updateVatCharges = async (data: VatPercentType) => {
    try {
        const response = await axiosPut("/admin-settings/vat-charges", data)
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
export const updateReplacementDays = async (data: OrderReplacementTime) => {
    try {
        const response = await axiosPut("/admin-settings/replace-days", data)
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
export const adminPaymentInfo = async (apiParams: ApiParamsType) => {
    try {
        const response = await axiosGet("/admin/payment-details", {
            apiParams,
        })
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
