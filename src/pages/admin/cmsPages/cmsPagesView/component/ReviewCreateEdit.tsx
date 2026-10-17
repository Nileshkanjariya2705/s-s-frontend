import { Button } from "components/button/Button"
import SectionHeader from "components/sectionHeader/SectionHeader"
import TextArea from "components/textArea/Textarea"
import { useForm } from "react-hook-form"
import InputImage from "components/input/InputImage"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import { REACT_APP_IMAGE_PATH } from "config"
import { showToast } from "helper/toast.helper"
import { getSingleReview } from "../services/cmsPageView.services"
import Input from "components/input/Input"
import { ratingOptions } from "constant/dropdown.constant"
import { responseType, toastType } from "constant/common.constant"
import { ReviewListType } from "../types/cms.types"
import { ReviewSchema } from "../schema/review.schema"
import { yupResolver } from "@hookform/resolvers/yup"
import { PageNotFound } from "components/pageNotFound/PageNotFound"
import Loading from "components/globalLoader/Loading"
import { FormattedMessage, useIntl } from "react-intl"
import CustomSelect from "components/customSelect/CustomSelect"

const CreateReview = () => {
    const intl = useIntl()

    const [varient, setVarient] = useState<string>("Edit")
    const [reviewData, setReviewData] = useState<ReviewListType>()
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const navigate = useNavigate()
    const { reviewId } = useParams()

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<ReviewListType>({
        resolver: yupResolver(ReviewSchema),
        values: reviewData ? reviewData : undefined,
    })

    useEffect(() => {
        if (reviewId) {
            setVarient("Edit")
            getEditableData(reviewId)
        } else {
            setVarient("Create")
        }
    }, [reviewId])

    const getEditableData = async (reviewId: string) => {
        try {
            const response = await getSingleReview(reviewId)
            setReviewData(response.data.data[0])
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const onSubmit = async (values: ReviewListType) => {
        try {
            setButtonLoader(true)
            const formData = new FormData()
            Object.entries(values).forEach((item) => {
                if (item[1]) {
                    if (item[0] === "profile_image") {
                        formData.append(item[0], item[1][0])
                    } else {
                        formData.append(item[0], item[1] as string)
                    }
                }
            })

            const response = await axios.post(
                varient === "Create"
                    ? `${process.env.REACT_APP_API_URL}/cms-review/create`
                    : `${process.env.REACT_APP_API_URL}/cms-review/update`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            if (response?.data.responseType === responseType.Success) {
                showToast(response?.data.message, toastType.Success, intl)
                navigate(`/admin/cms-pages/review-list`)
            } else {
                showToast(response?.data.message, toastType.Error, intl)
            }
            setButtonLoader(false)
        } catch (error) {
            setButtonLoader(false)
            return error
        }
    }

    return (
        <>
            {varient === "Edit" ? (
                <>
                    {!loading ? (
                        <>
                            {reviewData ? (
                                <div className='relative w-full min-w-0 flex-auto p-8'>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='space-y-4 px-5 py-8 rounded-xl shadow-primary-shadow'>
                                            <div className='relative'>
                                                <SectionHeader
                                                    text={
                                                        reviewId ? (
                                                            <FormattedMessage id='Edit_Review' />
                                                        ) : (
                                                            <FormattedMessage id='Add_Review' />
                                                        )
                                                    }
                                                    textClass='text-black'
                                                />
                                                <div className='relative w-full mt-8 border p-5 rounded-xl'>
                                                    <div className='flex flex-wrap gap-y-7'>
                                                        <div className='relative w-full md:w-1/2 px-2'>
                                                            <CustomSelect
                                                                selectedOption={
                                                                    reviewData &&
                                                                    reviewData.rating.toString()
                                                                }
                                                                label={
                                                                    <FormattedMessage id='Rating' />
                                                                }
                                                                options={
                                                                    ratingOptions
                                                                }
                                                                control={
                                                                    control
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                name='rating'
                                                                error={errors}
                                                                required={true}
                                                            />
                                                        </div>

                                                        <div className='relative w-1/3 px-2 '>
                                                            <InputImage
                                                                errors={errors}
                                                                id={`profile_image`}
                                                                register={
                                                                    register
                                                                }
                                                                type='file'
                                                                name={`profile_image`}
                                                                isMulitple={
                                                                    false
                                                                }
                                                                label={
                                                                    <FormattedMessage id='Profile_Image' />
                                                                }
                                                                required={true}
                                                                setValue={
                                                                    setValue
                                                                }
                                                                value={
                                                                    reviewData &&
                                                                    reviewData[
                                                                        "profile_image"
                                                                    ]
                                                                        ? `${REACT_APP_IMAGE_PATH}` +
                                                                          `${reviewData["profile_image"]}`
                                                                        : null
                                                                }
                                                                style={`bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]`}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='mt-8'>
                                                        <p className='text-lg font-medium text-gray-900'>
                                                            {
                                                                <FormattedMessage id='English' />
                                                            }
                                                        </p>
                                                        <div className='flex flex-wrap gap-y-7 mt-2 border py-8 rounded-lg'>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <Input<ReviewListType>
                                                                    id={`customer_designation_en`}
                                                                    type='text'
                                                                    label={
                                                                        <FormattedMessage id='Designation' />
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Designation",
                                                                        }
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <Input<ReviewListType>
                                                                    id={`customer_name_en`}
                                                                    type='text'
                                                                    label={
                                                                        <FormattedMessage id='Customer_Name' />
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Enter_Customer_name",
                                                                        }
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <TextArea<ReviewListType>
                                                                    id={`card_description_en`}
                                                                    label={
                                                                        <FormattedMessage id='Card_Description' />
                                                                    }
                                                                    name={`card_description_en`}
                                                                    register={
                                                                        register
                                                                    }
                                                                    type='textarea'
                                                                    parentClass='mb-30px last:mb-0 !min-h-250px'
                                                                    fieldLimit={
                                                                        100
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Enter_reviews",
                                                                        }
                                                                    )}
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='mt-8'>
                                                        <p className='text-lg font-medium text-gray-900'>
                                                            {
                                                                <FormattedMessage id='Urdu' />
                                                            }
                                                        </p>
                                                        <div className='flex flex-wrap gap-y-7 mt-2 border py-8 rounded-lg'>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <Input<ReviewListType>
                                                                    id={`customer_designation_ur`}
                                                                    type='text'
                                                                    label={
                                                                        <FormattedMessage id='Designation' />
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Designation",
                                                                        }
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <Input<ReviewListType>
                                                                    id={`customer_name_ur`}
                                                                    type='text'
                                                                    label={
                                                                        <FormattedMessage id='Customer_Name' />
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Enter_Customer_name",
                                                                        }
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <TextArea<ReviewListType>
                                                                    id={`card_description_ur`}
                                                                    label={
                                                                        <FormattedMessage id='Card_Description' />
                                                                    }
                                                                    name={`card_description_ur`}
                                                                    register={
                                                                        register
                                                                    }
                                                                    type='textarea'
                                                                    parentClass='mb-30px last:mb-0 !min-h-250px'
                                                                    fieldLimit={
                                                                        100
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Enter_reviews",
                                                                        }
                                                                    )}
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='mt-8'>
                                                        <p className='text-lg font-medium text-gray-900'>
                                                            {
                                                                <FormattedMessage id='Arabic' />
                                                            }
                                                        </p>
                                                        <div className='flex flex-wrap gap-y-7 mt-2 border py-8 rounded-lg'>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <Input<ReviewListType>
                                                                    id={`customer_designation_ar`}
                                                                    type='text'
                                                                    label={
                                                                        <FormattedMessage id='Designation' />
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Designation",
                                                                        }
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <Input<ReviewListType>
                                                                    id={`customer_name_ar`}
                                                                    type='text'
                                                                    label={
                                                                        <FormattedMessage id='Customer_Name' />
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Enter_Customer_name",
                                                                        }
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <TextArea<ReviewListType>
                                                                    id={`card_description_ar`}
                                                                    label={
                                                                        <FormattedMessage id='Card_Description' />
                                                                    }
                                                                    name={`card_description_ar`}
                                                                    register={
                                                                        register
                                                                    }
                                                                    type='textarea'
                                                                    parentClass='mb-30px last:mb-0 !min-h-250px'
                                                                    fieldLimit={
                                                                        100
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Enter_reviews",
                                                                        }
                                                                    )}
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-4 mt-8 mb-5 '>
                                            <Button
                                                text={
                                                    <FormattedMessage id='Cancel' />
                                                }
                                                type='button'
                                                disable={buttonLoader}
                                                className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                                onClick={() => {
                                                    // reset();
                                                    navigate(
                                                        `/admin/cms-pages/review-list`
                                                    )
                                                }}
                                            ></Button>
                                            <Button
                                                text={
                                                    <FormattedMessage id='Update' />
                                                }
                                                type='submit'
                                                loader={buttonLoader}
                                                className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                            ></Button>
                                        </div>
                                    </form>
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='space-y-4 px-5 py-8 rounded-xl shadow-primary-shadow'>
                        <div className='relative'>
                            <SectionHeader
                                text={
                                    reviewId ? (
                                        <FormattedMessage id='Edit_Review' />
                                    ) : (
                                        <FormattedMessage id='Add_Review' />
                                    )
                                }
                                textClass='text-black'
                            />
                            <div className='relative w-full mt-8 border p-5 rounded-xl'>
                                <div className='flex flex-wrap gap-y-7'>
                                    <div className='relative w-full md:w-1/2 px-2'>
                                        <CustomSelect
                                            selectedOption={
                                                reviewData &&
                                                String(reviewData.rating)
                                            }
                                            label={
                                                <FormattedMessage id='Rating' />
                                            }
                                            options={ratingOptions}
                                            control={control}
                                            register={register}
                                            name='rating'
                                            error={errors}
                                            required={true}
                                        />
                                    </div>

                                    <div className='relative w-1/3 px-2 '>
                                        <InputImage
                                            errors={errors}
                                            id={`profile_image`}
                                            register={register}
                                            type='file'
                                            name={`profile_image`}
                                            isMulitple={false}
                                            label={
                                                <FormattedMessage id='Profile_Image' />
                                            }
                                            required={true}
                                            setValue={setValue}
                                            value={
                                                reviewData &&
                                                reviewData["profile_image"]
                                                    ? `${REACT_APP_IMAGE_PATH}` +
                                                      `${reviewData["profile_image"]}`
                                                    : null
                                            }
                                            style={`bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]`}
                                        />
                                    </div>
                                </div>

                                <div className='mt-8'>
                                    <p className='text-lg font-medium text-gray-900'>
                                        {<FormattedMessage id='English' />}
                                    </p>
                                    <div className='flex flex-wrap gap-y-7 mt-2 border py-8 rounded-lg'>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <Input<ReviewListType>
                                                id={`customer_designation_en`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Designation' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Designation",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <Input<ReviewListType>
                                                id={`customer_name_en`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Customer_Name' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_Customer_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <TextArea<ReviewListType>
                                                id={`card_description_en`}
                                                label={
                                                    <FormattedMessage id='Card_Description' />
                                                }
                                                name={`card_description_en`}
                                                register={register}
                                                type='textarea'
                                                parentClass='mb-30px last:mb-0 !min-h-250px'
                                                fieldLimit={100}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_reviews",
                                                    }
                                                )}
                                                errors={errors}
                                                required={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-8'>
                                    <p className='text-lg font-medium text-gray-900'>
                                        {<FormattedMessage id='Urdu' />}
                                    </p>
                                    <div className='flex flex-wrap gap-y-7 mt-2 border py-8 rounded-lg'>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <Input<ReviewListType>
                                                id={`customer_designation_ur`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Designation' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Designation",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <Input<ReviewListType>
                                                id={`customer_name_ur`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Customer_Name' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_Customer_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <TextArea<ReviewListType>
                                                id={`card_description_ur`}
                                                label={
                                                    <FormattedMessage id='Card_Description' />
                                                }
                                                name={`card_description_ur`}
                                                register={register}
                                                type='textarea'
                                                parentClass='mb-30px last:mb-0 !min-h-250px'
                                                fieldLimit={100}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_reviews",
                                                    }
                                                )}
                                                errors={errors}
                                                required={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-8'>
                                    <p className='text-lg font-medium text-gray-900'>
                                        {<FormattedMessage id='Arabic' />}
                                    </p>
                                    <div className='flex flex-wrap gap-y-7 mt-2 border py-8 rounded-lg'>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <Input<ReviewListType>
                                                id={`customer_designation_ar`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Designation' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Designation",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <Input<ReviewListType>
                                                id={`customer_name_ar`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Customer_Name' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_Customer_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <TextArea<ReviewListType>
                                                id={`card_description_ar`}
                                                label={
                                                    <FormattedMessage id='Card_Description' />
                                                }
                                                name={`card_description_ar`}
                                                register={register}
                                                type='textarea'
                                                parentClass='mb-30px last:mb-0 !min-h-250px'
                                                fieldLimit={100}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_reviews",
                                                    }
                                                )}
                                                errors={errors}
                                                required={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-4 mt-8 mb-5 '>
                        <Button
                            text={<FormattedMessage id='Cancel' />}
                            type='button'
                            disable={buttonLoader}
                            className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                            onClick={() => {
                                navigate(`/admin/cms-pages/review-list`)
                            }}
                        ></Button>
                        <Button
                            text={<FormattedMessage id='Save' />}
                            type='submit'
                            loader={buttonLoader}
                            className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                        ></Button>
                    </div>
                </form>
            )}
        </>
    )
}

export default CreateReview
