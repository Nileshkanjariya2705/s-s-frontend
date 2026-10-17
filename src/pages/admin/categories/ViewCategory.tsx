import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react"
import {  DropdownOptionType, statusDropdown } from "constant/dropdown.constant"
import { newCategoryValidation } from "./schema/newCategory.schema"
import { getSpecifiCategory } from "./services/category.service"
import { REACT_APP_IMAGE_PATH } from "config"
import { CategoryType } from "./types/category.type"
import SectionHeader from "components/sectionHeader/SectionHeader"
import InputImage from "components/input/InputImage"
import Input from "components/input/Input"
import { Button } from "components/button/Button"
import Loading from "components/globalLoader/Loading"
import { PageNotFound } from "components/pageNotFound/PageNotFound"
import { FormattedMessage } from "react-intl"
import CustomSelect from "components/customSelect/CustomSelect"
import useLocale from "hooks/useLocale"

const ViewCategory = () => {
    const { categoryId } = useParams()
    const [defaultValues, setDefaultValues] = useState<CategoryType>()
    const [loading, setLoading] = useState<boolean>(true)
    const { language } = useLocale();
    const navigate = useNavigate()
    const categoryStatus = statusDropdown(language as string)


    const getCategory = async (categoryId: string | undefined) => {
        try {
            setLoading(true)
            const response = await getSpecifiCategory(categoryId)
            setDefaultValues(response?.data?.data)
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
        control,
        reset,
        formState: { errors },

        setValue,
    } = useForm({
        values: defaultValues && defaultValues,
        resolver: yupResolver(newCategoryValidation),
    })


    return (
        <>
            {!loading ? (
                <>
                    {defaultValues ? (
                        <form>
                            <div className='border border-black/10 rounded-xl p-5'>
                                <div className='relative pb-7'>
                                        <SectionHeader
                                            text={
                                                <FormattedMessage id='View_Category' />
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
                                                    readonly={true}
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
                                                    readonly={true}
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
                                                    readonly={true}
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
                                                index={0}
                                                style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                                disabled={true}
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
                                                    isDisabled={true}
                                                />
                                            </div>
                                            
                                        </div>
                                </div>
                                <div className='flex gap-4 py-5 md:py-8 pb-0 border-black/10 border-t'>
                                    <Button
                                        text={
                                            <FormattedMessage id='Go_to_Category_List' />
                                        }
                                        type='button'
                                        className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                        onClick={() => {
                                            reset()
                                            navigate("/admin/categories")
                                        }}
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

export default ViewCategory
