import { AxiosError } from "axios"
import { axiosGet, axiosPost } from "../../../../axios/method"

export const getSupplierMonthData = async (supplierId: string) => {
    try {
        const response = await axiosGet("/supplier/month-wise-data", {supplierId})
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const getAdminMonthData = async (userId: string) => {
    try {
        const response = await axiosGet("/admin/month-wise-data", {userId})
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const getPdfInfo = async(financeId:string) => {
    try {
        const response = await axiosGet("/supplier/pdfData", { financeId })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}

export const approveFinancePayment = async (financeId: string) => {
    try {
        const response = await axiosPost("/supplier/finance-payment-approve", { financeId })
        return response
    } catch (error) {
        return (error as AxiosError).response
    }
}