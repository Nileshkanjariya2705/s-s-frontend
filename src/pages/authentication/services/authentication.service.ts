import { AxiosError } from "axios"
import { axiosPost } from "../../../axios/method"
import { LoginInterFace, SignUpInterface } from "../types/authentication.type"

export const createAccount = async (data: SignUpInterface) => {
    try {
        const response = await axiosPost("/account/create", { ...data })
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
export const loginUser = async (data: LoginInterFace) => {
    try {
        const response = await axiosPost("/account/login", { ...data })
        return response
    } catch (err: any) {
        return err
    }
}
