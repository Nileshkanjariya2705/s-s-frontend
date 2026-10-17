import { Button } from "components/button/Button"
import CountdownTimer from "components/countDown/CountdownTimer"
import Loading from "components/globalLoader/Loading"
import { DeleteModal } from "components/model/DeleteModal"
import { Modal } from "components/model/Model"
import { NoData } from "components/noDataFound/NoDataFound"
import { PurchaseRequestDetailColumn } from "components/table/columns/purchaseRequestDetail.columns"
import { Table } from "components/table/Table"
import { ApiParamsType } from "components/table/types"
import { perPage, purchaseReuestStatus, responseType, toastType } from "constant/common.constant"
import { showToast } from "helper/toast.helper"
import moment from "moment"
import { QuoteTabType } from "pages/supplier/purchaseRequest/types/purchaseRequest.type"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { RootState } from "store"
import {
    checkoutOrderCreate,
    closePurchaseRequest,
    deletePurchaseReqQuote,
    purchaseRequestData,
    purchaseRequestView,
} from "../services/purchaseRequest.services"
import {
    checkOutDataType,
    purchaseRequestType,
    requestData,
    supplierProductQuotesType,
} from "../types/purchaseRequest.types"
import useUserData from "hooks/getUserData"
import { FormattedMessage, useIntl } from "react-intl"
import { PageNotFound } from "components/pageNotFound/PageNotFound"
type viewState = {
    [supplier_info_uuid: string]: {
        isOpen: boolean
        supplier_product_quotes: supplierProductQuotesType[]
    }
}
function StorePurchaseReqView() {
    const { purchaseReqId } = useParams()
    const navigate = useNavigate()
    const [purchaseReqView, setPurchaseReqView] = useState<
        purchaseRequestType[]
    >([])

    const { uuid } = useSelector((state: RootState) => ({
        uuid: state.account.uuid,
    }))
    const [purchaseReqData, setPurchaseReqData] = useState<requestData>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showCheckOutModal, setShowCheckOutModal] = useState<boolean>(false)
    const [selectedTab, setSelectedTab] = useState<QuoteTabType>("ACTIVE")
    const [tab, setTab] = useState<number>(0)

    const [closeButtonLoader, setCloseButtonLoader] = useState<boolean>(false)
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const [supplierId, setSupplierId] = useState<string>("")
    const [checkOutData, setCheckOutData] = useState<checkOutDataType>({
        supplier_info_uuid: "",
    })
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false)

    const { socket } = useSelector((state: RootState) => ({
        socket: state.socket.socket,
    }))

    const [allSupplierDropdown, setAllSupplierDropdown] = useState<viewState>(
        {}
    )

    const [apiParams, setApiParams] = useState<ApiParamsType>({
        limit: perPage,
        count: 0,
        page: 1,
    })

    const [showCloseModal, setShowCloseModal] = useState<boolean>(false)
    const [showCloseButtonMessage, setShowCloseButtonMessage] = useState(false)
    const [deleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [deleteId, setDeleteId] = useState<string>()
    const { given_permissions } = useUserData()
    const columns = PurchaseRequestDetailColumn(
        ({ supplier_info_uuid }) => {
            setShowCheckOutModal(true)
            setCheckOutData({
                supplier_info_uuid: supplier_info_uuid,
            })
        },
        (supplier_info_uuid) => onPurchaseReqDelete(supplier_info_uuid),
        (supplier_info_uuid) => showToggle(supplier_info_uuid),
        given_permissions
    )

    const onPurchaseReqDelete = (supplier_info_uuid: string) => {
        setShowDeleteModal(true)
        setDeleteId(supplier_info_uuid)
    }

    const intl = useIntl()
    async function PurchaseReqDelete(supplier_info_uuid: string) {
        setDeleteLoader(true)
        const resp = await deletePurchaseReqQuote(
            purchaseReqId as string,
            supplier_info_uuid,
            selectedTab,
            uuid
        )

        getPurchaseRequestView()
        if (resp?.data.responseType === responseType.Failed) {
            showToast(resp.data.message, toastType.Error, intl)
        } else {
            showToast(resp?.data.message, toastType.Success, intl)
        }
        setShowDeleteModal(false)
        setDeleteLoader(false)
    }

    const showToggle = useCallback((supplier_info_uuid: string) => {
        setAllSupplierDropdown((prevState) => {
            const newState = { ...prevState }
            if (prevState[supplier_info_uuid].isOpen) {
                newState[supplier_info_uuid].isOpen = false
            } else {
                newState[supplier_info_uuid].isOpen = true
            }
            return newState
        })
        setSupplierId(supplier_info_uuid)
    }, [])

    const getPurchaseRequestView = async () => {
        setIsLoading(true)
        const purchaseRequestBySuppliers = await purchaseRequestData(
            purchaseReqId as string
        )
        const purchaseRequestSuppliersDetails = await purchaseRequestView(
            apiParams,
            purchaseReqId as string,
            selectedTab
        )
        setPurchaseReqData(purchaseRequestBySuppliers.data.data)

        setIsLoading(false)
        if (purchaseRequestSuppliersDetails) {
            setApiParams((params) => {
                return {
                    ...params,
                    count: purchaseRequestSuppliersDetails?.data?.data?.count,
                }
            })
        }

        setPurchaseReqView(purchaseRequestSuppliersDetails?.data?.data?.data)
        const supplierIdsObj =
            purchaseRequestSuppliersDetails?.data?.data?.data?.map(
                (item: purchaseRequestType) => {
                    return {
                        [item.supplier_info_uuid]: {
                            isOpen: false,
                            supplier_product_quotes:
                                item.supplier_product_quotes,
                        },
                    }
                }
            )
        if (supplierIdsObj) {
            setAllSupplierDropdown(Object.assign({}, ...supplierIdsObj))
        }
    }

    useEffect(() => {
        getPurchaseRequestView()
    }, [selectedTab, apiParams.page])
    const handleCheckOut = async () => {
        try {
            setShowCheckOutModal(true)
            setButtonLoader(true)
            const encodedId1 = btoa(purchaseReqId as string)
            const encodedId2 = btoa(checkOutData.supplier_info_uuid as string)

            const mergeId = `${encodedId1}|${encodedId2}`

            await checkoutOrderCreate(
                uuid,
                purchaseReqId as string,
                checkOutData.supplier_info_uuid
            )

            navigate(`/checkout-process/${mergeId}`)

            socket?.emit("create-notification", {
                message: `New Order Recieved`,
            })

            setShowCheckOutModal(false)
            setButtonLoader(false)
        } catch (err) {}
    }

    const handleTabChange = (tab: number) => {
        if (tab === 0) {
            setTab(tab)
            setSelectedTab("ACTIVE")
        } else {
            setTab(tab)
            setSelectedTab("REJECTED")
        }
    }

    const closeRequest = async () => {
        setCloseButtonLoader(true)
        const response = await closePurchaseRequest(purchaseReqId as string)
        if (response?.data?.responseType === responseType.Failed) {
            showToast(response.data.message, toastType.Error, intl)
        } else {
            showToast(response?.data?.message, toastType.Success, intl)
        }
        setShowCloseModal(false)
        getPurchaseRequestView()
        setCloseButtonLoader(false)
    }

    return (
        <>
            <div className='w-full'>
                {isLoading ? (
                    <Loading className='!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                ) : (
                    <>
                        {purchaseReqData ? (
                            <>
                                {purchaseReqView ||
                                selectedTab === "ACTIVE" ||
                                selectedTab === "REJECTED" ? (
                                    <>
                                        <div className='w-full border border-black/10 rounded-xl p-5 '>
                                            <div className='flex items-center justify-between flex-wrap gap-y-4'>
                                                <div className='relative flex items-center gap-3'>
                                                    <div className='w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center'>
                                                        <i
                                                            className='icon-left_arrow text-24px text-primarycolor hover:cursor-pointer'
                                                            onClick={() =>
                                                                navigate(
                                                                    "/purchase-request"
                                                                )
                                                            }
                                                        ></i>
                                                    </div>
                                                    <h2 className='font-semibold text-xl md:text-2xl'>
                                                        {
                                                            <FormattedMessage id='Purchase_Requests' />
                                                        }{" "}
                                                        - #{" "}
                                                        {purchaseReqId?.slice(
                                                            0,
                                                            8
                                                        )}
                                                    </h2>
                                                </div>
                                                <div className='relative'>
                                                    {purchaseReqData?.quotes_accepted_upto &&
                                                        purchaseReqData?.status !==
                                                            "COMPLETED" && (
                                                            <CountdownTimer
                                                                endDate={
                                                                    purchaseReqData?.quotes_accepted_upto
                                                                }
                                                            />
                                                        )}
                                                </div>
                                            </div>
                                            <hr className='border-black/10 my-5' />
                                            <h3 className='font-semibold text-lg '>
                                                {
                                                    <FormattedMessage id='Request_Summary' />
                                                }
                                            </h3>
                                            <div className='flex flex-wrap mt-4 mb-3 -mx-4'>
                                                <div className='relative w-full md:w-1/2  px-4 border-b-2 md:border-b-0 pb-5 md:pb-0 md:border-r-2 border-black/10 md:rtl:border-l-2 md:rtl:border-r-0'>
                                                    <ul className='space-y-2 lg:space-y-4 w-full md:w-11/12'>
                                                        <li className='w-full flex flex-wrap space-y-2 lg:space-y-0'>
                                                            <span className='text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between'>
                                                                {
                                                                    <FormattedMessage id='Requested_Date' />
                                                                }{" "}
                                                                <span className='hidden lg:inline-block'>
                                                                    :
                                                                </span>
                                                            </span>
                                                            <span className='text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5'>
                                                                {purchaseReqData?.created_at &&
                                                                    moment(
                                                                        purchaseReqData?.created_at
                                                                    ).format(
                                                                        "MM/DD/YYYY - HH:mm:ss"
                                                                    )}
                                                            </span>
                                                        </li>
                                                        <li className='w-full flex flex-wrap space-y-2 lg:space-y-0'>
                                                            <span className='text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between'>
                                                                {
                                                                    <FormattedMessage id='Products_Request' />
                                                                }{" "}
                                                                <span className='hidden lg:inline-block'>
                                                                    :
                                                                </span>
                                                            </span>
                                                            <span className='text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5'>
                                                                {purchaseReqData
                                                                    ?.PurchaseRequestProducts
                                                                    .length ||
                                                                    0}
                                                            </span>
                                                        </li>
                                                        <li className='w-full flex flex-wrap space-y-2 lg:space-y-0'>
                                                            <span className='text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between'>
                                                                {
                                                                    <FormattedMessage id='Total_Quotes' />
                                                                }{" "}
                                                                <span className='hidden lg:inline-block'>
                                                                    :
                                                                </span>
                                                            </span>
                                                            <span className='text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5'>
                                                                {
                                                                    purchaseReqData
                                                                        ?.supplier_quote
                                                                        .length
                                                                }
                                                            </span>
                                                        </li>
                                                        <li className='w-full flex flex-wrap space-y-2 lg:space-y-0'>
                                                            <span className='text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between'>
                                                                {
                                                                    <FormattedMessage id='Requested_Status' />
                                                                }{" "}
                                                                <span className='hidden lg:inline-block'>
                                                                    :
                                                                </span>
                                                            </span>
                                                            <span className='text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5'>
                                                                {purchaseReqData?.status &&
                                                                purchaseReqData?.status ===
                                                                    "EXPIRED" ? (
                                                                    <div className='text-primaryRed bg-primaryRed/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center '>
                                                                        {
                                                                            <FormattedMessage id='EXPIRED' />
                                                                        }
                                                                    </div>
                                                                ) : purchaseReqData?.status ===
                                                                  "COMPLETED" ? (
                                                                    <p className='text-secondaryGreen bg-secondaryGreen/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center '>
                                                                        {
                                                                            <FormattedMessage id='COMPLETED' />
                                                                        }
                                                                    </p>
                                                                ) : purchaseReqData?.status ===
                                                                  "NEW" ? (
                                                                    <p className='text-secondaryBlue bg-secondaryBlue/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center '>
                                                                        {
                                                                            <FormattedMessage id='NEW' />
                                                                        }
                                                                    </p>
                                                                ) : purchaseReqData?.status ===
                                                                purchaseReuestStatus.QUOTED ? (
                                                                    <p className='text-secondaryOrange bg-secondaryOrange/20 text-xs font-medium  rounded-lg px-2 py-1.5 whitespace-nowrap inline-flex items-center justify-center '>
                                                                        {
                                                                            <FormattedMessage id='QUOTED' />
                                                                        }
                                                                    </p>
                                                                ) : null}
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className='relative w-full md:w-1/2 px-4 pt-5 md:pt-0'>
                                                    <ul className='space-y-2 lg:space-y-4 w-full md:w-11/12'>
                                                        <li className='w-full flex flex-wrap space-y-2 lg:space-y-0'>
                                                            <span className='text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between'>
                                                                {
                                                                    <FormattedMessage id='Subtotal' />
                                                                }{" "}
                                                                <span className='hidden lg:inline-block'>
                                                                    :
                                                                </span>
                                                            </span>
                                                            <span className='text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5'>
                                                                <span>
                                                                    {purchaseReqData?.total_price &&
                                                                        "SAR"}{" "}
                                                                </span>
                                                                <span>
                                                                    {
                                                                        purchaseReqData?.total_price
                                                                    }
                                                                </span>
                                                            </span>
                                                        </li>
                                                        <li className='w-full flex flex-wrap space-y-2 lg:space-y-0'>
                                                            <span className='text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between'>
                                                                {
                                                                    <FormattedMessage id='Requested_Expiry' />
                                                                }{" "}
                                                                <span className='hidden lg:inline-block'>
                                                                    :
                                                                </span>
                                                            </span>
                                                            <span className='text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5'>
                                                                <span>
                                                                    {purchaseReqData?.quotes_accepted_upto &&
                                                                        moment(
                                                                            purchaseReqData?.quotes_accepted_upto
                                                                        ).format(
                                                                            "MM/DD/YYYY - HH:mm:ss"
                                                                        )}
                                                                </span>
                                                            </span>
                                                        </li>
                                                    </ul>

                                                    {(purchaseReqData?.status ===
                                                        "QUOTED" ||
                                                        purchaseReqData?.status ===
                                                            "NEW") && (
                                                        <div className='w-1/3 mt-5'>
                                                            <>
                                                                {(purchaseReqView &&
                                                                    Array.isArray(
                                                                        purchaseReqView
                                                                    ) &&
                                                                    purchaseReqView.findIndex(
                                                                        (
                                                                            req: any
                                                                        ) =>
                                                                            req.is_paid ===
                                                                                null &&
                                                                            req.payment_method ===
                                                                                "BANK_TRANSFER"
                                                                    )) !==
                                                                -1 ? (
                                                                    <Button
                                                                        type='button'
                                                                        text={
                                                                            <FormattedMessage id='Close_Request' />
                                                                        }
                                                                        onClick={() =>
                                                                            setShowCloseButtonMessage(
                                                                                true
                                                                            )
                                                                        }
                                                                        className='inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium transition-all duration-200 hover:bg-primarycolor hover:text-white  border border-primarycolor rounded-lg text-primarycolor'
                                                                    />
                                                                ) : (
                                                                    <Button
                                                                        type='button'
                                                                        text={
                                                                            <FormattedMessage id='Close_Request' />
                                                                        }
                                                                        loader={
                                                                            closeButtonLoader
                                                                        }
                                                                        className='inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium transition-all duration-200 hover:bg-primarycolor hover:text-white  border border-primarycolor rounded-lg text-primarycolor'
                                                                        onClick={() =>
                                                                            setShowCloseModal(
                                                                                true
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {purchaseReqView && (
                                            <div className='mt-5'>
                                                <Table<purchaseRequestType>
                                                    header=''
                                                    data={purchaseReqView}
                                                    columns={columns}
                                                    apiParams={apiParams}
                                                    setApiParams={setApiParams}
                                                    pagination={true}
                                                    search={false}
                                                    filters={
                                                        <ul className='flex items-center bg-primarycolor/10 p-1.5 rounded-xl'>
                                                            <li
                                                                className='mx-1 cursor-pointer'
                                                                onClick={() =>
                                                                    handleTabChange(
                                                                        0
                                                                    )
                                                                }
                                                            >
                                                                <span
                                                                    className={`text-xs font-normal px-7  ${
                                                                        tab ===
                                                                        0
                                                                            ? "text-white bg-primarycolor"
                                                                            : "text-black"
                                                                    }  py-2 rounded-xl inline-block `}
                                                                >
                                                                    {
                                                                        <FormattedMessage id='ACTIVE' />
                                                                    }
                                                                </span>
                                                            </li>
                                                            <li
                                                                className='mx-1 cursor-pointer'
                                                                onClick={() =>
                                                                    handleTabChange(
                                                                        1
                                                                    )
                                                                }
                                                            >
                                                                <span
                                                                    className={`text-xs font-normal px-7  ${
                                                                        tab ===
                                                                        1
                                                                            ? "text-white bg-primarycolor"
                                                                            : "text-black"
                                                                    }  py-2 rounded-xl inline-block`}
                                                                >
                                                                    {
                                                                        <FormattedMessage id='REJECTED' />
                                                                    }
                                                                </span>
                                                            </li>
                                                        </ul>
                                                    }
                                                    targetDropdown={
                                                        allSupplierDropdown
                                                    }
                                                    supplierId={supplierId}
                                                />
                                            </div>
                                        )}
                                        {deleteModal ? (
                                            <DeleteModal
                                                setShowModal={
                                                    setShowDeleteModal
                                                }
                                                showModal={deleteModal}
                                                deleteId={deleteId}
                                                onDeleteClick={
                                                    PurchaseReqDelete
                                                }
                                                deleteLoader={deleteLoader}
                                                btnText={
                                                    selectedTab === "REJECTED"
                                                        ? "Delete"
                                                        : "Reject"
                                                }
                                                text={
                                                    selectedTab ===
                                                    "REJECTED" ? (
                                                        <FormattedMessage id='DeleteMsg' />
                                                    ) : (
                                                        <FormattedMessage id='Reject_Msg' />
                                                    )
                                                }
                                            />
                                        ) : null}

                                        {/* {purchaseReqData?.status === "COMPLETED" && (
                      <div className="text-center mt-3 md:mt-8">
                        {<FormattedMessage id="closed_req" />}
                      </div>
                    )} */}

                                        {purchaseReqData?.status ===
                                            "EXPIRED" && (
                                            <div className='text-center mt-3 md:mt-8'>
                                                {
                                                    <FormattedMessage id='expired_req' />
                                                }
                                            </div>
                                        )}

                                        {showCheckOutModal && (
                                            <Modal
                                                showModal={showCheckOutModal}
                                                title={
                                                    <FormattedMessage id='Are_you_sure' />
                                                }
                                                setShowModal={
                                                    setShowCheckOutModal
                                                }
                                                width='w-96'
                                            >
                                                <div>
                                                    <h1>
                                                        {
                                                            <FormattedMessage id='checkout_msg' />
                                                        }
                                                    </h1>
                                                </div>
                                                <div className='flex flex-row gap-2 mt-3 justify-center'>
                                                    <Button
                                                        text={
                                                            <FormattedMessage id='Cancel' />
                                                        }
                                                        type='button'
                                                        disable={buttonLoader}
                                                        onClick={() =>
                                                            setShowCheckOutModal(
                                                                false
                                                            )
                                                        }
                                                        className='inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium transition-all duration-200 hover:bg-secondaryOrange hover:text-white  border border-secondaryOrange rounded-lg text-secondaryOrange'
                                                    ></Button>
                                                    <Button
                                                        text={
                                                            <FormattedMessage id='Checkout' />
                                                        }
                                                        type='button'
                                                        loader={buttonLoader}
                                                        onClick={() =>
                                                            handleCheckOut()
                                                        }
                                                        className='inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium transition-all duration-200 hover:bg-primarycolor hover:text-white  border border-primarycolor rounded-lg text-primarycolor'
                                                    ></Button>
                                                </div>
                                            </Modal>
                                        )}

                                        {showCloseModal && (
                                            <DeleteModal
                                                setShowModal={setShowCloseModal}
                                                showModal={showCloseModal}
                                                deleteId={purchaseReqId}
                                                onDeleteClick={closeRequest}
                                                btnText='Close'
                                                text={
                                                    <FormattedMessage id='close_msg' />
                                                }
                                            />
                                        )}

                                        {showCloseButtonMessage && (
                                            <Modal
                                                showModal={
                                                    showCloseButtonMessage
                                                }
                                                title={
                                                    <FormattedMessage id='Are_you_sure' />
                                                }
                                                setShowModal={
                                                    setShowCloseButtonMessage
                                                }
                                                width='w-96'
                                            >
                                                <div className='p-4'>
                                                    Can not close this request
                                                    because your payment is in
                                                    pending mode
                                                </div>
                                            </Modal>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className='relative w-full min-w-0 flex-auto p-8 ml-[50%]'>
                                            <NoData
                                                text={
                                                    <FormattedMessage id='no_quotes' />
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <PageNotFound />
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default StorePurchaseReqView
