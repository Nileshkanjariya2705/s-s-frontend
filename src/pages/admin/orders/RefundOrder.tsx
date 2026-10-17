import { Table } from "components/table/Table"
import { ApiParamsType, ColumnProps } from "components/table/types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { perPage } from "constant/common.constant"
import { getOrderInfo } from "./services/order.service"
import { AdminOrderFinalTypes, OrderFilterType } from "./types/order.type"
import { FormattedMessage, useIntl } from "react-intl"
import useDebounce from "hooks/useDebounce"
import { Button } from "components/button/Button"
import { useOutsideClick } from "hooks/clickOutside"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import Input from "components/input/Input"
import CustomSelect from "components/customSelect/CustomSelect"
import { OrderStatus } from "constant/dropdown.constant"
import { myOrdersSearchFilter } from "./schema/AdminOrderFilter"
import RangeDatePicker from "components/datePicker/RangeDatePicker"
import { adminRefundOrderColumns } from "components/table/columns/adminRefundOrders.columns"
import useLocale from "hooks/useLocale"

const AdminRefundOrder = () => {
    const intl = useIntl()
    const { language } = useLocale()
    const [loading, setLoading] = useState<boolean>(true)
    const [orderData, setOrderData] = useState<AdminOrderFinalTypes[]>([])
    const [filterModel, setFilterModal] = useState<boolean>(false)
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
   
    const [apiParams, setApiParams] = useState<ApiParamsType>({
        limit: perPage,
        count: 0,
        page: 1,
        isAsc: true,
        sort: `uuid`,
        searchText: "",
        extraParams: {
            refund_order: true,
        },
    })
    const OrderStatusLanguageWise = OrderStatus(language)
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<OrderFilterType>({
        resolver: yupResolver(myOrdersSearchFilter),
    })
    const navigate = useNavigate()
    const columns: ColumnProps[] = adminRefundOrderColumns(
        ({ uuid }: { uuid: string }) => {
            navigate(`/admin/refund-orders/view-order/${uuid}`)
        }
    )
    const ref = useOutsideClick(() => {
        if (filterModel) {
            setFilterModal(false)
        }
    })

    const debouncedHtmlContent = useDebounce(
        apiParams.searchText as string | number,
        500
    )

    const getAllOrder = async () => {
        try {
            setLoading(true)
            const getOrders = await getOrderInfo(apiParams)
            if (getOrders?.data?.data?.orderDetail) {
                setApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: getOrders?.data?.data?.orderDetail?.count,
                    }
                })
            }
            setOrderData(getOrders?.data?.data?.orderDetail?.rows)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }
    useEffect(() => {
        getAllOrder()
    }, [debouncedHtmlContent, apiParams.isAsc, apiParams.sort, apiParams.page])

    const applyFilters = async (values: OrderFilterType) => {
        try {
            setButtonLoader(true)
            Object.keys(values).forEach((key) => {
                if (values[key as keyof OrderFilterType] === "") {
                    delete values[key as keyof OrderFilterType]
                }
            })
            apiParams.extraParams = { refund_order: true, ...values }
            const applyFilter = await getOrderInfo(apiParams)
            if (applyFilter) {
                setApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: applyFilter?.data?.data?.orderDetail?.count,
                    }
                })
            }
            setOrderData(applyFilter?.data?.data?.orderDetail?.rows)

            setFilterModal(false)
            setButtonLoader(false)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setButtonLoader(false)
            return error
        }
    }

    const resetFilter = () => {
        apiParams.extraParams = { refund_order: true }
        reset()
        getAllOrder()
        setFilterModal(false)
    }
    return (
        <>
            <div className='relative'>
                <Table
                    header={
                        <>
                            <div className='flex gap-3 items-center'>
                                <FormattedMessage id='Refund_Orders' />
                                <div className='relative'>
                                    <div
                                        className='w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center cursor-pointer'
                                        onClick={() =>
                                            setFilterModal(!filterModel)
                                        }
                                    >
                                        <Button
                                            type='button'
                                            className='icon-filter text-base text-primarycolor'
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    data={orderData}
                    columns={columns}
                    apiParams={apiParams}
                    setApiParams={setApiParams}
                    pagination={true}
                    search={true}
                    loading={loading}
                />
                {filterModel === true && (
                    <>
                        <div
                            className=' !mt-3 p-8 bg-white block w-full md:w-620px left-0 absolute top-16 z-20 px-5 py-6 rounded-md shadow-box-search rtl:left-0 rtl:right-0 lg:rtl:right-14'
                            ref={ref}
                        >
                            <h4 className='text-black font-semibold capitalize border-b border-black/10 pb-3'>
                                <FormattedMessage id='Search Filter' />
                            </h4>
                            <div className='flex flex-wrap my-2 '>
                                <form
                                    className='w-full'
                                    onSubmit={handleSubmit(applyFilters)}
                                >
                                    <div>
                                        <div className='flex flex-wrap -mx-3'>
                                            <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                                                <Input
                                                    label={
                                                        <FormattedMessage id='Order Id' />
                                                    }
                                                    errors={errors}
                                                    id='order_uuid'
                                                    register={register}
                                                    type='text'
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id: "Enter_Payment_Id",
                                                        }
                                                    )}
                                                    required={false}
                                                    style='bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                                                />
                                            </div>
                                            <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                                                <CustomSelect
                                                    label={
                                                        <FormattedMessage id='Status' />
                                                    }
                                                    control={control}
                                                    name='order_status'
                                                    options={
                                                        OrderStatusLanguageWise as {
                                                            value:
                                                                | string
                                                                | boolean
                                                            label?: string
                                                            isdisabled?: boolean
                                                        }[]
                                                    }
                                                    register={register}
                                                    required={false}
                                                    error={errors}
                                                    isSearchable={false}
                                                />
                                            </div>
                                            <div className='relative lg:w-1/2  w-full px-3 mb-3 md:mb-5 '>
                                                <Input
                                                    label={
                                                        <FormattedMessage id='Amount' />
                                                    }
                                                    errors={errors}
                                                    id='amount'
                                                    register={register}
                                                    type='text'
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id: "Enter_Amount",
                                                        }
                                                    )}
                                                    required={false}
                                                    style='bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                                                />
                                            </div>
                                            <div className='relative lg:w-1/2  w-full px-3 mb-3 md:mb-5 '>
                                                <Input
                                                    label={
                                                        <FormattedMessage id='Supplier_Company' />
                                                    }
                                                    errors={errors}
                                                    id='supplier_company'
                                                    register={register}
                                                    type='text'
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id: "Supplier_Company",
                                                        }
                                                    )}
                                                    required={false}
                                                    style='bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                                                />
                                            </div>
                                            <div className='relative lg:w-1/2  w-full px-3 mb-3 md:mb-5 '>
                                                <Input
                                                    label={
                                                        <FormattedMessage id='Store_Company' />
                                                    }
                                                    errors={errors}
                                                    id='store_company'
                                                    register={register}
                                                    type='text'
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id: "Store_Company",
                                                        }
                                                    )}
                                                    required={false}
                                                    style='bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                                                />
                                            </div>
                                            <div className='relative  w-full  px-3 mb-3 md:mb-5 z-0'>
                                                <RangeDatePicker
                                                    label={
                                                        <FormattedMessage id='Orders_After_Date' />
                                                    }
                                                    required={false}
                                                    errors={errors}
                                                    id='order_date'
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id: "Enter_date",
                                                        }
                                                    )}
                                                    control={control}
                                                    name='order_date'
                                                    //cannot select past dates
                                                    minDate={false}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-wrap'>
                                            <div className='mt-5 flex justify-center gap-5 w-full'>
                                                <Button
                                                    text={
                                                        <FormattedMessage id='Reset' />
                                                    }
                                                    type='button'
                                                    onClick={() =>
                                                        resetFilter()
                                                    }
                                                    className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                                />{" "}
                                                <Button
                                                    text={
                                                        <FormattedMessage id='Apply' />
                                                    }
                                                    type='submit'
                                                    loader={buttonLoader}
                                                    className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                                />{" "}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default AdminRefundOrder
