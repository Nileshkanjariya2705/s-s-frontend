import * as yup from "yup"

export const purchaseRequest = yup.object({
    expiry_date: yup
        .string()
        .required("Pur_Req_Expiry")
        .test(
            "passedDate",
            "Passed_Date",
            (value) => new Date() < new Date(value)
        ),
    offer_for_entire_request: yup.boolean().required(),
    product_details: yup.array().of(
        yup.object().shape({
            category: yup.string().required("Pur_Req_Category"),
            product: yup.string().required("Pur_Req_Product"),

            quantity: yup
                .string()
                .required("Pur_Req_Quantity")
                .test(
                    "is-positive-number",
                    "Quantity_Positive",
                    (value: any) => {
                        const parsedValue = parseFloat(value)
                        return !isNaN(parsedValue) && parsedValue > 0
                    }
                ),

            subtotal: yup.string().optional(),
            requested_price: yup
                .string()
                .required("Pur_Req_Price")
                .test("is-number", "Price_Number", (value: any) => {
                    return !isNaN(value)
                })
                .test("is-positive-number", "Price_Positive", (value: any) => {
                    if (/^\d*[\.{1}\d*]\d*$/.test(value)) {
                        const parsedValue = parseFloat(value)
                        return !isNaN(parsedValue) && parsedValue > 0
                    }
                }),
            description: yup.string().required("Pur_Req_Description"),
        })
    ),
    address_uuid: yup.string().required('Please choose branch for delivery'),
})

export const purchaseRequestFilter = yup.object({
    expiry_date: yup.array().optional(),
    purchaseRequest_uuid: yup.string().optional(),
    status: yup.string().optional(),
    hasOffers: yup.string().optional(),
})
