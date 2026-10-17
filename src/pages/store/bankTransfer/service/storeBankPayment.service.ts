// import { ApiParamsType } from "components/table/types";
import { ApiParamsType } from "components/table/types"
import { axiosGet } from "../../../../axios/method"

export const bankTransferList = async ({
    store_info_uuid,
    apiParams,
}: {
    store_info_uuid: string
    apiParams: ApiParamsType
}) => {
    try {
        const response = await axiosGet("/bank-transfer-list", {
            store_info_uuid,
            apiParams,
        })
        return response
    } catch (err: any) {
        return err
    }
}

export const bankTransDetails = async ({
    store_info_uuid,
    orderId,
}: {
    store_info_uuid: string
    orderId: string | undefined
}) => {
    try {
        const response = await axiosGet("/store/bank-transfer-details", {
            store_info_uuid,
            orderId,
        })
        return response
    } catch (err: any) {
        return err
    }
}
