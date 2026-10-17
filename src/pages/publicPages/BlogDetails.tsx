import { useEffect, useState } from "react";

import BlogImg from "../../assets/images/blog-image.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { REACT_APP_IMAGE_PATH } from "../../config";
import { getCmsPage, getRelatedBlog } from "./service/publicPage.service";
import { cmsPages } from "constant/common.constant";
import Loading from "components/globalLoader/Loading";
import { getSingleBlog } from "pages/admin/cmsPages/cmsPagesView/services/cmsPageView.services";
import {
  BlogHeaderData,
  SingleBlog,
} from "pages/admin/cmsPages/cmsPagesView/types/cms.types";
import { FormattedMessage, useIntl } from "react-intl";
import useLocale from "hooks/useLocale";
import { Helmet } from "react-helmet";
const BlogDetails = () => {
  const params = useParams();
  const [selectedBlog, setSelectedBlog] = useState<SingleBlog>();
  const [blogs, setBlogs] = useState<SingleBlog[]>();
  const [relatedBlogsHeader, setRelatedBlogsHeader] =
    useState<BlogHeaderData>();
  const navigate = useNavigate();
  const { language } = useLocale();
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'Blog_Details' });

  const getEditableData = async (slug: string) => {
    try {
      const response = await getSingleBlog(slug, language);
      setSelectedBlog(response.data.data[0]);
      const getBlogHeader = await getCmsPage({
        page_title: cmsPages.Blog,
      });
      const blogheadingSection = JSON.parse(
        getBlogHeader?.data?.data?.[`cms_content_${language}`] === ""
          ? "{}"
          : getBlogHeader?.data?.data?.[`cms_content_${language}`]
      )?.blogData?.find(
        (item: BlogHeaderData) => item?.page === cmsPages.Blog_details
      );

      setRelatedBlogsHeader(blogheadingSection);
    } catch (error) {
      return error;
    }
  };

  const getBlogs = async (slug: string) => {
    try {
      const response = await getRelatedBlog(language);
      const getBlog = response.data.data.filter(
        (blog: SingleBlog) => slug !== blog?.slug
      );
      setBlogs(getBlog);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    getEditableData(params.uuid as string);
    getBlogs(params.uuid as string);
  }, [params.uuid, language]);

  return selectedBlog ? (
    <>
      <div className="mt-80px ">
        <div className='relative bg-main-banner bg-no-repeat bg-center bg-cover before:content-[""] before:top-0 before:left-0 before:w-full before:h-full before:absolute before:bg-primarycolor/90 py-20 lg:py-24 px-5 z-0 before:-z-10'>
          <div className="container mx-auto">
            <h1 className="text-3xl xxl:text-50px leading-60px font-bold text-white text-center">
              <FormattedMessage id="Blog_Details" />
              <Helmet>
                <title>{title}</title>
              </Helmet>
            </h1>
          </div>
        </div>
      </div>
      <div className="relative bg-white py-5 px-5">
        <div className="container mx-auto">
          <ul className="flex items-center  gap-7">
            <li className='relative before:content-["/"] rtl:first:before:content-[unset] before:absolute before:top-0 before:-right-4 before:text-black/40'>
              <Link to={""} className="text-black/40 text-base font-normal">
                <FormattedMessage id="Home" />
              </Link>
            </li>
            <li className='relative before:content-["/"] before:absolute before:top-0 before:-right-4 before:text-black/40'>
              <Link
                to={`/blog`}
                className="text-black/40 text-base font-normal"
              >
                <FormattedMessage id="Blog" />
              </Link>
            </li>
            <li className='relative before:content-[unset] rtl:before:content-["/"] before:absolute before:top-0 before:-right-4 before:text-black/40'>
              <Link
                to={`/blog/${params.uuid}`}
                className="text-primarycolor text-base font-medium"
              >
                {selectedBlog[`title_${language}`]}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="relativerelative px-5 py-10 md:py-16">
        <div className="container mx-auto blog-detail-rs">
          <p className="text-base text-Thirdcolor/50 font-normal">
            {" "}
            {`${selectedBlog.created_at.slice(0, 10)}`}
          </p>
          <h2 className="text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor ">
            {selectedBlog[`title_${language}`]}
          </h2>
          <p className="text-sm md:text-base text-Thirdcolor/60 font-normal text-left  mt-5"></p>
          <p className="text-sm md:text-base text-Thirdcolor/60 font-normal text-left mt-5">
            <div
              dangerouslySetInnerHTML={{
                __html: selectedBlog[
                  `body_${language}`
                ] as "string | TrustedHTML",
              }}
            />
          </p>

          <hr className="my-5 md:my-10 border-black/10" />
          <div className="relative flex  items-center flex-wrap space-y-5 md:space-y-0 ">
            <div className="flex gap-4 items-center w-full md:w-1/2 ">
              <div className="w-70px h-70px rounded-full border-2 border-primarycolor p-1">
                {selectedBlog.author_image ? (
                  <>
                    <img
                      src={`${REACT_APP_IMAGE_PATH}${selectedBlog.author_image}`}
                      alt="image"
                      className="rounded-full"
                    />
                  </>
                ) : (
                  <>
                    <img src={BlogImg} alt="" />
                  </>
                )}
              </div>

              <div className="relative">
                <h5 className="font-semibold text-base text-secodarycolor">
                  {selectedBlog[`author_name_${language}`]}
                </h5>
                <p className="text-black/60 text-sm font-normal">
                  <FormattedMessage id="Follow_Me" />{" "}
                  <a href="#" className="text-Primaryblue">
                    @JohnAMWill.
                  </a>
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <ul className="flex items-center justify-start md:justify-end gap-4 ">
                <li className="mr-5">
                  <p className="text-black text-base font-normal">
                    <FormattedMessage id="Share_Post" />
                  </p>
                </li>
                <li>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-Linkdin flex items-center justify-center"
                  >
                    <i className="icon-linkdin text-base text-white"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-Twitter flex items-center justify-center"
                  >
                    <i className="icon-twitter text-base text-white"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-Dribble flex items-center justify-center"
                  >
                    <i className="icon-dribbble-alt text-base text-white"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primarygrey py-10 md:py-16 px-5">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-3xl xxl:text-4xl font-bold text-secodarycolor text-center">
            {relatedBlogsHeader && relatedBlogsHeader?.heading}
          </h2>
          <p className="text-sm md:text-base text-Thirdcolor font-normal text-center max-w-3xl mx-auto mt-3">
            {relatedBlogsHeader && relatedBlogsHeader?.description}
          </p>
          <div className="flex mt-8 md:mt-50px lg:-mx-3 flex-wrap gap-y-5">
            {blogs &&
              blogs.map((blog: SingleBlog) => {
                return (
                  <>
                    <div
                      className="w-full lg:w-1/3 lg:px-3"
                      onClick={() => {
                        getEditableData(`${blog.slug}`);
                        navigate(`/blog/${blog.slug}`);
                      }}
                      key={blog.uuid}
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
                                __html: blog[`body_${language}`] as string,
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
              })}
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Loading />
    </>
  );
};

export default BlogDetails;
