import { useEffect, useState } from "react"
import BlogImg from "../../assets/images/blog-image.jpg"

import {
    getCmsPage,
    getContactBlogList,
    getPageData,
    userContactForm,
} from "./service/publicPage.service"
import { REACT_APP_IMAGE_PATH } from "config"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { UserContactSchema } from "./schema/contact.schema"
import { cmsPages } from "constant/common.constant"
import { Link, useNavigate } from "react-router-dom"
import {
    Blog,
    BlogHeaderData,
    UserContactPublicPageType,
    UserContactSchemaType,
} from "pages/admin/cmsPages/cmsPagesView/types/cms.types"
import { yupResolver } from "@hookform/resolvers/yup"
import Input from "components/input/Input"
import TextArea from "components/textArea/Textarea"
import GlobalLoader from "components/globalLoader/GlobalLoader"
import { FormattedMessage, useIntl } from "react-intl"
import { Button } from "components/button/Button"
import useLocale from "hooks/useLocale"
import { Helmet } from 'react-helmet';
const Contact = () => {
    
     const { language } = useLocale();

    const intl = useIntl()
    const navigate = useNavigate()
    const [contactPageData, setContactPageData] =
        useState<UserContactPublicPageType>()
    const [relatedBlogsHeader, setRelatedBlogsHeader] =
        useState<BlogHeaderData>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [blogs, setBlogs] = useState([])
    const [btnLoader, setBtnLoader] = useState<boolean>(false)
    const getContactUsDetails = async () => {
        try {
            setLoading(true)
            const response = await getPageData("Contact Us")
            const jsonData = JSON.parse(
                response?.data?.data?.[`cms_content_${language}`] === ""
                    ? "{}"
                    : response?.data?.data?.[`cms_content_${language}`]
            )
            setContactPageData(jsonData)
            const getBlogHeader = await getCmsPage({
                page_title: cmsPages.Blog,
            })

            const blogheadingSection = JSON.parse(
                getBlogHeader?.data?.data?.[`cms_content_${language}`] === ""
                    ? "{}"
                    : getBlogHeader?.data?.data?.[`cms_content_${language}`]
            )?.blogData?.find(
                (item: { page: string }) => item?.page === "Contact Us"
            )
            setRelatedBlogsHeader(blogheadingSection)
        } catch (error) {
            setLoading(false)
            return error
        }
    }
    const getBlogs = async () => {
        try {
            const response = await getContactBlogList(language)
            setBlogs(response.data.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            return error
        }
    }
    useEffect(() => {
        getContactUsDetails()
        getBlogs()
    }, [language])
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<UserContactSchemaType>({
        resolver: yupResolver(UserContactSchema),
    })

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setBtnLoader(true)
            const response = await userContactForm(values)
            if (response?.data?.responseType === "success") {
                setBtnLoader(false)
                setShowModal(true)
            } else {
                setBtnLoader(false)
            }
        } catch (error: any) {}
    }
    return (
        <>
            {loading ? (
                <GlobalLoader />
            ) : (
                <>
                    <div className='mt-80px '>
                        <div className='relative bg-main-banner bg-no-repeat bg-center bg-cover before:content-[""] before:top-0 before:left-0 before:w-full before:h-full before:absolute before:bg-primarycolor/90 py-20 lg:py-24 px-5 z-0 before:-z-10'>
                            <div className='container mx-auto'>
                                <h1 className='text-3xl xxl:text-50px leading-60px font-bold text-white text-center'>
                                <Helmet>
                                    <title>{contactPageData?.pageTitle}</title>
                                </Helmet>
                                    {contactPageData?.pageTitle}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className='relative bg-white py-5 px-5'>
                        <div className='container mx-auto'>
                            <ul className='flex items-center  gap-7'>
                                <li className='relative before:content-["/"] before:absolute before:top-0 before:-right-4 rtl:before:right-[unset] rtl:before:-left-4 before:text-black/40'>
                                    <Link
                                        to='/'
                                        className='text-black/40 text-base font-normal'
                                    >
                                        <FormattedMessage id='Home' />
                                    </Link>
                                </li>

                                <li className='relative'>
                                    <Link
                                        to='/contact-us'
                                        className='text-primarycolor text-base font-medium'
                                    >
                                        <FormattedMessage id='Contact_Us' />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='relative py-10 md:py-16 before:-z-10 px-5 overflow-hidden'>
                        <div className='container mx-auto'>
                            <div className='flex flex-wrap space-y-10 lg:space-y-0'>
                                <div className='w-full lg:w-2/5 xxl:w-1/2 '>
                                    <div className='lg:mt-5'>
                                        <h1 className='text-2xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor '>
                                            {contactPageData?.heading}
                                        </h1>
                                        <p className='text-sm md:text-base text-Thirdcolor/60 font-normal  lg:max-w-xs xxl:max-w-md  mt-7'>
                                            {contactPageData?.subHeding}
                                        </p>
                                    </div>
                                </div>

                                <div className='w-full lg:w-3/5 xxl:w-1/2'>
                                    {showModal === false ? (
                                        <div className='p-6 md:p-8 xxl:p-10 bg-white shadow-box-shadow-contact rounded-20px'>
                                            <h4 className='text-secodarycolor text-xl md:text-2xl font-semibold'>
                                                {language === "en"
                                                    ? "Get In Touch"
                                                    : language === "ar"
                                                    ? "ابقى على تواصل"
                                                    : language === "ur"
                                                    ? "رابطے میں رہنا"
                                                    : null}
                                            </h4>
                                            <form
                                                onSubmit={handleSubmit(
                                                    onSubmit
                                                )}
                                            >
                                                <div className='flex -mx-2 flex-wrap gap-y-5 mt-6'>
                                                    <div className='relative w-full md:w-1/2 px-2'>
                                                        <Input
                                                            id='firstname'
                                                            type='text'
                                                            label={
                                                                language ===
                                                                "en"
                                                                    ? "First Name"
                                                                    : language ===
                                                                      "ar"
                                                                    ? "الاسم الأول"
                                                                    : language ===
                                                                      "ur"
                                                                    ? "پہلا نام"
                                                                    : "null"
                                                            }
                                                            register={register}
                                                            errors={errors}
                                                            required={true}
                                                            placeholder={intl.formatMessage(
                                                                {
                                                                    id: "Enter_Firstname",
                                                                }
                                                            )}
                                                        />
                                                    </div>
                                                    <div className='relative w-full md:w-1/2 px-2'>
                                                        <Input
                                                            id='lastname'
                                                            type='text'
                                                            label={
                                                                language ===
                                                                "en"
                                                                    ? "Last Name"
                                                                    : language ===
                                                                      "ar"
                                                                    ? "اسم العائلة"
                                                                    : language ===
                                                                      "ur"
                                                                    ? "آخری نام"
                                                                    : "null"
                                                            }
                                                            register={register}
                                                            errors={errors}
                                                            required={true}
                                                            placeholder={intl.formatMessage(
                                                                {
                                                                    id: "Enter_Lastname",
                                                                }
                                                            )}
                                                        />
                                                    </div>

                                                    <div className='relative w-full md:w-1/2 px-2'>
                                                        <Input
                                                            id='email'
                                                            type='text'
                                                            label={
                                                                language ===
                                                                "en"
                                                                    ? "Email"
                                                                    : language ===
                                                                      "ar"
                                                                    ? "اسم العائلة"
                                                                    : language ===
                                                                      "ur"
                                                                    ? "آخری نام"
                                                                    : "null"
                                                            }
                                                            register={register}
                                                            errors={errors}
                                                            required={true}
                                                            placeholder={intl.formatMessage(
                                                                {
                                                                    id: "Enter_Your_Email",
                                                                }
                                                            )}
                                                        />
                                                    </div>
                                                    <div className='relative w-full md:w-1/2 px-2'>
                                                        <Input
                                                            id='phone'
                                                            type='text'
                                                            label={
                                                                language ===
                                                                "en"
                                                                    ? "Phone"
                                                                    : language ===
                                                                      "ar"
                                                                    ? "هاتف"
                                                                    : language ===
                                                                      "ur"
                                                                    ? "فون"
                                                                    : "null"
                                                            }
                                                            register={register}
                                                            errors={errors}
                                                            required={false}
                                                            placeholder={intl.formatMessage(
                                                                {
                                                                    id: "Enter_Your_Phone",
                                                                }
                                                            )}
                                                        />
                                                    </div>

                                                    <div className='relative w-full px-2'>
                                                        <TextArea
                                                            id='message'
                                                            label={
                                                                language ===
                                                                "en"
                                                                    ? "Message"
                                                                    : language ===
                                                                      "ar"
                                                                    ? "رسالة"
                                                                    : language ===
                                                                      "ur"
                                                                    ? "پیغام"
                                                                    : "null"
                                                            }
                                                            name='message'
                                                            register={register}
                                                            type='textarea'
                                                            parentClass='mb-30px last:mb-0'
                                                            // fieldLimit={100}
                                                            required={true}
                                                            errors={errors}
                                                            placeholder={intl.formatMessage(
                                                                {
                                                                    id: "Enter_Message",
                                                                }
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='mt-5 xl:mt-8 xxl:mt-12 w-full'>
                                                    <Button
                                                        type='submit'
                                                        loader={btnLoader}
                                                        className='w-full px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:bg-secondaryOrange hover:text-white focus:ring-0 focus:outline-0 uppercase'
                                                    >
                                                        {language === "en"
                                                            ? "Save"
                                                            : language === "ar"
                                                            ? "يحفظ"
                                                            : language === "ur"
                                                            ? "محفوظ کریں۔"
                                                            : "null"}
                                                    </Button>
                                                </div>
                                            </form>

                                            {/* Thank You */}
                                        </div>
                                    ) : (
                                        <div className='p-6 md:p-8 xxl:p-10 bg-white shadow-box-shadow-contact rounded-20px'>
                                            <div className='text-center'>
                                                <div className='w-16 h-16 md:w-76px md:h-76px rounded-xl flex items-center justify-center mx-auto bg-primarycolor/10'>
                                                    <i className='icon-check-alt-2 text-4xl md:text-5xl text-primarycolor '></i>
                                                </div>
                                                <h3 className='mt-4 md:mt-7 font-semibold text-2xl md:text-3xl text-secodarycolor'>
                                                    <FormattedMessage id='Thank_You' />
                                                </h3>
                                                <p className='mt-4 md:mt-6 max-w-lg mx-auto text-secodarycolor/60 text-lg md:text-xl font-normal'>
                                                    <FormattedMessage id='Received_Your_Message' />
                                                </p>
                                                <ul className='flex items-center gap-4 md:gap-6 justify-center my-8 md:my-16'>
                                                    <li>
                                                        <a
                                                            href='#'
                                                            className='w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primarycolor text-white flex items-center justify-center'
                                                        >
                                                            <i className='icon-facebook text-lg md:text-2xl text-white'></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href='#'
                                                            className='w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primarycolor text-white flex items-center justify-center'
                                                        >
                                                            <i className='icon-linkdin text-lg md:text-2xl text-white'></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href='#'
                                                            className='w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primarycolor text-white flex items-center justify-center'
                                                        >
                                                            <i className='icon-twitter text-base md:text-xl text-white'></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href='#'
                                                            className='w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primarycolor text-white flex items-center justify-center'
                                                        >
                                                            <i className='icon-instagram-outline text-lg md:text-2xl text-white'></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* <h1>Thank you</h1> */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='absolute w-full bottom-0 -z-[1] overflow-hidden h-366px xl:h-424px -mx-5'>
                            {contactPageData?.contact &&
                            contactPageData?.contact.length > 0 ? (
                                <img
                                    src={`${REACT_APP_IMAGE_PATH}${contactPageData?.contact[0].image}`}
                                    alt='ContactImg1'
                                    width={50}
                                    className='w-full h-366px xl:h-[424px] object-cover group-hover/product:scale-105 transition-all duration-500'
                                />
                            ) : null}
                        </div>
                    </div>

                    <div className='bg-white py-10 md:py-16 px-5 '>
                        <div className='container mx-auto'>
                            <h2 className='text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center'>
                                {contactPageData?.supportTitle}
                            </h2>

                            <div className='flex -mx-3 flex-wrap gap-y-3 mt-12'>
                                <div className='w-full lg:w-1/3 px-3 '>
                                    <div className='text-center border border-black/10 p-10 xl:p-6 xxl:p-8 lg:min-h-250px xl:min-h-164px rounded-10px flex flex-wrap items-start xl:items-center justify-center cursor-pointer transition-all duration-500 hover:border-transparent hover:shadow-primary-shadow group/green'>
                                        <div className='flex items-center gap-7 w-full flex-wrap xl:flex-nowrap justify-center xl:justify-start'>
                                            <div className='relative w-full xl:w-unset'>
                                                <i className='w-70px h-70px mx-auto xl:mx-unset flex items-center justify-center icon-navigation bg-primarycolor/10 rounded-xl text-3xl text-primarycolor '></i>
                                            </div>
                                            <div className='relative text-center xl:text-left space-y-1 w-full xl:w-unset'>
                                                <h5 className='text-lg font-semibold text-secodarycolor '>
                                                    {contactPageData?.title1}
                                                </h5>
                                                <a
                                                    href='mailto:example@xyzmail.com'
                                                    className='text-Thirdcolor/60 text-base font-normal'
                                                >
                                                    {contactPageData?.subTitle1}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full lg:w-1/3 px-3 '>
                                    <div className='text-center border border-black/10 p-10 xl:p-6 xxl:p-8 lg:min-h-250px xl:min-h-164px rounded-10px flex flex-wrap items-start xl:items-center justify-center cursor-pointer transition-all duration-500 hover:border-transparent hover:shadow-primary-shadow group/green'>
                                        <div className='flex items-center gap-7 w-full flex-wrap xl:flex-nowrap justify-center xl:justify-start'>
                                            <div className='relative w-full xl:w-unset'>
                                                <i className='w-70px h-70px flex mx-auto xl:mx-unset items-center justify-center icon-mail bg-primarycolor/10 rounded-xl text-3xl text-primarycolor '></i>
                                            </div>
                                            <div className='relative text-center xl:text-left space-y-1 w-full xl:w-unset'>
                                                <h5 className='text-lg font-semibold text-secodarycolor '>
                                                    {contactPageData?.title2}
                                                </h5>
                                                <a
                                                    href='mailto:example@xyzmail.com'
                                                    className='text-Thirdcolor/60 text-base font-normal'
                                                >
                                                    {contactPageData?.subTitle2}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full lg:w-1/3 px-3 '>
                                    <div className='text-center border border-black/10 p-10 xl:p-6 xxl:p-8  lg:min-h-250px xl:min-h-164px rounded-10px flex flex-wrap items-start xl:items-center justify-center cursor-pointer transition-all duration-500 hover:border-transparent hover:shadow-primary-shadow group/green'>
                                        <div className='flex items-center gap-7 w-full flex-wrap xl:flex-nowrap justify-center xl:justify-start'>
                                            <div className='relative w-full xl:w-unset'>
                                                <i className='w-70px h-70px flex mx-auto xl:mx-unset items-center justify-center icon-mail bg-primarycolor/10 rounded-xl text-3xl text-primarycolor '></i>
                                            </div>
                                            <div className='relative text-center xl:text-left space-y-1 w-full  xl:w-unset'>
                                                <h5 className='text-lg font-semibold text-secodarycolor '>
                                                    {contactPageData?.title3}
                                                </h5>

                                                <a
                                                    href='tel:+9719786543210'
                                                    className='text-Thirdcolor/60 text-base font-normal'
                                                >
                                                    {contactPageData?.subTitle3}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Related Blogs */}
                    <div className='bg-primarygrey py-10 md:py-16 px-5'>
                        <div className='container mx-auto'>
                            <h2 className='text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center'>
                                {relatedBlogsHeader &&
                                    relatedBlogsHeader?.heading}
                            </h2>
                            <p className='text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3'>
                                {relatedBlogsHeader &&
                                    relatedBlogsHeader?.description}
                            </p>
                            <div className='flex mt-8 md:mt-50px lg:-mx-3 flex-wrap gap-y-5'>
                                {blogs &&
                                    blogs.map((blog: Blog) => {
                                        return (
                                            <>
                                                <div
                                                    className='w-full lg:w-1/3 lg:px-3'
                                                    onClick={() =>
                                                        navigate(
                                                            `/blog/${blog.slug}`
                                                        )
                                                    }
                                                >
                                                    <div className='group/button cursor-pointer bg-white rounded-14px overflow-hidden'>
                                                        {blog.cover_image ? (
                                                            <>
                                                                <img
                                                                    src={`${REACT_APP_IMAGE_PATH}${blog.cover_image}`}
                                                                    alt='BlogImg'
                                                                    className='w-full h-72 '
                                                                />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <img
                                                                    src={
                                                                        BlogImg
                                                                    }
                                                                    alt='BlogImg'
                                                                    className='w-full'
                                                                />
                                                            </>
                                                        )}
                                                        <div className='border border-black/10 px-6 py-5 border-t-0  rounded-b-14px'>
                                                            <p className='text-sm text-Thirdcolor/50 font-normal mb-2'>
                                                                {`${blog.created_at.slice(
                                                                    0,
                                                                    10
                                                                )}`}
                                                            </p>
                                                            <h3 className='text-secodarycolor text-lg lg:text-xl font-semibold  line-clamp-2 text-clip mb-3'>
                                                                {
                                                                    blog[
                                                                        `title_${language}`
                                                                    ] as string
                                                                }
                                                            </h3>
                                                            <p className='font-normal text-base leading-6  text-black/70 line-clamp-3 text-clip'>
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: blog[
                                                                            `body_${language}`
                                                                        ] as
                                                                            | string
                                                                            | TrustedHTML,
                                                                    }}
                                                                />
                                                            </p>
                                                            <div className='mt-4'>
                                                                <a
                                                                    href='#'
                                                                    className='text-primarycolor text-sm font-semibold flex items-center gap-2 group-hs'
                                                                >
                                                                    <FormattedMessage id='Read_More' />{" "}
                                                                    <span className='w-4 h-[2px] bg-primarycolor group-hover/button:w-6 hover:w-14 transition-all duration-150'></span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })}
                            </div>
                        </div>
                        <div className='mt-8 md:mt-50px w-full text-center'>
                            <a
                                href='/blog'
                                className='uppercase px-5 py-2 md:px-7 md:py-2.5 inline-block text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white'
                            >
                                <FormattedMessage id='View_All_Blogs' />
                            </a>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Contact
