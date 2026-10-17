import * as yup from "yup"
export const BranchInfoSchema = yup.object().shape({
    name: yup.string().trim().required("Branch_Error"),
    address: yup.string().trim().required("Address_Data"),
    city: yup.string().required("Address_City"),
    country: yup.string().required("Address_Country"),
    state: yup.string().required("Address_State"),
    users: yup
        .array()
        .of(yup.string())
        // .min(1, "Brach_User")
        .optional(),
    status: yup.string().required("Role_Status"),
    postal_code: yup
    .string()
    .required("Postal code is required")
    .matches(/^[a-zA-Z0-9]+$/, "Postal_Code_Alphanumeric")
    .test("is-number", "Postal_Code_Number", (value: any) => {
        return !isNaN(value)
    }),
    // .test("number-length", "Postal_Code_Length", (value: any) => {
    //     return !(value.length < 6 || value.length > 10)
    // }),
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
    }),
})
