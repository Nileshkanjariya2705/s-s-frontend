import {
    Controller,
    FieldValues,
    SubmitHandler,
    useFieldArray,
    useForm,
} from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import {
    getAdminCategory,
    getCategoryWiseData,
    updateHomePage,
} from "../services/cmsPageView.services"
import { responseType, toastType } from "constant/common.constant"
import { HomeSchema } from "../schema/home.schema"
import { yupResolver } from "@hookform/resolvers/yup"
import { ChangeEvent, useEffect, useState } from "react"
import { CmsType, HomeType } from "../types/cms.types"
import SectionHeader from "components/sectionHeader/SectionHeader"
import Input from "components/input/Input"
import TextArea from "components/textArea/Textarea"
import { REACT_APP_IMAGE_PATH } from "config"
import InputImage from "components/input/InputImage"
import { Button } from "components/button/Button"
import { showToast } from "helper/toast.helper"
import { NewCategoryType } from "pages/supplier/supplierProduct/types/supplierProducts.types"
import Loading from "components/globalLoader/Loading"
import { FormattedMessage, useIntl } from "react-intl"
import CustomSelect from "components/customSelect/CustomSelect"

const Home = ({ data }: { data: CmsType }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const intl = useIntl()
    const navigate = useNavigate()
    const [lang, setLang] = useState<string>("cms_content_en")
    const [cmsCategory, setCmsCategory] = useState<NewCategoryType[]>([])
    const [defaultValues, setDefaultValue] = useState(
        JSON.parse(data?.cms_content_en ?? "{}")
    )
    const [btnLoader, setButtonLoader] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
        watch,
    } = useForm<HomeType>({
        resolver: yupResolver(HomeSchema),
        values: defaultValues,
        defaultValues: {
            featured_products: [{ image: undefined }],
        },
    })
    const formValues = watch()

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setButtonLoader(true)
            const formData: FormData = new FormData()
            for (const key in values) {
                if (values.hasOwnProperty(key)) {
                    if (
                        key === "banner_section_img" &&
                        values.banner_section_img
                    ) {
                        values.banner_section_img.length > 0 &&
                            values.banner_section_img.map(
                                (file: { fileName: File[] }, index: number) => {
                                    if (
                                        file !== undefined &&
                                        file?.fileName[0] !== undefined
                                    ) {
                                        if (
                                            typeof file?.fileName !== "string"
                                        ) {
                                            formData.append(
                                                "banner_section_img",
                                                file.fileName[0]
                                            )
                                        }
                                        values.banner_section_img[index] = {
                                            fileName:
                                                typeof file.fileName[0] ===
                                                "object"
                                                    ? file.fileName[0].name
                                                    : file.fileName,
                                        }
                                    }
                                }
                            )
                    } else if (
                        key === "community_network_img" &&
                        values.community_network_img
                    ) {
                        values.community_network_img.length > 0 &&
                            values.community_network_img.map(
                                (file: { fileName: File[] }, index: number) => {
                                    if (
                                        file !== undefined &&
                                        file?.fileName[0] !== undefined
                                    ) {
                                        if (
                                            typeof file?.fileName !== "string"
                                        ) {
                                            formData.append(
                                                "community_network_img",
                                                file?.fileName[0]
                                            )
                                        }
                                        values.community_network_img[index] = {
                                            fileName:
                                                typeof file.fileName[0] ===
                                                "object"
                                                    ? file.fileName[0].name
                                                    : file.fileName,
                                        }
                                    }
                                }
                            )
                    } else if (
                        key === "purchase_section_img" &&
                        values.purchase_section_img
                    ) {
                        values.purchase_section_img.length > 0 &&
                            values.purchase_section_img.map(
                                (file: { fileName: File[] }, index: number) => {
                                    if (
                                        file !== undefined &&
                                        file?.fileName?.[0] !== undefined
                                    ) {
                                        if (
                                            typeof file?.fileName !== "string"
                                        ) {
                                            formData.append(
                                                "purchase_section_img",
                                                file?.fileName[0]
                                            )
                                        }
                                        values.purchase_section_img[index] = {
                                            fileName:
                                                typeof file.fileName[0] ===
                                                "object"
                                                    ? file.fileName[0].name
                                                    : file.fileName,
                                        }
                                    }
                                }
                            )
                    } else if (
                        key === "dynamic_section_img" &&
                        values.dynamic_section_img
                    ) {
                        values?.dynamic_section_img.length > 0 &&
                            values.dynamic_section_img.map(
                                (file: { fileName: File[] }, index: number) => {
                                    if (
                                        file !== undefined &&
                                        file?.fileName?.[0] !== undefined
                                    ) {
                                        if (
                                            typeof file?.fileName !== "string"
                                        ) {
                                            formData.append(
                                                "dynamic_section_img",
                                                file?.fileName?.[0]
                                            )
                                        }
                                        values.dynamic_section_img[index] = {
                                            fileName:
                                                typeof file.fileName[0] ===
                                                "object"
                                                    ? file.fileName[0].name
                                                    : file.fileName,
                                        }
                                    }
                                }
                            )
                    } else if (key === "category" && values.category) {
                        values.category = values.category.map(
                            (category: { text: string }) => {
                                const selectedCategory:
                                    | { label: string; value: string }
                                    | undefined = cmsCategory.find(
                                    (item: NewCategoryType) =>
                                        item.value === category.text
                                )
                                return {
                                    ...category,
                                    name: selectedCategory?.label,
                                }
                            }
                        )
                    } else if (
                        key === "featured_products" &&
                        values.featured_products
                    ) {
                        values.featured_products.length > 0 &&
                            values.featured_products.map(
                                (item: { image: File[] }) => {
                                    let images = item?.image[0]
                                    if (
                                        item !== undefined &&
                                        images &&
                                        typeof images === "object"
                                    ) {
                                        formData.append(
                                            "featured_products",
                                            images
                                        )
                                    }
                                }
                            )
                    }
                }
            }
            const findIndexRepeatingProducts = (dataArray: []) => {
                const oldcategory = new Set()

                return dataArray.findIndex((item) => {
                    const { text } = item

                    if (oldcategory.has(text)) {
                        return true
                    }

                    oldcategory.add(text)
                    return false
                })
            }

            const indexOfRepeatingProduct = findIndexRepeatingProducts(
                values.category as []
            )

            if (indexOfRepeatingProduct !== -1) {
                showToast("Same_Category_Error", "error", intl)
            } else {
                formData.append(lang, JSON.stringify(values))
                const response = await updateHomePage(formData)

                if (response?.data.responseType === responseType.Success) {
                    showToast(response?.data.message, toastType.Success, intl)
                    navigate("/admin/cms-pages")
                }
            }
            setButtonLoader(false)
        } catch (error) {
            setButtonLoader(false)
        }
    }

    const { append: CategoryAppend, remove: CategoryRemove } = useFieldArray({
        control,
        name: "category",
    })

    const getAllCategories = async (lang: string) => {
        try {
            const catResponse = await getAdminCategory(lang)
            setCmsCategory(catResponse?.data?.data)

            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        getAllCategories(lang)

        if (lang === "cms_content_en") {
            setDefaultValue(JSON.parse(data?.cms_content_en ?? "{}"))
        } else if (lang === "cms_content_ur") {
            setDefaultValue(JSON.parse(data?.cms_content_ur ?? "{}"))
        } else if (lang === "cms_content_ar") {
            setDefaultValue(JSON.parse(data?.cms_content_ar ?? "{}"))
        }
    }, [lang])

    function handleLangChange(lang: string) {
        setLang(lang)
    }

    const handleCategorySelect = async (
        event: ChangeEvent<HTMLSelectElement>,
        index: number
    ) => {
        const res = await getCategoryWiseData(event.target.value)
        setValue(`category[${index}].image`, res?.data?.data?.image)
    }

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
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
                                            {<FormattedMessage id='English' />}
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
                                                    ? `  border-primarycolor border-b-2 text-primarycolor`
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
                                            className={`text-base font-medium px-3 pb-2 ${
                                                lang === "cms_content_ar"
                                                    ? `  border-primarycolor border-b-2  text-primarycolor`
                                                    : ` text-black/50`
                                            } `}
                                        >
                                            {<FormattedMessage id='Arabic' />}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <SectionHeader
                                text={<FormattedMessage id='Banner_Section' />}
                                parentClass='text-black'
                                textClass=' !text-base md:!text-xl'
                            />
                            <div className='flex flex-wrap gap-y-4 mt-8 -mx-2'>
                                <div className='w-full md:w-1/3 flex gap-y-4 flex-wrap'>
                                    <div className='relative w-full px-2'>
                                        <Input
                                            id='heading'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Heading' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Heading",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full px-2'>
                                        <Input
                                            id='bannerButtonText1'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Button_Text' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "About_buttonText",
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className='w-full md:w-1/3'>
                                    <div className=' relative w-full  px-2'>
                                        <TextArea
                                            id='subheding'
                                            label={
                                                <FormattedMessage id='subHeading' />
                                            }
                                            name='subheding'
                                            register={register}
                                            type='textarea'
                                            errors={errors}
                                            required={true}
                                            parentClass='mb-30px last:mb-0 !min-h-250px'
                                            fieldLimit={500}
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Subheading",
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className='w-full md:w-1/3 flex gap-y-4 flex-wrap'>
                                    <div className='relative w-full px-2'>
                                        <Input
                                            id='Collection1'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Collection_Text' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "About_collectionText",
                                            })}
                                        />
                                    </div>
                                    <div className='relative w-full px-2'>
                                        <Input
                                            id='Collection2'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Collection_Text' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "About_collectionText",
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                    <Input
                                        id='FooterIcon1'
                                        type='text'
                                        label={<FormattedMessage id='Text' />}
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Footer_Text",
                                        })}
                                    />
                                </div>

                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                    <Input
                                        id='FooterIcon2'
                                        type='text'
                                        label={<FormattedMessage id='Text' />}
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Footer_Text",
                                        })}
                                    />
                                </div>

                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                    <Input
                                        id='FooterIcon3'
                                        type='text'
                                        label={<FormattedMessage id='Text' />}
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Footer_Text",
                                        })}
                                    />
                                </div>

                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                    <Input
                                        id='FooterIcon4'
                                        type='text'
                                        label={<FormattedMessage id='Text' />}
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Footer_Text",
                                        })}
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                    <Input
                                        id='productsCount'
                                        type='text'
                                        label={
                                            <FormattedMessage id='Product_Count' />
                                        }
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_product_count",
                                        })}
                                    />
                                </div>
                                <div className='w-full flex flex-wrap gap-y-4'>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                        <InputImage
                                            errors={errors}
                                            required={true}
                                            id={`banner_section_img.${0}.fileName`}
                                            errorKey={`banner_section_img.${0}.fileName`}
                                            register={register}
                                            type='file'
                                            setValue={setValue}
                                            value={
                                                defaultValues
                                                    ?.banner_section_img?.[0]
                                                    ?.fileName !== null
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.banner_section_img?.[0]?.fileName}`
                                                    : null
                                            }
                                            index={0}
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                    <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                        <InputImage
                                            errors={errors}
                                            id={`banner_section_img.${1}.fileName`}
                                            errorKey={`banner_section_img.${1}.fileName`}
                                            register={register}
                                            type='file'
                                            required={true}
                                            setValue={setValue}
                                            value={
                                                defaultValues
                                                    ?.banner_section_img?.[1]
                                                    ?.fileName !== null
                                                    ? `${REACT_APP_IMAGE_PATH}${defaultValues?.banner_section_img?.[1].fileName}`
                                                    : null
                                            }
                                            index={1}
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='relative'>
                            <hr className='border-slate-200 my-7 px-2' />
                            <SectionHeader
                                text={
                                    <FormattedMessage id='Category_Section' />
                                }
                                parentClass='text-black'
                                textClass=' !text-base md:!text-xl'
                            />
                            <div className='flex flex-wrap  gap-y-4   mt-8'>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <Input
                                        id='catHeading'
                                        type='text'
                                        label={
                                            <FormattedMessage id='Category_Heading' />
                                        }
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Category_Heading",
                                        })}
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 px-2 '>
                                    <TextArea
                                        id='catSubheding'
                                        required={true}
                                        label={
                                            <FormattedMessage id='Sub_heading' />
                                        }
                                        errors={errors}
                                        name='catSubheding'
                                        register={register}
                                        type='textarea'
                                        parentClass='mb-30px last:mb-0'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Category_SubHeading",
                                        })}
                                    />
                                </div>
                                {formValues.category &&
                                    Array.isArray(formValues.category) &&
                                    formValues.category?.length > 0 &&
                                    formValues.category.map((field, index) => (
                                        <>
                                            <div
                                                key={index}
                                                className=' relative w-full'
                                            >
                                                <div className='flex flex-wrap  gap-y-7  '>
                                                    <div className='w-1/2 px-2 relative'>
                                                        <CustomSelect
                                                            selectedOption={
                                                                defaultValues &&
                                                                defaultValues.category &&
                                                                defaultValues
                                                                    .category[
                                                                    index
                                                                ]?.text
                                                            }
                                                            label='Categories'
                                                            options={
                                                                cmsCategory
                                                            }
                                                            control={control}
                                                            register={register}
                                                            errorKey={
                                                                `category.${index}.text` as string
                                                            }
                                                            name={`category.${index}.text`}
                                                            error={errors}
                                                            required={true}
                                                            placeholder={intl.formatMessage(
                                                                {
                                                                    id: "Choose_Category",
                                                                }
                                                            )}
                                                            handleSelectChange={(
                                                                e
                                                            ) =>
                                                                handleCategorySelect(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className='relative w-full md:w-1/2 px-2'>
                                                        {field.image &&
                                                        field.image !==
                                                            undefined ? (
                                                            <>
                                                                <label>
                                                                    Category
                                                                    Image
                                                                </label>
                                                                <Controller
                                                                    name={`category.${index}.image`}
                                                                    control={
                                                                        control
                                                                    }
                                                                    render={() => (
                                                                        <img
                                                                            src={`${REACT_APP_IMAGE_PATH}${field?.image}`}
                                                                            className={`w-[80px] h-[80px]  object-top object-contain rounded-2xl mt-2`}
                                                                        />
                                                                    )}
                                                                />
                                                            </>
                                                        ) : null}
                                                    </div>
                                                    <div className='relative w-1/5 px-2 '>
                                                        <Button
                                                            className='text-base font-medium text-secondaryOrange border border-secondaryOrange py-2.5 px-10 rounded-xl transition-all duration-300 hover:bg-secondaryOrange hover:text-white'
                                                            type='button'
                                                            disable={btnLoader}
                                                            onClick={() =>
                                                                CategoryRemove(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            {
                                                                <FormattedMessage id='Remove' />
                                                            }
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ))}
                            </div>
                            <div className='w-full mt-8 px-2'>
                                <Button
                                    text={
                                        <FormattedMessage id='Select_Category' />
                                    }
                                    type='button'
                                    disable={btnLoader}
                                    onClick={() => CategoryAppend({ text: "" })}
                                    className='py-3 px-6  text-sm font-bold text-center text-primarycolor border-2 border-primarycolor bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                ></Button>
                            </div>
                        </div>
                        <div className='relative'>
                            <hr className='border-slate-200 my-7 px-2' />
                            <SectionHeader
                                text={
                                    <FormattedMessage id='Community_Network_Section' />
                                }
                                textClass=' !text-base md:!text-xl'
                            />
                            <div className='flex flex-wrap  gap-y-4  mt-8 items-start'>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <Input
                                        id='communityHeading'
                                        type='text'
                                        label={
                                            <FormattedMessage id='Network_Heading' />
                                        }
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Heading_Network",
                                        })}
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <TextArea
                                        id='communitySubheding'
                                        label={
                                            <FormattedMessage id='Network_SubHeading' />
                                        }
                                        name='communitySubheding'
                                        register={register}
                                        errors={errors}
                                        type='textarea'
                                        required={true}
                                        parentClass='mb-30px last:mb-0'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_SubHeading_Network",
                                        })}
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 flex flex-wrap gap-y-4'>
                                    <div className='w-full'>
                                        <Input
                                            id='CommTitle1'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Community_Title' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Community_title",
                                            })}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <Input
                                            id='commButtonText1'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Button_Text' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "About_buttonText",
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                    <TextArea
                                        id='ComSubheading1'
                                        label={
                                            <FormattedMessage id='Community_Description' />
                                        }
                                        name='ComSubheading1'
                                        required={true}
                                        register={register}
                                        type='textarea'
                                        errors={errors}
                                        parentClass='mb-30px last:mb-0'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_SubHeading_Community",
                                        })}
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2  mt-2'>
                                    <InputImage
                                        errors={errors}
                                        id={`community_network_img.${0}.fileName`}
                                        errorKey={`community_network_img.${0}.fileName`}
                                        register={register}
                                        type='file'
                                        required={true}
                                        value={
                                            defaultValues
                                                ?.community_network_img?.[0]
                                                ?.fileName !== null
                                                ? `${REACT_APP_IMAGE_PATH}${defaultValues?.community_network_img?.[0]?.fileName}`
                                                : null
                                        }
                                        setValue={setValue}
                                        index={0}
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                                {/* 02 */}
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 flex flex-wrap gap-y-4'>
                                    <div className='w-full'>
                                        <Input
                                            id='CommTitle2'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Community_Title' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Community_title",
                                            })}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <Input
                                            id='commButtonText2'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Button_Text' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "About_buttonText",
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                    <TextArea
                                        id='ComSubheading2'
                                        required={true}
                                        label={
                                            <FormattedMessage id='Community_Description' />
                                        }
                                        name='ComSubheading2'
                                        register={register}
                                        type='textarea'
                                        errors={errors}
                                        parentClass='mb-30px last:mb-0'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_SubHeading_Community",
                                        })}
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2  mt-2'>
                                    <InputImage
                                        required={true}
                                        errors={errors}
                                        id={`community_network_img.${1}.fileName`}
                                        errorKey={`community_network_img.${1}.fileName`}
                                        register={register}
                                        type='file'
                                        value={
                                            defaultValues
                                                ?.community_network_img?.[1]
                                                ?.fileName !== null
                                                ? `${REACT_APP_IMAGE_PATH}${defaultValues?.community_network_img?.[1]?.fileName}`
                                                : null
                                        }
                                        setValue={setValue}
                                        index={1}
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='relative'>
                            <hr className='border-slate-200 my-7 px-2' />
                            <SectionHeader
                                text={
                                    <FormattedMessage id='Purchase_Request_Section' />
                                }
                                textClass=' !text-base md:!text-xl'
                            />
                            <div className='flex flex-wrap gap-y-7 mt-8 items-start'>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 gap-y-4 flex flex-wrap'>
                                    <div className='w-full'>
                                        <Input
                                            id='purchaseHeading'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Heading' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Heading",
                                            })}
                                        />
                                    </div>
                                    <div className=' w-full '>
                                        <Input
                                            id='PurchaseButtonText'
                                            type='text'
                                            label={
                                                <FormattedMessage id='Button_Text' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Heading",
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 '>
                                    <TextArea
                                        id='purchaseSubheding'
                                        label={
                                            <FormattedMessage id='subHeading' />
                                        }
                                        name='purchaseSubheding'
                                        register={register}
                                        required={true}
                                        type='textarea'
                                        errors={errors}
                                        parentClass='mb-30px last:mb-0'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Subheading",
                                        })}
                                    />
                                </div>

                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2 mt-2'>
                                    <InputImage
                                        errors={errors}
                                        id={`purchase_section_img.${0}.fileName`}
                                        // name={`purchase_section_img.${0}.fileName`}
                                        errorKey={`purchase_section_img.${0}.fileName`}
                                        value={
                                            defaultValues
                                                ?.purchase_section_img?.[0]
                                                ?.fileName !== null
                                                ? `${REACT_APP_IMAGE_PATH}${defaultValues?.purchase_section_img?.[0]?.fileName}`
                                                : null
                                        }
                                        register={register}
                                        required={true}
                                        setValue={setValue}
                                        index={0}
                                        type='file'
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                    <InputImage
                                        errors={errors}
                                        required={true}
                                        id={`purchase_section_img.${1}.fileName`}
                                        // name={`purchase_section_img.${1}.fileName`}
                                        errorKey={`purchase_section_img.${1}.fileName`}
                                        value={
                                            defaultValues
                                                ?.purchase_section_img?.[1]
                                                ?.fileName !== null
                                                ? `${REACT_APP_IMAGE_PATH}${defaultValues?.purchase_section_img?.[1]?.fileName}`
                                                : null
                                        }
                                        register={register}
                                        setValue={setValue}
                                        index={1}
                                        type='file'
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                    <InputImage
                                        errors={errors}
                                        id={`purchase_section_img.${2}.fileName`}
                                        // name={`purchase_section_img.${2}.fileName`}
                                        errorKey={`purchase_section_img.${2}.fileName`}
                                        value={
                                            defaultValues
                                                ?.purchase_section_img?.[2]
                                                ?.fileName !== null
                                                ? `${REACT_APP_IMAGE_PATH}${defaultValues?.purchase_section_img?.[2]?.fileName}`
                                                : null
                                        }
                                        setValue={setValue}
                                        required={true}
                                        index={2}
                                        register={register}
                                        type='file'
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                    <InputImage
                                        errors={errors}
                                        id={`purchase_section_img.${3}.fileName`}
                                        // name={`purchase_section_img.${3}.fileName`}
                                        errorKey={`purchase_section_img.${3}.fileName`}
                                        value={
                                            defaultValues
                                                ?.purchase_section_img?.[3]
                                                ?.fileName !== null
                                                ? `${REACT_APP_IMAGE_PATH}${defaultValues?.purchase_section_img?.[3]?.fileName}`
                                                : null
                                        }
                                        register={register}
                                        type='file'
                                        setValue={setValue}
                                        index={3}
                                        required={true}
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                    <InputImage
                                        errors={errors}
                                        id={`purchase_section_img.${4}.fileName`}
                                        // name={`purchase_section_img.${4}.fileName`}
                                        errorKey={`purchase_section_img.${4}.fileName`}
                                        value={
                                            defaultValues
                                                ?.purchase_section_img?.[4]
                                                ?.fileName !== null
                                                ? `${REACT_APP_IMAGE_PATH}${defaultValues?.purchase_section_img?.[4]?.fileName}`
                                                : null
                                        }
                                        required={true}
                                        register={register}
                                        setValue={setValue}
                                        index={4}
                                        type='file'
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 xl:w-1/3 px-2'>
                                    <InputImage
                                        errors={errors}
                                        required={true}
                                        id={`purchase_section_img.${5}.fileName`}
                                        // name={`purchase_section_img.${5}.fileName`}
                                        errorKey={`purchase_section_img.${5}.fileName`}
                                        value={
                                            defaultValues
                                                ?.purchase_section_img?.[5]
                                                ?.fileName !== null
                                                ? `${REACT_APP_IMAGE_PATH}${defaultValues?.purchase_section_img?.[5]?.fileName}`
                                                : null
                                        }
                                        register={register}
                                        type='file'
                                        setValue={setValue}
                                        index={5}
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='relative'>
                            <hr className='border-slate-200 my-7 px-2' />
                            <SectionHeader
                                text={
                                    <FormattedMessage id='Dynamic_Image_Section' />
                                }
                                textClass=' !text-base md:!text-xl'
                            />

                            <div className='flex flex-wrap  gap-y-7 mt-8'>
                                <div className='w-1/3 px-2 relative'>
                                    <Input
                                        id='imageHeading1'
                                        type='text'
                                        label={
                                            <FormattedMessage id='Image_Heading' />
                                        }
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Heading_Image",
                                        })}
                                    />
                                </div>
                                <div className='w-1/3 px-2 relative'>
                                    <TextArea
                                        id='imageSubheading1'
                                        label={
                                            <FormattedMessage id='Image_SubHeading' />
                                        }
                                        register={register}
                                        name='imageSubheading1'
                                        type='textarea'
                                        errors={errors}
                                        parentClass='mb-30px last:mb-0'
                                        fieldLimit={500}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_SubHeading_Image",
                                        })}
                                    />
                                </div>
                                <div className='relative w-1/3 px-2 '>
                                    <InputImage
                                        errors={errors}
                                        required={true}
                                        id={`dynamic_section_img.${0}.fileName`}
                                        errorKey={`dynamic_section_img.${0}.fileName`}
                                        register={register}
                                        type='file'
                                        value={
                                            defaultValues
                                                ?.dynamic_section_img?.[0]
                                                ?.fileName !== null
                                                ? `${REACT_APP_IMAGE_PATH}${defaultValues?.dynamic_section_img?.[0]?.fileName}`
                                                : null
                                        }
                                        setValue={setValue}
                                        index={0}
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-wrap  gap-y-7 mt-8'>
                                <div className='w-1/3 px-2 relative'>
                                    <Input
                                        id='imageHeading2'
                                        type='text'
                                        label={
                                            <FormattedMessage id='Image_Heading' />
                                        }
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Heading_Image",
                                        })}
                                    />
                                </div>
                                <div className='w-1/3 px-2 relative'>
                                    <TextArea
                                        id='imageSubheading2'
                                        label={
                                            <FormattedMessage id='Image_SubHeading' />
                                        }
                                        register={register}
                                        name='imageSubheading2'
                                        type='textarea'
                                        errors={errors}
                                        required={true}
                                        parentClass='mb-30px last:mb-0'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_SubHeading_Image",
                                        })}
                                    />
                                </div>
                                <div className='relative w-1/3 px-2 '>
                                    <InputImage
                                        errors={errors}
                                        id={`dynamic_section_img.${1}.fileName`}
                                        errorKey={`dynamic_section_img.${1}.fileName`}
                                        register={register}
                                        type='file'
                                        value={
                                            defaultValues
                                                ?.dynamic_section_img?.[1]
                                                ?.fileName !== null
                                                ? `${REACT_APP_IMAGE_PATH}${defaultValues?.dynamic_section_img?.[1]?.fileName}`
                                                : null
                                        }
                                        setValue={setValue}
                                        index={1}
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='relative'>
                            <hr className='border-slate-200 my-7 px-2' />
                            <SectionHeader
                                text={<FormattedMessage id='Offer_Section' />}
                                textClass=' !text-base md:!text-xl'
                            />
                            <div className='flex flex-wrap mt-8 gap-y-7'>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <Input
                                        id='offerHeading'
                                        type='text'
                                        label={
                                            <FormattedMessage id='Heading' />
                                        }
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Heading",
                                        })}
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <TextArea
                                        id='offerSubheding'
                                        label={
                                            <FormattedMessage id='subHeading' />
                                        }
                                        name='offerSubheding'
                                        register={register}
                                        type='textarea'
                                        errors={errors}
                                        required={true}
                                        parentClass='mb-30px last:mb-0'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Subheading",
                                        })}
                                    />
                                </div>
                                <div className='w-1/2 px-2 relative'>
                                    <Input
                                        id='offerTitle1'
                                        type='text'
                                        label={<FormattedMessage id='Title' />}
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_title",
                                        })}
                                    />
                                </div>
                                <div className='w-1/2 px-2 relative'>
                                    <TextArea
                                        id='offerDescription1'
                                        label={
                                            <FormattedMessage id='Description' />
                                        }
                                        name='offerDescription1'
                                        register={register}
                                        type='textarea'
                                        errors={errors}
                                        required={true}
                                        parentClass='mb-30px last:mb-0'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Description",
                                        })}
                                    />
                                </div>

                                <div className='w-1/2 px-2 relative'>
                                    <Input
                                        id='offerTitle2'
                                        type='text'
                                        label={<FormattedMessage id='Title' />}
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_title",
                                        })}
                                    />
                                </div>
                                <div className='w-1/2 px-2 relative'>
                                    <TextArea
                                        id='offerDescription2'
                                        label={
                                            <FormattedMessage id='Description' />
                                        }
                                        name='offerDescription2'
                                        register={register}
                                        type='textarea'
                                        errors={errors}
                                        required={true}
                                        parentClass='mb-30px last:mb-0'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Description",
                                        })}
                                    />
                                </div>

                                <div className='relative w-full md:w-1/2 px-2'>
                                    <Input
                                        id='offerTitle3'
                                        type='text'
                                        label={<FormattedMessage id='Title' />}
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Title",
                                        })}
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <TextArea
                                        id='offerDescription3'
                                        label={
                                            <FormattedMessage id='Description' />
                                        }
                                        name='offerDescription3'
                                        register={register}
                                        type='textarea'
                                        errors={errors}
                                        required={true}
                                        parentClass='mb-30px last:mb-0'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Description",
                                        })}
                                    />
                                </div>
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
                            <div className='flex flex-wrap gap-y-7 mt-8 items-start'>
                                <div className='relative w-full md:w-1/2 px-2 flex'>
                                    <Link
                                        to={`/admin/cms-pages/blog-list`}
                                        className='uppercase px-7 py-3 text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white'
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
                                text={<FormattedMessage id='Reviews_Section' />}
                                textClass=' !text-base md:!text-xl'
                            />
                            <div className='flex flex-wrap gap-y-7 mt-8 items-start'>
                                <div className='relative w-full md:w-1/2 px-2 flex'>
                                    <Link
                                        to={`/admin/cms-pages/review-list`}
                                        className='uppercase px-7 py-3 text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white'
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
                                text={<FormattedMessage id='FAQ_Section' />}
                                textClass=' !text-base md:!text-xl'
                            />
                            <div className='flex flex-wrap gap-y-7 mt-8 items-start'>
                                <div className='relative w-full md:w-1/2 px-2 flex'>
                                    <Link
                                        to={`/admin/cms-pages/faq-list`}
                                        className='uppercase px-7 py-3 text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white'
                                    >
                                        {
                                            <FormattedMessage id='Go_to_Faq_Section' />
                                        }
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-4 mt-8 px-5 py-8 rounded-xl shadow-primary-shadow sticky bottom-0 bg-white w-full'>
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
            )}
        </>
    )
}

export default Home
