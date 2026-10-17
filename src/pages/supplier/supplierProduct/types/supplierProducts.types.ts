export interface SupplierProductType {
    sr_no?: string
    category: string
    product: string
    price: string
    time: string
}

export type SupplierAddProduct = {
    end_date: string
    price: string | undefined
    category: string
    product: string
    overview_en: string | undefined
    units: string | undefined
    base_price: string | undefined
    status: string | undefined
    specification_en: string | undefined
    description_en: string | undefined
    is_purchaseable: string | undefined
    measurement: string | undefined
    uuid?: string
    product_images: { image?: File[] }[] | undefined | []
    charges: string | undefined
}

export type CategoryType = {
    value: string
    label: string
}
export type ProductType = {
    value: string
    label: string
}
export type productImage =
    | {
          image: File[] | undefined
      }[]
    | undefined

export type NewCategoryType = {
    label: string
    value: string
}
export type searchFilterType = {
    category_name: string | undefined
    product_name: string | undefined
    offered_price: string | undefined
    status: string | undefined
    created_date: string[] | undefined
}
