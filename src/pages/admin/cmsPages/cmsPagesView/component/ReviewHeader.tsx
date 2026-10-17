import { useFieldArray, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { updateReview } from "../services/cmsPageView.services"

import { showToast } from "helper/toast.helper"
import { responseType, toastType } from "constant/common.constant"
import { yupResolver } from "@hookform/resolvers/yup"
import { reviewHeaderSchema } from "../schema/review.schema"
import { useState } from "react"

import TextArea from "components/textArea/Textarea"
import SectionHeader from "components/sectionHeader/SectionHeader"
import { Button } from "components/button/Button"
import Input from "components/input/Input"
import {
    CmsType,
    ReviewHeaderFormFields,
    reviewHeader,
} from "../types/cms.types"
import { FormattedMessage, useIntl } from "react-intl"

const Review = ({ data }: { data: CmsType }) => {
    const intl = useIntl()

    const navigate = useNavigate()
    const cmsParams = useParams()
    const [lang, setLang] = useState<"en" | "ur" | "ar">("en")
    const [btnLoader, setButtonLoader] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<ReviewHeaderFormFields>({
        resolver: yupResolver(reviewHeaderSchema),
        values: JSON.parse(data?.[`cms_content_${lang}`]),
    })

    const { fields } = useFieldArray({
        control,
        name: "reviewHeaderSection",
    })

    const onSubmit = async (values: ReviewHeaderFormFields) => {
        try {
            setButtonLoader(true)
            const response = await updateReview({
                page: cmsParams.page,
                data: values,
                key: `cms_content_${lang}`,
            })

            if (response?.data?.responseType === responseType.Success) {
                showToast(response?.data.message, toastType.Success, intl)
                navigate("/admin/cms-pages")
            }
            setButtonLoader(false)
        } catch (error) {
            setButtonLoader(false)
        }
    }

    return (
        <>
            <div className='border border-black/10 rounded-xl p-5'>
                <div className='relative mb-5'>
                    <ul className='border-b border-primarycolor/20  flex items-center w-full mt-4'>
                        <li>
                            <button
                                type='button'
                                onClick={() => setLang("en")}
                                className={`text-base font-medium px-3  pb-2${
                                    lang === "en"
                                        ? `  border-primarycolor  border-b-2 text-primarycolor`
                                        : ` text-black/50`
                                } `}
                            >
                                English
                            </button>
                        </li>

                        <li>
                            <button
                                type='button'
                                onClick={() => setLang("ur")}
                                className={`text-base font-medium px-3  pb-2 ${
                                    lang === "ur"
                                        ? `  border-primarycolor  border-b-2 text-primarycolor`
                                        : ` text-black/50`
                                } `}
                            >
                                {<FormattedMessage id='Urdu' />}
                            </button>
                        </li>
                        <li>
                            <button
                                type='button'
                                onClick={() => setLang("ar")}
                                className={`text-base font-medium px-3  pb-2 ${
                                    lang === "ar"
                                        ? `  border-primarycolor  border-b-2 text-primarycolor`
                                        : ` text-black/50`
                                } `}
                            >
                                {<FormattedMessage id='Arabic' />}
                            </button>
                        </li>
                    </ul>
                </div>
                <SectionHeader
                    text={<FormattedMessage id='Review_Section' />}
                    textClass='text-black !text-base md:!text-xl'
                />

                <form onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((item: reviewHeader, index: number) => (
                        <div
                            className='relative flex flex-wrap gap-y-4 pb-8 -mx-2 border-b border-slate-200 mt-5 items-start'
                            key={item.id}
                        >
                            <div className=' relative w-full md:w-1/2 xl:w-1/3 px-2 flex flex-wrap gap-y-4 '>
                                <Input<ReviewHeaderFormFields>
                                    required={true}
                                    errors={errors}
                                    register={register}
                                    type='text'
                                    id={`reviewHeaderSection.${index}.page`}
                                    label={<FormattedMessage id='Page' />}
                                    readonly={true}
                                />
                            </div>

                            <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 flex flex-wrap gap-y-4 '>
                                <Input<ReviewHeaderFormFields>
                                    errors={errors}
                                    register={register}
                                    type='text'
                                    id={`reviewHeaderSection.${index}.heading`}
                                    label={
                                        <FormattedMessage id='Review_Heading' />
                                    }
                                    required={true}
                                    errorKey={`reviewHeaderSection.${index}.heading`}
                                    placeholder={intl.formatMessage({
                                        id: "Heading",
                                    })}
                                />
                            </div>
                            <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 flex flex-wrap gap-y-4 '>
                                <TextArea<ReviewHeaderFormFields>
                                    id={`reviewHeaderSection.${index}.description`}
                                    label={
                                        <FormattedMessage id='Review_Description' />
                                    }
                                    name={`reviewHeaderSection.${index}.description`}
                                    register={register}
                                    type='textarea'
                                    parentClass='mb-30px last:mb-0 !min-h-250px'
                                    errors={errors}
                                    required={true}
                                    errorKey={`reviewHeaderSection.${index}.description`}
                                    placeholder={intl.formatMessage({
                                        id: "Enter_description",
                                    })}
                                />
                            </div>

                            {/* {index !== 0 && (
                <div className="relative w-full">
                  <Button
                    className="text-base font-medium text-secondaryOrange border border-secondaryOrange py-2.5 px-10 rounded-full transition-all duration-300 hover:bg-secondaryOrange hover:text-white"
                    type="button"
                    disable={btnLoader}
                    onClick={() => remove(index)}
                  >
                    {<FormattedMessage id="Remove" />}
                  </Button>
                </div>
              )} */}
                            <hr className='border-black/10 my-5' />
                        </div>
                    ))}

                    <div className='flex gap-4 py-8 pb-0 '>
                        <Button
                            text={<FormattedMessage id='Cancel' />}
                            type='button'
                            disable={btnLoader}
                            className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                            onClick={() => {
                                reset()
                                navigate("/admin/cms-pages")
                            }}
                        ></Button>
                        <Button
                            text={<FormattedMessage id='Update' />}
                            type='submit'
                            loader={btnLoader}
                            className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                        ></Button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Review
