export interface DataProps {
    username: string
    email: string
    company_name: string
    cr_number: string
    tax_number?: string | null
    uuid: string | undefined
}
export type supplierEditType = {
    uuid: string | undefined
    username: string
    email: string
    profile_image: File[] | string | undefined | null
    company_name: string
    phone: string | undefined | null
    cr_number: string
    tax_number?: string | null
    iban_number: string
    is_active: string
    ord_commission: string
    bank_commission: string
}
export type supplierAddressType = {
    uuid: string
    user_uuid: string
    address: string
    city: string
    country: string
    state: string
    postal_code: number
    phone: number
    is_default: boolean
}
