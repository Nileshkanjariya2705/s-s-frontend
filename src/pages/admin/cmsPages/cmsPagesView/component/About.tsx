import { Button } from "components/button/Button"
import Input from "components/input/Input"
import InputImage from "components/input/InputImage"
import SectionHeader from "components/sectionHeader/SectionHeader"

import { REACT_APP_IMAGE_PATH } from "../../../../../config"
import { Link, useNavigate } from "react-router-dom"

import { updateAboutUs } from "../services/cmsPageView.services"
import { yupResolver } from "@hookform/resolvers/yup"
import { aboutUsValidationSchema } from "../schema/aboutUs.schema"

import { useEffect, useState } from "react"
import { AboutUsType, CmsType } from "../types/cms.types"
import { useForm } from "react-hook-form"
import TextArea from "components/textArea/Textarea"
import { FormattedMessage, useIntl } from "react-intl"
import { responseType, toastType } from "constant/common.constant"
import { showToast } from "helper/toast.helper"
import Loading from "components/globalLoader/Loading"

const About = ({ data }: { data: CmsType }) => {
    const intl = useIntl()

    const [lang, setLang] = useState<string>("cms_content_en")
    const [defaultValues, setDefaultValue] = useState(
        JSON.parse(data?.cms_content_en ?? "{}")
    )
    const [loading, setLoading] = useState<boolean>(true)
    const [btnLoader, setButtonLoader] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,

        watch,
    } = useForm<AboutUsType>({
        resolver: yupResolver(aboutUsValidationSchema),
        values: defaultValues,
    })

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
    // const banner_section_img = watch("banner_section_img", []);
    const banner_section_collections = watch("banner_section_collections", [])

    const navigate = useNavigate()

    const onSubmit = handleSubmit(async (values: AboutUsType) => {
        try {
            setButtonLoader(true)
            const formData: FormData = new FormData()
            for (const key in values) {
                if (values.hasOwnProperty(key)) {
                    if (
                        key === "banner_section_img" &&
                        values.banner_section_img &&
                        values.banner_section_img !== null
                    ) {
                        values.banner_section_img.length > 0 &&
                            values.banner_section_img.map(
                                (file: { image: File[] }, index: number) => {
                                    if (
                                        file &&
                                        file !== undefined &&
                                        typeof file?.image !== "string" &&
                                        file?.image?.[0] !== undefined
                                    ) {
                                        let images = file?.image
                                        formData.append(
                                            "banner_section_img",
                                            images[0]
                                        )
                                    } else {
                                        values.banner_section_img[index] = {
                                            image: file?.image,
                                        }
                                    }
                                }
                            )
                    } else if (key === "our_team" && values.our_team) {
                        values.our_team.length > 0 &&
                            values.our_team.map((item: { image?: File[] }) => {
                                let images = item?.image
                                if (
                                    item !== undefined &&
                                    images &&
                                    typeof images === "object"
                                ) {
                                    formData.append("our_team", images[0])
                                }
                            })
                    } else if (
                        key === "choose_us_card" &&
                        values.choose_us_card
                    ) {
                        values.choose_us_card.length > 0 &&
                            values.choose_us_card.map(
                                (item: { image?: File[] }) => {
                                    let images = item?.image

                                    if (
                                        item !== undefined &&
                                        images &&
                                        item?.image !== undefined &&
                                        typeof images === "object"
                                    ) {
                                        formData.append(
                                            "choose_us_card",
                                            images[0]
                                        )
                                    }
                                }
                            )
                    }
                }
            }

            formData.append(lang, JSON.stringify(values))
            const response = await updateAboutUs(formData)
            if (response?.data.responseType === responseType.Success) {
                showToast(response?.data.message, toastType.Success, intl)
                navigate("/admin/cms-pages")
            }
            setButtonLoader(false)
        } catch (error) {
            setButtonLoader(false)
            return error
        }
    })

    function handleLangChange(lang: string) {
        setLang(lang)
    }
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <form onSubmit={onSubmit}>
                        <div className='border border-black/10 rounded-xl p-5'>
                            <div className='relative'>
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
                                                className={`text-base font-medium px-3  pb-2${
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
                                        <FormattedMessage id='Banner_Section' />
                                    }
                                    textClass='text-black !text-base md:!text-xl'
                                />

                                <div className='flex flex-wrap gap-y-4 mt-8 -mx-2 item-start'>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 flex flex-wrap gap-y-4 '>
                                        <div className='w-full'>
                                            <Input
                                                required={true}
                                                errors={errors}
                                                register={register}
                                                type='text'
                                                id={`about_page_banner`}
                                                label={
                                                    <FormattedMessage id='Blog_Page_Banner' />
                                                }
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Page_banner",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className='w-full'>
                                            <Input
                                                id='banner_section_heading'
                                                required={true}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Heading' />
                                                }
                                                register={register}
                                                errors={errors}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "About_heading",
                                                    }
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <div className='w-full'>
                                            <TextArea
                                                id='banner_section_subheading'
                                                label={
                                                    <FormattedMessage id='Sub_heading' />
                                                }
                                                name='banner_section_subheading'
                                                register={register}
                                                type='textarea'
                                                parentClass='mb-30px last:mb-0'
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "About_subHeading",
                                                    }
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input
                                            id={`button_text`}
                                            type='text'
                                            label={
                                                <FormattedMessage id='Button_Text' />
                                            }
                                            register={register}
                                            required={true}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_buttonText",
                                            })}
                                        />
                                    </div>

                                    {banner_section_collections &&
                                        banner_section_collections?.map(
                                            (
                                                banner_section_collections: object,
                                                index: number
                                            ) => {
                                                return (
                                                    <>
                                                        {banner_section_collections && (
                                                            <>
                                                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                                                    <Input
                                                                        key={`banner_section_collection_1`}
                                                                        required={
                                                                            true
                                                                        }
                                                                        id={`banner_section_collections.${index}.value`}
                                                                        type='text'
                                                                        label={
                                                                            <FormattedMessage id='Collection_Value' />
                                                                        }
                                                                        register={
                                                                            register
                                                                        }
                                                                        errorKey={`banner_section_collections.${index}.value`}
                                                                        errors={
                                                                            errors
                                                                        }
                                                                        placeholder={intl.formatMessage(
                                                                            {
                                                                                id: "About_collectionValue",
                                                                            }
                                                                        )}
                                                                    />
                                                                </div>
                                                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                                                    <Input
                                                                        key={`banner_section_collection_2`}
                                                                        required={
                                                                            true
                                                                        }
                                                                        id={`banner_section_collections.${index}.text`}
                                                                        type='text'
                                                                        label={
                                                                            <FormattedMessage id='Collection_Text' />
                                                                        }
                                                                        register={
                                                                            register
                                                                        }
                                                                        errorKey={`banner_section_collections.${index}.text`}
                                                                        errors={
                                                                            errors
                                                                        }
                                                                        placeholder={intl.formatMessage(
                                                                            {
                                                                                id: "About_collectionText",
                                                                            }
                                                                        )}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )
                                            }
                                        )}
                                </div>
                                <div className='flex flex-wrap -mx-2'>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <InputImage
                                            errors={errors}
                                            id={`banner_section_img.${0}.image`}
                                            errorKey={`banner_section_img.0.image`}
                                            register={register}
                                            setValue={setValue}
                                            index={1}
                                            value={
                                                !!defaultValues
                                                    ?.banner_section_img?.[0]
                                                    ?.image
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.banner_section_img?.[0]?.image}`
                                                    : null
                                            }
                                            type='file'
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <InputImage
                                            errors={errors}
                                            id={`banner_section_img.${1}.image`}
                                            errorKey={`banner_section_img.1.image`}
                                            register={register}
                                            setValue={setValue}
                                            index={1}
                                            value={
                                                !!defaultValues
                                                    ?.banner_section_img?.[1]
                                                    ?.image
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.banner_section_img?.[1]?.image}`
                                                    : null
                                            }
                                            type='file'
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='relative'>
                                <hr className='border-slate-200 my-7 px-2' />
                                <SectionHeader
                                    text={
                                        <FormattedMessage id='Why_to_Choose_Us' />
                                    }
                                    textClass=' !text-base md:!text-xl'
                                />
                                <div className='flex flex-wrap gap-y-4 mt-8 -mx-2 item-start '>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input
                                            required={true}
                                            id='choose_us_header'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Heading' />
                                            }
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_choose_heading",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <TextArea
                                            required={true}
                                            id='choose_us_description'
                                            label={
                                                <FormattedMessage id='Description' />
                                            }
                                            name='choose_us_description'
                                            register={register}
                                            type='textarea'
                                            errors={errors}
                                            parentClass='mb-30px last:mb-0'
                                            placeholder={intl.formatMessage({
                                                id: "About_choose_desc",
                                            })}
                                        />
                                    </div>

                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 mt-2'>
                                        <InputImage
                                            required={true}
                                            errors={errors}
                                            id={`choose_us_card.${0}.image`}
                                            errorKey={`choose_us_card.0.image`}
                                            register={register}
                                            setValue={setValue}
                                            index={0}
                                            value={
                                                !!defaultValues
                                                    ?.choose_us_card?.[0]?.image
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.choose_us_card?.[0]?.image}`
                                                    : null
                                            }
                                            type='file'
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input<AboutUsType>
                                            key={`chooce_us_card_header_1`}
                                            type='text'
                                            required={true}
                                            label={
                                                <FormattedMessage id='Card_Heading' />
                                            }
                                            id={`choose_us_card.${0}.header`}
                                            errorKey={`choose_us_card.0.header`}
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_heading",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                        <div className='relative'>
                                            <TextArea<AboutUsType>
                                                id='choose_us_card.0.description'
                                                label={
                                                    <FormattedMessage id='Card_Description' />
                                                }
                                                name={`choose_us_card.${0}.description`}
                                                register={register}
                                                required={true}
                                                type='textarea'
                                                parentClass='mb-30px last:mb-0'
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "About_card_description",
                                                    }
                                                )}
                                                errorKey={`choose_us_card.0.description`}
                                                errors={errors}
                                            />
                                        </div>
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 mt-2'>
                                        <InputImage
                                            errors={errors}
                                            required={true}
                                            id={`choose_us_card.${1}.image`}
                                            errorKey={`choose_us_card.1.image`}
                                            register={register}
                                            setValue={setValue}
                                            index={1}
                                            value={
                                                !!defaultValues
                                                    ?.choose_us_card?.[1]?.image
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.choose_us_card?.[1]?.image}`
                                                    : null
                                            }
                                            type='file'
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input<AboutUsType>
                                            key={`chooce_us_card_header_2`}
                                            type='text'
                                            label={
                                                <FormattedMessage id='Card_Heading' />
                                            }
                                            id={`choose_us_card.${1}.header`}
                                            errorKey={`choose_us_card.1.header`}
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_heading",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                        <div className='relative'>
                                            <TextArea<AboutUsType>
                                                id='choose_us_card.1.description'
                                                label={
                                                    <FormattedMessage id='Card_Description' />
                                                }
                                                name={`choose_us_card.${1}.description`}
                                                register={register}
                                                type='textarea'
                                                required={true}
                                                parentClass='mb-30px last:mb-0'
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "About_card_description",
                                                    }
                                                )}
                                                errorKey={`choose_us_card.1.description`}
                                                errors={errors}
                                            />
                                        </div>
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 mt-2'>
                                        <InputImage
                                            errors={errors}
                                            required={true}
                                            id={`choose_us_card.${2}.image`}
                                            errorKey={`choose_us_card.2.image`}
                                            register={register}
                                            setValue={setValue}
                                            index={2}
                                            value={
                                                !!defaultValues
                                                    ?.choose_us_card?.[2]?.image
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.choose_us_card?.[2]?.image}`
                                                    : null
                                            }
                                            type='file'
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input
                                            key={`chooce_us_card_header_3`}
                                            type='text'
                                            required={true}
                                            label={
                                                <FormattedMessage id='Card_Heading' />
                                            }
                                            id={`choose_us_card.${2}.header`}
                                            errorKey={`choose_us_card.2.header`}
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_heading",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                        <div className='relative'>
                                            <TextArea<AboutUsType>
                                                id='choose_us_card.2.description'
                                                label={
                                                    <FormattedMessage id='Card_Description' />
                                                }
                                                name={`choose_us_card.${2}.description`}
                                                register={register}
                                                type='textarea'
                                                parentClass='mb-30px last:mb-0'
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "About_card_description",
                                                    }
                                                )}
                                                errorKey={`choose_us_card.2.description`}
                                                errors={errors}
                                                required={true}
                                            />
                                        </div>
                                    </div>

                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 mt-2'>
                                        <InputImage
                                            errors={errors}
                                            required={true}
                                            id={`choose_us_card.${3}.image`}
                                            register={register}
                                            value={
                                                !!defaultValues
                                                    ?.choose_us_card?.[3]?.image
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.choose_us_card?.[3]?.image}`
                                                    : null
                                            }
                                            index={3}
                                            errorKey={`choose_us_card.3.image`}
                                            type='file'
                                            setValue={setValue}
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input
                                            required={true}
                                            key={`chooce_us_card_header_4`}
                                            type='text'
                                            label={
                                                <FormattedMessage id='Card_Heading' />
                                            }
                                            id={`choose_us_card.${3}.header`}
                                            errorKey={`choose_us_card.3.header`}
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_heading",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                        <TextArea
                                            required={true}
                                            id='choose_us_card.3.description'
                                            label={
                                                <FormattedMessage id='Card_Description' />
                                            }
                                            name={`choose_us_card.${3}.description`}
                                            register={register}
                                            type='textarea'
                                            parentClass='mb-30px last:mb-0'
                                            placeholder={intl.formatMessage({
                                                id: "About_card_description",
                                            })}
                                            errorKey={`choose_us_card.3.description`}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='relative'>
                                <hr className='border-slate-200 my-7 px-2' />
                                <SectionHeader
                                    text={<FormattedMessage id='Our_Team' />}
                                    textClass=' !text-base md:!text-xl'
                                />
                                <div className='flex flex-wrap gap-y-4 mt-8 -mx-2'>
                                    <div className='relative w-full md:w-1/2 px-2'>
                                        <Input
                                            required={true}
                                            id='our_team_header'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Heading' />
                                            }
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_heading",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 px-2'>
                                        <TextArea
                                            required={true}
                                            id='our_team_description'
                                            label={
                                                <FormattedMessage id='Description' />
                                            }
                                            name='our_team_description'
                                            register={register}
                                            type='textarea'
                                            errors={errors}
                                            parentClass='mb-30px last:mb-0'
                                            placeholder={intl.formatMessage({
                                                id: "About_card_description",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 mt-2'>
                                        <InputImage
                                            required={true}
                                            errors={errors}
                                            id={`our_team.${0}.image`}
                                            errorKey={`our_team.0.image`}
                                            register={register}
                                            value={
                                                !!defaultValues?.our_team?.[0]
                                                    ?.image
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.our_team?.[0]?.image}`
                                                    : null
                                            }
                                            setValue={setValue}
                                            index={0}
                                            type='file'
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input<AboutUsType>
                                            key={`our_team_name_1`}
                                            required={true}
                                            type='text'
                                            label={
                                                <FormattedMessage id='Card_Name' />
                                            }
                                            id={`our_team.0.name`}
                                            errorKey={`our_team.0.name`}
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_name",
                                            })}
                                        />
                                    </div>

                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input
                                            required={true}
                                            key={`our_card__position_1`}
                                            type='text'
                                            label={
                                                <FormattedMessage id='Card_Position' />
                                            }
                                            id={`our_team.${0}.position`}
                                            errorKey={`our_team.0.position`}
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_position",
                                            })}
                                        />
                                    </div>

                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 mt-2'>
                                        <InputImage
                                            required={true}
                                            errors={errors}
                                            id={`our_team.${1}.image`}
                                            errorKey={`our_team.1.image`}
                                            value={
                                                !!defaultValues?.our_team?.[1]
                                                    ?.image
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.our_team?.[1]?.image}`
                                                    : null
                                            }
                                            // value={
                                            //   !!JSON.parse(data ?? "{}")?.our_team?.[1]?.image
                                            //     ? `${REACT_APP_IMAGE_PATH}${
                                            //         JSON.parse(data ?? "{}")?.our_team?.[1]?.image
                                            //       }`
                                            //     : null
                                            // }
                                            setValue={setValue}
                                            index={1}
                                            register={register}
                                            type='file'
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input
                                            key={`our_team_name_2`}
                                            type='text'
                                            required={true}
                                            label={
                                                <FormattedMessage id='Card_Name' />
                                            }
                                            id={`our_team.${1}.name`}
                                            errorKey={`our_team.1.name`}
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_name",
                                            })}
                                        />
                                    </div>

                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input
                                            required={true}
                                            key={`our_card__position_2`}
                                            type='text'
                                            label={
                                                <FormattedMessage id='Card_Position' />
                                            }
                                            id={`our_team.${1}.position`}
                                            errorKey={`our_team.1.position`}
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_position",
                                            })}
                                        />
                                    </div>

                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 mt-2'>
                                        <InputImage
                                            value={
                                                !!defaultValues?.our_team?.[2]
                                                    ?.image
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.our_team?.[2]?.image}`
                                                    : null
                                            }
                                            setValue={setValue}
                                            required={true}
                                            index={2}
                                            errors={errors}
                                            id={`our_team.${2}.image`}
                                            errorKey={`our_team.2.image`}
                                            register={register}
                                            type='file'
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input
                                            key={`our_team_name_3`}
                                            type='text'
                                            required={true}
                                            label={
                                                <FormattedMessage id='Card_Name' />
                                            }
                                            id={`our_team.${2}.name`}
                                            errorKey={`our_team.2.name`}
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_name",
                                            })}
                                        />
                                    </div>

                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input
                                            key={`our_card__position_3`}
                                            type='text'
                                            required={true}
                                            label={
                                                <FormattedMessage id='Card_Position' />
                                            }
                                            id={`our_team.${2}.position`}
                                            errorKey={`our_team.2.position`}
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_position",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 mt-2'>
                                        <InputImage
                                            errors={errors}
                                            required={true}
                                            id={`our_team.${3}.image`}
                                            register={register}
                                            value={
                                                !!defaultValues?.our_team?.[3]
                                                    ?.image
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.our_team?.[3]?.image}`
                                                    : null
                                            }
                                            errorKey={`our_team.3.image`}
                                            setValue={setValue}
                                            index={3}
                                            type='file'
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input
                                            key={`our_team_name_4`}
                                            type='text'
                                            required={true}
                                            label={
                                                <FormattedMessage id='Card_Name' />
                                            }
                                            id={`our_team.${3}.name`}
                                            errorKey={`our_team.3.name`}
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_name",
                                            })}
                                        />
                                    </div>

                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                        <Input
                                            key={`our_card__position_4`}
                                            type='text'
                                            required={true}
                                            label={
                                                <FormattedMessage id='Card_Position' />
                                            }
                                            id={`our_team.${3}.position`}
                                            errorKey={`our_team.3.position`}
                                            register={register}
                                            errors={errors}
                                            placeholder={intl.formatMessage({
                                                id: "About_card_position",
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className='relative'>
                                    <hr className='border-slate-200 my-7 px-2' />
                                    <SectionHeader
                                        text={
                                            <FormattedMessage id='About_Blogs_Section' />
                                        }
                                        textClass=' !text-base md:!text-xl'
                                    />
                                    <div className='flex flex-wrap gap-y-4 mt-8'>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <Link
                                                to={`/admin/cms-pages/blog-list`}
                                                className='uppercase px-5 py-3 text-sm font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white inline-flex'
                                            >
                                                {
                                                    <FormattedMessage id='Go_to_Blogs_Section' />
                                                }
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className='relative'>
                                    <hr className='border-slate-200 my-7 px-2' />
                                    <SectionHeader
                                        text={
                                            <FormattedMessage id='Reviews_Section' />
                                        }
                                        textClass=' !text-base md:!text-xl'
                                    />
                                    <div className='flex flex-wrap gap-y-4 mt-8'>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <Link
                                                to={`/admin/cms-pages/review-list`}
                                                className='uppercase px-5 py-3 text-sm font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white inline-flex'
                                            >
                                                {
                                                    <FormattedMessage id='Go_to_Reviews_Section' />
                                                }
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className='relative'>
                                    <hr className='border-slate-200 my-7 px-2' />
                                    <SectionHeader
                                        text={
                                            <FormattedMessage id='FAQ_Section' />
                                        }
                                        textClass=' !text-base md:!text-xl'
                                    />
                                    <div className='flex flex-wrap gap-y-4 mt-8'>
                                        <div className='relative w-full md:w-1/2 px-2'>
                                            <Link
                                                to={`/admin/cms-pages/faq-list`}
                                                className='uppercase px-5 py-3 text-sm font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white inline-flex'
                                            >
                                                {
                                                    <FormattedMessage id='Go_to_Faq_Section' />
                                                }
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex gap-4 mt-8 mb-5 px-5 py-8 rounded-xl shadow-primary-shadow sticky bottom-0 bg-white w-full'>
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

export default About
