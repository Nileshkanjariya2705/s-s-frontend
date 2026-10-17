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
import { ContactSchema } from "../schema/contact.schema"
import { updateContactUs } from "../services/cmsPageView.services"
import { CmsType, UserContactType } from "../types/cms.types"
import { FormattedMessage, useIntl } from "react-intl"
import Loading from "components/globalLoader/Loading"

const Contact = ({ data }: { data: CmsType }) => {
    const intl = useIntl()

    const navigate = useNavigate()
    const [lang, setLang] = useState<string>("cms_content_en")
    const [defaultValues, setDefaultValue] = useState(
        JSON.parse(data.cms_content_en)
    )
    const [loading, setLoading] = useState<boolean>(true)
    const [btnLoader, setButtonLoader] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<UserContactType>({
        resolver: yupResolver(ContactSchema),
        values: defaultValues,
    })
    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setButtonLoader(true)
            const formData: FormData = new FormData()
            for (const key in values) {
                if (values.hasOwnProperty(key)) {
                    if (key === "contact" && values.contact) {
                        values.contact.length > 0 &&
                            values.contact.map((file: { image: File[] }) => {
                                let images = file?.image[0]
                                if (
                                    file !== undefined &&
                                    images &&
                                    typeof images === "object"
                                ) {
                                    formData.append("contact", images)
                                }
                            })
                    }
                }
            }
            formData.append(lang, JSON.stringify(values))
            const response = await updateContactUs(formData)
            if (response?.data.responseType === responseType.Success) {
                showToast(response?.data.message, toastType.Success, intl)
                navigate("/admin/cms-pages")
            }
            setButtonLoader(false)
        } catch (error) {}
    }
    useEffect(() => {
        if (lang === "cms_content_en") {
            setDefaultValue(JSON.parse(data?.cms_content_en ?? "{}"))
            setLoading(false)
        } else if (lang === "cms_content_ur") {
            setDefaultValue(JSON.parse(data?.cms_content_ur ?? "{}"))
            setLoading(false)
        } else if (lang === "cms_content_ar") {
            setDefaultValue(JSON.parse(data?.cms_content_ar ?? "{}"))
            setLoading(false)
        }
    }, [lang])
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
                                                English
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
                                    text={
                                        <FormattedMessage id='Contact_Us_Section' />
                                    }
                                    parentClass='text-black'
                                    textClass='text-black !text-base md:!text-xl'
                                />
                                <div className='flex flex-wrap gap-y-4  -mx-2  mt-8 items-start'>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2  gap-y-4 flex flex-wrap'>
                                        <div className='relative w-full'>
                                            <Input
                                                id='pageTitle'
                                                type='text'
                                                label={
                                                    <FormattedMessage id='PageTitle' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Page_title",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='relative w-full'>
                                            <Input<UserContactType>
                                                id='heading'
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Heading' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Heading",
                                                    }
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className='w-full md:w-1/2 xl:w-1/3 px-2 relative '>
                                        <TextArea<UserContactType>
                                            id='subHeding'
                                            label={
                                                <FormattedMessage id='subHeading' />
                                            }
                                            name='subHeding'
                                            register={register}
                                            errors={errors}
                                            type='textarea'
                                            parentClass='mb-30px last:mb-0'
                                            fieldLimit={500}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Subheading",
                                            })}
                                        />
                                    </div>
                                    <div className='w-full md:w-1/2 xl:w-1/3 px-2 relative mt-2'>
                                        <InputImage
                                            errors={errors}
                                            id={`contact.${0}.image`}
                                            errorKey={`contact.${0}.image`}
                                            register={register}
                                            type='file'
                                            value={
                                                defaultValues?.contact &&
                                                defaultValues?.contact.length
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.contact?.[0]?.image}`
                                                    : null
                                            }
                                            setValue={setValue}
                                            index={0}
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                    <div className='w-full md:w-1/2 xl:w-1/3 px-2 relative'>
                                        <Input
                                            id='supportTitle'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Title_For_Support' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Support_title",
                                            })}
                                        />
                                    </div>
                                    <div className='w-full md:w-1/2 xl:w-1/3 px-2 relative'>
                                        <Input
                                            id='title1'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Card_Title' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Enter_title",
                                            })}
                                        />
                                    </div>

                                    <div className='w-full md:w-1/2 xl:w-1/3 px-2 relative '>
                                        <Input
                                            id='subTitle1'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Card_SubTitle' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Enter_subTitle",
                                            })}
                                        />
                                    </div>

                                    <div className='w-full md:w-1/2 xl:w-1/3 px-2 relative '>
                                        <Input
                                            id='title2'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Card_Title' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Enter_title",
                                            })}
                                        />
                                    </div>
                                    <div className='w-full md:w-1/2 xl:w-1/3 px-2 relative '>
                                        <Input
                                            id='subTitle2'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Card_SubTitle' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Enter_subTitle",
                                            })}
                                        />
                                    </div>

                                    <div className='w-full md:w-1/2 xl:w-1/3 px-2 relative '>
                                        <Input
                                            id='title3'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Card_Title' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Enter_title",
                                            })}
                                        />
                                    </div>
                                    <div className='w-full md:w-1/2 xl:w-1/3 px-2 relative '>
                                        <Input
                                            id='subTitle3'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Card_SubTitle' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Enter_subTitle",
                                            })}
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
                                    text={<FormattedMessage id="Update" />}
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

export default Contact
