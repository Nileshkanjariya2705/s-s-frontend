import { useEffect, useState } from "react"

import BlogImg from "../../assets/images/blog-image.jpg"

import { REACT_APP_IMAGE_PATH } from "../../config/index"
import {
    getAboutUsBlogList,
    getAboutUsReviews,
    getCmsPage,
} from "./service/publicPage.service"
import { Link, useNavigate } from "react-router-dom"
import { cmsPages } from "constant/common.constant"
import { getFaqDetail } from "pages/admin/cmsPages/cmsPagesView/services/cmsPageView.services"
import GlobalLoader from "components/globalLoader/GlobalLoader"
import useUserData from "hooks/getUserData"
import {
    AboutUsPublicPagesType,
    Blog,
    BlogHeaderData,
    FaqDetailListingType,
    FaqTypes,
    Language,
    reviewHeader,
    ReviewListType,
} from "pages/admin/cmsPages/cmsPagesView/types/cms.types"
import { FormattedMessage, useIntl } from "react-intl"
import useLocale from "hooks/useLocale"
import { Helmet } from "react-helmet"

const About = () => {
    const [getAboutUsData, setAboutUsData] = useState<AboutUsPublicPagesType>()
    const [faqData, setFaqData] = useState<FaqTypes>()
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [reviewData, setReviewData] = useState<ReviewListType[]>([])
    const [blogHeader, setBlogHeader] = useState<BlogHeaderData>()
    const [reviewHeader, setReviewHeader] = useState<reviewHeader>()
    const [faqDetailData, setFaqDetailData] = useState<FaqDetailListingType[]>(
        []
    )
    const [openQuestion, setOpenQuestion] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
     const { language } = useLocale();

    const { token } = useUserData()
    const intl = useIntl();
    const title = intl.formatMessage({ id: 'About_Us' });
    let jsonData = {}
    let blogheadingSection = {}
    let reviewheadingSection = {}
    let faqJsonData = {}
    const navigate = useNavigate()
    const getAboutUsDetails = async () => {
        try {
            const response = await getCmsPage({
                page_title: "About Us",
            })

            const getBlogHeader = await getCmsPage({
                page_title: cmsPages.Blog,
            })
            const getReviewHeader = await getCmsPage({
                page_title: cmsPages.Review,
            })

            const faqResponse = await getCmsPage({
                page_title: "FAQ",
            })
            jsonData = JSON.parse(
                response?.data?.data?.[`cms_content_${language}`] === ""
                    ? "{}"
                    : response?.data?.data?.[`cms_content_${language}`]
            )
            blogheadingSection = JSON.parse(
                getBlogHeader?.data?.[`cms_content_${language}`] === ""
                    ? "{}"
                    : getBlogHeader?.data?.data?.[`cms_content_${language}`]
            )?.blogData.find(
                (item: BlogHeaderData) => item?.page === "About Us"
            )
            setBlogHeader(blogheadingSection as BlogHeaderData)
            reviewheadingSection = JSON.parse(
                getReviewHeader?.data?.data?.[`cms_content_${language}`] === ""
                    ? "{}"
                    : getReviewHeader?.data?.data?.[`cms_content_${language}`]
            )?.reviewHeaderSection?.find(
                (item: reviewHeader) => item?.page === "About Us"
            )

            setReviewHeader(reviewheadingSection as reviewHeader)

            faqJsonData = JSON.parse(
                faqResponse?.data?.data?.[`cms_content_${language}`] === ""
                    ? "{}"
                    : faqResponse?.data?.data?.[`cms_content_${language}`]
            )
            const faqDetailData = await getFaqDetail(language)
            setFaqDetailData(faqDetailData.data.data)
            setAboutUsData(jsonData as AboutUsPublicPagesType)
            setFaqData(faqJsonData as FaqTypes)
            getAboutUsReviewsCall()
        } catch (error) {
            setLoading(false)
            return error
        }
    }

    const getBlogs = async () => {
        try {
            setLoading(true)
            const response = await getAboutUsBlogList(language)
            setBlogs(response.data.data)
        } catch (error) {
            setLoading(false)
            return error
        }
    }

    const getAboutUsReviewsCall = async () => {
        try {
            const getReviews = await getAboutUsReviews()
            setReviewData(getReviews?.data?.data.rows)
            setLoading(false)
        } catch (error) {
            return error
        }
    }
    useEffect(() => {
        getBlogs()
        getAboutUsDetails()
    }, [language])

    const handleClickedAccordian = (index: number) => {
        if (openQuestion === index) {
            setOpenQuestion(null)
        } else {
            setOpenQuestion(index)
        }
    }

    return (
        <>
            {loading ? (
                <GlobalLoader />
            ) : (
                <>
                    <div className='mt-80px'>
                        <div className='relative bg-main-banner bg-no-repeat bg-center bg-cover before:content-[""] before:top-0 before:left-0 before:w-full before:h-full before:absolute before:bg-primarycolor/90 py-20 lg:py-24 px-5 z-0 before:-z-10'>
                            <div className='container mx-auto'>
                                <h1 className='text-3xl xxl:text-50px leading-60px font-bold text-white text-center'>
                                <Helmet>
                                      <title>{title}</title>
                                </Helmet>
                                    <FormattedMessage id='About_Us' />
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className='relative bg-white py-5 px-5 '>
                        <div className='container mx-auto'>
                            <ul className='flex items-center gap-7'>
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
                                        to='about-us'
                                        className='text-primarycolor text-base font-medium'
                                    >
                                        <FormattedMessage id='About_Us' />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='relative px-5 py-10 md:py-16'>
                        <div className='container mx-auto'>
                            <div className='flex items-center flex-wrap gap-y-8'>
                                <div className='w-full xl:w-1/2 px-3 order-2 xl:order-1'>
                                    <div className='flex gap-4 md:gap-7 items-start md:pr-70px rtl:pr-0 md:rtl:pl-70px flex-wrap md:flex-nowrap'>
                                        {getAboutUsData?.banner_section_img &&
                                        getAboutUsData?.banner_section_img
                                            .length > 0
                                            ? getAboutUsData?.banner_section_img.map(
                                                  (item: { image: string }) => {
                                                      return (
                                                          <div className=' md:mt-28 last:mt-0 w-full md:w-[308px] h-340px md:h-430px object-cover rounded-2xl overflow-hidden'>
                                                              <img
                                                                  src={`${REACT_APP_IMAGE_PATH}${item?.image}`}
                                                                  alt='AboutImg1'
                                                                  width={50}
                                                                  className='!rounded-14px  w-full h-full object-cover'
                                                              />
                                                          </div>
                                                      )
                                                  }
                                              )
                                            : null}
                                    </div>
                                </div>
                                <div className='w-full xl:w-1/2 px-3 order-1 xl:order-2'>
                                    <h2 className='text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor'>
                                        {getAboutUsData &&
                                        getAboutUsData?.banner_section_heading
                                            ? getAboutUsData?.banner_section_heading
                                            : null}
                                    </h2>
                                    <p className='text-base text-black/60 font-normal mt-7'>
                                        {getAboutUsData &&
                                        getAboutUsData?.banner_section_subheading
                                            ? getAboutUsData?.banner_section_subheading
                                            : null}
                                    </p>

                                    <ul className='grid grid-cols-2  gap-4 md:gap-0 md:flex  md:gap-x-16 mxl:gap-x-20 mt-5 xxl:mt-8'>
                                        <>
                                            {getAboutUsData &&
                                                getAboutUsData?.banner_section_collections &&
                                                getAboutUsData
                                                    ?.banner_section_collections
                                                    .length > 0 &&
                                                getAboutUsData?.banner_section_collections.map(
                                                    (item: {
                                                        value: string
                                                        text: string
                                                    }) => {
                                                        return (
                                                            <li className='relative before:content-[""]  before:absolute before:w-[1px] before:h-12 md:before:h-[66px] before:top-1 before:right-5 md:before:-right-12 rtl:before:right-24 before:bg-black/10'>
                                                                <h4 className='text-2xl md:text-3xl font-bold text-black'>
                                                                    {
                                                                        item?.value
                                                                    }
                                                                </h4>
                                                                <p className='text-sm md:text-base text-black/60 font-normal'>
                                                                    <FormattedMessage id='Collection' />
                                                                </p>
                                                            </li>
                                                        )
                                                    }
                                                )}
                                        </>
                                    </ul>
                                    <div className='flex gap-4 mt-8 xxl:mt-12 flex-wrap'>
                                        <a
                                            href={
                                                token ? "/dashboard" : "/login"
                                            }
                                            className='uppercase px-5 py-2 md:px-7 md:py-3 text-sm md:text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white'
                                        >
                                            {getAboutUsData &&
                                            getAboutUsData?.button_text
                                                ? getAboutUsData?.button_text
                                                : null}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-primarygrey py-10 md:py-16 px-5 '>
                        <div className='container mx-auto'>
                            <h2 className='text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center'>
                                {getAboutUsData &&
                                    getAboutUsData?.choose_us_header &&
                                    getAboutUsData?.choose_us_header}
                            </h2>
                            <p className='text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3'>
                                {getAboutUsData &&
                                getAboutUsData?.choose_us_description
                                    ? getAboutUsData?.choose_us_description
                                    : null}
                            </p>

                            <div className='flex -mx-3 flex-wrap gap-y-3 mt-12'>
                                {getAboutUsData &&
                                getAboutUsData?.choose_us_card &&
                                getAboutUsData?.choose_us_card.length > 0 ? (
                                    <>
                                        {getAboutUsData?.choose_us_card.map(
                                            (item: {
                                                header: string
                                                description: string
                                                image: string
                                            }) => {
                                                return (
                                                    <div className='w-full lg:w-1/4 px-3 '>
                                                        <div className='text-center  bg-white p-5 xl:p-30px group/hs  rounded-10px min-h-178px flex items-center justify-center c  transition-all duration-500  '>
                                                            <div className='w-full space-y-3'>
                                                                <div className='rounded-xl relative w-20 h-20  flex items-center justify-center bg-primarycolor/10 object-cover object-left-top overflow-hidden mx-auto'>
                                                                    {" "}
                                                                    <img
                                                                        src={`${REACT_APP_IMAGE_PATH}${item.image}`}
                                                                        alt='AboutImg2'
                                                                        className='w-9'
                                                                    />
                                                                </div>
                                                                <h5 className='text-base xl:text-lg font-semibold text-secodarycolor group-hover/green:text-white break-all'>
                                                                    {
                                                                        item?.header
                                                                    }
                                                                </h5>
                                                                <p className='text-Thirdcolor/60 text-base text-center group-hover/green:text-white'>
                                                                    {
                                                                        item?.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className='bg-white py-10 md:py-16 px-5'>
                        <div className='container mx-auto'>
                            <h2 className='text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center'>
                                {getAboutUsData?.our_team_header &&
                                    getAboutUsData?.our_team_header}
                            </h2>
                            <p className='text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3'>
                                {getAboutUsData?.our_team_description &&
                                    getAboutUsData?.our_team_description}
                            </p>
                            <div className='flex -mx-3 mt-12 lg:mt-50px flex-wrap gap-y-7 xl:gap-y-0'>
                                <>
                                    {getAboutUsData?.our_team &&
                                        getAboutUsData?.our_team?.length > 0 &&
                                        getAboutUsData?.our_team.map(
                                            (item: {
                                                name: string
                                                position: string
                                                image: { fileName: string }
                                            }) => {
                                                return (
                                                    <div className='w-full md:w-1/2 xl:w-1/4 px-3'>
                                                        <div className='border border-black/10 p-4 rounded-14px group/button cursor-pointer'>
                                                            <div className='relative h-340px'>
                                                                <img
                                                                    src={`${REACT_APP_IMAGE_PATH}${item?.image}`}
                                                                    alt=''
                                                                    className='w-full h-full object-cover rounded-xl'
                                                                />
                                                            </div>
                                                            <div className='py-3'>
                                                                <h4 className='font-semibold text-secodarycolor text-lg'>
                                                                    {item?.name}
                                                                </h4>
                                                                <p className='text-sm text-black/60'>
                                                                    {
                                                                        item?.position
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}
                                </>
                            </div>
                        </div>
                    </div>

                    <div className='bg-primarygrey relative px-5 py-10 md:py-16'>
                        <div className='container mx-auto'>
                            <div className='container mx-auto'>
                                <h2 className='text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center capitalize'>
                                    {reviewHeader && reviewHeader?.heading}
                                </h2>
                                <p className='text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3'>
                                    {reviewHeader && reviewHeader?.description}
                                </p>
                            </div>
                            <div className='flex mt-8 md:mt-50px -mx-3 flex-wrap gap-y-5'>
                                {reviewData &&
                                    reviewData.map(
                                        (reviewCard: ReviewListType) => {
                                            return (
                                                <>
                                                    <div className='w-full md:w-1/2 xl:w-1/4 px-3'>
                                                        <div className='border border-black/10 p-30px rounded-14px group/button bg-white'>
                                                            <div className='flex my-2'>
                                                                {Array.from(
                                                                    {
                                                                        length: 5,
                                                                    },
                                                                    (_v, i) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            {i <
                                                                            Number(
                                                                                reviewCard.rating
                                                                            ) ? (
                                                                                <i className='icon-star-fill text-base text-PrimaryYellow'></i>
                                                                            ) : (
                                                                                <i className='icon-star-outline text-base text-PrimaryYellow'></i>
                                                                            )}
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                            <p className='font-normal text-sm leading-6 max-w-[280px] text-black/70'>
                                                                {
                                                                    reviewCard[
                                                                        `card_description_${
                                                                            language as Language
                                                                        }`
                                                                    ]
                                                                }
                                                            </p>
                                                            <div className='flex gap-3 items-center mt-7'>
                                                                <img
                                                                    src={`${REACT_APP_IMAGE_PATH}${reviewCard.profile_image}`}
                                                                    alt='Profile'
                                                                    className='rounded-xl w-14 h-14'
                                                                />
                                                                <div className='relative'>
                                                                    <h5 className='font-semibold text-base text-secodarycolor'>
                                                                        {
                                                                            reviewCard[
                                                                                `customer_name_${
                                                                                    language as Language
                                                                                }`
                                                                            ]
                                                                        }
                                                                    </h5>
                                                                    <p className='text-black/60 text-sm font-normal'>
                                                                        {
                                                                            reviewCard[
                                                                                `customer_designation_${
                                                                                    language as Language
                                                                                }`
                                                                            ]
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }
                                    )}
                            </div>
                        </div>
                    </div>
                    <div className='bg-white py-10 md:py-16 px-5'>
                        <div className='container mx-auto'>
                            <h2 className='text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center capitalize'>
                                {faqData?.faqHeading}
                            </h2>
                            <p className='text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3'>
                                {faqData?.faqSubHeading}
                            </p>
                            <div className='flex -mx-3 mt-12 lg:mt-50px flex-wrap gap-y-7 xl:gap-y-0 items-start'>
                                <div className='w-full lg:w-1/2 px-3 order-2 lg:order-1'>
                                    <div className='max-w-md mx-auto'>
                                        {faqData?.faqImage &&
                                        faqData?.faqImage.length > 0 ? (
                                            <img
                                                src={`${REACT_APP_IMAGE_PATH}${faqData?.faqImage?.[0]?.image}`}
                                                alt='FaqImage'
                                                width={50}
                                                className='w-full h-400px object-contain group-hover/product:scale-105 transition-all duration-500'
                                            />
                                        ) : null}
                                    </div>
                                </div>
                                <div className='w-full lg:w-1/2 px-3 order-1 lg:order-2'>
                                    <div className='relative space-y-4 '>
                                        {faqDetailData ? (
                                            <>
                                                {faqDetailData.map(
                                                    (
                                                        faq: FaqDetailListingType,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <div key={index}>
                                                                <h2
                                                                    id={`accordion-collapse-heading-${index}`}
                                                                >
                                                                    <button
                                                                        type='button'
                                                                        className={`flex flex-col w-full border border-black/10 rounded-xl px-9 text-left py-4 space-y-4  ${
                                                                            index ===
                                                                            openQuestion
                                                                                ? `border-white shadow-box-search`
                                                                                : "border-black/10"
                                                                        }`}
                                                                        // data-accordion-target={`#accordion-collapse-body-${index}`}
                                                                        // aria-expanded={openQuestion === index}
                                                                        // aria-controls={`accordion-collapse-body-${index}`}
                                                                        onClick={() =>
                                                                            handleClickedAccordian(
                                                                                index
                                                                            )
                                                                        }
                                                                    >
                                                                        <div className='flex flex-row justify-between w-full gap-2'>
                                                                            <span className='font-semibold text-xl text-left rtl:text-right text-secodarycolor'>
                                                                                {
                                                                                    faq[
                                                                                        `question_${language}`
                                                                                    ]
                                                                                }{" "}
                                                                            </span>
                                                                            <span className='font-semibold text-xl text-left rtl:text-right text-secodarycolor'>
                                                                                <i
                                                                                    className={`icon-plus text-lg text-primarycolor ${
                                                                                        openQuestion ===
                                                                                        index
                                                                                            ? "rotate-icon"
                                                                                            : ""
                                                                                    }`}
                                                                                ></i>
                                                                            </span>
                                                                        </div>
                                                                        {openQuestion ===
                                                                            index && (
                                                                            <div
                                                                                className='text-left rtl:text-right'
                                                                                id={`accordion-collapse-body-${index}`}
                                                                            >
                                                                                <span className='font-normal text-base text-left rtl:text-right text-black/60'>
                                                                                    {
                                                                                        faq[
                                                                                            `answer_${language}`
                                                                                        ]
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </button>
                                                                </h2>
                                                            </div>
                                                        )
                                                    }
                                                )}
                                            </>
                                        ) : (
                                            <>No Records Found</>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-primarygrey py-10 md:py-16 px-5'>
                        <div className='container mx-auto'>
                            <h2 className='text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center'>
                                {blogHeader && blogHeader?.heading}
                            </h2>
                            <p className='text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3'>
                                {blogHeader && blogHeader?.description}
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
                                                                {blog.created_at.slice(
                                                                    0,
                                                                    10
                                                                )}
                                                            </p>
                                                            <h3 className='text-secodarycolor text-lg lg:text-xl font-semibold  line-clamp-2 text-clip mb-3'>
                                                                {
                                                                    blog[
                                                                        `title_${language}`
                                                                    ]
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
                            <div className='mt-8 md:mt-50px w-full text-center'>
                                <a
                                    href='/blog'
                                    className='uppercase px-5 py-2 md:px-7 md:py-2.5 inline-block text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white'
                                >
                                    <FormattedMessage id='View_All_Blogs' />
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default About
