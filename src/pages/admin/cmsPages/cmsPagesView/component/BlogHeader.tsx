import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import {
    BlogHeaderType,
    CmsType,
    SingleBlogHeaderType,
} from "../types/cms.types"
import { showToast } from "helper/toast.helper"
import { useNavigate } from "react-router-dom"
import { updateBlogHeader } from "../services/cmsPageView.services"
import { responseType, toastType } from "constant/common.constant"

import { yupResolver } from "@hookform/resolvers/yup"
import { blogHeaderSchema } from "../schema/blog.schema"

import { useEffect, useState } from "react"
import SectionHeader from "components/sectionHeader/SectionHeader"
import Input from "components/input/Input"
import { Button } from "components/button/Button"
import { FormattedMessage, useIntl } from "react-intl"
import Loading from "components/globalLoader/Loading"
import TextArea from "components/textArea/Textarea"

const BlogHeader = ({ data }: { data: CmsType }) => {
    const intl = useIntl()

    const [lang, setLang] = useState<"en" | "ur" | "ar">("en")

    const navigate = useNavigate()
    const [blogHeaderSection, setBlogHeaderSection] = useState<BlogHeaderType>(
        JSON.parse(data?.[`cms_content_${lang}`])
    )
    const [loading, setLoading] = useState<boolean>(true)
    const [btnLoader, setBtnLoader] = useState<boolean>(false)

    useEffect(() => {
        setBlogHeaderSection(JSON.parse(data?.[`cms_content_${lang}`]))
        setLoading(false)
    }, [lang])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(blogHeaderSchema),
        values: blogHeaderSection,
    })

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setBtnLoader(true)
            const response = await updateBlogHeader(
                JSON.stringify(values),
                lang
            )
            if (response?.data.responseType === responseType.Success) {
                showToast(response.data.message, toastType.Success, intl)
                navigate("/admin/cms-pages")
            } else {
                showToast(response?.data.message, toastType.Error, intl)
            }
            setBtnLoader(false)
        } catch (error) {
            return error
        }
    }

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className='border border-black/10 rounded-xl p-5'>
                        <div className='relative mb-5'>
                            <ul className='border-b border-primarycolor/20  flex items-center w-full'>
                                <li>
                                    <button
                                        type='button'
                                        onClick={() => setLang("en")}
                                        className={`text-base font-medium px-3  pb-2 ${
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
                            text={<FormattedMessage id='Blogs_Section' />}
                            textClass='text-black !text-base md:!text-xl'
                        />

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <>
                                <div className=' relative w-full md:w-1/2 px-2 mt-5'>
                                    <Input
                                        required={true}
                                        errors={errors}
                                        register={register}
                                        type='text'
                                        id={`page_banner`}
                                        label={
                                            <FormattedMessage id='Blog_Page_Banner' />
                                        }
                                        errorKey={`page_banner`}
                                        placeholder={intl.formatMessage({
                                            id: "Page_banner",
                                        })}
                                    />
                                </div>
                                {blogHeaderSection?.blogData?.map(
                                    (
                                        blogData: SingleBlogHeaderType,
                                        index: number
                                    ) => {
                                        return (
                                            <>
                                                {blogData && (
                                                    <>
                                                        <div className='relative flex flex-wrap gap-y-4 py-5 border-b border-slate-200 '>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <Input
                                                                    required={
                                                                        true
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    type='text'
                                                                    id={`blogData.${index}.page`}
                                                                    label={
                                                                        <FormattedMessage id='Page' />
                                                                    }
                                                                    readonly={
                                                                        true
                                                                    }
                                                                    errorKey={`blogData.${index}.page`}
                                                                />
                                                            </div>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <Input
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    type='text'
                                                                    id={`blogData.${index}.heading`}
                                                                    label={
                                                                        <FormattedMessage id='Blog_Heading' />
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                    errorKey={`blogData.${index}.heading`}
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Heading",
                                                                        }
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <TextArea
                                                                    id={`blogData.${index}.description`}
                                                                    label={
                                                                        <FormattedMessage id='Blog_Description' />
                                                                    }
                                                                    name={`blogData.${index}.description`}
                                                                    register={
                                                                        register
                                                                    }
                                                                    type='textarea'
                                                                    parentClass='mb-30px last:mb-0 !min-h-250px'
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    errorKey={`blogData.${index}.description`}
                                                                    required={
                                                                        true
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Enter_description",
                                                                        }
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )
                                    }
                                )}
                                <div className='flex gap-4 max-w-md mt-8 '>
                                    <Button
                                        text={<FormattedMessage id='Cancel' />}
                                        type='button'
                                        disable={btnLoader}
                                        className='w-full px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange hover:border-secondaryOrange focus:ring-0 focus:outline-0'
                                        onClick={() => {
                                            reset()
                                            navigate("/admin/cms-pages")
                                        }}
                                    ></Button>
                                    <Button
                                        text={<FormattedMessage id='Update' />}
                                        type='submit'
                                        loader={btnLoader}
                                        className='w-full px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                    ></Button>
                                </div>
                            </>
                        </form>
                    </div>
                </>
            )}
        </>
    )
}

export default BlogHeader
