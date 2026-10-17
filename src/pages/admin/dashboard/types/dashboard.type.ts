export interface TransactionType {
    amount: number
    orders: {
        user: { username: string; image: string }
        storeInfo: { company_name: string }
    }
    created_at: string
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
}

export type adminDataType = {   
    vat_percentage: number
    replacement_days: number
    refundable_days: number
    default_ord_commission:number
    default_bank_commission:number
    created_at: Date
    updated_at:Date
}
