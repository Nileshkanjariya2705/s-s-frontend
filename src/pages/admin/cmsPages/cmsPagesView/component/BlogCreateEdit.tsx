import { useEffect, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

import axios from "axios"
import { showToast } from "helper/toast.helper"

import { BlogData, ModeType } from "../types/cms.types"
import { useSelector } from "react-redux"
import { RootState } from "store"

import { yupResolver } from "@hookform/resolvers/yup"
import { getSingleBlogById } from "../services/cmsPageView.services"
import { createBlogSchema } from "../schema/blog.schema"
import { responseType, toastType } from "constant/common.constant"
import SectionHeader from "components/sectionHeader/SectionHeader"
import Input from "components/input/Input"
import CkEditor from "components/ckEditor/CkEditor"
import InputImage from "components/input/InputImage"
import { REACT_APP_IMAGE_PATH } from "config"
import { Button } from "components/button/Button"
import { PageNotFound } from "components/pageNotFound/PageNotFound"
import Loading from "components/globalLoader/Loading"
import { FormattedMessage, useIntl } from "react-intl"

const BlogCreate = () => {
    const intl = useIntl()

    const navigate = useNavigate()
    const params = useParams()
    const [varient, setVarient] = useState<ModeType>("Edit")
    const [selectedBlog, setSelectedBlog] = useState<BlogData>()
    const [loading, setLoading] = useState<boolean>(true)
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const { langauge, token } = useSelector((state: RootState) => ({
        langauge: state.language.language,
        token: state.token.token,
    }))

    const getEditableData = async (blogId: string) => {
        try {
            const response = await getSingleBlogById(blogId, langauge)
            setSelectedBlog(response.data.data[0])
            setLoading(false)
        } catch (error) {
            return error
        }
    }

    useEffect(() => {
        if (params.blogId) {
            setVarient("Edit")
            getEditableData(params.blogId)
        } else {
            setVarient("Create")
        }
    }, [params.blogId, token])

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        clearErrors,
    } = useForm<BlogData>({
        values: selectedBlog ? selectedBlog : undefined,
        resolver: yupResolver(createBlogSchema),
    })

    const onSubmit = async (values: BlogData & FieldValues) => {
        const formData: FormData = new FormData()

        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                if (
                    key === "cover_image" &&
                    values.cover_image &&
                    values.cover_image[0]
                ) {
                    formData.append("cover_image", values.cover_image[0])
                } else if (
                    key === "author_image" &&
                    values.author_image &&
                    values.author_image[0]
                ) {
                    formData.append("author_image", values.author_image[0])
                } else {
                    formData.append(key, values[key])
                }
            }
        }
        if (varient === "Create") {
            try {
                setButtonLoader(true)
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/blog/create`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                if (response?.data.responseType === responseType.Success) {
                    setButtonLoader(false)
                    showToast(response?.data.message, toastType.Success, intl)
                    navigate(`/admin/cms-pages/blog-list`)
                } else {
                    setButtonLoader(false)
                    showToast(response?.data.message, toastType.Error, intl)
                }
            } catch (error) {
                return error
            }
        } else {
            setButtonLoader(true)
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/blog/update`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            if (response?.data.responseType === responseType.Success) {
                setButtonLoader(false)
                showToast(response?.data.message, toastType.Success, intl)
                navigate(`/admin/cms-pages/blog-list`)
            } else {
                setButtonLoader(false)
                showToast(response?.data.message, toastType.Error, intl)
            }
        }
    }
    const handleInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        const trimmedString = newValue.trim()
        const removeSpaces = trimmedString.replace(/\s+/g, "-")
        const sanitizedValue = removeSpaces
            .replace(/[^\w\s-]/g, "")
            .toLowerCase()
        setValue("title_en", newValue)
        setValue("slug", sanitizedValue)
        clearErrors("slug")
    }
    return (
        <>
            {varient === "Edit" ? (
                <>
                    {!loading ? (
                        <>
                            {selectedBlog ? (
                                <>
                                    <SectionHeader
                                        text={
                                            <FormattedMessage id='Edit_Blog' />
                                        }
                                        textClass='text-black'
                                    />
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='shadow-2xl w-full px-6 py-9 rounded-30px border-2 border-gray mt-5 md:mt-10'>
                                            <div className='flex flex-col'>
                                                <div className='mt-2'>
                                                    <p className='text-lg font-medium text-gray-900'>
                                                        {
                                                            <FormattedMessage id='English' />
                                                        }
                                                    </p>
                                                    <div className='flex flex-wrap flex-col gap-y-2 mt-2 border py-8 rounded-lg border-dashed border-primarycolor p-2'>
                                                        <div className=' relative my-3'>
                                                            <Input<BlogData>
                                                                id={`author_name_en`}
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Author_Name' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                errors={errors}
                                                                required={true}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Author_name",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                        <div className=' relative my-3'>
                                                            <Input<BlogData>
                                                                id={`title_en`}
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Blog_Title' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                errors={errors}
                                                                required={true}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Blog_title",
                                                                    }
                                                                )}
                                                                HandleChange={
                                                                    handleInput1Change
                                                                }
                                                            />
                                                        </div>
                                                        <div className=' relative my-3'>
                                                            <Input<BlogData>
                                                                id={`slug`}
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Slug' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                errors={errors}
                                                                required={true}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_Slug",
                                                                    }
                                                                )}
                                                                disabled={true}
                                                            />
                                                        </div>
                                                        <div className=' relative  my-3'>
                                                            <CkEditor
                                                                control={
                                                                    control
                                                                }
                                                                name={`body_en`}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Blog_content",
                                                                    }
                                                                )}
                                                                label={intl.formatMessage(
                                                                    {
                                                                        id: "Blog_Content",
                                                                    }
                                                                )}
                                                                error={errors}
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
                                                    <div className='flex flex-wrap flex-col gap-y-2 mt-2 border py-8 rounded-lg border-dashed border-primarycolor p-2'>
                                                        <div className=' relative my-3'>
                                                            <Input<BlogData>
                                                                id={`author_name_ar`}
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Author_Name' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                errors={errors}
                                                                required={true}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Author_name",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                        <div className=' relative my-3'>
                                                            <Input<BlogData>
                                                                id={`title_ar`}
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Blog_Title' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                errors={errors}
                                                                required={true}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Blog_title",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                        <div className=' relative  my-3'>
                                                            <CkEditor
                                                                control={
                                                                    control
                                                                }
                                                                name={`body_ar`}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Blog_content",
                                                                    }
                                                                )}
                                                                label={intl.formatMessage(
                                                                    {
                                                                        id: "Blog_Content",
                                                                    }
                                                                )}
                                                                error={errors}
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
                                                    <div className='flex flex-wrap flex-col gap-y-2 mt-2 border py-8 rounded-lg border-dashed border-primarycolor p-2'>
                                                        <div className=' relative my-3'>
                                                            <Input<BlogData>
                                                                id={`author_name_ur`}
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Author_Name' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                errors={errors}
                                                                required={true}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Author_name",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                        <div className=' relative my-3'>
                                                            <Input<BlogData>
                                                                id={`title_ur`}
                                                                type='text'
                                                                label={
                                                                    <FormattedMessage id='Blog_Title' />
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                errors={errors}
                                                                required={true}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Blog_title",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                        <div className=' relative  my-3'>
                                                            <CkEditor
                                                                control={
                                                                    control
                                                                }
                                                                name={`body_ur`}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Blog_content",
                                                                    }
                                                                )}
                                                                label={intl.formatMessage(
                                                                    {
                                                                        id: "Blog_Content",
                                                                    }
                                                                )}
                                                                error={errors}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='relative w-full px-5 mb-8 mt-9'>
                                                    <InputImage<BlogData>
                                                        type='file'
                                                        errors={errors}
                                                        id='cover_image'
                                                        register={register}
                                                        setValue={setValue}
                                                        required={true}
                                                        label={
                                                            <FormattedMessage id='Blog_Cover_Photo' />
                                                        }
                                                        value={
                                                            selectedBlog &&
                                                            selectedBlog[
                                                                "cover_image"
                                                            ]
                                                                ? `${REACT_APP_IMAGE_PATH}` +
                                                                  `${selectedBlog["cover_image"]}`
                                                                : null
                                                        }
                                                        isMulitple={false}
                                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                                    />
                                                </div>

                                                <div className='relative w-full px-5 mb-8'>
                                                    <InputImage<BlogData>
                                                        type='file'
                                                        errors={errors}
                                                        id='author_image'
                                                        required={true}
                                                        register={register}
                                                        setValue={setValue}
                                                        label={
                                                            <FormattedMessage id='Blog_Author_Photo' />
                                                        }
                                                        value={
                                                            selectedBlog &&
                                                            selectedBlog[
                                                                "author_image"
                                                            ]
                                                                ? `${REACT_APP_IMAGE_PATH}` +
                                                                  `${selectedBlog["author_image"]}`
                                                                : null
                                                        }
                                                        isMulitple={false}
                                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                                    />
                                                </div>
                                            </div>
                                            <div className='mt-5 xl:mt-8 xxl:mt-8 w-full flex gap-5'>
                                                {/* <Link
                          className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                          to={`/admin/cms-pages/blog-list`}
                        > */}
                                                <Button
                                                    text={
                                                        <FormattedMessage id='Cancel' />
                                                    }
                                                    type='button'
                                                    disable={buttonLoader}
                                                    className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                                    onClick={() => {
                                                        navigate(
                                                            "/admin/cms-pages/blog-list"
                                                        )
                                                    }}
                                                ></Button>
                                                <Button
                                                    loader={buttonLoader}
                                                    text={
                                                        <FormattedMessage id='Update' />
                                                    }
                                                    type='submit'
                                                    className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                                ></Button>
                                                {/* </Link> */}
                                            </div>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <PageNotFound />
                                </>
                            )}
                        </>
                    ) : (
                        <Loading />
                    )}
                </>
            ) : (
                <>
                    <SectionHeader
                        text={<FormattedMessage id='Create_Blog' />}
                        textClass='text-black'
                    />

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='shadow-2xl w-full px-6 py-9 rounded-30px border-2 border-gray mt-5 md:mt-10'>
                            <div className='flex flex-col'>
                                <div className='mt-8 '>
                                    <p className='text-lg font-medium text-gray-900'>
                                        {<FormattedMessage id='English' />}
                                    </p>
                                    <div className='flex flex-wrap flex-col gap-y-2 mt-2 border py-8 rounded-lg border-dashed border-primarycolor p-2 '>
                                        <div className=' relative my-3'>
                                            <Input<BlogData>
                                                id={`author_name_en`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Author_Name' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Author_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className=' relative my-3'>
                                            <Input<BlogData>
                                                id={`title_en`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Blog_Title' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Blog_title",
                                                    }
                                                )}
                                                HandleChange={
                                                    handleInput1Change
                                                }
                                            />
                                        </div>
                                        <div className=' relative my-3'>
                                            <Input<BlogData>
                                                id={`slug`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Slug' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_Slug",
                                                    }
                                                )}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className=' relative  my-3'>
                                            <CkEditor
                                                control={control}
                                                name={`body_en`}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Blog_content",
                                                    }
                                                )}
                                                label={intl.formatMessage({
                                                    id: "Blog_Content",
                                                })}
                                                error={errors}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-8 '>
                                    <p className='text-lg font-medium text-gray-900'>
                                        {" "}
                                        {<FormattedMessage id='Arabic' />}
                                    </p>
                                    <div className='flex flex-wrap flex-col gap-y-2 mt-2 border py-8 rounded-lg border-dashed border-primarycolor p-2 '>
                                        <div className=' relative my-3'>
                                            <Input<BlogData>
                                                id={`author_name_ar`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Author_Name' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Author_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className=' relative my-3'>
                                            <Input<BlogData>
                                                id={`title_ar`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Blog_Title' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Blog_title",
                                                    }
                                                )}
                                            />
                                        </div>

                                        <div className=' relative  my-3'>
                                            <CkEditor
                                                control={control}
                                                name={`body_ar`}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Blog_content",
                                                    }
                                                )}
                                                label={intl.formatMessage({
                                                    id: "Blog_Content",
                                                })}
                                                error={errors}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-8 '>
                                    <p className='text-lg font-medium text-gray-900'>
                                        {" "}
                                        {<FormattedMessage id='Urdu' />}
                                    </p>
                                    <div className='flex flex-wrap flex-col gap-y-2 mt-2 border py-8 rounded-lg border-dashed border-primarycolor p-2 '>
                                        <div className=' relative my-3'>
                                            <Input<BlogData>
                                                id={`author_name_ur`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Author_Name' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Author_name",
                                                    }
                                                )}
                                            />
                                        </div>
                                        <div className=' relative my-3'>
                                            <Input<BlogData>
                                                id={`title_ur`}
                                                type='text'
                                                label={
                                                    <FormattedMessage id='Blog_Title' />
                                                }
                                                register={register}
                                                errors={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Blog_title",
                                                    }
                                                )}
                                            />
                                        </div>

                                        <div className=' relative  my-3'>
                                            <CkEditor
                                                control={control}
                                                name={`body_ur`}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Enter_Slug",
                                                    }
                                                )}
                                                label={intl.formatMessage({
                                                    id: "Blog_Content",
                                                })}
                                                error={errors}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className=' relative  my-3'>
                                    <InputImage<BlogData>
                                        type='file'
                                        errors={errors}
                                        id='cover_image'
                                        register={register}
                                        setValue={setValue}
                                        label={
                                            <FormattedMessage id='Blog_Cover_Photo' />
                                        }
                                        isMulitple={false}
                                        required={true}
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                                <div className=' relative  my-3'>
                                    <InputImage<BlogData>
                                        type='file'
                                        errors={errors}
                                        id='author_image'
                                        setValue={setValue}
                                        register={register}
                                        label={
                                            <FormattedMessage id='Blog_Author_Photo' />
                                        }
                                        isMulitple={false}
                                        required={true}
                                            style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 xl:mt-8 xxl:mt-8 w-full flex gap-5'>
                            <Button
                                text={<FormattedMessage id='Cancel' />}
                                type='button'
                                disable={buttonLoader}
                                className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                onClick={() => {
                                    navigate("/admin/cms-pages/blog-list")
                                }}
                            ></Button>
                            <Button
                                loader={buttonLoader}
                                text={<FormattedMessage id='Save' />}
                                type='submit'
                                onClick={onSubmit}
                                className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                            ></Button>
                        </div>
                    </form>
                </>
            )}
        </>
    )
}

export default BlogCreate
