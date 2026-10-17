import * as yup from "yup"
export const myOrdersSearchFilter = yup.object().shape({
    supplier_company: yup.string().optional(),
    expiry_date: yup.array().optional(),
    payment_uuid: yup.string().optional(),
    order_status: yup.string().optional(),
})

export const supplierOrderSearchFilter = yup.object().shape({
    order_id: yup.string().optional(),
    store_company: yup.string().optional(),
    order_status: yup.string().optional(),
    amount: yup.string().optional(),
    order_date: yup.array().optional(),
})
