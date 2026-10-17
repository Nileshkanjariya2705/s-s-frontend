export type categoryType = categoryDetails[]

export type categoryDetails = {
    uuid: string
    name: string
    status: string
    image: string
}

export interface ParentProduct {
    uuid: string
    [key: string]:
        | string
        | undefined
        | number
        | { name: string }
        | {
              unit_name: string
          }
    category_uuid: string
    measurement_uuid: string
    featured_image: string
    category: {
        name: string
    }
    measurement: {
        unit_name: string
    }
}

export interface ProductDetailsPageType {
    price: string
    end_date: string
    units: number
    product: ParentProduct
    supplier_uuid: string
}

export interface PurchaseRequest {
    quantity: string | undefined
    requested_price: string | undefined
    sub_total: string | undefined
    request_expiry: string
    description: string
    supplier_product_uuid?: string
    store_uuid?: string
}

export interface PurchaseRequestApiType {
    quantity: string | undefined
    requested_price: string | undefined
    quotes_accepted_upto: string
    description: string | undefined
    supplier_product_uuid?: string
    store_uuid?: string
    store_info_uuid: string
    requester_uuid: string
    // purchase_request_mode: string;
}

export interface TimerState {
    days: string
    hours: string
    minutes: string
    seconds: string
}
export interface TimerStateNumeric {
    days: number
    hours: number
    minutes: number
    seconds: number
}

export type productDataType = {
    featured_image: string
    end_date: string
    price: string
    uuid: string
    supplier_uuid: string
    units: number
    [key: string]: string | number
}

export type CategoryData = {
    uuid: string
    category_en: string
    category_ar: string
    category_ur: string
    product_data: {
        name_en: string
        price: string
        units: number
        end_date: string
        supplier_uuid: string
        uuid: string
        featured_image: string
        unit_name: string
    }[]
}

export type categoryListType = {
    image: string
    name: string
    name_ar: string
    name_ur: string
    uuid: string
    name_en: string
}

export type productRatingType = {
    averageRating: string
    product_uuid: string
    supplier_info_uuid: string
}

export type ProductsRelatedCategoryType = {
    uuid: string
    product_uuid: string
    supplier_uuid: string
    supplier_info_uuid: string
    price: string
    base_price: string
    units: number
    is_purchaseable: boolean
    end_date: string
    created_at: string
    updated_at: string
    deleted_at: string
    product: {
        name_en: string
        uuid: string
        name_ar: string
        name_ur: string
        featured_image: string
        measurement: {
            unit_name: string
            unit_name_ar: string
            unit_name_ur: string
        }
    }
}

interface ProductData {
    name_en: string
    price: string
    units: number
    end_date: string
    supplier_uuid: string
    featured_image: string
    unit_name: string
    product_uuid: string
}

export type ProductDataStateType = Record<string, ProductCategory>

interface ProductCategory {
    name: string
    product_data: ProductData[]
}

export interface ProductDetailType {
    uuid: string
    product_uuid: string
    supplier_uuid: string
    supplier_info_uuid: string
    price: string
    base_price: string
    units: number
    is_purchaseable: boolean
    end_date: string
    created_at: string
    updated_at: string
    deleted_at: string
    charges: string
    product: productParentType
}

export type Language = "en" | "ur" | "ar"

export interface productParentType {
    uuid: string
    name_en: string
    name_ar: string
    name_ur: string
    overview_en: string
    overview_ur: string
    overview_ar: string
    description_en: string
    description_ar: string
    description_ur: string
    specification_en: string
    specification_ar: string
    specification_ur: string
    category_uuid: string
    measurement_uuid: string
    images: string
    featured_image: string
    status: string
    created_at: string
    updated_at: string
    deleted_at: string
    measurement: MeasurementType
}

export interface MeasurementType {
    uuid: string
    unit_name: string
    unit_short_name: string
    unit_short_name_ar: string
    unit_short_name_ur: string
    status: string
    created_at: string
    updated_at: string
    deleted_at: string
}

export interface ProductCategoryData {
    category_ar: string
    category_ur: string
    category_en: string
    product_uuid: string
    supplier_uuid: string
    uuid: string
    name: string
    product_data: []
}

export interface ProductDataType {
    featured_image: string
    end_date: string
    units: string
    price: string
    product_uuid: string
    supplier_uuid: string
    unit_name_en: string
    unit_name_ar: string
    unit_name_ur: string
    name_en: string
    name_ar: string
    name_ur: string
    supplierProdId: string
    supplier_info_uuid: string
}

export interface RatingTypes {
    items: number[]
    review?: string
}
