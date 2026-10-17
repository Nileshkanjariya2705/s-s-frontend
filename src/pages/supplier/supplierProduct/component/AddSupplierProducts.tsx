import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "components/button/Button"
import Input from "components/input/Input"
import SectionHeader from "components/sectionHeader/SectionHeader"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css"
import { supplierProductSchema } from "../schema/supplierProducts.schema"
import {
    CategoryType,
    SupplierAddProduct,
} from "../types/supplierProducts.types"
import DatePicker from "components/datePicker/DatePicker"
import {
    getAllCategory,
    supplierAddProduct,
    getProductWiseData,
    getCategoryWiseProductAdd,
} from "../services/supplierProducts.services"
import { showToast } from "helper/toast.helper"
import Loading from "components/globalLoader/Loading"
import TextArea from "components/textArea/Textarea"
import InputImage from "components/input/InputImage"
import { responseType, toastType } from "constant/common.constant"
import { REACT_APP_IMAGE_PATH } from "config"
import useUserData from "hooks/getUserData"
import { FormattedMessage, useIntl } from "react-intl"
import CustomSelect from "components/customSelect/CustomSelect"
import useLocale from "hooks/useLocale"

function AddOrEditProducts() {
    const intl = useIntl()
    const navigate = useNavigate()
    const { user_entity_uuid, uuid } = useUserData()
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [category, setCategory] = useState<CategoryType[]>([])
    const [product, setProduct] = useState<CategoryType[]>([])
    const [productImage, setProductImage] = useState([])
    const [allowedPurchaseRequests, setAllowedPurchaseRequests] =
        useState<boolean>(false)
    const [dropdownLoader, setDropdownLoader] = useState<boolean>(false)

    supplierProductSchema(allowedPurchaseRequests)
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        setError,
        formState: { errors },
    } = useForm<SupplierAddProduct>({
        resolver: yupResolver(supplierProductSchema(allowedPurchaseRequests)),
    })
    const formValues = watch()
     const { language } = useLocale();


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
                    supplier_uuid: uuid,
                    user_entity_uuid,
                }
                const response = await supplierAddProduct(data)
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

    const getAllCategories = async () => {
        try {
            setIsLoading(true)
            const catResponse = await getAllCategory(language)
            setCategory(catResponse?.data?.data)
            setProduct([])
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        getAllCategories()
    }, [language])

    const handleCategorySelect = async (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        setDropdownLoader(true)
        const res = await getCategoryWiseProductAdd(
            event.target.value,
            language
        )
        setValue("overview_en", "")
        setValue("specification_en", "")
        setValue("description_en", "")
        setValue("measurement", "")
        setValue("status", "")
        setValue("product", "")
        setProduct(res.data.data)
        setProductImage([])
        setDropdownLoader(false)
    }

    const handleProductSelect = async (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        setDropdownLoader(true)
        const res = await getProductWiseData(event.target.value)
        setProductImage(JSON.parse(res.data.data.images))
        setValue("overview_en", res.data.data.overview_en)
        setValue("specification_en", res.data.data.specification_en)
        setValue("description_en", res.data.data.description_en)
        setValue("measurement", res.data.data.measurement)
        setValue("status", res.data.data.status)
        setDropdownLoader(false)
    }

    return (
        <>
            {isLoading ? (
                <Loading className='!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            ) : (
                <div className='w-full xl:w-3/4 space-y-30px'>
                    <>
                        {dropdownLoader && (
                            <Loading className='!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                        )}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className=' w-full px-6 py-9 rounded-14px border-2 border-gray'>
                                <SectionHeader
                                    text={<FormattedMessage id='Add_Product' />}
                                    textClass='text-black mb-5'
                                />
                                <div className='flex flex-wrap gap-y-4 md:gap-y-5'>
                                    <div className='relative w-full md:w-1/2 px-0 md:px-2'>
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
                                            isDisabled={dropdownLoader}
                                            placeholder={"Select Category"}
                                            handleSelectChange={(e) =>
                                                handleCategorySelect(e)
                                            }
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 px-0 md:px-2'>
                                        <CustomSelect
                                            label={
                                                <FormattedMessage id='Product_Name' />
                                            }
                                            control={control}
                                            register={register}
                                            name='product'
                                            error={errors}
                                            required={true}
                                            isDisabled={dropdownLoader}
                                            placeholder={intl.formatMessage({
                                                id: "Select_Product",
                                            })}
                                            handleSelectChange={(e) =>
                                                handleProductSelect(e)
                                            }
                                            options={product}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 px-0 md:px-2'>
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
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Overview",
                                            })}
                                            readonly={true}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 px-0 md:px-2 space-y-4'>
                                        <div className='relative w-full  px-0 md:px-2'>
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
                                                readonly={dropdownLoader}
                                            />
                                        </div>
                                        <div className='relative w-full px-0 md:px-2'>
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

                                    <div className='relative w-full md:w-1/2 px-0 md:px-2'>
                                        <Input
                                            id='status'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Status' />
                                            }
                                            register={register}
                                            required={true}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Status",
                                            })}
                                            readonly={true}
                                        />
                                    </div>

                                    <div className='relative w-full md:w-1/2 px-0 md:px-2'>
                                        <DatePicker
                                            label={
                                                <FormattedMessage id='Offer_Valid_Till' />
                                            }
                                            errors={errors}
                                            required={true}
                                            id='end_date'
                                            name='end_date'
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Date",
                                            })}
                                            control={control}
                                        />
                                    </div>

                                    <div className='flex flex-wrap gap-y-2 w-full md:w-1/2'>
                                        {productImage &&
                                            productImage?.map(
                                                (
                                                    image: string,
                                                    index: number
                                                ) => {
                                                    return (
                                                        <>
                                                            <div className='relative w-full px-0 md:px-2 '>
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
                                                                            :
                                                                        </>
                                                                    }
                                                                    style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28'
                                                                />
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            )}
                                    </div>
                                    <div className='w-full md:w-1/2 space-y-5'>
                                        <div className='relative w-full  px-0 md:px-2'>
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
                                                readonly={dropdownLoader}
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
                                                readonly={dropdownLoader}
                                                fixDecimal={true}
                                            />
                                        </div>
                                        <div className='w-full px-0 md:px-2'>
                                            <div className='flex flex-row-reverse cs-checkout gap-3 items-center justify-end mt-0 md:mt-8 xl:mt-10'>
                                                <Input
                                                    id='is_purchaseable'
                                                    type='checkbox'
                                                    label={
                                                        <FormattedMessage id='Allow_Purchase_Request' />
                                                    }
                                                    register={register}
                                                    errors={errors}
                                                    readonly={dropdownLoader}
                                                    required={false}
                                                    handleClick={
                                                        purchaseRequestAllowed
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className='relative w-full px-0 md:px-2'>
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
                                                readonly={dropdownLoader}
                                                fixDecimal={true}
                                            />
                                        </div>
                                    </div>

                                    <div className='relative w-full md:w-1/2 px-0 md:px-2'>
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
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Description",
                                            })}
                                            readonly={true}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 px-0 md:px-2'>
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
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Specification",
                                            })}
                                            readonly={true}
                                        />
                                    </div>
                                </div>
                                <div className='mt-5 xl:mt-8 xxl:mt-8 flex gap-3 md:gap-5 px-0 md:px-2 flex-wrap'>
                                    <Button
                                        text={<FormattedMessage id='Cancel' />}
                                        disable={buttonLoader}
                                        type='button'
                                        className='md:w-48 px-5 py-3 text-xs md:text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                        onClick={() => {
                                            navigate(`/products`)
                                        }}
                                    ></Button>
                                    <Button
                                        loader={buttonLoader}
                                        text={
                                            <FormattedMessage id='CREATE_PRODUCT' />
                                        }
                                        type='submit'
                                        onClick={onSubmit}
                                        className='md:w-48 object-right-bottom px-5 py-3 text-sm font-bold text-center  border-2 border-primarycolor text-primarycolor bg-white rounded-xl hover:bg-primarycolor hover:text-white focus:ring-0 focus:outline-0'
                                    ></Button>
                                </div>
                            </div>
                        </form>
                    </>
                </div>
            )}
        </>
    )
}

export default AddOrEditProducts
