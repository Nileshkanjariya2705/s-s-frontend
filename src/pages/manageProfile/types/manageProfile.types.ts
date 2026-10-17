export interface makeAddressDefaultData {
    address_uuid: string
}

export interface updateProfileData {
    username: string
    email: string
    company_name: string
    cr_number: string
    tax_number: string | null | undefined
    iban_number: string
    phone: string
    photo: File[] | string | undefined | null
}

export interface CountryInfo {
    name: string
    isoCode: string
    flag: string
    phonecode: string
    currency: string
    latitude: string
    longitude: string
    timezones: Timezone[]
}
export interface CountryInfoDropdownData {
    label: string
    value: string
}
export interface StateInfoDropdownData {
    label: string
    value: string
}
export interface CityInfoDropdownData {
    label: string
    value: string
}
export interface CountryInfoDropdownData {
    label: string
    value: string
}
export interface StateInfoDropdownData {
    label: string
    value: string
}
export interface CityInfoDropdownData {
    label: string
    value: string
}

export interface Timezone {
    zoneName: string
    gmtOffset: number
    gmtOffsetName: string
    abbreviation: string
    tzName: string
}

export interface StateInfo {
    name: string
    isoCode: string
    countryCode: string
    latitude: string
    longitude: string
}

export interface CityInfo {
    name: string
    stateCode: string
    countryCode: string
    latitude: string
    longitude: string
}

export type AddressInfo = {
    address: string
    country: string
    state: string
    city: string
    postal_code: string
    is_default: boolean | undefined
    uuid: string | undefined
    user_uuid: string | undefined
    phone: string
    default?: boolean
}
