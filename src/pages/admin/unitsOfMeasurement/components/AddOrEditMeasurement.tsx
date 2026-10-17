import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

import { DropdownOptionType, statusDropdown } from "constant/dropdown.constant"
import { measurementSchema } from "../schema/measurement.schema"
import { yupResolver } from "@hookform/resolvers/yup"
import { showToast } from "helper/toast.helper"
import {
    addUnit,
    getSingleUnit,
    updateUnit,
} from "../services/measurement.services"
import { MeasurementType } from "../types/measurement.types"
import SectionHeader from "components/sectionHeader/SectionHeader"
import Input from "components/input/Input"
import { Button } from "components/button/Button"
import { PageNotFound } from "components/pageNotFound/PageNotFound"
import Loading from "components/globalLoader/Loading"
import { FormattedMessage, useIntl } from "react-intl"
import CustomSelect from "components/customSelect/CustomSelect"
import useLocale from "hooks/useLocale"

const AddOrEditMeasurement = () => {
    const navigate = useNavigate()
    const params = useParams()

    const [updatedUnitId, setUpdatedUnitId] = useState<string>()
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [singleUnit, setSingleUnit] = useState<MeasurementType>()
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<MeasurementType>({
        resolver: yupResolver(measurementSchema),
        values: singleUnit ? singleUnit : undefined,
    })

    const intl = useIntl()
    const { language } = useLocale();
    const statusDropdownOption = statusDropdown(language as string)

    const onSubmit = async (values: MeasurementType) => {
        setButtonLoader(true)
        if (!updatedUnitId) {
            const response = await addUnit(values)
            if (response?.data?.responseType === "success") {
                setButtonLoader(false)
                showToast(response?.data?.message, "success", intl)
                navigate(`/admin/measurement`)
            } else {
                setButtonLoader(false)
                showToast(response?.data?.message, "error", intl)
            }
        } else {
            const response = await updateUnit(values)
            if (response?.data?.responseType === "success") {
                setButtonLoader(false)
                showToast(response?.data?.message, "success", intl)
                navigate(`/admin/measurement`)
            } else {
                setButtonLoader(false)
                showToast(response?.data?.message, "error", intl)
            }
        }
    }
    const getEditableData = async (unitId: string) => {
        try {
            const response = await getSingleUnit(unitId)
            setSingleUnit(response.data.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            return error
        }
    }
    useEffect(() => {
        if (params.unitId) {
            setUpdatedUnitId(params.unitId)
            getEditableData(params.unitId)
        }
    }, [params.unitId])


    return (
        <>
            {updatedUnitId ? (
                <>
                    {!loading ? (
                        <>
                            {singleUnit ? (
                                <div className='border border-black/10 rounded-xl p-5'>
                                    <SectionHeader
                                        text={
                                            <FormattedMessage id='Edit_Measurement' />
                                        }
                                        textClass='text-black'
                                    />
                                    <>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className='flex flex-wrap gap-y-4 mt-8 -mx-2  pb-8'>
                                                <div className='relative w-full md:w-1/2 xl:w-1/4 px-2'>
                                                    <p className='text-sm font-medium text-gray-900'>
                                                        {
                                                            <FormattedMessage id='English' />
                                                        }
                                                    </p>
                                                    <div className='flex flex-wrap gap-y-3 mt-3 border py-5 rounded-lg border-dashed border-primarycolor p-2'>
                                                        <div className='relative w-full  px-2'>
                                                            <Input
                                                                id='unit_name'
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Unit_Name' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                required={true}
                                                                errors={errors}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_unit_name",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                        <div className='relative w-full px-2'>
                                                            <Input
                                                                id='unit_short_name'
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Unit_Short_Name' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                errors={errors}
                                                                required={true}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_unit_short_name",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='relative w-full md:w-1/2 xl:w-1/4 px-2'>
                                                    <p className='text-sm font-medium text-gray-900'>
                                                        {
                                                            <FormattedMessage id='Arabic' />
                                                        }
                                                    </p>
                                                    <div className='flex flex-wrap gap-y-3 mt-3 border py-5 rounded-lg border-dashed border-primarycolor p-2'>
                                                        <div className='relative w-full px-2'>
                                                            <Input
                                                                id='unit_name_ar'
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Unit_Name' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                required={true}
                                                                errors={errors}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_unit_name",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                        <div className='relative w-full px-2'>
                                                            <Input
                                                                id='unit_short_name_ar'
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Unit_Short_Name' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                errors={errors}
                                                                required={true}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_unit_short_name",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='relative w-full md:w-1/2 xl:w-1/4 px-2'>
                                                    <p className='text-sm font-medium text-gray-900'>
                                                        {
                                                            <FormattedMessage id='Urdu' />
                                                        }
                                                    </p>
                                                    <div className='flex flex-wrap gap-y-3 mt-3 border py-5 rounded-lg border-dashed border-primarycolor p-2'>
                                                        <div className='relative w-full px-2'>
                                                            <Input
                                                                id='unit_name_ur'
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Unit_Name' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                required={true}
                                                                errors={errors}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_unit_name",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                        <div className='relative w-full px-2'>
                                                            <Input
                                                                id='unit_short_name_ur'
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Unit_Short_Name' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                errors={errors}
                                                                required={true}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_unit_short_name",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='relative w-full md:w-1/2 xl:w-1/4 px-2'>
                                                    <CustomSelect
                                                        control={control}
                                                        register={register}
                                                        options={
                                                            statusDropdownOption as DropdownOptionType
                                                        }
                                                        name='status'
                                                        error={errors}
                                                        required={true}
                                                        placeholder={intl.formatMessage(
                                                            {
                                                                id: "Choose_Status",
                                                            }
                                                        )}
                                                        label={
                                                            <FormattedMessage id='Status' />
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex gap-4 py-5 md:py-8 pb-0 border-black/10 border-t'>
                                                <Button
                                                    text={
                                                        <FormattedMessage id='Cancel' />
                                                    }
                                                    type='button'
                                                    disable={buttonLoader}
                                                    className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                                    onClick={() => {
                                                        navigate(
                                                            `/admin/measurement`
                                                        )
                                                    }}
                                                />
                                                <Button
                                                    text={
                                                        <FormattedMessage id='Update' />
                                                    }
                                                    type='submit'
                                                    loader={buttonLoader}
                                                    className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                                />
                                            </div>
                                        </form>
                                    </>
                                </div>
                            ) : (
                                <PageNotFound />
                            )}
                        </>
                    ) : (
                        <Loading />
                    )}
                </>
            ) : (
                <div className='border border-black/10 rounded-xl p-5'>
                    <SectionHeader
                        text={<FormattedMessage id='Add_Measurement' />}
                        textClass='text-black'
                    />
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='flex flex-wrap gap-y-4 mt-8 -mx-2  pb-8'>
                                <div className='relative w-full md:w-1/2 xl:w-1/4 px-2'>
                                    <p className='text-sm font-medium text-gray-900'>
                                        {<FormattedMessage id='English' />}
                                    </p>
                                    <div className='flex flex-wrap gap-y-3 mt-3 border py-5 rounded-lg border-dashed border-primarycolor p-2'>
                                        <div className='relative w-full px-2'>
                                            <Input
                                                id='unit_name'
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Unit_Name' />
                                                }
                                                register={register}
                                                required={true}
                                                errors={errors}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_unit_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full px-2'>
                                            <Input
                                                id='unit_short_name'
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Unit_Short_Name' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_unit_short_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/4 px-2'>
                                    <p className='text-sm font-medium text-gray-900'>
                                        {<FormattedMessage id='Arabic' />}
                                    </p>
                                    <div className='flex flex-wrap gap-y-3 mt-3 border py-5 rounded-lg border-dashed border-primarycolor p-2'>
                                        <div className='relative w-full px-2'>
                                            <Input
                                                id='unit_name_ar'
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Unit_Name' />
                                                }
                                                register={register}
                                                required={true}
                                                errors={errors}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_unit_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full px-2'>
                                            <Input
                                                id='unit_short_name_ar'
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Unit_Short_Name' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_unit_short_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/4 px-2'>
                                    <p className='text-sm font-medium text-gray-900'>
                                        {<FormattedMessage id='Urdu' />}
                                    </p>
                                    <div className='flex flex-wrap gap-y-3 mt-3 border py-5 rounded-lg border-dashed border-primarycolor p-2'>
                                        <div className='relative w-full px-2'>
                                            <Input
                                                id='unit_name_ur'
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Unit_Name' />
                                                }
                                                register={register}
                                                required={true}
                                                errors={errors}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_unit_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full px-2'>
                                            <Input
                                                id='unit_short_name_ur'
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Unit_Short_Name' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_unit_short_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/4 px-2'>
                                    <CustomSelect
                                        control={control}
                                        register={register}
                                        options={
                                            statusDropdownOption as DropdownOptionType
                                        }
                                        name='status'
                                        error={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Choose_Status",
                                        })}
                                        label={<FormattedMessage id='Status' />}
                                    />
                                </div>
                            </div>
                            <div className='flex gap-4 py-5 md:py-8 pb-0 border-black/10 border-t'>
                                <Button
                                    text={<FormattedMessage id='Cancel' />}
                                    type='button'
                                    disable={buttonLoader}
                                    className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                    onClick={() => {
                                        navigate(`/admin/measurement`)
                                    }}
                                />
                                <Button
                                    text={<FormattedMessage id='Save' />}
                                    type='submit'
                                    loader={buttonLoader}
                                    className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                />
                            </div>
                        </form>
                    </>
                </div>
            )}
        </>
    )
}
export default AddOrEditMeasurement
