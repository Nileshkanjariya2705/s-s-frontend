import * as yup from "yup"
export const VatChargeSchema = yup.object().shape({
    vat_charge: yup
        .string()
        .test("is-positive-number", "Vat_Positive_Error", (value: any) => {
            if (/^\d*[\.{1}\d*]\d*$/.test(value)) {
                const parsedValue = parseFloat(value)
                return !isNaN(parsedValue) && parsedValue >= 0
            }
            return false
        })
        .required("Vat_Req_Error"),
})
export const OrderReplacementSchema = yup.object().shape({
    replacement_days: yup
        .number()
        .test(
            "is-positive-number",
            "Replacemnt_Positive_Error",
            (value: any) => {
                if (/^-?\d+$/.test(value)) {
                    const parsedValue = parseInt(value)
                    return !isNaN(parsedValue) && parsedValue >= 0
                }
                return false
            }
        )
        .required("Replacemnt_Req_Error"),
})
export const OrderRefundSchema = yup.object().shape({
    refundable_days: yup
        .number()
        .test(
            "is-positive-number",
            "Refundable_Positive_Error",
            (value: any) => {
                if (/^-?\d+$/.test(value)) {
                    const parsedValue = parseInt(value)
                    return !isNaN(parsedValue) && parsedValue >= 0
                }
                return false
            }
        )
        .required("Refundable_Req_Error"),
})
