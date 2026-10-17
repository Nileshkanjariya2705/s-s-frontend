export interface DataProps {
    featured_image: string
    name_en: string
    category: string
    measurement: string
    status: string
}

export type CategoryDataType = {
    label: string
    value: string
}

export type ProductDataType = {
    category_uuid: string
    name_en: string
    name_ar: string
    name_ur: string
    overview_en: string
    overview_ar: string
    overview_ur: string
    description_en: string
    description_ar: string
    description_ur: string
    specification_en: string
    specification_ar: string
    specification_ur: string
    product_image: productImage
    featured_image: string
    status: string
    measurement_uuid: string
}

export type productImage =
    | {
          featured_image?: string
          image?: File[] | undefined
      }[]
    | undefined
export type productEditImage = {
    featured_image: string
    image: string
}[]
export type MeasurementDataType = {
    label: string
    value: string
}

export type searchFilterType = {
    productName: string | undefined
    categoryName: string | undefined
    status: string | undefined
}
