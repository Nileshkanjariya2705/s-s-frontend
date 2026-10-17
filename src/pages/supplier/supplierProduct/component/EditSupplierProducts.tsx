import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "components/button/Button"
import Input from "components/input/Input"
import SectionHeader from "components/sectionHeader/SectionHeader"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css"
import { supplierProductSchema } from "../schema/supplierProducts.schema"
import {
    CategoryType,
    SupplierAddProduct,
} from "../types/supplierProducts.types"
import DatePicker from "components/datePicker/DatePicker"
import {
    getSingleSupplierProduct,
    getProductWiseData,
    supplierEditProduct,
    getActiveCategory,
    getCategoryWiseProductEdit,
} from "../services/supplierProducts.services"

import { showToast } from "helper/toast.helper"
import Loading from "components/globalLoader/Loading"
import TextArea from "components/textArea/Textarea"
import { REACT_APP_IMAGE_PATH } from "config"
import { PageNotFound } from "components/pageNotFound/PageNotFound"
import { responseType, toastType } from "constant/common.constant"
import InputImage from "components/input/InputImage"
import { FormattedMessage, useIntl } from "react-intl"
import CustomSelect from "components/customSelect/CustomSelect"
import useUserData from "hooks/getUserData"
import useLocale from "hooks/useLocale"

function AddOrEditProducts() {
    const intl = useIntl()
    const { language } = useLocale();
    const { productId } = useParams()
    const navigate = useNavigate()
    const [buttonLoader, setButtonLoader] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [category, setCategory] = useState<CategoryType[]>([])
    const [product, setProduct] = useState<CategoryType[]>([])
    const [productData, setProductData] = useState<SupplierAddProduct>()
    const [productImages, setProductImages] = useState([])
    const { user_entity_uuid, uuid } = useUserData()
    const [allowedPurchaseRequests, setAllowedPurchaseRequests] =
        useState<boolean>(false)
    const [dropdownLoader, setDropdownLoader] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        setError,
        formState: { errors },
    } = useForm<SupplierAddProduct>({
        resolver: yupResolver(supplierProductSchema(allowedPurchaseRequests)),
        values: productData,
    })
    const formValues = watch()
    const purchaseRequestAllowed = useCallback(() => {
        setAllowedPurchaseRequests(!allowedPurchaseRequests)
    }, [allowedPurchaseRequests])

    useEffect(() => {
        const offered_price = Number(formValues?.price)
        const base_price = Number(formValues?.base_price)
        if (offered_price && base_price && offered_price < base_price) {
            setError("price", {
                type: "manual",
                message: intl.formatMessage({
                    id: "Offer_Price_Message",
                }),
            })
        } else if (offered_price && base_price && offered_price < base_price) {
            setError("price", {
                type: "manual",
                message: "",
            })
        }
    }, [formValues?.base_price])

    const onSubmit = async (values: SupplierAddProduct) => {
        try {
            const offered_price = Number(formValues?.price)
            const base_price = Number(formValues?.base_price)
            const charge = values?.charges === "" ? "0" : values.charges
            if (offered_price && base_price && offered_price < base_price) {
                setError("price", {
                    type: "manual",
                    message: intl.formatMessage({
                        id: "Offer_Price_Message",
                    }),
                })
            } else {
                setButtonLoader(true)
                const data = {
                    ...values,
                    charges: charge,
                    supplier_uuid: uuid,
                    user_entity_uuid,
                }
                const response = await supplierEditProduct(data)
                if (response?.data?.responseType === responseType.Success) {
                    setButtonLoader(false)
                    showToast(response?.data?.message, toastType.Success, intl)
                    navigate(`/products`)
                } else {
                    setButtonLoader(false)
                    showToast(response?.data?.message, toastType.Error, intl)
                }
            }
        } catch (error) {
            return error
        }
    }

    const getAllCategories = async (categoryId: string, productId: string) => {
        try {
            const catResponse = await getActiveCategory(categoryId, language)
            setCategory(catResponse?.data?.data)
            const prodResponse = await getCategoryWiseProductEdit(
                categoryId,
                productId,
                language
            )
            setProduct(prodResponse.data.data)
        } catch (error) {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (productId) {
            getEditableData(productId)
        }
    }, [])

    const handleCategorySelect = async (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        setDropdownLoader(true)
        const res = await getCategoryWiseProductEdit(
            event.target.value,
            productData?.uuid as string,
            language
        )
        setValue("overview_en", "")
        setValue("specification_en", "")
        setValue("description_en", "")
        setValue("measurement", "")
        setValue("status", "")
        setValue("product", "")
        setProduct(res.data.data)
        setProductImages([])
        setDropdownLoader(false)
    }

    const handleProductSelect = async (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        setDropdownLoader(true)
        const res = await getProductWiseData(event.target.value)
        setProductImages(JSON.parse(res.data.data.images))
        setValue("overview_en", res.data.data.overview_en)
        setValue("specification_en", res.data.data.specification_en)
        setValue("description_en", res.data.data.description_en)
        setValue("measurement", res.data.data.measurement)
        setValue("status", res.data.data.status)
        setDropdownLoader(false)
    }

    const getEditableData = async (productId: string) => {
        try {
            setIsLoading(true)
            const response = await getSingleSupplierProduct(productId)
            setProductData(response.data.data)
            const categoryId = response.data.data.category
            await getAllCategories(categoryId, productId)
            setProductImages(JSON.parse(response.data.data.product_images))
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            return error
        }
    }
    return (
        <>
            {isLoading ? (
                <Loading className='!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            ) : (
                <>
                    {productData ? (
                        <>
                            {dropdownLoader && (
                                <Loading className='!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                            )}
                            <div className='w-full xl:w-3/4 space-y-30px'>
                                <SectionHeader
                                    text={
                                        <FormattedMessage id='Edit_Products' />
                                    }
                                    textClass='text-black'
                                />

                                <>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='shadow-2xl w-full px-6 py-9 rounded-30px border-2 border-gray mt-5 md:mt-10'>
                                            <div className='flex flex-wrap gap-y-4 md:gap-y-5'>
                                                <div className='relative w-full md:w-1/2 px-2'>
                                                    <CustomSelect
                                                        label={
                                                            <FormattedMessage id='Categories' />
                                                        }
                                                        options={category}
                                                        control={control}
                                                        register={register}
                                                        name='category'
                                                        error={errors}
                                                        required={true}
                                                        placeholder={
                                                            "Select Category"
                                                        }
                                                        handleSelectChange={(
                                                            e
                                                        ) =>
                                                            handleCategorySelect(
                                                                e
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className='relative w-full md:w-1/2 px-2'>
                                                    <CustomSelect
                                                        label={
                                                            <FormattedMessage id='Product_Name' />
                                                        }
                                                        control={control}
                                                        register={register}
                                                        name='product'
                                                        error={errors}
                                                        required={true}
                                                        placeholder={intl.formatMessage(
                                                            {
                                                                id: "Select_Product",
                                                            }
                                                        )}
                                                        handleSelectChange={(
                                                            e
                                                        ) =>
                                                            handleProductSelect(
                                                                e
                                                            )
                                                        }
                                                        options={product}
                                                    />
                                                </div>
                                                <div className='relative w-full md:w-1/2 px-2'>
                                                    <TextArea
                                                        id='overview_en'
                                                        label={
                                                            <FormattedMessage id='Overview' />
                                                        }
                                                        name='overview_en'
                                                        register={register}
                                                        type='textarea'
                                                        parentClass='mb-30px last:mb-0'
                                                        errors={errors}
                                                        placeholder={intl.formatMessage(
                                                            {
                                                                id: "Enter_Overview",
                                                            }
                                                        )}
                                                        readonly={true}
                                                    />
                                                </div>
                                                <div className='relative w-full md:w-1/2 space-y-4'>
                                                    <div className='relative w-full px-2'>
                                                        <Input
                                                            id='units'
                                                            type='text'
                                                            label={
                                                                <FormattedMessage id='Units' />
                                                            }
                                                            register={register}
                                                            required={true}
                                                            errors={errors}
                                                            placeholder={intl.formatMessage(
                                                                {
                                                                    id: "Enter_Units",
                                                                }
                                                            )}
                                                        />
                                                    </div>
                                                    <div className='relative w-full px-2'>
                                                        <Input
                                                            id='measurement'
                                                            type='text'
                                                            label={
                                                                <FormattedMessage id='Unit_Property' />
                                                            }
                                                            register={register}
                                                            errors={errors}
                                                            placeholder={intl.formatMessage(
                                                                {
                                                                    id: "Enter_Unitproperty",
                                                                }
                                                            )}
                                                            readonly={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className='relative w-full md:w-1/2 px-2'>
                                                    <Input
                                                        id='status'
                                                        type='text'
                                                        label={
                                                            <FormattedMessage id='Status' />
                                                        }
                                                        register={register}
                                                        required={true}
                                                        errors={errors}
                                                        placeholder={intl.formatMessage(
                                                            {
                                                                id: "Enter_Status",
                                                            }
                                                        )}
                                                        readonly={true}
                                                    />
                                                </div>
                                                <div className='relative w-full md:w-1/2 px-2'>
                                                    <DatePicker
                                                        label={
                                                            <FormattedMessage id='Offer_Valid_Till' />
                                                        }
                                                        errors={errors}
                                                        required={true}
                                                        id='end_date'
                                                        name='end_date'
                                                        placeholder={intl.formatMessage(
                                                            {
                                                                id: "Enter_Date",
                                                            }
                                                        )}
                                                        control={control}
                                                    />
                                                </div>

                                                <div className='flex flex-wrap gap-y-2 w-full md:w-1/2'>
                                                    {productImages &&
                                                        productImages?.map(
                                                            (
                                                                image: string,
                                                                index: number
                                                            ) => {
                                                                return (
                                                                    <>
                                                                        <div className='relative w-full px-2 '>
                                                                            <InputImage
                                                                                required={
                                                                                    true
                                                                                }
                                                                                errors={
                                                                                    errors
                                                                                }
                                                                                id={`product_images.${index}.image`}
                                                                                register={
                                                                                    register
                                                                                }
                                                                                type='file'
                                                                                value={
                                                                                    image
                                                                                        ? `${REACT_APP_IMAGE_PATH}${image}`
                                                                                        : null
                                                                                }
                                                                                disabled={
                                                                                    true
                                                                                }
                                                                                label={
                                                                                    <>
                                                                                        {" "}
                                                                                        {
                                                                                            <FormattedMessage id='Product_Images' />
                                                                                        }
                                                                                    </>
                                                                                }
                                                                                style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-3xl block w-full py-3 leading-6 px-4 pr-28 file-select'
                                                                            />
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                        )}
                                                </div>
                                                <div className='w-full md:w-1/2 space-y-5'>
                                                    <div className='relative w-full px-2'>
                                                        <Input
                                                            id='price'
                                                            type='text'
                                                            label={
                                                                <FormattedMessage id='Offered_Price' />
                                                            }
                                                            register={register}
                                                            required={true}
                                                            errors={errors}
                                                            placeholder={intl.formatMessage(
                                                                {
                                                                    id: "Enter_Price",
                                                                }
                                                            )}
                                                            fixDecimal={true}
                                                        />
                                                    </div>
                                                    <div className='relative w-full  px-0 md:px-2'>
                                                        <Input
                                                            id='charges'
                                                            type='text'
                                                            label={
                                                                <FormattedMessage id='Charges' />
                                                            }
                                                            register={register}
                                                            required={false}
                                                            errors={errors}
                                                            placeholder={intl.formatMessage(
                                                                {
                                                                    id: "Enter_Charges",
                                                                }
                                                            )}
                                                            readonly={
                                                                dropdownLoader
                                                            }
                                                            fixDecimal={true}
                                                        />
                                                    </div>
                                                    <div className='w-full md:mt-10'>
                                                        <div className='flex ml-2 flex-row-reverse cs-checkout gap-3 items-center justify-end '>
                                                            <Input
                                                                id='is_purchaseable'
                                                                type='checkbox'
                                                                label={
                                                                    <FormattedMessage id='Allow_Purchase_Request' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                errors={errors}
                                                                readonly={
                                                                    dropdownLoader
                                                                }
                                                                required={false}
                                                                handleClick={
                                                                    purchaseRequestAllowed
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='relative w-full px-2'>
                                                        <Input
                                                            id='base_price'
                                                            type='text'
                                                            label={
                                                                <FormattedMessage id='Base_Price' />
                                                            }
                                                            register={register}
                                                            required={
                                                                allowedPurchaseRequests
                                                            }
                                                            errors={errors}
                                                            placeholder={intl.formatMessage(
                                                                {
                                                                    id: "Enter_Baseprice",
                                                                }
                                                            )}
                                                            fixDecimal={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className='relative w-full md:w-1/2 px-2'>
                                                    <TextArea
                                                        id='description_en'
                                                        label={
                                                            <FormattedMessage id='Description' />
                                                        }
                                                        name='description_en'
                                                        register={register}
                                                        type='textarea'
                                                        parentClass='mb-30px last:mb-0'
                                                        errors={errors}
                                                        placeholder={intl.formatMessage(
                                                            {
                                                                id: "Enter_Description",
                                                            }
                                                        )}
                                                        readonly={true}
                                                    />
                                                </div>
                                                <div className='relative w-full md:w-1/2 px-2'>
                                                    <TextArea
                                                        id='specification_en'
                                                        label={
                                                            <FormattedMessage id='Specification' />
                                                        }
                                                        name='specification_en'
                                                        register={register}
                                                        type='textarea'
                                                        parentClass='mb-30px last:mb-0'
                                                        errors={errors}
                                                        placeholder={intl.formatMessage(
                                                            {
                                                                id: "Enter_Specification",
                                                            }
                                                        )}
                                                        readonly={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className='mt-5 xl:mt-8 xxl:mt-8 flex gap-5 px-2'>
                                                <Button
                                                    text={
                                                        <FormattedMessage id='Cancel' />
                                                    }
                                                    type='button'
                                                    className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                                    onClick={() => {
                                                        navigate(`/products`)
                                                    }}
                                                ></Button>
                                                <Button
                                                    loader={buttonLoader}
                                                    text={
                                                        <FormattedMessage id='Edit_Products' />
                                                    }
                                                    type='submit'
                                                    onClick={onSubmit}
                                                    className='w-48 object-right-bottom px-5 py-3 text-sm font-bold text-center  border-2 border-primarycolor text-primarycolor bg-white rounded-xl hover:bg-primarycolor hover:text-white focus:ring-0 focus:outline-0'
                                                ></Button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            </div>
                        </>
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

export default AddOrEditProducts
