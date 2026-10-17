import { Table } from "components/table/Table"
import { ApiParamsType } from "components/table/types"
import { perPage } from "constant/common.constant"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllPurchaseHistory } from "./services/purchaseHistory.service"
import useUserData from "hooks/getUserData"
import { purchaseHistoryType } from "./types/purchaseHistory.type"
import { FormattedMessage } from "react-intl"
import useDebounce from "hooks/useDebounce"
import { OrderRefundColumns } from "components/table/columns/orderRefund.column"

const RefundOrders = () => {
    const navigate = useNavigate()
    const [purchaseHistory, setPurchaseHistory] = useState<
        purchaseHistoryType[]
    >([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [tab] = useState("SUCCESS")

    const [apiParams, setApiParams] = useState<ApiParamsType>({
        limit: perPage,
        count: 0,
        page: 1,
        isAsc: true,
        sort: `uuid`,
        searchText: "",
        extraParams: {
            refund_request: true,
        },
    })

    const debounceSearch = useDebounce(
        apiParams.searchText as string | number,
        500
    )

    const { user_entity_uuid } = useUserData()

    const getAllPurchaseHistoryDetail = async () => {
        try {
            !debounceSearch && setIsLoading(true)
            const res = await getAllPurchaseHistory({
                user_entity_uuid,
                apiParams,
                tab,
            })
            if (res) {
                setApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: res?.data?.data?.purchaseHistory.count,
                    }
                })
            }
            setPurchaseHistory(res?.data?.data?.purchaseHistory.rows)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }
    const columns = OrderRefundColumns((uuid: string) =>
        navigate(`/refund-orders/${uuid}`)
    )

    const debouncedHtmlContent = useDebounce(
        apiParams.searchText as string | number,
        500
    )

    useEffect(() => {
        getAllPurchaseHistoryDetail()
    }, [apiParams.page, apiParams.sort, debouncedHtmlContent, apiParams.isAsc])

    return (
        <>
            <div className='w-full xl:w-3/4 space-y-30px relative'>
                <div>
                    <Table
                        header={
                            <>
                                <div className='flex gap-3 items-center'>
                                    <FormattedMessage id='Refund_Orders' />
                                </div>
                            </>
                        }
                        columns={columns}
                        pagination={true}
                        data={purchaseHistory}
                        apiParams={apiParams}
                        setApiParams={setApiParams}
                        search={false}
                        loading={isLoading}
                    />
                </div>
            </div>
        </>
    )
}

export default RefundOrders
