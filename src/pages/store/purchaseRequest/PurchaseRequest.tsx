import { DeleteModal } from "components/model/DeleteModal"
import { PurchaseRequestColumns } from "components/table/columns/purchaseRequest.columns"
import { Table } from "components/table/Table"
import { ApiParamsType } from "components/table/types"
import { perPage, responseType, toastType } from "constant/common.constant"
import { useEffect, useState } from "react"
import {
    getAllPurchaseRequest,
    supplierDeleteProduct,
    updateExpiredStatus,
} from "./services/purchaseRequest.services"
import {
    PrSearchFilterType,
    PurchaseRequestListingType,
    PurchaseRequestTableType,
} from "./types/purchaseRequest.types"
import { useNavigate } from "react-router-dom"
import { showToast } from "helper/toast.helper"
import useUserData from "hooks/getUserData"
import { FormattedMessage, useIntl } from "react-intl"
import useDebounce from "hooks/useDebounce"
import { Button } from "components/button/Button"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import Input from "components/input/Input"
import CustomSelect from "components/customSelect/CustomSelect"
import {
    hasOffersDropdown,
    purchaseRequestStatauses,
} from "constant/dropdown.constant"
import { purchaseRequestFilter } from "./schema/purchaseRequestAdd.schema"
import { useOutsideClick } from "hooks/clickOutside"
import RangeDatePicker from "components/datePicker/RangeDatePicker"
import useLocale from "hooks/useLocale"
const PurchaseRequest = () => {
    const [purchaseRequest, setPurchaseRequest] = useState<
        PurchaseRequestListingType[]
    >([])
    const [purchaseDeletedId, setPurchaseDeletedId] = useState<string>("")
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false)
    const [expiredIds, setExpiredIds] = useState<string[]>([])
    const [filterModel, setFilterModal] = useState<boolean>(false)
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const [searchedFilter, setSearchFilter] = useState<PrSearchFilterType>({
        expiry_date: undefined,
        status: undefined,
        purchaseRequest_uuid: undefined,
        hasOffers: undefined,
    })
    const { language } = useLocale()
    const {uuid } = useUserData()
    
    const [apiParams, setApiParams] = useState<ApiParamsType>({
        limit: perPage,
        count: 0,
        page: 1,
        isAsc: true,
        sort: `uuid`,
        searchText: "",
        extraParams: {},
    })

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(purchaseRequestFilter),
        defaultValues: searchedFilter,
    })

    const OfferStatusLanguageWise = hasOffersDropdown(language)
    const ref = useOutsideClick(() => {
        if (filterModel) {
            setFilterModal(false)
        }
    })
    const { given_permissions } = useUserData()
    const intl = useIntl()

    const getAllStoreProducts = async () => {
        try {
            setIsLoading(true)
            const res = await getAllPurchaseRequest(apiParams, uuid)

            if (res) {
                setApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: res?.data?.data?.count,
                    }
                })
            }
            setPurchaseRequest(res?.data?.data?.rows)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }

    const columns = PurchaseRequestColumns(
        (uuid: string) => navigate(`/purchase-request/view/${uuid}`),
        (uuid: string) => {
            setPurchaseDeletedId(uuid)
            setShowDeleteModal(true)
        },
        (uuid: string) => {
            onExpiryClickView(uuid)
        },
        (uuid: string) => navigate(`/purchase-request/edit/${uuid}`),
        given_permissions
    )

    const debouncedHtmlContent = useDebounce(
        apiParams?.searchText as string,
        500
    )

    useEffect(() => {
        getAllStoreProducts()
    }, [apiParams.page, debouncedHtmlContent, apiParams.sort, apiParams.isAsc])

    const onDeleteClick = async () => {
        try {
            setDeleteLoader(true)
            const response = await supplierDeleteProduct(purchaseDeletedId)
            await setShowDeleteModal(false)
            if (response?.data.responseType === responseType.Success) {
                showToast(response?.data.message, toastType.Success, intl)
                getAllStoreProducts()
                setApiParams((params) => {
                    return {
                        ...params,
                        page: 1,
                    }
                })
            } else {
                showToast(response?.data.message, toastType.Error, intl)
            }
            setDeleteLoader(false)
        } catch (err) {}
    }
    const navigate = useNavigate()

    async function onExpiryClickView(uuid: string) {
        if (!expiredIds.includes(uuid)) {
            setExpiredIds((prev) => [...prev, uuid])
        }
    }

    const updateExpireStatus = async () => {
        await updateExpiredStatus(expiredIds)
    }

    useEffect(() => {
        if (expiredIds.length > 0) {
            updateExpireStatus()
        }
    }, [apiParams.page, expiredIds])

    const applyFilters = async (values: PrSearchFilterType) => {
        try {
            setButtonLoader(true)
            if (values.expiry_date) {
                setSearchFilter(values)
            } else {
                setSearchFilter({ ...values, expiry_date: undefined })
            }
            Object.keys(values).forEach((key) => {
                if (values[key as keyof PrSearchFilterType] === "") {
                    delete values[key as keyof PrSearchFilterType]
                }
            })
            apiParams.extraParams = { ...values }
            const applyFilter = await getAllPurchaseRequest(apiParams, uuid)
            if (applyFilter) {
                setApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: applyFilter?.data?.data?.count,
                    }
                })
            }
            setPurchaseRequest(applyFilter?.data?.data?.rows)
            setFilterModal(false)
            setButtonLoader(false)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            setButtonLoader(false)
            return error
        }
    }
    const resetFilter = () => {
        apiParams.extraParams = {}
        reset()
        getAllStoreProducts()
        setFilterModal(false)
    }

    return (
        <>
            <div className='w-full xl:w-3/4 space-y-30px relative'>
                <>
                    <Table<PurchaseRequestTableType>
                        header={
                            <>
                                <div className='flex gap-3 items-center'>
                                    <FormattedMessage id='Purchase_Request' />
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
                        columns={columns}
                        pagination={true}
                        data={purchaseRequest}
                        apiParams={apiParams}
                        setApiParams={setApiParams}
                        search={true}
                        loading={isLoading}
                        filters={
                            <>
                                {given_permissions.find(
                                    (item: { name: string }) =>
                                        item.name === "Create Purchase Request"
                                )?.granted && (
                                    <button
                                        className='relative px-4 py-2 border rounded-xl border-primarycolor text-primarycolor text-base font-medium hover:text-white hover:bg-primarycolor'
                                        onClick={() => {
                                            navigate("/purchase-request/add")
                                        }}
                                    >
                                        {
                                            <FormattedMessage id='Create_Purchase_Request' />
                                        }
                                    </button>
                                )}
                            </>
                        }
                    />
                    {showDeleteModal ? (
                        <DeleteModal
                            setShowModal={setShowDeleteModal}
                            showModal={showDeleteModal}
                            deleteId={purchaseDeletedId}
                            onDeleteClick={onDeleteClick}
                            deleteLoader={deleteLoader}
                        />
                    ) : null}
                    {filterModel === true && (
                        <>
                            <div
                                className='!mt-3 p-8 bg-white block w-full md:w-620px left-0 absolute top-16 z-20 px-5 py-6 rounded-md shadow-box-search rtl:left-0 rtl:right-0 lg:rtl:right-14'
                                ref={ref}
                            >
                                <h4 className='text-black font-semibold capitalize border-b border-black/10 pb-3'>
                                    <FormattedMessage id='Search_Filter' />
                                </h4>
                                <div className='flex flex-wrap my-2'>
                                    <form
                                        className='w-full'
                                        onSubmit={handleSubmit(applyFilters)}
                                    >
                                        <div>
                                            <div className='flex flex-wrap -mx-3'>
                                                <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                                                    <Input
                                                        label={
                                                            <FormattedMessage id='Request_ID' />
                                                        }
                                                        errors={errors}
                                                        id='purchaseRequest_uuid'
                                                        register={register}
                                                        type='text'
                                                        placeholder={intl.formatMessage(
                                                            {
                                                                id: "Enter_Request_ID",
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
                                                        name='status'
                                                        options={
                                                            purchaseRequestStatauses
                                                        }
                                                        register={register}
                                                        required={false}
                                                        error={errors}
                                                        isSearchable={false}
                                                    />
                                                </div>
                                                <div className='relative w-full px-3 mb-3 md:mb-5'>
                                                    <CustomSelect
                                                        label={
                                                            <FormattedMessage id='Has_Offers' />
                                                        }
                                                        control={control}
                                                        name='hasOffers'
                                                        options={
                                                            OfferStatusLanguageWise as {
                                                                value: string
                                                                label?: string
                                                            }[]
                                                        }
                                                        register={register}
                                                        required={false}
                                                        error={errors}
                                                        isSearchable={false}
                                                    />
                                                </div>
                                                <div className='relative  w-full  px-3 mb-3 md:mb-5 z-0'>
                                                    <RangeDatePicker
                                                        label={
                                                            <FormattedMessage id='Expiry_Date' />
                                                        }
                                                        required={false}
                                                        errors={errors}
                                                        id='expiry_date'
                                                        placeholder={intl.formatMessage(
                                                            {
                                                                id: "Enter_date",
                                                            }
                                                        )}
                                                        control={control}
                                                        name='expiry_date'
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
                </>
            </div>
        </>
    )
}

export default PurchaseRequest
