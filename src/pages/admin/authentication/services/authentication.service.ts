import { axiosGet, axiosPost } from "../../../../axios/method"
import { LoginInterFace } from "pages/authentication/types/authentication.type"
import { AxiosError } from "axios"

export const loginAdmin = async (data: LoginInterFace) => {
    try {
        const response = await axiosPost("/admin/login", { ...data })
        return response
    } catch (err: any) {
        return err
    }
}

export const adminForgotPassword = async (data: any) => {
    try {
        const response = await axiosPost("/admin/forgot-password", data)
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const adminUpdatePassword = async (data: any) => {
    try {
        const response = await axiosPost("/admin/change-password", data)
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
