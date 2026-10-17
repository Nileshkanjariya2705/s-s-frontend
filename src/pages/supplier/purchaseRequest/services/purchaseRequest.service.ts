import { AxiosError } from "axios"
import { axiosDelete, axiosGet, axiosPost } from "../../../../axios/method"
// import { SupplierPurchaseRequestQuote } from "../types/purchaseRequest.type";
import { ApiParamsType } from "components/table/types"

export const createSupplierProductQuotes = async (data: any) => {
    try {
        const response = await axiosPost(
            "/supplier-product-quotes/create",
            data
        )
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const updateSupplierProductQuotes = async (data: any) => {
    try {
        const response = await axiosPost(
            "/supplier-product-quotes/update",
            data
        )
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const getAllPurchaseRequests = async (
    apiParams: ApiParamsType,
    selectedTab: string,
    supplier_uuid: string,
    user_entity_uuid: string
) => {
    try {
        const response = await axiosGet("/supplier/purchase-request", {
            apiParams,
            selectedTab,
            supplier_uuid,
            entity_uuid: user_entity_uuid,
        })
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const getSinglePurchaseRequest = async (
    requestId: string,
    supplier_uuid: string
    // user_entity_uuid: string,
    // selectedTab: string
) => {
    try {
        const response = await axiosGet(
            `/purchase-request/get-single-request/${requestId}`,
            {
                supplier_uuid,
                // entity_uuid: user_entity_uuid,
                // selectedTab: selectedTab,
            }
        )
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
export const deleteSupplierProductRequest = async (requestId: string) => {
    try {
        const response = await axiosDelete(
            `/product-purchase-request/delete-request/${requestId}`
        )
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const getCategoryWiseProducts = async (
    category_uuid: string,
    purchase_request_product_uuid: string,
    language: string
) => {
    try {
        const response = await axiosGet(
            `/supplier-product-quotes/getProducts`,
            {
                category_uuid,
                purchase_request_product_uuid,
                language,
            }
        )
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}

export const updateOtherBrandProduct = async (data: any) => {
    try {
        const response = await axiosPost(
            "/supplier-product-quotes/updateOtherBrandProduct",
            data
        )
        return response
    } catch (err: unknown) {
        return (err as AxiosError).response
    }
}
