import { address } from "pages/store/checkOut/types/checkout.types"

export interface purchaseHistoryUserInfo {
    userDetail: {
        email: string
        username: string
    }
    paymentDetails: {
        uuid: string
        order_id: string
        payment_status: string
        amount: number
        created_at: string
    }
    orderDetail: {
        payment_mode: string
        uuid: string
        status: string
        created_at: string
        updated_at: string
        vat_percentage: number
        address: {
            address: string
            city: string
            country: string
            state: string
            postal_code: string
        }
        purchase_request_id: string
        supplier_info_uuid: string
        reason_for_cancel: string
        refund_accepted_admin: boolean,
        refund_accepted_supplier: string,
    }
}
export type DropdownType = {
    label: string
    value: string
}
export interface searchFilterType {
    supplier_company: string | undefined
    expiry_date: string[] | undefined
    payment_uuid: string | undefined
    order_status: string | undefined
}
interface Product {
    uuid: string
    order_id: string
    product_uuid: string | null
    quote_id: string
    price: string
    quantity: number
    created_at: string
    updated_at: string
    deleted_at: string | null
    supplierProductQuotes: SupplierProductQuote
}

export interface SupplierProductQuote {
    uuid: string
    purchase_request_products_uuid: string
    supplier_quotes_uuid: string
    SupplierQuotes?: {
        charges_and_total: number
        charges: number
    }
    offered_price: number
    offered_quantity: number
    is_approved: boolean | null
    created_at: string
    updated_at: string
    deleted_at: string | null
    otherBrandProduct: any
    ProductPurchaseRequests: ProductPurchaseRequest
    other_brand_product_uuid: string
}

interface ProductPurchaseRequest {
    uuid: string
    purchase_request_uuid: string
    product_uuid: string
    category_uuid: string
    requested_price: number
    requested_quantity: number
    allow_other_brands: boolean
    is_purchased: boolean
    products: ProductInfo
}

interface ProductInfo {
    uuid: string
    name_en: string
    category_uuid: string
    measurement_uuid: string
    featured_image: string
    category: {
        name: string
        uuid: string
    }
    measurement: {
        unit_name: string
    }
    name_ar: string
    name_ur: string
}

export type OrderProducts = Product[]

export interface purchaseHistoryType {
    uuid: string
    order_id: string
    amount: number
    payment_status: string
    created_at: string
    orders: OrderDetails
}

export interface OrderDetails {
    uuid: string
    created_by: string
    purchase_request_id: string
    address_id: string
    store_info_uuid: string
    supplier_info_uuid: string
    additional_info: any
    status: string
    replacement_status: string
    refund_accepted_supplier: string
    refund_request: boolean,
    refund_accepted_admin: boolean,
    replacement_request: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
    OrderProducts: OrderProduct[]
    supplierInfo: {
        company_name: string
    }
}

export interface OrderProduct {
    uuid: string
    order_id: string
    product_uuid: string | null
    quote_id: string
    price: string
    quantity: number
    created_at: string
    updated_at: string
    deleted_at: string | null
}

interface Product {
    uuid: string
    name_en: string
    name_ar: string
    name_ur: string
    featured_image: string
}

export interface SupplierResponseType {
    uuid: string
    order_uuid: string
    order_replace_requests_uuid: string
    order_product_uuid: string
    product_uuid: string
    rejection_reason: string | null
    replacement_product_status: string | null
    refund_product_status: string | null
    reason: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
    orders: {
        replacement_status: string
    }
}

export interface ProductDataType {
    uuid: string
    name_en: string
    name_ar: string
    name_ur: string
    featured_image: string
}

interface SupplierResponse {
    uuid: string
    order_uuid: string
    order_replace_requests_uuid: string
    order_product_uuid: string
    rejection_reason: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
    orders: {
        replacement_status: string
    }
}

export interface SupplierProductQuotesDetails {
    purchase_request_products_uuid: string
    other_brand_product_uuid: string | null
    ProductPurchaseRequests: {
        product_uuid: string
        products: Product
    }
    otherBrandProduct: {
        uuid: string
        name_en: string
        name_ar: string
        name_ur: string
        featured_image: string
    } | null
}

export interface ReplacementProduct {
    uuid: string
    order_id: string
    product_uuid: string | null
    quote_id: string
    price: string
    quantity: number
    replacement_reason: string
    replacement_request: boolean
    refund_reason: string
    refund_request: boolean
    supplierProductQuotes: SupplierProductQuotesDetails | null
    product: null | Product
    supplierResponse: SupplierResponse[] | null
}

interface OrderInfo{
    uuid:string,
    refund_accepted_admin:boolean,
    refund_accepted_supplier:string,
    refund_request:string,
    store_info_uuid:string,
    supplier_info_uuid:string,
    created_by :string,
    address_id:string,
    purchase_request_id:string,
    address: address
    created_at:string,
    vat_percentage:number
}

export interface ReplacementProductResponseType {
    uuid: string
    order_id: string
    product_uuid: string | null
    quote_id: string
    price: string
    quantity: number
    replacement_reason: string
    replacement_request: boolean
    refund_reason: string
    refund_request: boolean
    supplierProductQuotes: SupplierProductQuotesDetails | null
    product: null | Product,
}

export interface RefundProductResponseType {
    uuid: string
    order_id: string
    product_uuid: string | null
    quote_id: string
    price: string
    quantity: number
    replacement_reason: string
    replacement_request: boolean
    refund_reason: string
    refund_request: boolean
    supplierProductQuotes: SupplierProductQuotesDetails | null
    product: null | Product,
    orders: OrderInfo
}
export interface RefundProduct {
    uuid: string
    order_id: string
    product_uuid: string | null
    quote_id: string
    price: string
    quantity: number
    replacement_reason: string
    replacement_request: boolean
    refund_reason: string
    refund_request: boolean
    supplierProductQuotes: SupplierProductQuotesDetails | null
    product: null | Product
    supplierResponse: SupplierResponse[] | null,
    refundOrderDetail:RefundOrderDetailResponseType | null
    orders: OrderInfo
}


 interface RefundOrderDetailResponseType{
    uuid: string,
    order_uuid: string,
    refundable_amount: number,
    order_amount_left: null | number
} 


export interface refundDetailsType {
    RefundProductDetails:RefundProduct[],
    RefundOrderDetails:RefundOrderDetailResponseType | null,
    OrderDetails:OrderInfo,
    src:string
}