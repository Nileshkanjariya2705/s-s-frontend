import { ApiParamsType, ColumnProps } from "components/table/types"
import { perPage } from "constant/common.constant"
import { useEffect, useState } from "react"
import { Table } from "components/table/Table"
import { useNavigate } from "react-router-dom"
import useUserData from "hooks/getUserData"
import { FormattedMessage } from "react-intl"
import useDebounce from "hooks/useDebounce"
import { getOrders } from "./services/order.services"
import Loading from "components/globalLoader/Loading"
import { RefundOrderDetailsColumns } from "components/table/columns/refundOrderDetails.column"

const RefundOrderDetails = () => {
    const [orderData, setOrderData] = useState([])
    const [loading, setLoading] = useState<boolean>(false)
    const [apiParams, setApiParams] = useState<ApiParamsType>({
        limit: perPage,
        count: 0,
        page: 1,
        isAsc: true,
        sort: `uuid`,
        searchText: "",
        searchField: "company_name",
        extraParams: {
            refund_request: true,
        },
    })
    const { user_entity_uuid } = useUserData()
    const navigate = useNavigate()

    const debouncedHtmlContent = useDebounce(
        apiParams.searchText as string | number,
        500
    )

    const getOrderDetails = async () => {
        try {
            setLoading(true)
            const response = await getOrders(user_entity_uuid, apiParams)
            if (response?.data?.data?.orderDetail?.rows) {
                setApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: response?.data.data.orderDetail.count,
                    }
                })
            }
            if (response) {
                const uniqueOrders =
                    response?.data?.data?.orderDetail?.rows.reduce(
                        (unique: any, order: any) => {
                            const existingOrder = unique.find(
                                (item: any) => item.uuid === order.uuid
                            )

                            if (!existingOrder) {
                                unique.push(order)
                            }

                            return unique
                        },
                        []
                    )
                setOrderData(uniqueOrders)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            return error
        }
    }
    const columns: ColumnProps[] = RefundOrderDetailsColumns((uuid: string) =>
        navigate(`/refund-orders/view/${uuid}`)
    )
    useEffect(() => {
        getOrderDetails()
    }, [
        apiParams?.page,
        apiParams?.sort,
        apiParams?.isAsc,
        debouncedHtmlContent,
    ])

    return (
        <>
            {loading ? (
                <Loading className='!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            ) : (
                <div className='w-full xl:w-3/4 space-y-30px relative'>
                    <Table
                        header={
                            <>
                                <div className='flex gap-3 items-center'>
                                    <FormattedMessage id='Refund_Orders' />
                                </div>
                            </>
                        }
                        data={orderData}
                        columns={columns}
                        apiParams={apiParams}
                        setApiParams={setApiParams}
                        pagination={true}
                        search={false}
                        loading={loading}
                    />
                </div>
            )}
        </>
    )
}

export default RefundOrderDetails
