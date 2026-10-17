import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "components/button/Button"
import Input from "components/input/Input"
import InputImage from "components/input/InputImage"
import SectionHeader from "components/sectionHeader/SectionHeader"
import TextArea from "components/textArea/Textarea"
import { REACT_APP_IMAGE_PATH } from "config"
import { responseType, toastType } from "constant/common.constant"
import { showToast } from "helper/toast.helper"
import { useEffect, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { FaqSchema } from "../schema/faq.schema"
import { updateFaqPage } from "../services/cmsPageView.services"
import { CmsType, FaqType } from "../types/cms.types"
import { FormattedMessage, useIntl } from "react-intl"
import Loading from "components/globalLoader/Loading"

const Faq = ({ data }: { data: CmsType }) => {
    const intl = useIntl()

    const navigate = useNavigate()
    const [lang, setLang] = useState<string>("cms_content_en")
    const [btnLoader, setBtnLoader] = useState<boolean>(false)
    const [defaultValues, setDefaultValue] = useState(
        JSON.parse(data.cms_content_en)
    )
    const [loading, setLoading] = useState<boolean>(false)
    const {
        register,
        reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<FaqType>({
        resolver: yupResolver(FaqSchema),
        values: defaultValues,
    })
    useEffect(() => {
        if (lang === "cms_content_en") {
            setDefaultValue(JSON.parse(data?.cms_content_en ?? "{}"))
            setLoading(false)
        } else if ("cms_content_ur") {
            setDefaultValue(JSON.parse(data?.cms_content_ur ?? "{}"))
            setLoading(false)
        } else if ("cms_content_ar") {
            setDefaultValue(JSON.parse(data?.cms_content_ar ?? "{}"))
            setLoading(false)
        }
    }, [lang])
    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setBtnLoader(true)
            const formData: FormData = new FormData()
            for (const key in values) {
                if (values.hasOwnProperty(key)) {
                    if (key === "faqImage" && values.faqImage) {
                        values.faqImage.length > 0 &&
                            values.faqImage.map((item: { image: File[] }) => {
                                let images = item?.image[0]
                                if (
                                    item !== undefined &&
                                    images &&
                                    typeof images === "object"
                                ) {
                                    formData.append("faqImage", images)
                                }
                            })
                    }
                }
            }
            formData.append(lang, JSON.stringify(values))
            const response = await updateFaqPage(formData)
            if (response?.data.responseType === responseType.Success) {
                showToast(response?.data.message, toastType.Success, intl)
                navigate("/admin/cms-pages")
            }
            setBtnLoader(false)
        } catch (error) {}
    }
    function handleLangChange(lang: string) {
        setLang(lang)
    }
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='border border-black/10 rounded-xl p-5'>
                            <div className='relative pb-8'>
                                <div className='relative mb-5'>
                                    <ul className='border-b border-primarycolor/20  flex items-center w-full'>
                                        <li>
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    handleLangChange(
                                                        "cms_content_en"
                                                    )
                                                }
                                                className={`text-base font-medium px-3  pb-2 ${
                                                    lang === "cms_content_en"
                                                        ? `  border-primarycolor  border-b-2 text-primarycolor`
                                                        : ` text-black/50`
                                                } `}
                                            >
                                                {
                                                    <FormattedMessage id='English' />
                                                }
                                            </button>
                                        </li>

                                        <li>
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    handleLangChange(
                                                        "cms_content_ur"
                                                    )
                                                }
                                                className={`text-base font-medium px-3  pb-2 ${
                                                    lang === "cms_content_ur"
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
                                                onClick={() =>
                                                    handleLangChange(
                                                        "cms_content_ar"
                                                    )
                                                }
                                                className={`text-base font-medium px-3  pb-2 ${
                                                    lang === "cms_content_ar"
                                                        ? `  border-primarycolor  border-b-2 text-primarycolor`
                                                        : ` text-black/50`
                                                } `}
                                            >
                                                {
                                                    <FormattedMessage id='Arabic' />
                                                }
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <SectionHeader
                                    text={<FormattedMessage id='Heading' />}
                                    textClass='text-black !text-base md:!text-xl'
                                />
                                <div className='flex flex-wrap gap-y-4 -mx-2 mt-8'>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input<FaqType>
                                            id='faqHeading'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Heading' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Faq_heading",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                        <TextArea<FaqType>
                                            id='faqSubHeading'
                                            label={
                                                <FormattedMessage id='subHeading' />
                                            }
                                            name='faqSubHeading'
                                            register={register}
                                            errors={errors}
                                            type='textarea'
                                            parentClass='mb-30px last:mb-0'
                                            fieldLimit={500}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Faq_subHeading",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 mt-2'>
                                        <InputImage<FaqType>
                                            errors={errors}
                                            id={`faqImage.${0}.image`}
                                            errorKey={`faqImage.${0}.image`}
                                            register={register}
                                            type='file'
                                            value={
                                                defaultValues?.faqImage &&
                                                defaultValues?.faqImage.length
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.faqImage?.[0].image}`
                                                    : null
                                            }
                                            setValue={setValue}
                                            index={0}
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex gap-4 py-5 md:py-8 pb-0 border-black/10 border-t'>
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
                        </div>
                    </form>
                </>
            )}
        </>
    )
}

export default Faq
