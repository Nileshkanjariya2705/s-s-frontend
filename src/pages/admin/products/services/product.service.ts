import { axiosDelete, axiosGet, axiosPost } from "../../../../axios/method"
import { ApiParamsType } from "components/table/types"

export const getAllCategory = async (language?: string) => {
    try {
        const response = await axiosGet("/product/getCategories", { language })
        return response
    } catch (err: any) {
        return err
    }
}

export const getActiveCategory = async (category_uuid: string) => {
    try {
        const response = await axiosGet("/product/getCategories", {
            category_uuid,
        })
        return response
    } catch (err: any) {
        return err
    }
}

export const getAllMeasurements = async (language:string) => {
  try {
    const response = await axiosGet("/product/get-measurements",{language});
    return response;
  } catch (err: any) {
    return err;
  }
};
export const getActiveMeasurements = async (measurement_uuid: string) => {
    try {
        const response = await axiosGet("/product/get-measurements", {
            measurement_uuid,
        })
        return response
    } catch (err: any) {
        return err
    }
}

export const fetchAllProducts = async (apiParams: ApiParamsType) => {
    try {
        const response = await axiosGet("/product", apiParams)
        return response
    } catch (err: any) {
        return err
    }
}

export const addProducts = async (formData: FormData) => {
    try {
        const response = await axiosPost("/product/create-product", formData)
        return response
    } catch (err: any) {
        return err
    }
}

export const deleteProduct = async (id: string) => {
    try {
        const response = await axiosDelete(`/product/delete-product/${id}`)
        return response
    } catch (err: any) {
        return err
    }
}

export const getSingleProduct = async (id: string) => {
    try {
        const response = await axiosGet(`/product/single-product/${id}`)
        return response
    } catch (err: any) {
        return err
    }
}

export const editProducts = async (formData: FormData) => {
    try {
        const response = await axiosPost(`/product/update-product`, formData)
        return response
    } catch (err: any) {
        return err
    }
}
