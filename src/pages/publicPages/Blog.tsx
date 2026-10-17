import { useEffect, useState } from "react";
import BlogImg from "../../assets/images/blog-image.jpg";
import { getBlogList, getCmsPage } from "./service/publicPage.service";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { REACT_APP_IMAGE_PATH } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import { cmsPages, perPage } from "constant/common.constant";
import {
  BlogHeaderData,
  SingleBlog,
  SingleBlogHeaderType,
} from "pages/admin/cmsPages/cmsPagesView/types/cms.types";
import ReactPaginate from "react-paginate";
import { ApiParamsType } from "components/table/types";
import { FormattedMessage } from "react-intl";
import GlobalLoader from "components/globalLoader/GlobalLoader";
import { Helmet } from "react-helmet";
const Blog = () => {
  const [blogs, setBlogs] = useState<SingleBlog[]>([]);
  const [blogHeader, setBlogHeader] = useState<SingleBlogHeaderType>();
  const [pageBanner, setPageBanner] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { langauge } = useSelector((state: RootState) => ({
    langauge: state.language.language,
  }));

  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
  });

  const getBlogs = async () => {
    try {
      setLoading(true);
      const response = await getBlogList(langauge, apiParams);
      setBlogs(response?.data?.data?.rows);
      const getBlogHeader = await getCmsPage({
        page_title: cmsPages.Blog,
      });
      setPageBanner(
        JSON.parse(getBlogHeader?.data?.data?.[`cms_content_${langauge}`])
          .page_banner
      );
      const blogheadingSection = JSON.parse(
        getBlogHeader?.data?.data?.[`cms_content_${langauge}`] === ""
          ? "{}"
          : getBlogHeader?.data?.data?.[`cms_content_${langauge}`]
      )?.blogData.find((item: BlogHeaderData) => item?.page === "Blog");
      setBlogHeader(blogheadingSection);
      setApiParams((params) => {
        return {
          ...params,
          count: response?.data?.data?.count,
        };
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  const handlePageClick = (event: { selected: number }) => {
    setApiParams((params) => {
      return {
        ...params,
        page: event.selected + 1,
      };
    });
  };

  useEffect(() => {
    if (langauge) {
      getBlogs();
    }
  }, [langauge, apiParams.page]);

  const paginationCount = Math.ceil(apiParams.count / perPage);

  return (
    <>
      {loading ? (
        <GlobalLoader />
      ) : (
        <>
          <div className="mt-80px ">
            <div className='relative bg-main-banner bg-no-repeat bg-center bg-cover before:content-[""] before:top-0 before:left-0 before:w-full before:h-full before:absolute before:bg-primarycolor/90 py-20 lg:py-24 px-5 z-0 before:-z-10'>
              <div className="container mx-auto">
                <h1 className="text-3xl xxl:text-50px leading-60px font-bold text-white text-center">
                  <Helmet>
                    <title>{pageBanner}</title>
                  </Helmet>
                  {pageBanner}
                </h1>
              </div>
            </div>
          </div>
          <div className="relative bg-primarygrey">
            <div className="container mx-auto">
              <ul className="flex items-center py-5 px-5 gap-7">
                <li className='relative before:content-["/"] before:absolute before:top-0 before:-right-4 rtl:before:right-[unset] rtl:before:-left-4 before:text-black/40'>
                  <Link
                    to={"/"}
                    className="text-black/40 text-base font-normal"
                  >
                    <FormattedMessage id="Home" />
                  </Link>
                </li>
                <li className="relative">
                  <Link
                    to={`/blog`}
                    className="text-black/40 text-base font-normal"
                  >
                    <FormattedMessage id="Blog" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-primarygrey py-10 md:py-16 px-5">
            <div className="container mx-auto">
              <h2 className="text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center">
                {blogHeader && blogHeader?.heading}
              </h2>
              <p className="text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3">
                {blogHeader && blogHeader?.description}
              </p>
              <div className="flex mt-8 md:mt-50px lg:-mx-3 flex-wrap gap-y-5">
                {blogs && blogs.length > 0 ? (
                  blogs.map((blog: SingleBlog) => {
                    return (
                      <>
                        <div
                          className="w-full lg:w-1/3 lg:px-3"
                          key={blog.uuid}
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
                                {blog[`title_${langauge}`]}
                              </h3>
                              <p className="font-normal text-base leading-6  text-black/70 line-clamp-3 text-clip h-[72px]">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: blog[
                                      `body_${langauge}`
                                    ] as "string | TrustedHTML",
                                  }}
                                />
                              </p>
                              <div className="mt-4">
                                <a
                                  href="#"
                                  className="text-primarycolor text-sm font-semibold flex items-center gap-2 group-hs"
                                >
                                  <FormattedMessage id="Read_More" />{" "}
                                  <span className="w-4 h-[2px] bg-primarycolor group-hover/button:w-6 hover:w-14 transition-all duration-150"></span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <div className="w-full flex justify-center items-center">
                    <p className="text-center text-black text-2xl">
                      No Blogs Found
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <ReactPaginate
                  breakLabel={<span className="text-black">...</span>}
                  nextLabel={
                    <div className="w-12 h-12 rounded-full border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange">
                      <i className="icon-right_arrow text-24px text-black group-hover/hs:text-white"></i>
                    </div>
                  }
                  onPageChange={handlePageClick}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  pageCount={paginationCount}
                  previousLabel={
                    <div className="w-12 h-12 rounded-full border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange">
                      <i className="icon-left_arrow text-24px  text-black group-hover/hs:text-white"></i>
                    </div>
                  }
                  renderOnZeroPageCount={null}
                  className="mb-5 inline-flex items-center justify-center mt-10 rounded-full shadow-card py-2 px-3  mx-auto font-medium"
                  pageClassName="text-black px-2 "
                  previousClassName={`font-bold text-black pr-2 ${
                    apiParams.page === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                  nextClassName={`font-bold text-black pl-2 ${
                    apiParams.page === paginationCount
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                  forcePage={apiParams.page - 1}
                  activeLinkClassName={`font-bold text-18px text-primarycolor `}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Blog;
