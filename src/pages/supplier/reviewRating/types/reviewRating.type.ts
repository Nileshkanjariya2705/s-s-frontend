export interface productInfo {
    [key: string]: string
    name_en: string
    name_ur: string
    name_ar: string
}
export type singleReviewType = {
    product_info: productInfo
    rating: number
    reviews: string
    store_info: {
        company_name: string
    }
    store_info_uuid: string
    uuid: string
}[]
