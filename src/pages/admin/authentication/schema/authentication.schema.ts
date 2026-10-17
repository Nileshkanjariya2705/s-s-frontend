import * as yup from "yup"

export const loginValidationSchema = yup.object().shape({
    username: yup.string().required("Email_Username_Error"),
    password: yup.string().required("Password_Error"),
    remember: yup.boolean().required(),
})
