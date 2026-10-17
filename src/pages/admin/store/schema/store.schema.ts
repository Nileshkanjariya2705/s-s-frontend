import { ImageSize, SUPPORTED_FORMATS } from "constant/common.constant"
import * as yup from "yup"
function isValidEmail(value: string): boolean {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return emailRegex.test(value)
}
function isFilterEmail(value: string) {
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value === "") {
        return true
    } else if (email.test(value)) {
        return true
    }
}
export const storeInfoDataSchema = yup.object().shape({
    uuid: yup.string().optional(),
    email: yup
        .string()
        .required("Email_Error")
        .test("email", "Valid_Email", (value) => {
            if (typeof value === "string") {
                return isValidEmail(value)
            }
        }),
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
    phone: yup
        .mixed<string>()
        .optional()
        .nullable()
        .test("is-number", "Phone_Number_Error", (value: any) => {
            return !isNaN(value)
        })
        .test("is-positive", "Phone_Positive", (value: any) => {
            if (value == null || value.length === 0) {
                return true
            }
            return value > 0
        })
        .test("number-length", "Phone_Length", (value: any) => {
            if (value == null || value.length === 0) {
                return true
            }
            return !(value?.length < 6 || value?.length > 14)
        })
        .transform((value) => {
            if (value === null || value.length === 0) {
                return ""
            } else {
                return value.replace(/\s/g, "")
            }
        }),
    image: yup
        .mixed<File[] | string>()
        .optional()
        .nullable()
        .test("FILE_SIZE", "Image_Size_Error", (value: any) => {
            if (value == null || value.length === 0) {
                return true
            } else {
                return (
                    typeof value === "string" ||
                    (value[0] && value[0].size <= ImageSize)
                )
            }
        })
        .test("FILE_FORMAT", "Image_Format_Error", (value: any) => {
            if (value == null || value.length === 0) {
                return true
            }
            return (
                typeof value === "string" ||
                (value.length > 0 && SUPPORTED_FORMATS.includes(value[0].type))
            )
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
    username: yup.string().required("Username_Error"),
    iban_number: yup
        .string()
        .matches(/^[a-zA-Z0-9]*$/, "Iban_Alphanumeric")
        .required("Iban_Number_Error")
        .test("is-positive", "Iban_Positive", (value: any) => {
            return isNaN(value) || value > 0
        })
        .test("LENGTH", "Iban_Length", (value: any) => {
            return value.length === 22
        }),
    is_active: yup.string().required("Company_Status"),
})

export const searchFilterSchema = yup.object().shape({
    name: yup.string().optional(),
    email: yup
        .string()
        .optional()
        .test("email", "Valid_Email", (value) => {
            if (typeof value === "string") {
                return isFilterEmail(value)
            }
        }),
    company_name: yup.string().optional(),
    status: yup.string().optional(),
})
