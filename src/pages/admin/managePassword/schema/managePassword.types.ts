import * as yup from "yup"

export const ManagePasswordSchema = yup.object().shape({
    password: yup
        .string()
        .required("Password_Error")
        .min(8, "Password_Length")
        .matches(
            /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/,
            "Password_Creds"
        ),
    confirm_password: yup
        .string()
        .oneOf([yup.ref("password")], "Confirm_Password_Error")
        .required("Confirm_Password_Req_Error"),
})

export const UpdatePasswordSchema = yup.object().shape({
    oldPassword: yup.string().required("Password_Error"),
    password: yup
        .string()
        .required("Password_Error")
        .min(8, "Password_Length")
        .matches(
            /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/,
            "Password_Creds"
        ),
    confirm_password: yup
        .string()
        .oneOf([yup.ref("password")], "Confirm_Password_Error")
        .required("Confirm_Password_Req_Error"),
})
