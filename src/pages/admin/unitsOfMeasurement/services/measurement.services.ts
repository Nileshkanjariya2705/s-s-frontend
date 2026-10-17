import { ApiParamsType } from "components/table/types"
import { axiosDelete, axiosGet, axiosPost } from "../../../../axios/method"

import { MeasurementType } from "../types/measurement.types"

export const addUnit = async (data: MeasurementType) => {
    try {
        const response = await axiosPost("/measurement/add", data)
        return response
    } catch (err: any) {
        return err
    }
}

export const getAllUnits = async (apiParams: ApiParamsType) => {
    try {
        const response: any = await axiosGet("/measurement/getAll", apiParams)
        return response
    } catch (err) {
        return err
    }
}

export const getSingleUnit = async (uuid: string) => {
    try {
        const response = await axiosPost("/measurement/get", {
            uuid,
        })
        return response
    } catch (err: any) {
        return err
    }
}

export const updateUnit = async (data: MeasurementType) => {
    try {
        const response = await axiosPost("/measurement/edit", {
            data,
        })
        return response
    } catch (err: any) {
        return err
    }
}
export const deleteUnit = async (uuid: string) => {
    try {
        const response = await axiosDelete(`/measurement/delete/${uuid}`)
        return response
    } catch (err: any) {
        return err
    }
}
