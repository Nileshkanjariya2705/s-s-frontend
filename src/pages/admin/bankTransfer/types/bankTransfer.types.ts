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
    count: number
    TotalAmount: number
    AmountRecived_MADA: number
    AmountRecived_VISA: number
    AmountRecived_MASTERCARD: number
}
export type TabType = "MADA" | "VISA" | "MASTERCARD"

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
            uuid: string
            purchase_request_id: string
            payment_receipt: string
            status: string
            created_at: string
            address: {
                address: string
                city: string
                state: string
                country: string
                uuid?: string
                user_uuid?: string
                postal_code: string
            }
            storeInfo: {
                uuid?: string
                company_name: string
                cr_number: string
                tax_number: string
            }
            supplierInfo: {
                uuid?: string
                company_name: string
                cr_number: string
                tax_number: string
            }
        }
    }
}


export type bankTransferFilter = {
    order_uuid: string | undefined;
    order_date: string [] | undefined;
    amount: string | undefined;
    supplier_company: string | undefined;
    store_company: string | undefined;
}