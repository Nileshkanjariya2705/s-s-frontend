import * as yup from "yup"
export const StaffMemberSchema = yup.object().shape({
    username: yup.string().required("Username_Error"),
    email: yup.string().email("Valid_Email").required("Email_Error"),
    phone: yup
        .mixed<string>()
        .required("Phone_Error")
        .test("is-required", "Phone_Error", (value) => {
            return value !== undefined && value !== null && value !== ""
        })
        .test("is-number", "Phone_Number_Error", (value: any) => {
            return !isNaN(value)
        })
        .test("is-positive", "Phone_Positive", (value: any) => {
            return isNaN(value) || value > 0
        })
        .test("number-length", "Phone_Length", (value: any) => {
            return !(value.length < 6 || value.length > 14)
        })
        .transform((value) => {
            if (value === null || value.length === 0) {
                return ""
            } else {
                return value.replace(/\s/g, "")
            }
        }),
    password: yup
        .string()
        .required("Password_Error")
        .min(8, "Password_Length")
        .matches(
            /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/,
            "Password_Creds"
        ),
    role: yup.string().required("Staff_Role"),
    is_active: yup.string().required("Staff_Status"),
})
