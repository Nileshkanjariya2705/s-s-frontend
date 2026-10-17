import useOwnerData from "hooks/getOwnerData"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getSuppDashDetail } from "./services/dashboard.service"
import useUserData from "hooks/getUserData"
import { getOrders } from "../order/services/order.services"
import { ApiParamsType, ColumnProps } from "components/table/types"
import { getAllPurchaseRequests } from "../purchaseRequest/services/purchaseRequest.service"
import { Table } from "components/table/Table"
import { OrderDetailsColumns } from "components/table/columns/orderDetails.column"
import { openPurchaseRequestColumns } from "components/table/columns/SupplierPurchaseRequest.columns"
import { openPurchaseRequest } from "../purchaseRequest/types/purchaseRequest.type"
import { DashboardType } from "./types/dashboard.type"
import Loading from "components/globalLoader/Loading"
import { FormattedMessage } from "react-intl"
import Tooltip from "components/tooltip/tooltip"
import useLocale from "hooks/useLocale"

const Dashboard = () => {
  const { language } = useLocale();
    const { uuid } = useUserData()
    const { user_entity_uuid, given_permissions } = useUserData()
    const [orderData, setOrderData] = useState([])
    const [suppDashData, setSuppDashData] = useState<DashboardType>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [openPurchaseRequest, setOpenPurchaseRequest] = useState<
        openPurchaseRequest[]
    >([])
    const { is_verified } = useOwnerData()
    const navigate = useNavigate()
    let showOrders: boolean | undefined
    let ShowPurchaseRequest: boolean | undefined
    const filterViewPermission =
        given_permissions &&
        given_permissions.filter((data) => data?.granted === true)
    if (
        filterViewPermission.find(
            (data) => data?.granted === true && data?.name === "View Orders"
        )?.granted as boolean | undefined
    ) {
        showOrders = true
    }
    if (
        filterViewPermission.find(
            (data) =>
                data?.granted === true && data?.name === "Manage Products Req."
        )?.granted as boolean | undefined
    ) {
        ShowPurchaseRequest = true
    }
    useEffect(() => {
        if (!is_verified) {
            // setShowModal(true);
        }
    }, [is_verified])

    const [apiParams, setApiParams] = useState<ApiParamsType>({
        limit: 5,
        count: 0,
        page: 1,
        isAsc: true,
        sort: `uuid`,
        searchText: "",
        searchField: "",
    })

    const [orderApiParams, setOrderApiParams] = useState<ApiParamsType>({
        limit: 5,
        count: 0,
        page: 1,
        isAsc: true,
        sort: ``,
    })
    const getPurchaseRequestDetails = async () => {
        if (!uuid || !user_entity_uuid) return;
        try {
            const resp = await getSuppDashDetail(uuid, user_entity_uuid)
            setSuppDashData(resp?.data?.data)

            const orders = await getOrders(user_entity_uuid, orderApiParams)
            if (orders?.data?.data?.orderDetail?.rows) {
                setOrderApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: orders?.data?.data?.orderDetail?.count,
                    }
                })
            }
            setOrderData(orders?.data?.data?.orderDetail?.rows)
            const response = await getAllPurchaseRequests(
                apiParams,
                "NEW",
                uuid,
                user_entity_uuid
            )
            if (response?.data?.data) {
                setApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: response?.data?.data?.result?.count,
                    }
                })
            }
            setOpenPurchaseRequest(response?.data?.data.result.rows)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getPurchaseRequestDetails()
    }, [
        uuid,
        user_entity_uuid,
        apiParams.limit,
        orderApiParams.limit,
        orderApiParams.isAsc,
        orderApiParams.sort,
        apiParams.isAsc,
        apiParams.sort,
    ])

    const columns: ColumnProps[] = OrderDetailsColumns((order_id: string) =>
        navigate(`/orders/view/${order_id}`)
    )
    const opencolumns: ColumnProps[] = openPurchaseRequestColumns(
        (request_uuid: string) => {
            navigate(`/purchase-request/view/open/${request_uuid}`)
        },
        language
    )
    const totalEarning = Number(suppDashData?.totalEarning).toFixed(2)
    const formattedTotalEarning =
        Number(totalEarning) > 999999.99
            ? totalEarning.substring(0, 6) + "..."
            : totalEarning
    return (
        <>
            {isLoading ? (
                <Loading className='!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            ) : (
                <div className='w-full xl:w-3/4 border border-black/10 rounded-14px space-y-8 p-20px md:p-30px relative'>
                    <>
                        <div className='flex flex-wrap md:flex-nowrap space-y-3 md:space-y-0 md:space-x-3 lg:space-x-5 rtl:space-x-reverse  items-start'>
                            <span className='w-full md:w-1/3 rounded-xl  border border-black/10 overflow-hidden '>
                                <div className='p-4 lg:px-26px lg:py-6 flex items-center justify-between text-primarycolor'>
                                    <Tooltip
                                        tooltip={
                                            Number(
                                                totalEarning
                                            ).toLocaleString() +
                                            " " +
                                            "SAR"
                                        }

                                    >
                                        <h4 className='text-35px lg:text-42px w-1/2 font-semibold '>
                                            {formattedTotalEarning}
                                        </h4>
                                    </Tooltip>
                                    <i className='icon-dollar text-45px lg:text-60px'></i>
                                </div>
                                <div className='bg-primarycolor/10 px-4 py-2.5 xxl:px-7 xxl:py-3'>
                                    <p className='text-sm lg:text-base font-normal text-secodarycolor'>
                                        <FormattedMessage id='total_earning' />
                                    </p>
                                </div>
                            </span>
                            <div
                                className='w-full md:w-1/3 rounded-xl  border border-black/10 overflow-hidden cursor-pointer'
                                onClick={() => navigate("/products")}
                            >
                                <div className='p-4 lg:px-26px lg:py-6 flex items-center justify-between text-primarycolor'>
                                    <h4 className='text-35px lg:text-42px font-semibold '>
                                        {suppDashData?.totalPrd}
                                    </h4>
                                    <i className='icon-orders text-45px lg:text-60px'></i>
                                </div>
                                <div className='bg-primarycolor/10 px-4 py-2.5 xxl:px-7 xxl:py-3'>
                                    <p className='text-sm lg:text-base font-normal text-secodarycolor'>
                                        <FormattedMessage id='total_product' />
                                    </p>
                                </div>
                            </div>
                            <div
                                className='w-full md:w-1/3 rounded-xl  border border-black/10 overflow-hidden cursor-pointer'
                                onClick={() => navigate("/purchase-request")}
                            >
                                <div className='p-4 lg:px-26px lg:py-6 flex items-center justify-between text-primarycolor '>
                                    <h4 className='text-35px lg:text-42px font-semibold '>
                                        {suppDashData?.totalQuotes}
                                    </h4>
                                    <i className='icon-purches-request text-45px lg:text-60px'></i>
                                </div>
                                <div className='bg-primarycolor/10 px-4 py-2.5 xxl:px-7 xxl:py-3'>
                                    <p className='text-sm lg:text-base font-normal text-secodarycolor'>
                                        <FormattedMessage id='Total_Sent_Quotes' />
                                    </p>
                                </div>
                            </div>
                        </div>
                        {showOrders === true && (
                            <div className='block'>
                                <Table
                                    header={
                                        <FormattedMessage id='Recent_Orders' />
                                    }
                                    data={orderData}
                                    columns={columns}
                                    apiParams={orderApiParams}
                                    setApiParams={setOrderApiParams}
                                    pagination={false}
                                    search={false}
                                    seeMore='/orders'
                                />
                            </div>
                        )}
                        {ShowPurchaseRequest === true && (
                            <div className='block'>
                                <Table
                                    header={
                                        <FormattedMessage id='Purchase_Requests' />
                                    }
                                    data={openPurchaseRequest}
                                    columns={opencolumns}
                                    apiParams={apiParams}
                                    setApiParams={setApiParams}
                                    pagination={false}
                                    search={false}
                                    seeMore='/purchase-request'
                                />
                            </div>
                        )}
                    </>
                </div>
            )}
        </>
    )
}

export default Dashboard
