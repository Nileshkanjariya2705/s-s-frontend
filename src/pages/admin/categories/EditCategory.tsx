import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react"

import { DropdownOptionType, statusDropdown } from "constant/dropdown.constant"
import { newCategoryValidation } from "./schema/newCategory.schema"
import { getSpecifiCategory, updateCategory } from "./services/category.service"
import { REACT_APP_IMAGE_PATH } from "config"
import { CategoryType } from "./types/category.type"
import { responseType, toastType } from "constant/common.constant"
import { showToast } from "helper/toast.helper"
import SectionHeader from "components/sectionHeader/SectionHeader"
import InputImage from "components/input/InputImage"
import Input from "components/input/Input"
import { Button } from "components/button/Button"
import Loading from "components/globalLoader/Loading"
// import { PageNotFound } from "components/pageNotFound/PageNotFound";
import { FormattedMessage, useIntl } from "react-intl"
import CustomSelect from "components/customSelect/CustomSelect"
import PageNotFound from "components/pageNotFound/PageNotFound"
import useLocale from "hooks/useLocale"

const EditCategory = () => {
    const intl = useIntl()
  const { language } = useLocale();
    const { categoryId } = useParams()
    const [defaultValues, setDefaultValues] = useState<CategoryType>()
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const navigate = useNavigate()
    const categoryStatus = statusDropdown(language as string)
    const getCategory = async (categoryId: string | undefined) => {
        try {
            setLoading(true)
            const response = await getSpecifiCategory(categoryId)
            if (response?.data?.responseType === responseType.Success) {
                setDefaultValues(response?.data?.data)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCategory(categoryId)
    }, [categoryId])

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
        setValue,
    } = useForm<CategoryType>({
        values: defaultValues && defaultValues,
        resolver: yupResolver(newCategoryValidation),
    })

    const onSubmit = handleSubmit(async (values) => {
        try {
            setButtonLoader(true)
            const formData = new FormData()

            formData.append("icon", values?.icon?.[0] as string | Blob)
            formData.append("name", values?.name)
            formData.append("name_ar", values?.name_ar)
            formData.append("name_ur", values?.name_ur)
            formData.append("status", values?.status)

            const response = await updateCategory(categoryId, formData)
            if (response?.data.responseType === responseType.Success) {
                showToast(response?.data.message, toastType.Success, intl)
                navigate("/admin/categories")
            } else {
                showToast(response?.data.message, toastType.Error, intl)
            }
            setButtonLoader(false)
        } catch (error) {
            setButtonLoader(false)
            return error
        }
    })



    return (
        <>
            {!loading ? (
                <>
                    {defaultValues ? (
                        <form onSubmit={onSubmit}>
                            <div className='border border-black/10 rounded-xl p-5'>
                                <div className='relative pb-7'>
                                    <SectionHeader
                                        text={
                                            <FormattedMessage id='Edit_Category' />
                                        }
                                    />

                                    <div className='flex flex-wrap gap-y-4 mt-8 -mx-2'>
                                        <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                            <Input
                                                required={true}
                                                errors={errors}
                                                register={register}
                                                type='text'
                                                id={`name`}
                                                label={
                                                    <FormattedMessage id='Category_English_Name' />
                                                }
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_category_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                            <Input
                                                required={true}
                                                errors={errors}
                                                register={register}
                                                type='text'
                                                id={`name_ar`}
                                                label={
                                                    <FormattedMessage id='Category_Ar_Name' />
                                                }
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_category_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                            <Input
                                                required={true}
                                                errors={errors}
                                                register={register}
                                                type='text'
                                                id={`name_ur`}
                                                label={
                                                    <FormattedMessage id='Category_Ur_Name' />
                                                }
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_category_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                            <InputImage
                                                errors={errors}
                                                id={`icon`}
                                                register={register}
                                                setValue={setValue}
                                                type='file'
                                                value={
                                                    !!defaultValues
                                                        ? `${REACT_APP_IMAGE_PATH}${defaultValues?.image}`
                                                        : null
                                                }
                                                label={
                                                    <FormattedMessage id='Select_Category_Image' />
                                                }
                                                required={true}
                                                index={0}
                                                // onlySvg={true}
                                                style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                            />
                                        </div>
                                        <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                            <CustomSelect
                                                selectedOption={
                                                    defaultValues &&
                                                    defaultValues.status
                                                }
                                                label={
                                                    <FormattedMessage id='Status' />
                                                }
                                                options={
                                                    categoryStatus as DropdownOptionType
                                                }
                                                control={control}
                                                register={register}
                                                name='status'
                                                error={errors}
                                                required={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex gap-4 py-5 md:py-8 pb-0 border-black/10 border-t'>
                                    <Button
                                        text={<FormattedMessage id='Cancel' />}
                                        type='button'
                                        disable={buttonLoader}
                                        className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                        onClick={() => {
                                            reset()
                                            navigate("/admin/categories")
                                        }}
                                    ></Button>
                                    <Button
                                        text={<FormattedMessage id='Update' />}
                                        loader={buttonLoader}
                                        type='submit'
                                        className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                    ></Button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <PageNotFound />
                    )}
                </>
            ) : (
                <Loading />
            )}
        </>
    )
}

export default EditCategory
