import { AxiosError } from "axios"
import { axiosGet, axiosPost } from "../../../axios/method"
import {
    ForgotPasswordInterface,
    ResetPasswordInterface,
} from "../types/forgotPassword.type"

export const forgotPassword = async (data: ForgotPasswordInterface) => {
    try {
        const response = await axiosPost("/account/forgot-password", {
            ...data,
        })
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const validateToken = async () => {
    try {
        const response = await axiosGet("/account/check-token")
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const UpdatePassword = async (data: ResetPasswordInterface) => {
    try {
        const response = await axiosPost("/change-password", { ...data })
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
