import { Button } from "components/button/Button"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useNavigate, useParams } from "react-router-dom"

import { BankTransfer } from "../checkOut/components/BankTransfer"
import { bankTransDetails } from "./service/storeBankPayment.service"
import { responseType } from "constant/common.constant"
import Loading from "components/globalLoader/Loading"
import moment from "moment"
import { OrderDetailTypes } from "./types/bankTransfer.types"
import { REACT_APP_PDF_PATH } from "config"
import useOwnerData from "hooks/getOwnerData"
import useUserData from "hooks/getUserData"
import PageNotFound from "components/pageNotFound/PageNotFound"

const ViewOrder = () => {
    const { orderId } = useParams()
    const { user_entity_uuid } = useUserData()
    const [showModal, setShowModal] = useState(false)
    const [loader, setLoader] = useState(true)

    const [orderData, setOrderData] = useState<OrderDetailTypes>()

    const navigate = useNavigate()

    const { store_uuid } = useOwnerData()

    const storeOrderBankDetails = async () => {
        try {
            const response = await bankTransDetails({
                store_info_uuid: store_uuid,
                orderId: orderId,
            })
            if (
                response?.data?.data &&
                response?.data?.responseType === responseType?.Success
            ) {
                setOrderData(response?.data?.data)
            }
            setLoader(false)
        } catch (error) {
            setLoader(false)
        }
    }

    useEffect(() => {
        if (orderId && store_uuid) {
            storeOrderBankDetails()
        }
    }, [orderId, store_uuid])

    const viewPdf = (pdfUrl: string) => {
        const downloadLink = document.createElement("a")
        downloadLink.href = pdfUrl
        downloadLink.download = "downloaded-file.pdf"
        downloadLink.target = "_blank"
        downloadLink.click()
    }

    return (
        <>
            {loader ? (
                <Loading className='!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            ) : (
                <>
                    {orderData ? (
                        <div className='w-full xl:w-3/4 space-y-30px'>
                            <div className='border border-black/10 rounded-14px p-20px md:p-30px'>
                                <div className='flex gap-3 124'>
                                    <div className='w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center'>
                                        <i
                                            className='icon-left_arrow text-24px text-primarycolor cursor-pointer'
                                            onClick={() =>
                                                navigate("/bank-transfer-order")
                                            }
                                        ></i>
                                    </div>
                                    <h2 className='text-xl md:text-2xl font-semibold text-black pr-90 mt-1'>
                                        {
                                            <FormattedMessage id='Order_Details' />
                                        }
                                    </h2>
                                </div>

                                <div className='border border-black/10 rounded-xl p-5 mt-8'>
                                    <h2 className='text-darkgrey text-base font-semibold'>
                                        {
                                            <FormattedMessage id='Order_Details' />
                                        }
                                    </h2>
                                    <div className='flex flex-wrap mt-4 mb-3 -mx-4'>
                                        <div className='relative w-full md:w-1/2  px-4 border-b-2 md:border-b-0 pb-5 md:pb-0 md:border-r-2 border-black/10 md:rtl:border-l-2 md:rtl:border-r-0'>
                                            <ul className='space-y-2 lg:space-y-4 w-full md:w-11/12'>
                                                <li className='w-full flex flex-wrap space-y-2 lg:space-y-0'>
                                                    <span className='text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between'>
                                                        {
                                                            <FormattedMessage id='Order_date' />
                                                        }{" "}
                                                        <span className='hidden lg:inline-block'>
                                                            :
                                                        </span>
                                                    </span>
                                                    <span className='text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2'>
                                                        {moment(
                                                            orderData?.orders
                                                                ?.created_at
                                                        ).format(
                                                            "DD-MM-YYYY, HH:mm"
                                                        )}
                                                    </span>
                                                </li>
                                                <li className='w-full flex flex-wrap space-y-2 lg:space-y-0'>
                                                    <span className='text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between'>
                                                        {
                                                            <FormattedMessage id='Order_Status' />
                                                        }{" "}
                                                        <span className='hidden lg:inline-block'>
                                                            :
                                                        </span>
                                                    </span>
                                                    <span className='text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2'>
                                                        {
                                                            orderData?.orders
                                                                ?.status
                                                        }
                                                    </span>
                                                </li>
                                                <li className='w-full flex flex-wrap space-y-2 lg:space-y-0'>
                                                    <span className='text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between'>
                                                        {
                                                            <FormattedMessage id='Amount' />
                                                        }
                                                        <span className='hidden lg:inline-block'>
                                                            :
                                                        </span>
                                                    </span>
                                                    <span className='text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2'>
                                                        <span className='inline-block'>
                                                            SAR
                                                        </span>{" "}
                                                        {Number(
                                                            orderData?.amount
                                                        ).toFixed(2)}
                                                    </span>
                                                </li>
                                            </ul>
                                            {/* <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Order_date" />}{" "}
                            <span>:</span>
                          </p>
                        </div>

                        <div className="w-4/6 px-5">
                          <p className="text-sm leading-7 text-gray-500">
                            {moment(orderData?.orders?.created_at).format(
                              "DD-MM-YYYY, HH:mm"
                            )}
                          </p>
                        </div>
                      </div> */}
                                            {/* <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Order_Status" />}{" "}
                            <span>:</span>
                          </p>
                        </div>
                        <div className="w-4/6 px-5">
                          <p className="leading-7  text-gray-500 text-sm ">
                            {orderData?.orders?.status}
                          </p>
                        </div>
                      </div> */}
                                            {/* <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Amount" />}
                            <span>:</span>
                          </p>
                        </div>
                        <div className="w-4/6 px-5">
                          <p className="text-sm leading-7  text-gray-500">
                            {orderData?.amount}
                          </p>
                        </div>
                      </div> */}
                                        </div>
                                        <div className='relative w-full md:w-1/2 px-4 pt-5 md:pt-0'>
                                            <ul className='space-y-2 lg:space-y-4 w-full md:w-11/12'>
                                                <li className='w-full flex flex-wrap space-y-2 lg:space-y-0'>
                                                    <span className='text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between'>
                                                        {
                                                            <FormattedMessage id='Payment_status' />
                                                        }{" "}
                                                        <span className='hidden lg:inline-block'>
                                                            :
                                                        </span>
                                                    </span>
                                                    <span className='text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2'>
                                                        {
                                                            orderData?.payment_status
                                                        }
                                                    </span>
                                                </li>
                                                <li className='w-full flex flex-wrap space-y-2 lg:space-y-0'>
                                                    <span className='text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between'>
                                                        {
                                                            <FormattedMessage id='Shipping_Address' />
                                                        }{" "}
                                                        <span className='hidden lg:inline-block'>
                                                            :
                                                        </span>
                                                    </span>
                                                    <span className='text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2'>
                                                        {
                                                            orderData?.orders
                                                                ?.address
                                                                ?.address
                                                        }
                                                        ,{" "}
                                                        {
                                                            orderData?.orders
                                                                ?.address?.city
                                                        }
                                                        ,{" "}
                                                        {
                                                            orderData?.orders
                                                                ?.address?.state
                                                        }
                                                        ,{" "}
                                                        {
                                                            orderData?.orders
                                                                ?.address
                                                                ?.country
                                                        }
                                                        ,{" "}
                                                        {
                                                            orderData?.orders
                                                                ?.address
                                                                ?.postal_code
                                                        }
                                                    </span>
                                                </li>
                                            </ul>
                                            {/* <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Payment_status" />}{" "}
                            <span>:</span>
                          </p>
                        </div>
                        <div className="w-4/6 px-5">
                          <p className="text-sm leading-7 text-gray-500">
                            {orderData?.payment_status}
                          </p>
                        </div>
                      </div> */}
                                            {/* <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Shipping_Address" />}{" "}
                            <span>:</span>
                          </p>
                        </div>

                        <div className="w-4/6 px-5">
                          <p className="leading-7  text-gray-500 text-sm break-all">
                            {orderData?.orders?.address?.address},{" "}
                            {orderData?.orders?.address?.city},{" "}
                            {orderData?.orders?.address?.state},{" "}
                            {orderData?.orders?.address?.country},{" "}
                            {orderData?.orders?.address?.postal_code}
                          </p>
                        </div>
                      </div> */}
                                        </div>
                                    </div>
                                </div>

                                <div className='flex mt-3 md:mt-6 lg:mt-8 items-center -mx-3 flex-wrap space-y-4 md:space-y-0'>
                                    <div className='w-full md:w-1/2 px-3'>
                                        <div className='bg-primarycolor/20 py-3.5 px-4 rounded-lg relative '>
                                            <div className='flex items-center gap-3 justify-between'>
                                                <h4 className='text-sm md:text-base break-all'>
                                                    {
                                                        orderData?.orders
                                                            ?.payment_receipt
                                                    }
                                                </h4>
                                                <div className=''>
                                                    <svg
                                                        width='24'
                                                        height='24'
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
                                        </div>
                                    </div>
                                    <div className='relative w-full md:w-1/2 px-3'>
                                        <div className='flex gap-4 max-w-md'>
                                            <Button
                                                text={
                                                    <FormattedMessage id='View' />
                                                }
                                                type='button'
                                                onClick={() =>
                                                    viewPdf(
                                                        `${REACT_APP_PDF_PATH}${orderData?.orders?.payment_receipt}`
                                                    )
                                                }
                                                className='w-full px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                            ></Button>
                                            {orderData?.orders?.status ===
                                                "PENDING" && (
                                                <Button
                                                    text={
                                                        <FormattedMessage id='Update' />
                                                    }
                                                    type='button'
                                                    onClick={() =>
                                                        setShowModal(true)
                                                    }
                                                    className='w-full px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                                ></Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <BankTransfer
                                    orderData={orderId}
                                    setShowModal={setShowModal}
                                    showModal={showModal}
                                    storeId={user_entity_uuid}
                                    downloadQuotation={false}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='w-full'>
                            <PageNotFound />
                        </div>
                    )}
                </>
            )}
        </>
    )
}

export default ViewOrder
