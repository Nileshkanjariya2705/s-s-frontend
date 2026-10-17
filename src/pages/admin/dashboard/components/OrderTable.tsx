import { useEffect, useState } from "react"
import { AdminOrderFinalTypes } from "../types/dashboard.type"
import { ApiParamsType, ColumnProps } from "components/table/types"
import { getOrderInfo } from "pages/admin/orders/services/order.service"
import { Table } from "components/table/Table"
import { FormattedMessage } from "react-intl"
import { RecetOrderDetailColumns } from "components/table/columns/recentOrderDetail.colums"
import { useNavigate } from "react-router-dom"

export const OrderDetails = () => {
    const [orderLoading, setOrderLoading] = useState<boolean>(true)
    const [orderData, setOrderData] = useState<AdminOrderFinalTypes[]>([])
    const [orderApiParams, setOrderApiParams] = useState<ApiParamsType>({
        limit: 5,
        count: 0,
        page: 1,
        isAsc: true,
    })
    const navigate = useNavigate()

    const getAllOrder = async () => {
        try {
            setOrderLoading(true)
            const getOrders = await getOrderInfo(orderApiParams)
            if (getOrders?.data?.data?.OrderDetail) {
                setOrderApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: getOrders?.data?.data?.orderDetail?.count,
                    }
                })
            }
            setOrderData(getOrders?.data?.data?.orderDetail?.rows)
            setOrderLoading(false)
        } catch (error) {
            setOrderLoading(false)
        }
    }

    useEffect(() => {
        getAllOrder()
    }, [orderApiParams.limit])

    const orderColumns: ColumnProps[] = RecetOrderDetailColumns(
        ({ uuid }: { uuid: string }) => {
            navigate(`/admin/orders/view-order/${uuid}`)
        }
    )

    return (
        <>
            {!orderLoading && (
                <Table
                    header={<FormattedMessage id='Recent_Orders' />}
                    data={orderData}
                    columns={orderColumns}
                    apiParams={orderApiParams}
                    setApiParams={setOrderApiParams}
                    pagination={false}
                    search={false}
                    seeMore='/admin/orders'
                />
            )}
        </>
    )
}
