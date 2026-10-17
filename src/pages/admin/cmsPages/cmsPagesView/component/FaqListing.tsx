import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "components/sectionHeader/SectionHeader";
import { Button } from "components/button/Button";
import { showToast } from "helper/toast.helper";
import { deleteFaq, getFaqDetail } from "../services/cmsPageView.services";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { language } from "i18n/messages/messages";
import { FaqDetailListingType } from "../types/cms.types";
import { responseType, toastType } from "constant/common.constant";
import { FormattedMessage, useIntl } from "react-intl";
import Loading from "components/globalLoader/Loading";
import { DeleteModal } from "components/model/DeleteModal";

const FaqListing = () => {
  const navigate = useNavigate();
  const [fagDetail, setFaqDetail] = useState<FaqDetailListingType[]>();
  const { langauge } = useSelector((state: RootState) => ({
    langauge: state.language.language,
  }));
  const [lang, setLang] = useState<string>(langauge);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [unitDeletedId, setUnitDeletedId] = useState<string>("");
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);

  const getFagDetailData = async () => {
    try {
      setLoading(true);
      const response = await getFaqDetail(lang);
      setFaqDetail(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };
  useEffect(() => {
    getFagDetailData();
  }, [language, lang]);

  const intl = useIntl();

  const handleDelete = async () => {
    try {
      setDeleteLoader(true);
      const response = await deleteFaq(unitDeletedId);
      if (response?.data.responseType === responseType.Success) {
        showToast(response?.data.message, toastType.Success, intl);
        getFagDetailData();
      }
      setUnitDeletedId("");
      setDeleteModal(false);
      setDeleteLoader(false);
    } catch (error) {
      setUnitDeletedId("");
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
              text={<FormattedMessage id="Manage_Questions" />}
              textClass="text-black"
            />
            <div className=" gap-4 max-w-xs ">
              <Button
                text={<FormattedMessage id="Create_Question" />}
                type="button"
                onClick={() => navigate(`/admin/cms-pages/faq-create`)}
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
          <div className="mt-8 -mx-3 relative rounded-2xl gap-y-5 overflow-hidden flex flex-wrap">
            {fagDetail && fagDetail.length > 0 ? (
              fagDetail.map((faq: FaqDetailListingType) => {
                return (
                  <>
                    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 md:px-3">
                      <div className="group/button cursor-pointer bg-white rounded-xl overflow-hidden">
                        <div className="relative border p-5 rounded-xl">
                          <h3>{faq[`question_${lang}`]}</h3>
                          <h2>{faq[`answer_${lang}`]}</h2>
                          <hr className="border-black/10 mt-6" />
                          <div className="mt-1 xl:mt-5 xxl:mt-5 w-full flex gap-5 justify-between">
                            <div
                              className="flex gap-1 cursor-pointer"
                              onClick={() =>
                                navigate(
                                  `/admin/cms-pages/faq-edit/${faq.uuid}`
                                )
                              }
                            >
                              <i className="icon-edit-alt text-base text-secondaryOrange"></i>
                              <Button
                                text={<FormattedMessage id="Edit" />}
                                type="button"
                                className="text-secondaryOrange"
                              ></Button>
                            </div>
                            <div
                              className="flex gap-1 cursor-pointer "
                              onClick={() => {
                                setDeleteModal(true);
                                setUnitDeletedId(faq?.uuid as string);
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
                        onDeleteClick={handleDelete}
                        deleteLoader={deleteLoader}
                      />
                    )}
                  </>
                );
              })
            ) : (
              <>
                <h4 className="text-center"> No Faq Found</h4>
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

export default FaqListing;
