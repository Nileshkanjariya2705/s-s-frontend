import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
    approveDeclineInvoice,
    approvePaymentInvoice,
    getOrderDetailInfo,
} from "../services/bankTransfer.service"
import { responseType } from "constant/common.constant"
import { AdminOrderDetailTypes } from "../types/bankTransfer.types"
import { REACT_APP_PDF_PATH } from "config"
import { FormattedMessage } from "react-intl"
import { Button } from "components/button/Button"
import PageNotFound from "components/pageNotFound/PageNotFound"
import Loading from "components/globalLoader/Loading"
import { sendConfirmationMail } from "pages/store/checkOut/services/checkout.services"

const BankTransferApproval = () => {
    const navigate = useNavigate()
    const { orderId } = useParams()
    const [loading, setLoading] = useState<boolean>(true)
    const [approveLoader, setApproveLoader] = useState<boolean>(false)
    const [declineLoader, setDeclineLoader] = useState<boolean>(false)
    const [orderDetailData, setOrderDetailData] =
        useState<AdminOrderDetailTypes>()
    const getSingleOrderDetails = async () => {
        try {
            setLoading(true)
            const response = await getOrderDetailInfo(orderId as string)
            if (response?.data?.responseType === responseType.Success) {
                setOrderDetailData(response?.data?.data)
            } else {
            }

            setLoading(false)
        } catch (error) {
            setLoading(false)
            return error
        }
    }
    useEffect(() => {
        getSingleOrderDetails()
    }, [])
    const handleApprovePayment = async () => {
        try {
            setApproveLoader(true)
            const data = {
                orderId: orderId,
                supplier_info_uuid:
                    orderDetailData?.singleData?.orders?.supplierInfo?.uuid,
                purchaseReqId:
                    orderDetailData?.singleData?.orders?.purchase_request_id,
                payment_id: orderDetailData?.singleData?.uuid,
            }
            const response = await approvePaymentInvoice(data)

            if (response?.data?.responseType === responseType.Success) {
                navigate("/admin/bank-transfer")
                sendConfirmationMail(orderId)
            }
            setApproveLoader(false)
        } catch (error) {
            setApproveLoader(false)
            return error
        }
    }
    const handleDeclinePayment = async () => {
        try {
            setDeclineLoader(true)
            const data = {
                orderId: orderId,
                supplier_info_uuid:
                    orderDetailData?.singleData?.orders?.supplierInfo?.uuid,
                purchaseReqId:
                    orderDetailData?.singleData?.orders?.purchase_request_id,
                payment_uuid: orderDetailData?.singleData?.uuid,
            }
            const response = await approveDeclineInvoice(data)

            if (response?.data?.responseType === responseType.Success) {
                navigate("/admin/bank-transfer")
            }
            setDeclineLoader(false)
        } catch (error) {
            setDeclineLoader(false)
            return error
        }
    }

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {orderDetailData?.singleData.orders.payment_receipt !==
                    undefined ? (
                        <>
                            <div className='border border-black/10 rounded-xl p-5'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-50px h-45px md:w-40px md:h-40px rounded-xl bg-primarycolor/10 flex items-center justify-center'>
                                        <i
                                            className='icon-left_arrow text-2xl text-primarycolor cursor-pointer'
                                            onClick={() =>
                                                navigate("/admin/bank-transfer")
                                            }
                                        ></i>
                                    </div>
                                    <div className=' relative flex-shrink flex flex-wrap gap-4'>
                                        <h2 className='text-base md:text-2xl font-medium '>
                                            <FormattedMessage id='Please_verify_document' />
                                        </h2>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 mt-3'>
                                    <h3>
                                        {
                                            <FormattedMessage id='View_OrderDetail' />
                                        }
                                        {" :-"}
                                    </h3>
                                    <Link
                                        to={`/admin/orders/view-order/${orderDetailData?.singleData?.orders?.uuid}`}
                                        target='_blank'
                                        className='bg-primarycolor/20'
                                    >
                                        {"#"}
                                        {orderDetailData?.singleData?.orders?.uuid.slice(
                                            0,
                                            8
                                        )}
                                    </Link>
                                </div>
                                <iframe
                                    className='py-5 w-full xl:w-1060px h-420px xl:h-800px'
                                    src={`${REACT_APP_PDF_PATH}${orderDetailData?.singleData?.orders?.payment_receipt}`}
                                ></iframe>
                                <div className='flex gap-4 py-5 md:py-8 !pb-0 border-black/10 border-t flex-wrap'>
                                    <>
                                        {" "}
                                        <div className='flex items-center gap-3 flex-wrap'>
                                            <div className='bg-primarycolor/20 px-4 py-3 rounded-lg'>
                                                <p>
                                                    <div className='flex gap-2'>
                                                        <p className='text-sm md:text-base break-all'>
                                                            {
                                                                orderDetailData
                                                                    ?.singleData
                                                                    ?.orders
                                                                    ?.payment_receipt
                                                            }
                                                        </p>
                                                        <div>
                                                            <svg
                                                                className='w-5 h-5'
                                                                viewBox='0 0 24 24'
                                                                fill='none'
                                                                xmlns='http://www.w3.org/2000/svg'
                                                            >
                                                                <path
                                                                    d='M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H14C14.41 1.25 14.75 1.59 14.75 2C14.75 2.41 14.41 2.75 14 2.75H9C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V10C21.25 9.59 21.59 9.25 22 9.25C22.41 9.25 22.75 9.59 22.75 10V15C22.75 20.43 20.43 22.75 15 22.75Z'
                                                                    fill='#292D32'
                                                                />
                                                                <path
                                                                    d='M22 10.7485H18C14.58 10.7485 13.25 9.41852 13.25 5.99852V1.99852C13.25 1.69852 13.43 1.41852 13.71 1.30852C13.99 1.18852 14.31 1.25852 14.53 1.46852L22.53 9.46852C22.74 9.67852 22.81 10.0085 22.69 10.2885C22.57 10.5685 22.3 10.7485 22 10.7485ZM14.75 3.80852V5.99852C14.75 8.57852 15.42 9.24852 18 9.24852H20.19L14.75 3.80852Z'
                                                                    fill='#292D32'
                                                                />
                                                                <path
                                                                    d='M13 13.75H7C6.59 13.75 6.25 13.41 6.25 13C6.25 12.59 6.59 12.25 7 12.25H13C13.41 12.25 13.75 12.59 13.75 13C13.75 13.41 13.41 13.75 13 13.75Z'
                                                                    fill='#292D32'
                                                                />
                                                                <path
                                                                    d='M11 17.75H7C6.59 17.75 6.25 17.41 6.25 17C6.25 16.59 6.59 16.25 7 16.25H11C11.41 16.25 11.75 16.59 11.75 17C11.75 17.41 11.41 17.75 11 17.75Z'
                                                                    fill='#292D32'
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </p>
                                            </div>
                                            <div className='flex gap-4 max-w-md'>
                                                {orderDetailData?.singleData
                                                    ?.orders?.status ===
                                                    "PENDING" &&
                                                orderDetailData?.singleData
                                                    ?.payment_status !==
                                                    "SUCCESS" ? (
                                                    <>
                                                        <Button
                                                            text={
                                                                <FormattedMessage id='Decline' />
                                                            }
                                                            type='button'
                                                            onClick={
                                                                handleDeclinePayment
                                                            }
                                                            disable={
                                                                approveLoader ||
                                                                declineLoader
                                                            }
                                                            loader={
                                                                declineLoader
                                                            }
                                                            className='w-full px-5 py-3 text-sm font-bold text-center text-red-500 border-2 border-red-500 text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-red-500 focus:ring-0 focus:outline-0'
                                                        ></Button>
                                                        <Button
                                                            text={
                                                                <FormattedMessage id='Approve' />
                                                            }
                                                            type='button'
                                                            loader={
                                                                approveLoader
                                                            }
                                                            onClick={
                                                                handleApprovePayment
                                                            }
                                                            disable={
                                                                declineLoader ||
                                                                approveLoader
                                                            }
                                                            className='w-full px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                                        ></Button>
                                                    </>
                                                ) : (
                                                    <h2 className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'>
                                                        <FormattedMessage id='Approved' />
                                                    </h2>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <PageNotFound />
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default BankTransferApproval
