import { Button } from "components/button/Button";
import { useEffect, useState } from "react";
import {
  addReviewsAndRatings,
  getChargeDetails,
  sendConfirmationMail,
} from "../services/checkout.services";
import Loading from "components/globalLoader/Loading";
import { useNavigate, useParams } from "react-router-dom";
import {
  PaymentDetails,
  ReviewAndRatingtype,
  ConfirmationReviews,
  SelectedProductProps,
} from "../types/checkout.types";
import {
  getOwnerShipDetils,
  setOwnershipDetails,
} from "reducers/ownership.reducer";
import { useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { Modal } from "components/model/Model";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import TextArea from "components/textArea/Textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { ConfirmationReviewSchema } from "../schema/reviewsAndRating.schema";
import { showToast } from "helper/toast.helper";
import { responseType, toastType } from "constant/common.constant";
import moment from "moment";
import SaveCard from "./SaveCard";

const Confirmation: React.FC<SelectedProductProps > = ({
  setTab,
  chargeId,
  setDisableTab,
  orderDetail
}) => {
  const url = new URL(window?.location.href);
  const tapId = url.searchParams.get("tap_id") || chargeId;
  const { mergeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("pending");
  const [loader, setLoader] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editReview, setEditReview] = useState(false);
  const [defaultValues, setDefaultValues] = useState<ReviewAndRatingtype>();
  const [ratingCount, setRatingCount] = useState(0);
  const [saveCardModal, setSaveCardModal] = useState<boolean>(true);
  const [encodedId1, encodedId2]: any = mergeId?.split("|");
  const purchaseReqId = atob(encodedId1);
  const supplier_info_uuid = atob(encodedId2);

  let storageFlag = localStorage.getItem("save_card");

  const getPaymentConfirmationDetails = async () => {
    try {
      setLoader(true);
      const response = await getChargeDetails({
        tapId,
        purchaseReqId,
        supplier_info_uuid,
      } as { tapId: string; purchaseReqId: string; supplier_info_uuid: string });

      if (response?.data?.responseType === "success") {
        if (response?.data?.data?.ratings !== null) {
          setEditReview(true);
        }
        if(orderDetail?.payment_details?.payment_mode === "BANK_TRANSFER"){
          setTab(2)
        }
        else{
          if (response?.data?.data?.payment_status !== "SUCCESS") {
            setPaymentDetails(response?.data?.data);
            setMessage(response?.data?.data?.payment_status);
            setRatingCount(response?.data?.data?.ratings?.rating);
            setDefaultValues(response?.data?.data?.ratings);
            setLoader(false);
          } else {
            setPaymentDetails(response?.data?.data);
            setMessage(response?.data?.data?.payment_status);
            setRatingCount(response?.data?.data?.ratings?.rating);
            setDefaultValues(response?.data?.data?.ratings);
            if (localStorage.getItem("orderMail") !== "1") {
              const resposne = await sendConfirmationMail(
                response?.data?.data?.order_uuid
              );
              if (resposne?.data?.responseType === responseType.Success) {
                localStorage.setItem("orderMail", "1");
              }
            }
            setLoader(false);
          }
        }
        setDisableTab(() => {
          return {
            selectedProductsFlag:1,
            shippingFlag: 1,
            confirmationFlag: 1,
            paymentFlag: 1,
          };
        });
      }
      setLoader(false);
    } catch (error) {}
  };
  const handleInitialApiCalls = async () => {
    try {
      const data = await dispatch(getOwnerShipDetils() as any);
      dispatch(setOwnershipDetails({ ...data.payload }));
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    handleInitialApiCalls();
  }, []);

  useEffect(() => {
    getPaymentConfirmationDetails();
  }, [tapId]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("orderMail");
    };
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ConfirmationReviews>({
    resolver: yupResolver(ConfirmationReviewSchema),
    values: defaultValues && defaultValues,
  });
  useEffect(() => {
    if (!showModal) {
      reset();
    }
  }, [message]);

  const intl = useIntl();

  const handleReviewAndRating: SubmitHandler<FieldValues> = async (values) => {
    try {
      const response = await addReviewsAndRatings({
        purchaseReqId: purchaseReqId,
        supplier_info_uuid,
        reviews: values.reviews,
        orderId: null,
        rating: ratingCount,
      });
      if (response) {
        if (response?.data.responseType === responseType.Success) {
          showToast(response?.data.message, toastType.Success, intl);
          setShowModal(false);
          setEditReview(true);
        } else {
          showToast(response?.data.message, toastType.Error, intl);
          setShowModal(false);
        }
      }
    } catch (error) {}
  };
  const handleStarClick = (index: number) => {
    setRatingCount(index + 1);
  };
  return (
    <>
      <div>
        {loader ? (
          <>
            <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </>
        ) : (
          <>
            {message === "SUCCESS" ? (
              <>
                <Modal
                  showModal={showModal}
                  title={
                    editReview === true ? (
                      <FormattedMessage id="Edit_Review_And_Rating" />
                    ) : (
                      <FormattedMessage id="Add_Review_And_Rating" />
                    )
                  }
                  setShowModal={setShowModal}
                >
                  <form onSubmit={handleSubmit(handleReviewAndRating)}>
                    <div className="m-3">
                      <div className="flex gap-3 md:gap-5  justify-center">
                        {[1, 2, 3, 4, 5].map((_item, index) => {
                          return (
                            <i
                              onClick={() => handleStarClick(index)}
                              className={`${
                                index < ratingCount
                                  ? "icon-star-fill hover:cursor-pointer"
                                  : "icon-star-outline hover:cursor-pointer"
                              } text-3xl md:text-4xl text-PrimaryYellow`}
                            ></i>
                          );
                        })}
                      </div>
                    </div>
                    <div className="m-3">
                      <TextArea
                        id="reviews"
                        label={<FormattedMessage id="Reviews" />}
                        name="reviews"
                        register={register}
                        type="textarea"
                        parentClass="mb-30px last:mb-0"
                        errors={errors}
                      />
                    </div>
                    <div className="mt-8 flex justify-center gap-4">
                      <Button
                        text={<FormattedMessage id="Submit" />}
                        type="submit"
                        className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                      ></Button>
                    </div>
                  </form>
                </Modal>
                <div>
                  <h2 className="text-primarycolor font-semibold text-center font-poppins text-xl md:text-3xl mt-8 md:mt-12 xl:mt-16">
                    {<FormattedMessage id="Thank" />}
                  </h2>
                  <div className="flex justify-center items-center gap-6 mt-4 md:mt-6 xl:mt-8 flex-wrap">
                    <p className="text-center text-sm ">
                      {<FormattedMessage id="copy" />}{" "}
                      <span className="text-primarycolor font-medium">
                        {paymentDetails?.email}
                      </span>
                    </p>
                    <Button
                      text={
                        editReview === true ? (
                          <FormattedMessage id="Edit_Ranking" />
                        ) : (
                          <FormattedMessage id="Add_Ranking" />
                        )
                      }
                      type="button"
                      onClick={() => {
                        setShowModal(true);
                      }}
                      className="md:w-48 px-4 py-2 md:px-5 md:py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                    ></Button>
                  </div>
                </div>
                <div className="mt-8">
                  <h2 className="text-base text-darkgrey font-semibold">
                    {" "}
                    {<FormattedMessage id="Order_Details" />}
                  </h2>
                  <div className="mt-3 mb-3 border border-black/10 rounded-xl p-5">
                    <div className="flex flex-wrap -mx-4">
                      <div className="relative w-full md:w-1/3 px-4 border-b md:border-b-0 md:border-r-2 md:rtl:border-l-2 md:rtl:border-r-0 pb-3 md:pb-0 border-black/10">
                        <ul className="space-y-3 w-full md:w-11/12">
                          <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Order_date" />}{" "}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                              {paymentDetails?.order_date &&
                                moment(
                                  parseInt(paymentDetails?.order_date, 10)
                                ).format("DD-MM-YYYY")}
                            </span>
                          </li>
                          <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Name" />}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                              {paymentDetails?.name}
                            </span>
                          </li>
                          <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Email" />}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                              {paymentDetails?.email}
                            </span>
                          </li>
                          <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Shipping_Address" />}{" "}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                              {paymentDetails?.address?.address?.address},{" "}
                              {paymentDetails?.address?.address?.city},{" "}
                              {paymentDetails?.address?.address?.state},{" "}
                              {paymentDetails?.address?.address?.country},{" "}
                              {paymentDetails?.address?.address?.postal_code}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="relative w-full md:w-1/3  px-4 border-b md:border-b-0 md:border-r-2 md:rtl:border-l-2 md:rtl:border-r-0 pt-3 pb-3 md:pt-0 md:pb-0 border-black/10">
                        <ul className="space-y-3 w-full md:w-11/12">
                          <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Payment_status" />}{" "}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                              {paymentDetails?.payment_status}
                            </span>
                          </li>
                          <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Total_order_amount" />}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                              SAR {paymentDetails?.amount.toFixed(2)}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="relative w-full md:w-1/3 pt-3 md:pt-0 px-4 ">
                        <ul className="space-y-3 w-full md:w-11/12">
                          <li className="w-full flex flex-wrap space-y-1 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Payment_status" />}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                              {paymentDetails?.payment_status}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h1 className="text-primaryRed font-semibold text-center font-poppins text-xl mt-16">
                    {<FormattedMessage id="issue" />}
                  </h1>
                  <p className="text-center text-sm mt-4 ">
                    {<FormattedMessage id="copy" />} {paymentDetails?.email}
                  </p>
                </div>
                <div>
                  <h2> {<FormattedMessage id="Order_Details" />}</h2>
                  <div className="flex flex-wrap mt-4 mb-3 -mx-4 border border-black/10 rounded-xl p-5">
                    <div className="relative w-1/3  px-4 border-r-2 border-black/10">
                      <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Order_date" />}{" "}
                            <span>:</span>
                          </p>
                        </div>
                        <div className="w-4/6 px-5">
                          <p className="text-sm leading-7 text-gray-500">
                            {paymentDetails?.order_date &&
                              new Date(
                                paymentDetails.order_date
                              ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Name" />}
                            <span>:</span>
                          </p>
                        </div>
                        <div className="w-4/6 px-5">
                          <p className="text-sm leading-7  text-gray-500">
                            {paymentDetails?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Email" />}
                            <span>:</span>
                          </p>
                        </div>
                        <div className="w-4/6 px-5">
                          <p className="leading-7  text-gray-500 text-sm ">
                            {paymentDetails?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Shipping_Address" />}{" "}
                            <span>:</span>
                          </p>
                        </div>
                        <div className="w-4/6 px-5">
                          <p className="leading-7  text-gray-500 text-sm ">
                            <div className="w-4/6 px-5">
                              <p className="leading-7  text-gray-500 text-sm ">
                                {paymentDetails?.address?.address?.address},{" "}
                                {paymentDetails?.address?.address?.city},{" "}
                                {paymentDetails?.address?.address?.state},{" "}
                                {paymentDetails?.address?.address?.country},{" "}
                                {paymentDetails?.address?.address?.postal_code}
                              </p>
                            </div>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative w-1/3  px-4 border-r-2 border-black/10">
                      <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Order_Status" />}{" "}
                            <span>:</span>
                          </p>
                        </div>
                        <div className="w-4/6 px-5">
                          <p className="text-sm leading-7 text-gray-500">
                            {paymentDetails?.payment_status}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Total_order_amount" />}

                            <span>:</span>
                          </p>
                        </div>
                        <div className="w-4/6 px-5">
                          <p className="text-sm leading-7  text-gray-500">
                            SAR {paymentDetails?.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Shipping" />}
                            <span>:</span>
                          </p>
                        </div>
                        <div className="w-4/6 px-5">
                          <p className="leading-7  text-gray-500 text-sm ">
                            {<FormattedMessage id="Flat_shipping_rate" />}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative w-1/3  px-4 ">
                      <div className="flex">
                        <div className="w-1/3">
                          <p className="text-sm leading-7 flex items-start justify-between">
                            {<FormattedMessage id="Payment_status" />}

                            <span>:</span>
                          </p>
                        </div>
                        <div className="w-4/6 px-5">
                          <p className="text-sm leading-7  text-gray-500">
                            {paymentDetails?.payment_status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-7  flex justify-between">
                    <p
                      className="text-primarycolor font-medium cursor-pointer"
                      onClick={() => setTab(2)}
                    >
                      {<FormattedMessage id="Return_To_Payment" />}
                    </p>
                  </div>
                </div>
              </>
            )}
            <div className="flex gap-4 mt-8 md:mt-20 flex-wrap justify-center">
              <Button
                type="button"
                text={<FormattedMessage id="BACK_TO_HOMEPAGE" />}
                onClick={() => navigate("/")}
                className="uppercase px-7 py-3 text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
              ></Button>
            </div>
          </>
        )}
      </div>

      {saveCardModal &&
        paymentDetails?.save_card === true &&
        storageFlag === "true" && (
          <SaveCard
            customerId={paymentDetails?.customer_id}
            card_id={paymentDetails?.card_id}
            showCardModal={saveCardModal}
            setShowCardModal={setSaveCardModal}
            edit_card={false}
          />
        )}

      {paymentDetails?.save_card === false &&
        storageFlag === "true" &&
        paymentDetails?.card_name !== null &&
        paymentDetails?.card_id && (
          <SaveCard
            customerId={paymentDetails?.customer_id}
            card_id={paymentDetails?.card_id}
            showCardModal={saveCardModal}
            setShowCardModal={setSaveCardModal}
            edit_card={true}
            card_name={paymentDetails?.card_name}
          />
        )}
    </>
  );
};

export default Confirmation;
