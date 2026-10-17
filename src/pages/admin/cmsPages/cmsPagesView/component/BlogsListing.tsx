import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import SectionHeader from "components/sectionHeader/SectionHeader";
import { Button } from "components/button/Button";
import { REACT_APP_IMAGE_PATH } from "../../../../../config";
import { showToast } from "helper/toast.helper";
import { deleteBlog, getBlogList } from "../services/cmsPageView.services";
import { responseType } from "constant/common.constant";
import Loading from "components/globalLoader/Loading";
import { SingleBlog } from "../types/cms.types";
import { FormattedMessage, useIntl } from "react-intl";
import { DeleteModal } from "components/model/DeleteModal";

const BlogsListing = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<SingleBlog[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [unitDeletedId, setUnitDeletedId] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<boolean>(true);
  const { langauge, token } = useSelector((state: RootState) => ({
    langauge: state.language.language,
    token: state.token.token,
  }));
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [lang, setLang] = useState<string>(langauge);
  const getBlogs = async () => {
    try {
      setLoading(true);
      const response = await getBlogList(lang);
      if (response?.data.responseType === responseType.Success) {
        setBlogs(response?.data?.data?.rows);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  useEffect(() => {
    if (token) {
      getBlogs();
    }
  }, [token, langauge, lang]);

  const intl = useIntl();

  const handleDelete = async () => {
    try {
      setDeleteLoader(true);
      const response = await deleteBlog(unitDeletedId);
      if (response?.data.responseType === responseType.Success) {
        showToast(response?.data.message, responseType.Success, intl);
        getBlogs();
      }

      setUnitDeletedId("");
      setDeleteModal(false);
      setDeleteLoader(false);
    } catch (error) {
      setDeleteModal(false);
      setDeleteLoader(false);
    }
  };

  return (
    <>
      {!loading ? (
        <>
          <div className="flex justify-between">
            <SectionHeader
              text={<FormattedMessage id="Manage_Blogs" />}
              textClass="text-black"
            />
            <div className=" gap-4 max-w-xs ">
              <Button
                text={<FormattedMessage id="Create_Blog" />}
                type="button"
                onClick={() => navigate(`/admin/cms-pages/blog-create`)}
                className="w-full px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
              ></Button>
            </div>
          </div>
          <ul className="border-b border-primarycolor/20  flex items-center w-full mt-4">
            <li>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`text-base font-medium px-3  pb-2${
                  lang === "en"
                    ? `  border-primarycolor  border-b-2 text-primarycolor`
                    : ` text-black/50`
                } `}
              >
                {<FormattedMessage id="English" />}
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setLang("ur")}
                className={`text-base font-medium px-3  pb-2 ${
                  lang === "ur"
                    ? `  border-primarycolor  border-b-2 text-primarycolor`
                    : ` text-black/50`
                } `}
              >
                {<FormattedMessage id="Urdu" />}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setLang("ar")}
                className={`text-base font-medium px-3  pb-2${
                  lang === "ar"
                    ? `  border-primarycolor  border-b-2 text-primarycolor`
                    : ` text-black/50`
                } `}
              >
                {<FormattedMessage id="Arabic" />}
              </button>
            </li>
          </ul>

          <div className="mt-8 -mx-3 relative rounded-2xl gap-y-5 overflow-hidden flex flex-wrap">
            {blogs && blogs.length > 0 ? (
              blogs.map((blog: SingleBlog, index: number) => {
                return (
                  <>
                    <div
                      className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 md:px-3"
                      key={index}
                    >
                      <div className="group/button cursor-pointer bg-white rounded-14px overflow-hidden">
                        <div className="h-56 xl:h-72 relative overflow-hidden">
                          <img
                            src={`${REACT_APP_IMAGE_PATH}${blog.cover_image}`}
                            alt="BlogImg"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="border border-black/10 px-6 py-5 border-t-0  rounded-b-14px">
                          <p className="text-sm text-Thirdcolor/50 font-normal mb-2">
                            {`${blog.created_at.slice(0, 10)}`}
                          </p>
                          <h3 className="text-secodarycolor text-lg lg:text-xl font-semibold  line-clamp-2 text-clip mb-3 h-16">
                            {blog[`title_${lang}`]}
                          </h3>
                          <p className="font-normal text-base leading-6  text-black/70 line-clamp-3 text-clip h-[72px]">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: blog[
                                  `body_${lang}`
                                ] as "string | TrustedHTML",
                              }}
                            />
                          </p>
                          <hr className="border-black/10 mt-6" />
                          <div className="mt-1 xl:mt-5 xxl:mt-5 w-full flex gap-5 justify-between">
                            <div
                              className="flex gap-1 cursor-pointer"
                              onClick={() =>
                                navigate(
                                  `/admin/cms-pages/blog-edit/${blog.uuid}`
                                )
                              }
                            >
                              <i className="icon-edit-alt text-base text-secondaryOrange"></i>
                              <Button
                                text={<FormattedMessage id="Edit" />}
                                // disable={disableBtn}
                                type="button"
                                className="text-secondaryOrange"
                              ></Button>
                            </div>
                            <div
                              className="flex gap-1 cursor-pointer "
                              onClick={() => {
                                setDeleteModal(true);
                                setUnitDeletedId(blog.uuid);
                              }}
                            >
                              <i className="icon-trash-alt text-base text-red-600"></i>
                              <Button
                                // loader={buttonLoader[blog.uuid]}
                                className="text-red-600"
                                text={<FormattedMessage id="Delete" />}
                                // disable={disableBtn}
                                type="button"
                              ></Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {deleteModal && unitDeletedId && (
                      <DeleteModal
                        setShowModal={setDeleteModal}
                        showModal={deleteModal}
                        deleteId={unitDeletedId}
                        onDeleteClick={handleDelete}
                        deleteLoader={deleteLoader}
                      />
                    )}
                  </>
                );
              })
            ) : (
              <>
                <h4 className="text-center">
                  {<FormattedMessage id="No_Blogs_Found" />}
                </h4>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <Loading />
        </>
      )}
    </>
  );
};

export default BlogsListing;
