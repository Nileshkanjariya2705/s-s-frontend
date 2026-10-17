import { ApiParamsType } from "components/table/types"
import { axiosDelete, axiosGet, axiosPost } from "../../../../axios/method"
import { SupplierAddProduct } from "../types/supplierProducts.types"

export const getAllCategory = async (language: string) => {
    try {
        const response = await axiosGet("/supplier-product/getCategory", {
            language,
        })
        return response
    } catch (err: any) {
        return err
    }
}

export const getActiveCategory = async (
    category_uuid: string,
    language: string
) => {
    try {
        const response = await axiosGet("/supplier-product/getCategory", {
            category_uuid,
            language,
        })
        return response
    } catch (err: any) {
        return err
    }
}
export const getAllProduct = async (language: string) => {
    try {
        const response = await axiosGet("/supplier-product/getProducts", {
            language,
        })
        return response
    } catch (err: any) {
        return err
    }
}
export const getAllSuppProducts = async (
    apiParams: ApiParamsType,
    user_entity_uuid: string,
    language?: string
) => {
    try {
        const response = await axiosGet("/supplier-product/getSuppProducts", {
            apiParams,
            user_entity_uuid,
            language,
        })
        return response
    } catch (err: any) {
        return err
    }
}

export const getCategoryWiseProductEdit = async (
    categoryId: string,
    product_uuid: string,
    language: string
) => {
    try {
        const response = await axiosGet(
            `/supplier-product/catWisePro/${categoryId}`,
            {
                product_uuid,
                language,
            }
        )
        return response
    } catch (err: any) {
        return err
    }
}
export const getCategoryWiseProductAdd = async (
    categoryId: string,
    language?: string
) => {
    try {
        const response = await axiosGet(
            `/supplier-product/catWisePro/${categoryId}`,
            { language }
        )
        return response
    } catch (err: any) {
        return err
    }
}

export const getProductWiseData = async (productId: string) => {
    try {
        const response = await axiosGet(
            `/supplier-product/getSingleProduct/${productId}`
        )
        return response
    } catch (err: any) {
        return err
    }
}

export const supplierAddProduct = async (data: SupplierAddProduct) => {
    try {
        const response = await axiosPost("/supplier-product/add", data)
        return response
    } catch (err: any) {
        return err
    }
}

export const supplierEditProduct = async (values: SupplierAddProduct) => {
    try {
        const response = await axiosPost("/supplier-product/edit", values)
        return response
    } catch (err: any) {
        return err
    }
}

export const supplierDeleteProduct = async (uuid: string) => {
    try {
        const response = await axiosDelete(`/supplier-product/delete/${uuid}`)
        return response
    } catch (err: any) {
        return err
    }
}

export const getSingleSupplierProduct = async (uuid: string) => {
    try {
        const response = await axiosPost("/supplier-product/get", {
            uuid,
        })
        return response
    } catch (err: any) {
        return err
    }
}
