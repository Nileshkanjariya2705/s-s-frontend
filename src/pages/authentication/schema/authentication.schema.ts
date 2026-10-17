import * as yup from "yup"

// function isValidEmail(value: string): boolean {
//   const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
//   return emailRegex.test(value);
// }

// function isValidUsername(value: string): boolean {
//   const usernameRegex = /^[a-zA-Z0-9_]+$/;
//   return usernameRegex.test(value);
// }

export const signupValidationSchema = yup.object().shape({
    username: yup.string().required("Username_Error"),
    email: yup.string().required("Email_Error").email("Valid_Email"),
    company_name: yup.string().required("Comapny_Name_Error"),
    cr_number: yup
        .string()
        .required("Cr_Number_Error")
        .matches(/^[a-zA-Z0-9]*$/, "Cr_Alphanumeric")
        .test("is-positive", "Cr_Positive", (value: any) => {
            return isNaN(value) || value > 0
        })
        .test("LENGTH", "Cr_Length", (value: any) => {
            return value.length === 10
        }),
    tax_number: yup
        .string()
        .optional()
        .nullable()
        .test("is-number", "Tax_Number_Error", (value: any) => {
            return !isNaN(value)
        })
        .test("is-positive", "Tax_Positive", (value: any) => {
            if (value == null || value.length === 0) {
                return true
            }
            return value > 0
        })
        .test("number-length", "Tax_Length", (value: any) => {
            if (value == null || value.length === 0) {
                return true
            }
            return !(value.length !== 9)
        }),

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
    varient: yup.string().optional(),
})

export const emailValidationSchema = yup.object().shape({
    username: yup.string().required("Email_Error").email("Valid_Email"),
})

export const passwordValidationSchema = yup.object().shape({
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
