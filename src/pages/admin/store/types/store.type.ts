import { ApiParamsType } from "components/table/types"

export interface DataProps {
    username: string
    email: string
    company_name: string
    cr_number: string
    tax_number?: string | null
}

export type StoreDataType = {
    uuid: string | undefined
    email: string
    company_name: string
    cr_number: string
    phone: string | undefined | null
    image: File[] | string | undefined | null
    tax_number?: string | null
    username: string
    iban_number: string
    is_active: string
}

export type getStoreInfoType = {
    type: string
    apiParams: ApiParamsType
}
export type AddressInfo = {
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
export type searchFilterType = {
    name: string | undefined
    email: string | undefined
    company_name: string | undefined
    status: string | undefined
}
