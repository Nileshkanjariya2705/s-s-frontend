import useOwnerData from "hooks/getOwnerData";
import { useEffect, useState } from "react";
import AddEditAddressModel from "pages/manageProfile/components/AddEditAddressModel";
import { Link, useNavigate } from "react-router-dom";

import useUserData from "hooks/getUserData";
import { getStoreDashboardDetail } from "./services/dashboard.service";
import { REACT_APP_IMAGE_PATH } from "config";
import CountdownTimer from "components/countDown/CountdownTimer";
import {
  SupplierProduct,
  purchasedproductDataType,
} from "./types/dashboard.type";
import Loading from "components/globalLoader/Loading";
import { FormattedMessage } from "react-intl";
import { AddressType } from "types/generalTypes";

import { RoleConstant } from "constant/common.constant";
import useLocale from "hooks/useLocale";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { is_verified } = useOwnerData();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [purchReqDetail, setPurchReqDetail] =
    useState<purchasedproductDataType>();
  const [startProductIndex, setStartProductIndex] = useState(0);
  const { language } = useLocale()
  const { address } = useOwnerData();

  useEffect(() => {
    if (!is_verified) {
      // setShowModal(true);
    }
  }, [is_verified]);

  const { uuid, role } = useUserData();

  const getPurchaseRequestDetails = async () => {
    try {
      const resp = await getStoreDashboardDetail(uuid);
      setPurchReqDetail(resp?.data?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPurchaseRequestDetails();
  }, []);

  const timer = setTimeout(() => {
    handleNext();
  }, 8000);

  const handleNext = () => {
    if (timer) {
      clearTimeout(timer);
    }
    if (
      purchReqDetail?.purchasedPrdDetail &&
      startProductIndex < purchReqDetail?.purchasedPrdDetail.length - 1
    ) {
      setStartProductIndex(startProductIndex + 1);
    } else if (
      purchReqDetail?.purchasedPrdDetail &&
      startProductIndex === purchReqDetail?.purchasedPrdDetail.length - 1
    ) {
      setStartProductIndex(0);
    }
  };
  const handlePrev = () => {
    if (timer) {
      clearTimeout(timer);
    }
    if (startProductIndex > 0) {
      setStartProductIndex(startProductIndex - 1);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <div className="w-full min-w-0 flex-auto border border-black/10 rounded-14px p-20px md:p-30px">
          <>
            {purchReqDetail &&
              purchReqDetail?.purchasedPrdDetail &&
              Array.isArray(purchReqDetail?.purchasedPrdDetail) &&
              purchReqDetail?.purchasedPrdDetail?.length > 0 &&
              purchReqDetail?.purchasedPrdDetail
                .slice(startProductIndex, startProductIndex + 1)
                .map((item: SupplierProduct) => {
                  let prodId = item?.product_uuid;
                  let suppId = item?.supplier_uuid;

                  const encodedId1 = btoa(prodId);
                  const encodedId2 = btoa(suppId);
                  const encodedId3 = btoa(item.uuid);

                  const mergeId = `${encodedId1}|${encodedId2}|${encodedId3}`;
                  return (
                    <>
                      <div className="bg-primarycolor/10 rounded-10px p-4 md:p-30px flex items-center flex-wrap lg:flex-nowrap space-y-3 lg:space-y-0 relative">
                        <div className="w-full  lg:w-2/5 md:px-2">
                          <div className="overflow-hidden h-60">
                            <img
                              src={
                                item?.product &&
                                `${REACT_APP_IMAGE_PATH}/${item?.product?.featured_image}`
                              }
                              className="w-full h-full object-contain"
                              alt="logo"
                            />
                          </div>
                        </div>
                        <div className="w-full  lg:w-3/5 md:px-2  space-y-5">
                          <h2 className="text-20px leading-6 md:text-26px font-semibold xl:leading-9 text-secodarycolor capitalize">
                            {item?.product &&
                              item?.product?.[
                                `name_${language as "ar" | "ur" | "en"}`
                              ]}{" "}
                            {/* <span className="block text-xl  font-medium">
                              {item?.quantity}{" "}
                              {getUnitShortName(item, language)}
                            </span> */}
                          </h2>
                          <p className="bg-primarycolor/10 font-bold text-lg uppercase py-1 px-2 rounded-md inline-block text-primarycolor">
                            <span className="inline-block">SAR</span>{" "}
                            <span>{parseInt(item?.price)}</span>
                          </p>
                          <div className="relative">
                            <CountdownTimer
                              endDate={item.end_date}
                              dashboard={true}
                            />
                          </div>
                          <p
                            className="uppercase px-3.5 py-2 inline-block group-hover/button:bg-secondaryOrange group-hover/button:text-white text-xs font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white cursor-pointer"
                            onClick={() =>
                              navigate(`/product/details/${mergeId}`)
                            }
                          >
                            {<FormattedMessage id="View_Details" />}
                          </p>
                        </div>
                        <div className="w-full justify-between absolute flex left-0 p-5">
                          <i
                            className={`icon-left_arrow p-2 rounded-full bg-primarycolor text-white ${
                              startProductIndex === 0 ? "disabled" : ""
                            } `}
                            onClick={() => handlePrev()}
                          ></i>
                          <i
                            className={`icon-right_arrow p-2 rounded-full bg-primarycolor text-white ${
                              startProductIndex ===
                              purchReqDetail?.purchasedPrdDetail.length - 1
                                ? "disabled"
                                : ""
                            }`}
                            onClick={() => handleNext()}
                          ></i>
                        </div>
                      </div>
                    </>
                  );
                })}
          </>

          <div className="flex flex-wrap md:flex-nowrap mt-5 space-y-3 md:space-y-0 md:space-x-3 lg:space-x-5 items-start rtl:space-x-reverse">
            <Link
              to="/product/listing"
              className="w-full md:w-1/3 rounded-xl  border border-black/10 overflow-hidden "
            >
              <div className="p-4 lg:px-26px lg:py-6 flex items-center justify-between text-primarycolor">
                <h4 className="text-35px lg:text-42px font-semibold ">
                  {purchReqDetail?.getAllPurchaseReq}
                </h4>
                <i className="icon-offers text-45px lg:text-60px"></i>
              </div>
              <div className="bg-primarycolor/10 px-4 py-2.5 xxl:px-7 lg:py-3">
                <p className="text-sm xxl:text-base font-normal text-secodarycolor">
                  {<FormattedMessage id="Total_Available_Offers" />}
                </p>
              </div>
            </Link>
            <div
              className="w-full md:w-1/3 rounded-xl  border border-black/10 overflow-hidden cursor-pointer "
              onClick={() => navigate("/purchase-history")}
            >
              <div className="p-4 lg:px-26px lg:py-6 flex items-center justify-between text-primarycolor">
                <h4 className="text-35px lg:text-42px font-semibold ">
                  {purchReqDetail?.totalProducts}
                </h4>
                <i className="icon-product-alt text-45px lg:text-60px"></i>
              </div>
              <div className="bg-primarycolor/10 px-4 py-2.5 xxl:px-7 xxl:py-3">
                <p className="text-sm xxl:text-base font-normal text-secodarycolor">
                  {<FormattedMessage id="Total_Products_Ordered" />}
                </p>
              </div>
            </div>
            <div
              className="w-full md:w-1/3 rounded-xl  border border-black/10 overflow-hidden cursor-pointer"
              onClick={() => navigate("/purchase-request")}
            >
              <div className="p-4 lg:px-26px lg:py-6 flex items-center justify-between text-primarycolor">
                <h4 className="text-35px lg:text-42px font-semibold ">
                  {purchReqDetail?.getInExpirePurcReq}
                </h4>
                <i className="icon-products-alt text-45px lg:text-60px"></i>
              </div>
              <div className="bg-primarycolor/10 px-4 py-2.5 xxl:px-7 xxl:py-3">
                <p className="text-sm xxl:text-base font-normal text-secodarycolor">
                  {<FormattedMessage id="Pending_Purchase_Requests" />}
                </p>
              </div>
            </div>
          </div>
          {/* 03 */}
          <div className="flex mt-5 space-x-5">
            <div className="w-full lg:w-4/6 xxl:w-1/2 rounded-xl  border border-black/10 overflow-hidden">
              <div className="p-5 md:px-26px md:py-6">
                <div className="flex flex-wrap items-center justify-between space-y-2 md:space-y-0 space-x-0 md:space-x-2">
                  <h4 className="text-lg font-medium text-secodarycolor">
                    {<FormattedMessage id="Default_Shipping_Address" />}
                  </h4>
                  {(role === RoleConstant.storeOwner ||
                    role === RoleConstant.supplierOwner) && (
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="bg-primarycolor/10 px-3 py-2 md:px-4 md:py-2.5 text-primarycolor text-sm font-bold rounded-xl"
                    >
                      {<FormattedMessage id="Add_New_Address" />}
                    </button>
                  )}
                </div>
                <hr className="border-black/10 my-4" />
                <p className="text-secodarycolor/60">
                  <>
                    {" "}
                    {address &&
                      Array.isArray(address) &&
                      address
                        .filter(({ is_default }) => is_default)
                        .map((address: AddressType) => {
                          return (
                            <>
                              <ul className="space-y-3">
                                <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                                  <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/4 flex justify-between">
                                    <FormattedMessage id="Address" />{" "}
                                    <span className="hidden md:inline-block">
                                      :
                                    </span>{" "}
                                  </span>
                                  <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-3/4 lg:px-2 md:pr-5">
                                    {address.address}
                                  </span>
                                </li>
                                <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                                  <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/4 flex justify-between">
                                    <FormattedMessage id="Postal_Code" />{" "}
                                    <span className="hidden md:inline-block">
                                      :
                                    </span>{" "}
                                  </span>
                                  <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-3/4 lg:px-2 md:pr-5">
                                    {address.postal_code}
                                  </span>
                                </li>
                                <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                                  <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/4 flex justify-between">
                                    <FormattedMessage id="City" />{" "}
                                    <span className="hidden md:inline-block">
                                      :
                                    </span>{" "}
                                  </span>
                                  <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-3/4 lg:px-2 md:pr-5">
                                    {address.city}
                                  </span>
                                </li>
                                <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                                  <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/4 flex justify-between">
                                    <FormattedMessage id="State" />{" "}
                                    <span className="hidden md:inline-block">
                                      :
                                    </span>{" "}
                                  </span>
                                  <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-3/4 lg:px-2 md:pr-5">
                                    {address.state}
                                  </span>
                                </li>
                                <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                                  <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/4 flex justify-between">
                                    <FormattedMessage id="Country" />{" "}
                                    <span className="hidden md:inline-block">
                                      :
                                    </span>{" "}
                                  </span>
                                  <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-3/4 lg:px-2 md:pr-5">
                                    {address.Country}
                                  </span>
                                </li>
                              </ul>
                            </>
                          );
                        })}
                  </>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <>
          <AddEditAddressModel
            setShowModal={setShowModal}
            showModal={showModal}
            makeDefault={true}
          />
        </>
      )}
    </>
  );
};

export default Dashboard;
