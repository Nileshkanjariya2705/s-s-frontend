import { useEffect, useState } from "react";
import ProductStar from "../../assets/images/product-star.svg";
import Tage from "../../assets/images/tage.svg";
import StarTage from "../../assets/images/star-tage.svg";
import BlogImg from "../../assets/images/blog-image.jpg";
import {
  getCmsPage,
  getHomeBlogList,
  getHomeReviews,
  getPageData,
} from "./service/publicPage.service";
import { REACT_APP_IMAGE_PATH } from "config";
import { Link, useNavigate } from "react-router-dom";
import {  featuredCards } from "constant/common.constant";
import {
  Blog,
  HeaderType,
  HomePagePublicType,
  ReviewCard,
} from "pages/admin/cmsPages/cmsPagesView/types/cms.types";
import GlobalLoader from "components/globalLoader/GlobalLoader";
import useUserData from "hooks/getUserData";
import { FormattedMessage } from "react-intl";
import useLocale from "hooks/useLocale";

const Home = () => {
  const { language } = useLocale()
  const [homePageData, setHomePageData] = useState<HomePagePublicType>();
  const { token } = useUserData();
  const [blogs, setBlogs] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [blogHeader, setBlogHeader] = useState<HeaderType>();
  const [reviewHeader, setReviewHeader] = useState<HeaderType>();
  const [startCategoryIndex, setStartCategoryIndex] = useState(0);
  const [startFeaturedIndex, setStartFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [categoryLength, setCategoryCardLength] = useState(6);

  const navigate = useNavigate();
  const getHomeData = async () => {
    try {
      setLoading(true);
      const response = await getPageData("Home");
      const jsonData = JSON.parse(
        response?.data?.data?.[`cms_content_${language}`] === ""
          ? "{}"
          : response?.data?.data?.[`cms_content_${language}`]
      );
      setHomePageData(jsonData);

      const getBlogHeader = await getCmsPage({
        page_title: "Blog",
      });

      const getReviewHeader = await getCmsPage({
        page_title: "Review",
      });

      const reviewheadingSection = JSON.parse(
        getReviewHeader?.data?.data?.[`cms_content_${language}`] === ""
          ? "{}"
          : getReviewHeader?.data?.data?.[`cms_content_${language}`]
      )?.reviewHeaderSection?.find(
        (item: { page: string }) => item?.page === "Home"
      );
      setReviewHeader(reviewheadingSection);

      const blogheadingSection = JSON.parse(
        getBlogHeader?.data?.data?.[`cms_content_${language}`] === ""
          ? "{}"
          : getBlogHeader?.data?.data?.[`cms_content_${language}`]
      )?.blogData?.find((item: { page: string }) => item?.page === "Home");
      setBlogHeader(blogheadingSection);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };
  const getBlogs = async () => {
    try {
      const response = await getHomeBlogList(language);
      setBlogs(response.data.data);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };
  const getHomeReviewsCall = async () => {
    try {
      const getReviews = await getHomeReviews();

      setReviewData(getReviews?.data?.data.rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };
  useEffect(() => {
    getHomeData();
    getBlogs();
    getHomeReviewsCall();
  }, [language]);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    setStartCategoryIndex(0);
    setCategoryCardLength(2)
  };

  useEffect(() => {
    isMobile ? setCategoryCardLength(2) : setCategoryCardLength(6);
    window.addEventListener("resize", handleResize);
    return () => {
      setCategoryCardLength(6);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);


  const handleNext = (data: string) => {
    if (data === "category") {
      if (
        homePageData &&
        homePageData.category &&
        startCategoryIndex < homePageData.category.length - categoryLength
      ) {
        setStartCategoryIndex(startCategoryIndex + 1);
      }
    } else {
      if (
        homePageData &&
        homePageData.featured_products &&
        startCategoryIndex <
          homePageData.featured_products.length - featuredCards
      ) {
        setStartCategoryIndex(startCategoryIndex + 1);
      }
    }
  };
  const handlePrev = (data: string) => {
    if (data === "category") {
      if (startCategoryIndex > 0) {
        setStartCategoryIndex(startCategoryIndex - 1);
      }
    } else {
      if (startFeaturedIndex > 0) {
        setStartFeaturedIndex(startFeaturedIndex - 1);
      }
    }
  };
  return (
    <>
      {loading ? (
        <GlobalLoader />
      ) : (
        <>
          <div
            className="mt-86px px-5 md:px-9 py-5 "
            dir={`${language === "ar" ? "rtl" : "ltr"}`}
          >
            <div className="bg-primarygrey rounded-30px px-6 py-8 md:px-8 md:py-10 xl:px-5 xxl:px-3 xl:py-8 pb-0 xl:pb-0">
              <div className="container mx-auto">
                <div className="flex flex-wrap items-center">
                  <div className="w-full xl:w-2/5 xxl:w-1/2 relative">
                    <div className="main-heading">
                      <h1
                        dangerouslySetInnerHTML={{
                          __html: homePageData?.heading || "",
                        }}
                      ></h1>
                    </div>
                    <p className="text-sm xxl:text-base font-normal text-black/60 max-w-xl mt-4">
                      {homePageData?.subheding}
                    </p>

                    <div className="flex gap-4 mt-8 xxl:mt-10 flex-wrap">
                      <Link
                        to={token ? "/dashboard" : "/login"}
                        className="uppercase px-5 py-2 md:px-7 md:py-3 text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
                      >
                        {homePageData?.bannerButtonText1}
                      </Link>

                      <Link
                        to={token ? "/purchase-request" : "/login"}
                        className="uppercase px-5 py-2 md:px-7 md:py-3 text-base font-bold text-primarycolor border-2 border-primarycolor rounded-xl hover:bg-primarycolor hover:text-white"
                      >
                        {homePageData?.bannerButtonText2}
                      </Link>
                    </div>
                    <ul className="flex space-x-16 md:space-x-24 mt-8 xxl:mt-12 rtl:space-x-reverse">
                      <li className='relative before:content-[""] before:absolute before:w-[1px] before:h-12 md:before:h-[66px] before:-top-1 before:-right-12 before:rtl:-left-12 before:rtl:right-[unset] before:bg-black/10'>
                        <h4 className="text-2xl md:text-3xl font-bold text-black">
                          {homePageData?.Collection1}
                        </h4>
                        <p className="text-sm md:text-base text-black/60 font-normal">
                          <FormattedMessage id="Collection" />
                        </p>
                      </li>
                      <li>
                        <h4 className="text-2xl md:text-3xl font-bold text-black">
                          {homePageData?.Collection2}
                        </h4>
                        <p className="text-sm md:text-base text-black/60 font-normal">
                          <FormattedMessage id="User" />
                        </p>
                      </li>
                    </ul>
                    <hr className="border-black/10 my-6 xxl:mt-14 xxl:mb-9" />
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:flex md:space-x-4 xl:space-x-2 xxl:space-x-6">
                      <li className="relative space-y-2 rtl:ml-6">
                        <i className="icon-orders text-24px text-primarycolor"></i>
                        <p className="text-xs md:text-sm xxl:text-base text-black font-normal">
                          {/* <FormattedMessage id="shiiping_available" /> */}
                          {homePageData?.FooterIcon1}
                        </p>
                      </li>
                      <li className="relative space-y-2">
                        <i className="icon-card text-24px text-primarycolor"></i>
                        <p className="text-xs md:text-sm xxl:text-base text-black font-normal">
                          {/* <FormattedMessage id="money_back" /> */}
                          {homePageData?.FooterIcon2}
                        </p>
                      </li>
                      <li className="relative space-y-2">
                        <i className="icon-verify text-24px text-primarycolor"></i>
                        <p className="text-xs md:text-sm xxl:text-base text-black font-normal">
                          {/* <FormattedMessage id="payment_process" /> */}
                          {homePageData?.FooterIcon3}
                        </p>
                      </li>
                      <li className="relative space-y-2">
                        <i className="icon-headphone text-24px text-primarycolor"></i>
                        <p className="text-xs md:text-sm xxl:text-base text-black font-normal">
                          {/* 24/7 Online Support */}
                          {/* <FormattedMessage id="online_support" /> */}
                          {homePageData?.FooterIcon4}
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="w-full xl:w-3/5 xxl:w-1/2 relative pt-12 md:pt-8">
                    <i className="icon-path01 text-xl top-10 md:text-4xl lg:text-6xl rtl::text-5xl text-black absolute md:top-24 lg:top-14 rtl:left-5 rtl:lg:left-5 xl:top-44 xl:left-12 xxl:-left-28"></i>

                    <div className="relative w-full xl:w-418px h-592px ml-auto xl:mr-100px">
                      {homePageData?.banner_section_img &&
                      homePageData?.banner_section_img.length > 0 ? (
                        <img
                          src={`${REACT_APP_IMAGE_PATH}${homePageData?.banner_section_img?.[0]?.fileName}`}
                          alt="ContactImg1"
                          width={50}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-bannerColor lg:ml-76px xl:ml-92px p-2 flex items-center justify-center">
                      {homePageData?.banner_section_img &&
                      homePageData?.banner_section_img.length > 0 ? (
                        <img
                          src={`${REACT_APP_IMAGE_PATH}${homePageData?.banner_section_img?.[1]?.fileName}`}
                          alt="ContactImg1"
                          width={50}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="absolute bottom-12 -right-8 md:bottom-16 md:-right-8 lg:right-28 xl:-right-9 mxl:-right-0 xxl:-right-6 rtl:-left-7 rtl:right-[unset]  flex items-center justify-center">
                      <img
                        src={ProductStar}
                        alt="ProductStar"
                        className="w-40 md:w-64 mml:w-full"
                      />
                      <div className="absolute  text-center zoom-in-zoom-out">
                        <h4 className="text-xl md:text-28px mml:text-30px leading-8 font-bold text-black">
                          {homePageData?.productsCount}
                        </h4>
                        <p className="text-sm md:text-base text-black/60 font-normal">
                          <FormattedMessage id="Products" />
                        </p>
                      </div>
                    </div>
                    <div className="w-24 h-24 top-8 -right-4 md:w-36 md:h-36 lg:w-40 lg:h-40 absolute md:top-12 md:right-6  lg:top-16 lg:right-12 xl:top-344px xl:left-0 mxl:-left-12 rtl:left-0 rtl:xl:right-0 rtl:mxl:-right-12">
                      <div className="tage animate-spin-slow">
                        <img src={Tage} alt="Tage" className="w-full" />
                      </div>
                      <div className="w-8 h-8 md:w-12 md:h-12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <img
                          src={StarTage}
                          alt="StarTage"
                          className="w-full "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white py-10 md:py-16 px-5 ">
            <>
              {homePageData?.category &&
              Array.isArray(homePageData?.category) &&
              homePageData?.category?.length > 0 ? (
                <div className="container mx-auto">
                  <h2 className="text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center">
                    {homePageData?.catHeading}
                  </h2>
                  <div className="flex">
                    <div className="w-full">
                      <p className="text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3">
                        {homePageData?.catSubheding}
                      </p>
                    </div>
                  </div>
                  <div className="flex -mx-3 flex-wrap gap-y-3 pt-10 relative">
                        <div className="md:absolute  xl:right-4 xl:-top-16 md:-top-28 -top-4 left-3 md:left-unset right-3 xl:left-unset relative flex gap-3 rtl:right-3 xl:rtl:right-unset xl:rtl:left-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange">
                        <i
                              className="icon-left_arrow text-xl md:text-2xl  text-black group-hover/hs:text-white rtl:-rotate-180"
                          onClick={() => handlePrev("category")}
                        ></i>
                      </div>
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange">
                        <i
                              className="icon-right_arrow text-xl md:text-2xl text-black group-hover/hs:text-white rtl:rotate-180"
                          onClick={() => handleNext("category")}
                        ></i>
                      </div>
                    </div>
             <div className="flex w-full">
             {homePageData &&
                    homePageData?.category &&
                    homePageData?.category.length > 0 ? (
                      <>
                        {homePageData?.category
                          .slice(
                            startCategoryIndex,
                            startCategoryIndex + categoryLength
                          )
                          .map(
                            (category: {
                              text: string;
                              image: string;
                              name: string;
                            }) => {
                              return (
                                <>
                                  <div
                                    className="w-full md:w-1/3 xl:w-1/6 px-3 "
                                    onClick={() =>
                                      token &&
                                      navigate(`/product/all-products`, {
                                        state: { category_uuid: category.text },
                                      })
                                    }
                                  >
                                    <div className="text-center border border-black/10 p-5 group/hs   rounded-10px min-h-178px flex items-center justify-center cursor-pointer hover:shadow-second-shadow transition-all duration-500 hover:bg-primarycolor group/green">
                                      <div className="w-full space-y-2">
                                        <img
                                          src={`${REACT_APP_IMAGE_PATH}${category.image}`}
                                          alt="ContactImg1"
                                          width={50}
                                          className="mx-auto group-hover/hs:brightness-[8]"
                                        />
                                        <h5 className="text-lg font-semibold text-secodarycolor group-hover/green:text-white break-all">
                                          {category.name}
                                        </h5>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          )}
                      </>
                    ) : null}
             </div>
                  </div>
                </div>
              ) : null}
            </>
          </div>

          {/* Join our community Network */}
          <div className="bg-primarygrey py-10 md:py-16 px-5 md:px-6">
            <div className="container mx-auto">
              <h2 className="text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center">
                {homePageData?.communityHeading}
              </h2>
              <p className="text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3">
                {homePageData?.communitySubheding}
              </p>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center mt-50px flex-wrap gap-y-8">
                  <div className="w-full lg:w-1/2 px-0 md:px-3">
                      <div className="w-full sm:w-366px  h-420px m-auto lg:m-unset lg:!mr-auto lg:rtl:m-unset lg:rtl:!ml-auto lg:rtl:!mr-unset ">
                      {/* <img src={NetworkImg} alt="NetworkImg" /> */}
                      {homePageData?.community_network_img &&
                      homePageData?.community_network_img.length > 0 ? (
                        <img
                          src={`${REACT_APP_IMAGE_PATH}${homePageData?.community_network_img?.[0]?.fileName}`}
                          alt="ContactImg1"
                          width={50}
                          className="w-full h-full rounded-t-full object-cover"
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 px-0 md:px-3">
                    <h3 className="font-bold text-2xl md:text-3xl md:leading-10 lg:max-w-sm text-black text-center lg:text-left rtl:max-w-none">
                      {homePageData?.CommTitle1}
                    </h3>
                    <p className="text-sm md:text-base text-black/60 font-normal mt-4 text-center lg:max-w-md lg:text-left rtl:max-w-none">
                      {homePageData?.ComSubheading1}
                    </p>
                    <div className="mt-8 lg:mt-50px text-center lg:text-left">
                      <Link
                        to={token ? "/dashboard" : "/signup"}
                        className="uppercase px-5 py-2 md:px-7 md:py-2.5 inline-block text-sm md:text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
                      >
                        {homePageData?.commButtonText1}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex items-center mt-10 lg:mt-80px flex-wrap gap-y-10">
                  <div className="w-full lg:w-1/2 order-2 lg:order-1 px-0 md:px-3">
                    <h3 className="font-bold text-2xl md:text-3xl md:leading-10 lg:max-w-sm text-black text-center lg:text-left rtl:max-w-none lg:rtl:text-right">
                      {homePageData?.CommTitle2}
                    </h3>
                    <p className="text-sm md:text-base text-black/60 font-normal mt-4 text-center lg:max-w-md lg:text-left rtl:max-w-none lg:rtl:text-right">
                      {homePageData?.ComSubheading2}
                    </p>
                    <div className="mt-8 lg:mt-50px text-center lg:text-left lg:rtl:text-right">
                      <Link
                        to={token ? "/dashboard" : "/signup"}
                        className="uppercase px-5 py-2 md:px-7 md:py-2.5 inline-block text-sm md:text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
                      >
                        {homePageData?.commButtonText2}
                      </Link>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 order-1 lg:order-2 px-0 md:px-3">
                      <div className="w-full sm:w-366px  h-420px m-auto lg:m-unset lg:!ml-auto lg:rtl:!mr-auto lg:rtl:!ml-unset">
                      {homePageData?.community_network_img &&
                      homePageData?.community_network_img.length > 0 ? (
                        <img
                          src={`${REACT_APP_IMAGE_PATH}${homePageData?.community_network_img?.[1]?.fileName}`}
                          alt="ContactImg1"
                          width={50}
                          className="w-full h-full rounded-t-full object-cover"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Request */}
          <div className="bg-white ">
            <div className="container mx-auto">
              <div className="w-full py-10 md:py-72 md:pb-48  lg:py-340px xl:py-400px  px-5 relative">
                <div className="max-w-md lg:max-w-xl mx-auto text-center">
                  <h3 className="text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center ">
                    {homePageData?.purchaseHeading}
                  </h3>
                  <p className="text-base text-black/60 font-normal mt-4">
                    {homePageData?.purchaseSubheding}
                  </p>
                  <div className="mt-8 md:mt-50px">
                    <Link
                      to={token ? "/purchase-request" : "/login"}
                      className="uppercase px-5 py-2 md:px-7 md:py-2.5 inline-block text-sm md:text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
                    >
                      {homePageData?.PurchaseButtonText}
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block absolute top-32 xl:top-36 left-32 lg:left-56 xl:left-80 overflow-hidden rounded-2xl md:w-24 hover:w-28 lg:w-120px h-40 lg:hover:w-126px transition-all duration-500 cursor-pointer">
                  {homePageData?.purchase_section_img &&
                  homePageData?.purchase_section_img.length > 0 ? (
                    <img
                      src={`${REACT_APP_IMAGE_PATH}${homePageData?.purchase_section_img?.[0]?.fileName}`}
                      alt="ContactImg1"
                      width={50}
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                    />
                  ) : null}
                </div>
                <div className="hidden md:block absolute top-80 lg:top-340px left-9 lg:left-8 xl:left-24 overflow-hidden rounded-2xl w-28 hover:w-32 lg:w-44 lg:hover:w-150px xl:w-52 h-52 lg:h-80 xl:hover:w-214px transition-all duration-500 cursor-pointer">
                  {homePageData?.purchase_section_img &&
                  homePageData?.purchase_section_img.length > 0 ? (
                    <img
                      src={`${REACT_APP_IMAGE_PATH}${homePageData?.purchase_section_img?.[1]?.fileName}`}
                      alt="ContactImg1"
                      width={50}
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                    />
                  ) : null}
                </div>
                <div className="hidden md:block absolute top-442px lg:top-550px xl:top-630px left-28 lg:left-44 xl:left-64 overflow-hidden rounded-2xl w-28 hover:w-24 lg:w-40 lg:hover:w-134px xl:w-164px h-48 lg:h-60 xl:h-250px xl:hover:w-172px transition-all duration-500 cursor-pointer">
                  {homePageData?.purchase_section_img &&
                  homePageData?.purchase_section_img.length > 0 ? (
                    <img
                      src={`${REACT_APP_IMAGE_PATH}${homePageData?.purchase_section_img?.[2]?.fileName}`}
                      alt="ContactImg1"
                      width={50}
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                    />
                  ) : null}
                </div>
                <div className="hidden md:block absolute top-442px lg:top-550px xl:top-630px right-28 lg:right-44 xl:right-64 overflow-hidden rounded-2xl w-28 hover:w-24 lg:w-40 lg:hover:w-134px xl:w-164px h-48 lg:h-60 xl:h-250px xl:hover:w-172px transition-all duration-500 cursor-pointer z-10">
                  {homePageData?.purchase_section_img &&
                  homePageData?.purchase_section_img.length > 0 ? (
                    <img
                      src={`${REACT_APP_IMAGE_PATH}${homePageData?.purchase_section_img?.[3]?.fileName}`}
                      alt="ContactImg1"
                      width={50}
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                    />
                  ) : null}
                </div>
                <div className="hidden md:block absolute top-80 lg:top-340px right-9 lg:right-8 xl:right-24 z-0 overflow-hidden rounded-2xl w-28 hover:w-32 lg:w-44 lg:hover:w-150px xl:w-52 h-52 lg:h-80 xl:hover:w-214px transition-all duration-500 cursor-pointer">
                  {homePageData?.purchase_section_img &&
                  homePageData?.purchase_section_img.length > 0 ? (
                    <img
                      src={`${REACT_APP_IMAGE_PATH}${homePageData?.purchase_section_img?.[4]?.fileName}`}
                      alt="ContactImg1"
                      width={50}
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                    />
                  ) : null}
                </div>
                <div className="hidden md:block absolute top-32 xl:top-36 right-32 lg:right-56 xl:right-80 overflow-hidden rounded-2xl w-24 hover:w-28 lg:w-120px h-40 lg:hover:w-126px transition-all duration-500 cursor-pointer">
                  {homePageData?.purchase_section_img &&
                  homePageData?.purchase_section_img.length > 0 ? (
                    <img
                      src={`${REACT_APP_IMAGE_PATH}${homePageData?.purchase_section_img?.[5]?.fileName}`}
                      alt="ContactImg1"
                      width={50}
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Always be present */}
            <div className="relative flex space-y-1 lg:space-y-0 lg:space-x-1 rtl:space-x-reverse flex-wrap lg:flex-nowrap">
            <div className="w-full lg:w-1/2">
                <div className="relative overflow-hidden  group/product transition-all duration-500 ">
                  <div className="relative overflow-hidden z-0 h-366px md:h-480px xl:h-680px">
                  {homePageData?.dynamic_section_img &&
                  homePageData?.dynamic_section_img.length > 0 ? (
                    <img
                      src={`${REACT_APP_IMAGE_PATH}${homePageData?.dynamic_section_img?.[0]?.fileName}`}
                      alt="ContactImg1"
                      
                      className="w-full h-full group-hover/product:scale-105 transition-all duration-500 object-cover"
                    />
                  ) : null}
                  <div className="absolute w-full h-full top-0 left-0 z-10 bg-gradient-to-t to-black/10 from-black/75"></div>
                </div>
                  <div className="absolute w-full left-0 bottom-0 z-10 px-5 md:px-8 lg:px-50px py-10 min-h-178px">
                  <h4 className="text-xl lg:text-25px lg:leading-7 font-semibold text-white">
                    {homePageData?.imageHeading1}
                  </h4>
                  <p className="text-sm md:text-base font-normal text-white mt-3">
                    {homePageData?.imageSubheading1}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
                <div className="relative overflow-hidden  group/product transition-all duration-500 ">
                  <div className="relative overflow-hidden z-0 h-366px md:h-480px xl:h-680px">
                  {homePageData?.dynamic_section_img &&
                  homePageData?.dynamic_section_img.length > 0 ? (
                    <img
                      src={`${REACT_APP_IMAGE_PATH}${homePageData?.dynamic_section_img?.[1]?.fileName}`}
                      alt="ContactImg1"
                     
                      className="w-full h-full group-hover/product:scale-105 transition-all duration-500 object-cover"
                    />
                  ) : null}
                  <div className="absolute w-full h-full top-0 left-0 z-10 bg-gradient-to-t to-black/10 from-black/75"></div>
                </div>
                  <div className="absolute w-full left-0 bottom-0 z-10 px-5 md:px-8 lg:px-50px py-10 min-h-178px">
                  <h4 className="text-xl lg:text-25px lg:leading-7 font-semibold text-white">
                    {homePageData?.imageHeading2}
                  </h4>
                  <p className="text-sm md:text-base font-normal text-white mt-3">
                    {homePageData?.imageSubheading2}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Products */}
          {/* <div className="bg-white py-14 md:py-24 xxl:py-164px px-5">
            <div className="container mx-auto">
              <h2 className="text-3xl xxl:text-4xl font-bold text-secodarycolor text-center">
                {homePageData?.featuredHeading}
              </h2>
              <div className="flex">
                <div className="w-full">
                  <p className="text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3">
                    {homePageData?.featuredSubheding}
                  </p>
                </div>
              </div>
              <div className="flex -mx-3 mt-12 lg:mt-50px flex-wrap gap-y-7 xl:gap-y-0 relative">
                <div className="absolute right-0 -top-24 flex gap-3">
                  <div className="w-12 h-12 rounded-xl border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange">
                    <i
                      className="icon-left_arrow text-24px  text-black group-hover/hs:text-white"
                      onClick={() => handlePrev("featured")}
                    ></i>
                  </div>
                  <div className="w-12 h-12 rounded-xl border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange">
                    <i
                      className="icon-right_arrow text-24px text-black group-hover/hs:text-white"
                      onClick={() => handleNext("featured")}
                    ></i>
                  </div>
                </div>
                {homePageData &&
                  homePageData?.featured_products &&
                  homePageData?.featured_products.length > 0 &&
                  homePageData.featured_products
                    .slice(
                      startFeaturedIndex,
                      startFeaturedIndex + featuredCards
                    )
                    .map(
                      (
                        item: {
                          image: string;
                          end_date: string;
                          title: string;
                          subTitle: string;
                          price: string;
                          rating: string | number;
                          featuredButtonText: string;
                          featuredButtonLink: string;
                        },
                        index: number
                      ) => {
                        return (
                          <>
                            <div
                              className="w-full md:w-1/2 xl:w-1/4 px-3"
                              key={index}
                            >
                              <div className="border border-black/10 p-3.5 rounded-14px group/button cursor-pointer">
                                <div className="relative">
                                  <img
                                    src={`${REACT_APP_IMAGE_PATH}${item.image}`}
                                    alt="FoodSeven"
                                    width={50}
                                    className="w-full rounded-xl"
                                  />
                                  <div className="absolute top-10px left-10px flex bg-primarycolor/10 text-primarycolor font-medium text-xs gap-3 rounded-lg py-1.5 px-2.5">
                                    <span>{remainingTime(item.end_date)}</span>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex my-2">
                                    {Array.from({ length: 5 }, (_v, i) => (
                                      <span key={i}>
                                        {i < Number(item.rating) ? (
                                          <i className="icon-star-fill text-base text-PrimaryYellow"></i>
                                        ) : (
                                          <i className="icon-star-outline text-base text-PrimaryYellow"></i>
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <h4 className="font-semibold text-secodarycolor text-lg">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-black/60">
                                  {item.subTitle}
                                </p>
                                <hr className="border-black/10 my-3" />
                                <div className="flex justify-between items-center my-4">
                                  <p className="text-primarycolor font-bold text-xl xxl:text-25px">
                                    {item.price}
                                    <span className="text-black/60 text-sm font-normal ml-2">
                                      SAR/Piece
                                    </span>
                                  </p>
                                  <a
                                    href={item.featuredButtonLink}
                                    className="uppercase px-3.5 py-2 inline-block group-hover/button:bg-secondaryOrange group-hover/button:text-white text-xs font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
                                  >
                                    {item.featuredButtonText}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      }
                    )}
              </div>
            </div>
          </div> */}

          {/* How to get best offers */}

          <div className='relative bg-bg-steps bg-no-repeat bg-left-top bg-cover before:content-[""] before:top-0 before:left-0 before:w-full before:h-full before:absolute before:bg-primarycolor/90 py-10 md:py-16 px-5 z-0 before:-z-10'>
            <div className="container mx-auto">
              <h2 className="text-xl md:text-3xl xxl:text-4xl font-bold text-white text-center">
                {homePageData?.offerHeading}
              </h2>
              <p className="text-sm md:text-base text-white font-normal text-center max-w-3xl mx-auto mt-3">
                {homePageData?.offerSubheding}
              </p>
              <div className='flex flex-wrap gap-y-24 mt-24 w-full xl:w-11/12 mx-auto relative before:content-[""] lg:before:w-[calc(100%-300px)] xl:before:w-[calc(100%-440px)] before:absolute before:top-9 lg:before:border-[2px] lg:before:border-dashed before:border-white/20 before:left-1/2 before:-translate-x-1/2'>
                <div className="w-full lg:w-1/3 lg:px-4 xl:px-14">
                  <div className='w-20 h-20 mx-auto bg-white rounded-xl flex items-center justify-center relative before:content-["01"] before:absolute before:-top-16 before:left-1/2 before:-translate-x-1/2 before:text-40px before:font-bold before:text-white/20'>
                    <i className="icon-product-detail text-4xl text-primarycolor"></i>
                  </div>
                  <h4 className="font-semibold text-xl text-white text-center mt-5">
                    {homePageData?.offerTitle1}
                  </h4>
                  <p className="text-white text-base font-normal text-center mt-4">
                    {homePageData?.offerDescription1}
                  </p>
                </div>
                <div className="w-full lg:w-1/3 lg:px-4 xl:px-14">
                  <div className='w-20 h-20 mx-auto bg-white rounded-xl flex items-center justify-center relative before:content-["02"] before:absolute before:-top-16 before:left-1/2 before:-translate-x-1/2 before:text-40px before:font-bold before:text-white/20'>
                    <i className="icon-send-purachase text-4xl text-primarycolor"></i>
                  </div>
                  <h4 className="font-semibold text-xl text-white text-center mt-5">
                    {homePageData?.offerTitle2}
                  </h4>
                  <p className="text-white text-base font-normal text-center mt-4">
                    {homePageData?.offerDescription2}
                  </p>
                </div>
                <div className="w-full lg:w-1/3 lg:px-4 xl:px-14">
                  <div className='w-20 h-20 mx-auto bg-white rounded-xl flex items-center justify-center relative before:content-["03"] before:absolute before:-top-16 before:left-1/2 before:-translate-x-1/2 before:text-40px before:font-bold before:text-white/20'>
                    <i className="icon-offers text-4xl text-primarycolor"></i>
                  </div>
                  <h4 className="font-semibold text-xl text-white text-center mt-5">
                    {homePageData?.offerTitle1}
                  </h4>
                  <p className="text-white text-base font-normal text-center mt-4">
                    {homePageData?.offerDescription3}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primarygrey relative px-5 py-10 md:py-16">
            <div className="container mx-auto">
              <div className="container mx-auto">
                <h2 className="text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center capitalize">
                  {reviewHeader && reviewHeader?.heading}
                </h2>
                <p className="text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3">
                  {reviewHeader && reviewHeader?.description}
                </p>
              </div>
              <div className="flex mt-8 md:mt-50px -mx-3 flex-wrap gap-y-5">
                {reviewData &&
                  reviewData.map((reviewCard: ReviewCard) => {
                    return (
                      <>
                        <div className="w-full md:w-1/2 xl:w-1/4 px-3">
                          <div className="border border-black/10 p-30px rounded-14px group/button ">
                            <div className="flex my-2">
                              {Array.from({ length: 5 }, (_v, i) => (
                                <span key={i}>
                                  {i < reviewCard.rating ? (
                                    <i className="icon-star-fill text-base text-PrimaryYellow"></i>
                                  ) : (
                                    <i className="icon-star-outline text-base text-PrimaryYellow"></i>
                                  )}
                                </span>
                              ))}
                            </div>
                            <p className="font-normal text-sm leading-6 max-w-[280px] text-black/70">
                              {reviewCard[`card_description_${language}`]}
                            </p>
                            <div className="flex gap-3 items-center mt-7">
                              <img
                                src={`${REACT_APP_IMAGE_PATH}${reviewCard.profile_image}`}
                                alt="Profile"
                                className="rounded-xl w-14 h-14"
                              />
                              <div className="relative">
                                <h5 className="font-semibold text-base text-secodarycolor">
                                  {reviewCard[`customer_name_${language}`]}
                                </h5>
                                <p className="text-black/60 text-sm font-normal">
                                  {
                                    reviewCard[
                                      `customer_designation_${language}`
                                    ]
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
          {/* Latest Blogs */}
          <div className="bg-primarygrey py-10 md:py-16  px-5">
            <div className="container mx-auto">
              <h2 className="text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center">
                {blogHeader && blogHeader?.heading}
              </h2>
              <p className="text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3">
                {blogHeader && blogHeader?.description}
              </p>
              <div className="flex mt-8 md:mt-50px lg:-mx-3 flex-wrap gap-y-5">
                {blogs &&
                  blogs.map((blog: Blog) => {
                    return (
                      <>
                        <div
                          className="w-full lg:w-1/3 lg:px-3"
                          onClick={() => navigate(`/blog/${blog.slug}`)}
                        >
                          <div className="group/button cursor-pointer bg-white rounded-14px overflow-hidden">
                            {blog.cover_image ? (
                              <>
                                <img
                                  src={`${REACT_APP_IMAGE_PATH}${blog.cover_image}`}
                                  alt="BlogImg"
                                  className="w-full h-72 "
                                />
                              </>
                            ) : (
                              <>
                                <img
                                  src={BlogImg}
                                  alt="BlogImg"
                                  className="w-full"
                                />
                              </>
                            )}
                            <div className="border border-black/10 px-6 py-5 border-t-0  rounded-b-14px">
                              <p className="text-sm text-Thirdcolor/50 font-normal mb-2">
                                {`${blog.created_at.slice(0, 10)}`}
                              </p>
                              <h3 className="text-secodarycolor text-lg lg:text-xl font-semibold  line-clamp-2 text-clip mb-3 h-16">
                                {blog[`title_${language}`]}
                              </h3>
                              <p className="font-normal text-base leading-6  text-black/70 line-clamp-3 text-clip h-[72px]">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: blog[`body_${language}`] as
                                      | string
                                      | TrustedHTML,
                                  }}
                                />
                              </p>
                              <div className="mt-4">
                                <a className="text-primarycolor text-sm font-semibold flex items-center gap-2 group-hs">
                                  <FormattedMessage id="Read_More" />{" "}
                                  <span className="w-4 h-[2px] bg-primarycolor group-hover/button:w-6 hover:w-14 transition-all duration-150"></span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>

              <div className="mt-8 md:mt-50px w-full text-center">
                <a
                  href="/blog"
                  className="uppercase px-5 py-2 md:px-7 md:py-2.5 inline-block text-sm md:text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
                >
                  <FormattedMessage id="View_All_Blogs" />
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
