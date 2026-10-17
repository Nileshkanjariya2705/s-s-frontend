import { Button } from "components/button/Button";
import SectionHeader from "components/sectionHeader/SectionHeader";
import { REACT_APP_IMAGE_PATH } from "config";
import { responseType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteSingleReview,
  getReviewList,
} from "../services/cmsPageView.services";
import { ReviewListType } from "../types/cms.types";
import { FormattedMessage, useIntl } from "react-intl";
import Loading from "components/globalLoader/Loading";
import { DeleteModal } from "components/model/DeleteModal";

const ReviewList = () => {
  const [reviewData, setReviewData] = useState<ReviewListType[]>([]);
  const [lang, setLang] = useState<"en" | "ur" | "ar">("en");
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [unitDeletedId, setUnitDeletedId] = useState<string>("");
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const getReviews = await getReviewList();
      if (getReviews?.data.responseType === responseType.Success) {
        setReviewData(getReviews?.data.data.rows);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  const intl = useIntl();

  const deleteReview = async () => {
    try {
      setDeleteLoader(true);
      const response = await deleteSingleReview(unitDeletedId);

      if (response?.data.responseType === responseType.Success) {
        showToast(response?.data.message, responseType.Success, intl);
        fetchData();
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
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex w-full justify-between">
            <SectionHeader
              text={<FormattedMessage id="Manage_Reviews" />}
              textClass="text-black"
            />
            <div className=" px-2">
              <Button
                text={<FormattedMessage id="Review_Card" />}
                type="button"
                className="py-3 px-6  text-sm font-bold text-center text-primarycolor border-2 border-primarycolor bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                onClick={() => {
                  navigate(`add`);
                }}
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
                className={`text-base font-medium px-3  pb-2 ${
                  lang === "ar"
                    ? `  border-primarycolor  border-b-2 text-primarycolor`
                    : ` text-black/50`
                } `}
              >
                {<FormattedMessage id="Arabic" />}
              </button>
            </li>
          </ul>

          <div className="relative">
            <div className="mt-8 -mx-3 relative rounded-2xl gap-y-5 overflow-hidden flex flex-wrap">
              {reviewData &&
                reviewData.map((reviewCard: ReviewListType, index: number) => {
                  return (
                    <>
                      <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 md:px-3">
                        <div
                          className="relative border p-5 rounded-xl"
                          key={index}
                        >
                          <div>
                            <p>
                              {<FormattedMessage id="Rating" />} :
                              {reviewCard?.rating}
                            </p>
                            <p>
                              {<FormattedMessage id="Description" />} :
                              {reviewCard[`card_description_${lang}`]}
                            </p>
                            <p>
                              {<FormattedMessage id="Customer_name" />} :
                              {reviewCard[`customer_name_${lang}`]}
                            </p>
                            <p>
                              {<FormattedMessage id="Customer_Designation" />}:
                              {reviewCard[`customer_designation_${lang}`]}
                            </p>
                            <p>
                              {<FormattedMessage id="Profile_Image" />}
                              :
                              <img
                                src={`${REACT_APP_IMAGE_PATH}${reviewCard.profile_image}`}
                                alt="profile_image"
                                className="w-20 h-20 rounded-3xl"
                              />
                            </p>
                            <hr className="border-black/10 mt-6" />
                            <div className="mt-1 xl:mt-5 xxl:mt-5 w-full flex gap-5 justify-between">
                              <div
                                className="flex gap-1 cursor-pointer"
                                onClick={() => {
                                  navigate(
                                    `/admin/cms-pages/review/edit/${reviewCard.uuid}`
                                  );
                                }}
                              >
                                <i className="icon-edit-alt text-base text-secondaryOrange"></i>
                                <Button
                                  text={<FormattedMessage id="Edit" />}
                                  type="button"
                                  className="text-secondaryOrange"
                                ></Button>
                              </div>
                              <div
                                className="flex gap-1 cursor-pointer"
                                onClick={() => {
                                  setDeleteModal(true);
                                  setUnitDeletedId(reviewCard?.uuid as string);
                                }}
                              >
                                <i className="icon-trash-alt text-base text-red-600"></i>
                                <Button
                                  className="text-red-600"
                                  text={<FormattedMessage id="Delete" />}
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
                          onDeleteClick={deleteReview}
                          deleteLoader={deleteLoader}
                        />
                      )}
                    </>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ReviewList;
