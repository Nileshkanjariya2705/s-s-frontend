import { axiosPost } from "../../../../axios/method"

export const UpdatePassword = async (data: string) => {
    try {
        const response = await axiosPost("/admin/manage-password", {
            password: data,
        })
        return response
    } catch (err: any) {
        return err
    }
}

export const UpdateManagePassword = async (
    email: string,
    oldPassword: string,
    password: string
) => {
    try {
        const response = await axiosPost("/manage-profile/updatePassword", {
            email,
            oldPassword,
            password,
        })
        return response
    } catch (error: any) {
        return error
    }
}
