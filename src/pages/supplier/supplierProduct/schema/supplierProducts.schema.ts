import { SUPPORTED_FORMATS } from "constant/common.constant";
import { remainingTime } from "helper/timezone.helper";
import * as yup from "yup";

export const supplierProductSchema = (allowedPurchaseRequests: boolean) => {
    return yup.object().shape({
        end_date: yup
            .string()
            .required("Date_Error")
            .test("is-valid", "Date_Invalid_Error", (value) => {
                const ans = remainingTime(value)
                return ans !== "Date_Passed_Error"
            })
            .test(
                "passedDate",
                "Passed_Date",
                (value) => new Date() < new Date(value)
            ),
        price: yup
            .mixed<string>()
            .test("is-required", "Pur_Req_Price", (value) => {
                return value !== undefined && value !== null && value !== ""
            })
            .test("is-number", "Price_Number", (value: any) => {
                return !isNaN(value)
            })
            .test("is-positive", "Price_Positive", (value: any) => {
                return isNaN(value) || value > 0
            }),
        charges: yup
            .string()
            .optional()
            .test("is-number", "Charges_Number_Error", (value: any) => {
                return !isNaN(value)
            })
            .test("is-positive", "Charges_Positive_Error", (value: any) => {
                if (value == null || value.length === 0) {
                    return true
                }
                return value >= 0
            }),
        category: yup.string().required("Pur_Req_Category"),
        product: yup.string().required("Pur_Req_Product"),
        overview_en: yup.string().optional(),
        units: yup
            .mixed<string>()
            .test("is-required", "Units_Error", (value) => {
                return value !== undefined && value !== null && value !== ""
            })
            .test("is-number", "Unit_Number_Error", (value: any) => {
                return !isNaN(value)
            })
            .test("is-positive", "Unit_Positive_Error", (value: any) => {
                return isNaN(value) || value > 0
            }),
        base_price: yup
            .mixed<string>()
            .test("is-required", "Base_Price_Error", (value) => {
                if (allowedPurchaseRequests) {
                    return value !== undefined && value !== null && value !== ""
                } else {
                    return true
                }
            })
            .test("is-number", "Base_Price_Number_Error", (value: any) => {
                return !isNaN(value)
            })
            .test("is-positive", "Base_Price_Positive_Error", (value: any) => {
                if (allowedPurchaseRequests) {
                    return isNaN(value) || value > 0
                } else {
                    return true
                }
            }),
        status: yup.string().optional(),
        specification_en: yup.string().optional(),
        description_en: yup.string().optional(),
        measurement: yup.string().optional(),
        is_purchaseable: yup.string().optional(),
        product_images: yup.array().of(
            yup.object().shape({
                image: yup
                    .mixed<File[]>()
                    .test("REQUIRED", "Image_Error", (value: any) => {
                        return !value || value.length > 0
                    })
                    .test(
                        "FILE_FORMAT",
                        "Image_Format_Error",
                        (value: any) =>
                            !value ||
                            typeof value === "string" ||
                            (value &&
                                value.length > 0 &&
                                SUPPORTED_FORMATS.includes(value[0].type))
                    ),
            })
        ),
        // product_images: yup.string().required(),
    })
}

export const productFilterSchema = yup.object().shape({
    category_name: yup.string().optional(),
    product_name: yup.string().optional(),
    offered_price: yup.string().optional(),
    status: yup.string().optional(),
    created_date: yup.array().optional(),
})
