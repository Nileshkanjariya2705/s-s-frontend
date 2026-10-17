import { useEffect, useState } from "react"
import { ApiParamsType } from "components/table/types"
import { productColumns } from "components/table/columns/products.columns"
import { Table } from "components/table/Table"
import { useNavigate } from "react-router-dom"
import { DeleteModal } from "components/model/DeleteModal"
import { deleteProduct, fetchAllProducts } from "./services/product.service"
import { perPage, responseType, toastType } from "constant/common.constant"
import { showToast } from "helper/toast.helper"
import { ProductDataType, searchFilterType } from "./types/product.type"
import { FormattedMessage, useIntl } from "react-intl"
import useDebounce from "hooks/useDebounce"
import { Button } from "components/button/Button"
import { statusDropdown } from "constant/dropdown.constant"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useOutsideClick } from "hooks/clickOutside"
import Input from "components/input/Input"
import CustomSelect from "components/customSelect/CustomSelect"
import { searchFilterSchema } from "./schema/product.schema"
import useLocale from "hooks/useLocale"

const Products = () => {
    const [products, setProducts] = useState<ProductDataType[]>([])
    const [opneModel, setOpenModel] = useState<boolean>(false)
    const [id, setId] = useState<string>()
    const [loading, setLoading] = useState<boolean>(true)
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false)
    const [filterModal, setFilterModal] = useState<boolean>(false)
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const [apiParams, setApiParams] = useState<ApiParamsType>({
        limit: perPage,
        count: 0,
        page: 1,
        isAsc: true,
        sort: `uuid`,
        searchText: "",
        searchField: "name_en",
        extraParams: {},
    })
    const navigate = useNavigate()
    const { language } = useLocale()
    const debouncedHtmlContent = useDebounce(
        apiParams.searchText as string | number,
        500
    )
    const ProductStatusLanguageWise = statusDropdown(language)

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const fetchProduct = await fetchAllProducts(apiParams)
            if (fetchProduct) {
                setApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: fetchProduct?.data?.data?.count,
                    }
                })
                setProducts(fetchProduct?.data?.data?.rows)
            }

            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [
        apiParams.page,
        apiParams.sort,
        apiParams.isAsc,
        debouncedHtmlContent,
        // apiParams.count,
    ])

    function onRowEdit({ uuid }: { uuid: string }) {
        navigate(`/admin/products/edit-product/${uuid}`)
    }
    function onRowView({ uuid }: { uuid: string }) {
        navigate(`/admin/products/view-product/${uuid}`)
    }
    function onRowDelete({ uuid }: { uuid: string }) {
        setOpenModel(true)
        setId(uuid)
    }

    const intl = useIntl()

    const handleDeleteApi = async (id: string) => {
        setDeleteLoader(true)
        const response = await deleteProduct(id)
        setOpenModel(false)
        if (response?.data.responseType === responseType.Success) {
            showToast(response?.data.message, toastType.Success, intl)
            getAllProducts()
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
    }

    const columns = productColumns(
        ({ uuid }: { uuid: string }) => {
            onRowEdit({ uuid })
        },
        ({ uuid }: { uuid: string }) => {
            onRowView({ uuid })
        },
        ({ uuid }: { uuid: string }) => {
            onRowDelete({ uuid })
        },
        language
    )

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({ resolver: yupResolver(searchFilterSchema) })
    const ref = useOutsideClick(() => {
        if (filterModal) {
            setFilterModal(false)
        }
    })

    const resetFilter = () => {
        apiParams.extraParams = {}
        reset()
        getAllProducts()
        setFilterModal(false)
    }

    const applyFilters = async (values: searchFilterType) => {
        try {
            setButtonLoader(true)
            apiParams.extraParams = { ...values }
            const filterdData = await fetchAllProducts(apiParams)

            if (filterdData) {
                setApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: filterdData?.data.data.count,
                    }
                })
            }
            setProducts(filterdData?.data?.data?.rows)
            setButtonLoader(false)
            setFilterModal(false)
        } catch (error) {
            return error
        }
    }
    return (
        <>
            {/* {loading ? (
        <Loading />
      ) : ( */}
            <>
                <div className='relative w-full min-w-0 flex-auto '>
                    <Table
                        header={
                            <>
                                <div className='flex gap-3 items-center'>
                                    <FormattedMessage id='Products' />
                                    <div className='relative'>
                                        <div
                                            className='w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center cursor-pointer'
                                            onClick={() =>
                                                setFilterModal(!filterModal)
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
                        data={products}
                        columns={columns}
                        apiParams={apiParams}
                        setApiParams={setApiParams}
                        pagination={true}
                        search={true}
                        loading={loading}
                        filters={
                            <button
                                onClick={() =>
                                    navigate("/admin/products/add-product")
                                }
                                className='relative px-4 py-2 border rounded-xl border-primarycolor text-primarycolor text-sm font-medium md:text-base hover:text-white hover:bg-primarycolor'
                            >
                                {<FormattedMessage id='Add_new_Product' />}
                            </button>
                        }
                    />
                    {opneModel ? (
                        <DeleteModal
                            setShowModal={setOpenModel}
                            showModal={opneModel}
                            deleteId={id}
                            onDeleteClick={handleDeleteApi}
                            deleteLoader={deleteLoader}
                        />
                    ) : null}

                    {filterModal === true && (
                        <>
                            <div
                                className=' p-8 bg-white block w-[calc(100vw-50px)] md:w-620px left-0 absolute top-16 z-20 px-5 py-6 rounded-md shadow-box-search rtl:left-0 rtl:right-0 lg:rtl:right-14'
                                ref={ref}
                            >
                                <h4 className='text-black font-semibold capitalize border-b border-black/10 pb-3'>
                                    <FormattedMessage id='Search_Filter' />
                                </h4>
                                <div className='flex flex-wrap my-2 '>
                                    <form onSubmit={handleSubmit(applyFilters)}>
                                        <div>
                                            <div className='flex flex-wrap -mx-3'>
                                                <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                                                    <Input
                                                        label={
                                                            <FormattedMessage id='Product_Name' />
                                                        }
                                                        errors={errors}
                                                        id='productName'
                                                        register={register}
                                                        type='text'
                                                        placeholder={intl.formatMessage(
                                                            {
                                                                id: "Enter_product_name",
                                                            }
                                                        )}
                                                        required={false}
                                                        style='bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                                                    />
                                                </div>
                                                <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                                                    <Input
                                                        label={
                                                            <FormattedMessage id='Category_Name' />
                                                        }
                                                        errors={errors}
                                                        id='categoryName'
                                                        register={register}
                                                        type='text'
                                                        placeholder={intl.formatMessage(
                                                            {
                                                                id: "Enter_category_name",
                                                            }
                                                        )}
                                                        required={false}
                                                        style='bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                                                    />
                                                </div>
                                                <div className='relative w-full px-3 mb-3 md:mb-5 '>
                                                    <CustomSelect
                                                        label={
                                                            <FormattedMessage id='Activation_Status' />
                                                        }
                                                        options={
                                                            ProductStatusLanguageWise as {
                                                                value:
                                                                    | string
                                                                    | boolean
                                                                label?: string
                                                                isdisabled?: boolean
                                                            }[]
                                                        }
                                                        control={control}
                                                        register={register}
                                                        name='status'
                                                        error={errors}
                                                        required={false}
                                                        isSearchable={true}
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
            {/* )} */}
        </>
    )
}

export default Products
