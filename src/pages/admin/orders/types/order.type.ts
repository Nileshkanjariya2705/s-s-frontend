export interface AdminOrderTypes {
    Date: Date
    amount: number
    count: number
    status: string
    store: string
    supplier: string
    uuid: string
}
export interface AmountCardWiseTypes {
    AmountRecived_MADA: number
    AmountRecived_VISA: number
    AmountRecived_MASTERCARD: number
}
export type TabType = "MADA" | "VISA" | "MASTERCARD"
export type OrderCancelInfo = {
    reason: string
}
export interface AdminOrderDetailTypes {
    ownerData: {
        storeOwnerName: string
        supplierOwnerName: string
    }
    singleData: {
        uuid: string
        payment_status: string
        amount: string
        orders: {
            purchase_request_id: string
            payment_receipt: string
            payment_mode: string
            status: string
            created_at: string
            vat_percentage: string
            address: addressType
            storeInfo: storeInfoType
            supplierInfo: supplierInfoType
            OrderProducts: OrderProducts[]
        }
    }
}

export interface AdminRefundOrderDetailTypes {
    ownerData: {
        storeOwnerName: string
        supplierOwnerName: string
    }
    singleData: {
        uuid: string
        payment_status: string
        amount: string
        orders: {
            purchase_request_id: string
            payment_receipt: string
            payment_mode: string
            status: string
            created_at: string
            refund_accepted_admin: boolean
            address: addressType
            storeInfo: storeInfoType
            supplierInfo: supplierInfoType
            RefundOrders: RefundOrderDetailType[]
        }
    }
}

type addressType = {
    address: string
    city: string
    state: string
    country: string
    uuid?: string
    user_uuid?: string
    postal_code: string
}

type supplierInfoType = {
    uuid?: string
    company_name: string
    cr_number: string
    tax_number: string
}

type storeInfoType = {
    uuid?: string
    company_name: string
    cr_number: string
    tax_number: string
}

type RefundOrderDetailType = {
    uuid: string
    refundable_amount: string
    RefundOrderProducts: RefundOrderProductsType[]
}

export type RefundOrderProductsType = {
    refund_order_uuid: string
    order_product_uuid: string
    product_uuid: string
    OrderProducts: {
        price: string
        quantity: number
        uuid: string
    }
    Products: {
        [key: string]: any
        featured_image: string
        measurement: {
            [key: string]: string
        }
    }
}

type OrderProducts = {
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
}
type supplierProductQuotes = {
    purchase_request_products_uuid: string
    other_brand_product_uuid: string
    ProductPurchaseRequests: ProductPurchaseRequests
    otherBrandProduct: {
        name_en: string
        name_ar: string
        name_ur: string
        featured_image: string
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
export type measurementType = {
    [key: string]: string
}
export interface AdminOrderFinalTypes {
    PaymentDetail: PaymentDetailType[]
    status: string
    storeInfo: {
        company_name: string
    }
    supplierInfo: {
        company_name: string
    }
    uuid: string
    purchase_request_id: string
}

export interface PaymentDetailType {
    amount: number
    created_at: string
    payment_success: string
    payment_method_type?: string
}
export interface RefundOrderType {
    refundable_amount: number
}
export type OrderFilterType = {
    supplier_company: string | undefined
    store_company: string | undefined
    order_date: string[] | undefined
    amount: string | undefined
    payment_uuid: string | undefined
    order_status: string | undefined
    order_uuid: string | undefined
}
