export type OrderDataType = {
    uuid: string
    amount: number
    payment_status: string
    orders: Orders
}

type Orders = {
    uuid: string
    vat_percentage: number
    created_at: string
    created_by: string
    status: string
    address: Address
    payment_mode: string
    reason_for_cancel: string
    additional_info: string
    refund_request: boolean
    storeInfo: {
        company_name: string
        uuid: string
    }
    replacement_status: string
    OrderProducts: OrderProducts[]
    refund_accepted_supplier: string
    refund_accepted_admin:boolean
}

type Address = {
    address: string
    city: string
    country: string
    phone: number
    postal_code: number
    state: string
}

export type OrderProducts = {
    uuid?: string
    price: string
    quantity: number
    subtotal: number | null
    supplierProductQuotes: supplierProductQuotes | null
    product: {
        [key: string]: any
        featured_image: string
        measurement: {
            [key: string]: string
        }
    } | null
    replacement_reason?: string
    refund_reason?: string
    replacement_request?: boolean
    evidence_image?: string
    refund_request?: boolean
}
type supplierProductQuotes = {
    purchase_request_products_uuid: string
    other_brand_product_uuid: string
    ProductPurchaseRequests: ProductPurchaseRequests
    SupplierQuotes?: {
        charges_and_total: number
        charges: number
    }
    otherBrandProduct: {
        name_en: string
        name_ar: string
        name_ur: string
        featured_image: string
        uuid?: string
    }
}
type ProductPurchaseRequests = {
    product_uuid: string
    products: {
        [key: string]: string | measurementType
        featured_image: string
        measurement: {
            [key: string]: string
        }
    }
}
export type storeUser = {
    user: {
        email: string
        image: string
        phone: number
        username: string
        created_at: string
    }
}

export type measurementType = {
    [key: string]: string
}

export type searchFilterType = {
    order_id: string | undefined
    store_company: string | undefined
    order_status: string | undefined
    amount: string | undefined
    order_date: string[] | undefined
}
export type reqStatus = {
    [key: string]: string
}
export type statusReplacement = "ACCEPTED" | "REJECTED"
export type changeStatusType = {
    uuid: string
    status: statusReplacement
    product_uuid: string
}[]
export type singleChangeStatusType = {
    uuid: string
    status: statusReplacement
    product_uuid: string
}

export type replaceOrderDataType = {
    replacement_product_status: string
    rejection_reason: string
    order_product_uuid: string
}[]

export type singleReplaceOrderDataType = {
    replacement_product_status: string
    rejection_reason: string
    order_product_uuid: string
}
