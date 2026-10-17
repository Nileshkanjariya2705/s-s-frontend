import * as yup from "yup"
export const myOrdersSearchFilter = yup.object().shape({
    supplier_company: yup.string().optional(),
    store_company: yup.string().optional(),
    order_date: yup.array().optional(),
    amount: yup.string().optional(),
    payment_uuid: yup.string().optional(),
    order_status: yup.string().optional(),
    order_uuid: yup.string().optional(),
})
export const orderCancelSchema = yup.object().shape({
    reason: yup.string().required("Reason is required"),
})
