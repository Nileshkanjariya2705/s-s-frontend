import { Button } from "components/button/Button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSingleOrder,
  requestRefund,
  updateRefundReqStatus,
  updateReqStatus,
} from "../services/order.services";
import { utcToLocal } from "helper/timezone.helper";
import { OrderStatus } from "constant/dropdown.constant";
import {
  OrderDataType,
  OrderProducts,
  changeStatusType,
  reqStatus,
  singleChangeStatusType,
  statusReplacement,
  storeUser,
} from "../types/order.type";
import { REACT_APP_IMAGE_PATH } from "config";
import { FormattedMessage, useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { PageNotFound } from "components/pageNotFound/PageNotFound";
import GlobalLoader from "components/globalLoader/GlobalLoader";
import TextArea from "components/textArea/Textarea";
import { responseType } from "constant/common.constant";
import useLocale from "hooks/useLocale";

const ViewRefundOrderDetails = () => {
  const { language } = useLocale();
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState<OrderDataType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [storeUserData, setStoreUserData] = useState<storeUser>();
  const [changeStatus, setChangeStatus] = useState<changeStatusType>([]);
  const [refundReq, setRefundReq] = useState();
  const [refundError, setRefundError] = useState<string>();

  const intl = useIntl();
  const OrderStatusLanguageWise = OrderStatus(language);
  const getSingleOrderDetails = async () => {
    try {
      const response = await getSingleOrder(orderId);
      setOrderData(response?.data?.data.PaymentDetail);
      setStoreUserData(response?.data?.data.UserDetail);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };
  const requestRefunddOccured = async () => {
    const response = await requestRefund(orderId);
    setRefundReq(response?.data.data);
  };
  useEffect(() => {
    getSingleOrderDetails();
    requestRefunddOccured();
  }, []);

  const navigate = useNavigate();

  const statusIndex =
    OrderStatusLanguageWise &&
    OrderStatusLanguageWise.findIndex(
      (data) => data.value === orderData?.orders?.status
    );
  OrderStatusLanguageWise &&
    OrderStatusLanguageWise.forEach((item, index) => {
      if (index <= (statusIndex as number)) {
        item.isdisabled = true;
      } else {
        item.isdisabled = false;
      }
    });
  const changeReqStatus = async (
    uuid: string,
    status: statusReplacement,
    product_uuid: string
  ) => {
    const res = changeStatus.find(
      (value: singleChangeStatusType) => value.uuid === uuid
    );
    !res &&
      setChangeStatus((prev: changeStatusType) => [
        ...prev,
        { uuid, status, product_uuid },
      ]);
  };
  const {
    handleSubmit,
    register: reqRegister,
    formState: { errors: reqErrors },
  } = useForm<reqStatus>({});

  const updateRefundReason = async (value: { [key: string]: string }) => {
    setSaveLoading(true);
    if (
      changeStatus.length ===
      orderData?.orders?.OrderProducts.filter(
        (item) => item.refund_request === true
      ).length
    ) {
      if (value) {
        setRefundError("");

        const updatedStatus = changeStatus.map(
          (item: { uuid: string; status: string; product_uuid: string }) => ({
            ...item,
            reason: value[`${item.uuid}`] || null,
          })
        );
        const data = { updatedStatus, orderId };
        const response = await updateRefundReqStatus(data);
        if (response?.data.responseType === responseType.Success) {
          setSaveLoading(false);
          getSingleOrderDetails();
          requestRefunddOccured();
        }
      } else {
        setRefundError("");
        const data = { changeStatus, orderId };
        {
          const response = await updateReqStatus(data);
          if (response?.data.responseType === responseType.Success) {
            setSaveLoading(false);
            getSingleOrderDetails();
            requestRefunddOccured();
          }
        }
      }
    } else {
      const error = intl.formatMessage({
        id: "Select_All",
      });
      setRefundError(error);
      setSaveLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <GlobalLoader />
      ) : (
        <>
          {orderData?.orders?.refund_accepted_supplier ? (
            <div className="w-full space-y-30px">
              <div className="border border-black/10 rounded-14px p-20px md:p-30px">
                <div className="flex justify-between flex-wrap space-y-5 md:space-y-0">
                  <div className="flex items-center gap-3 w-full md:w-unset">
                    <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                      <i
                        className="icon-left_arrow text-24px text-primarycolor cursor-pointer"
                        onClick={() => navigate("/refund-orders")}
                      ></i>
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-black pr-90">
                      <FormattedMessage id="Refund_Order_Details" />
                    </h2>
                  </div>
                </div>
                <div className="flex -mx-2.5 mt-5 md:mt-10 lg:mt-8 flex-wrap space-y-5 lg:space-y-5">
                  <div className="w-full lg:w-3/4 px-2.5 space-y-6">
                    <div className="border border-black/10 rounded-xl p-5">
                      <h2 className="text-darkgrey text-sm md:text-base font-semibold">
                        <FormattedMessage id="Order_Details" />
                      </h2>
                      <div className="flex flex-wrap mt-0 md:mt-4 mb-3 -mx-4">
                        <div className="relative w-full md:w-1/2  px-4 border-b-2 md:border-b-0 py-4 md:py-0 md:border-r-2 md:rtl:border-l-2 md:rtl:border-r-0 border-black/10 space-y-2">
                          <ul className="space-y-3 w-full md:w-full">
                            <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                              <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                <FormattedMessage id="Order_date" />{" "}
                                <span className="hidden lg:inline-block">
                                  :
                                </span>
                              </span>
                              <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                                {utcToLocal(
                                  orderData?.orders?.created_at as string
                                )}
                              </span>
                            </li>
                            <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                              <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                <FormattedMessage id="Order_Status" />{" "}
                                <span className="hidden lg:inline-block">
                                  :
                                </span>
                              </span>
                              <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                                {orderData?.orders?.status}
                              </span>
                            </li>
                            <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                              <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                <FormattedMessage id="Shipping_Address" />{" "}
                                <span className="hidden lg:inline-block">
                                  :
                                </span>
                              </span>
                              <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                                {orderData?.orders?.address?.address},{" "}
                                {orderData?.orders?.address?.city},{" "}
                                {orderData?.orders?.address?.state},{" "}
                                {orderData?.orders?.address?.country},{" "}
                                {orderData?.orders?.address?.postal_code}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="relative w-full md:w-1/2  px-4 pt-4 md:pt-0 space-y-2">
                          <ul className="space-y-3 w-full md:w-full">
                            <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                              <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                <FormattedMessage id="Payment_status" />{" "}
                                <span className="hidden lg:inline-block">
                                  :
                                </span>
                              </span>
                              <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 ">
                                {orderData?.payment_status}
                              </span>
                            </li>
                            <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                              <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                <FormattedMessage id="Payment_method" />{" "}
                                <span className="hidden lg:inline-block">
                                  :
                                </span>
                              </span>
                              <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                                {orderData?.orders?.payment_mode.replace(
                                  "_",
                                  " "
                                )}
                              </span>
                            </li>
                            {orderData?.orders?.status === "CANCELLED" && (
                              <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                  <FormattedMessage id="Reason_for_Cancel_Order" />{" "}
                                  <span className="hidden lg:inline-block">
                                    :
                                  </span>
                                </span>
                                <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                                  {orderData?.orders?.reason_for_cancel}
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/4 px-2.5 space-y-6">
                    <div className="border border-black/10 rounded-xl p-5 min-h-234px">
                      <h4 className="text-darkgrey text-sm md:text-lg font-semibold">
                        <FormattedMessage id="Additional_Notes" />
                      </h4>
                      <hr className="border-1 border-black/10 my-2 md:my-4" />
                      <p className="text-darkgrey/60 text-sm font-normal">
                        {orderData?.orders?.additional_info}
                      </p>
                    </div>
                  </div>
                  <div className="w-full px-2.5">
                    <div className="border border-black/10 rounded-xl p-5">
                      <div className="flex flex-wrap items-start md:-mx-3 xl:-mx-7">
                        <div className="w-full lg:w-3/4 md:px-3 xl:px-7 border-b pb-4 lg:pb-0 lg:border-b-0 lg:border-r lg:rtl:border-l lg:rtl:border-r-0 border-black/10">
                          <h2 className="text-darkgrey text-sm md:text-base font-semibold">
                            <FormattedMessage id="Order_Code" />:
                            <span className="text-primarycolor">
                              # {orderData?.orders?.uuid.slice(0, 8)}
                            </span>
                          </h2>

                          <div className="relative overflow-x-auto mt-2">
                            <form onSubmit={handleSubmit(updateRefundReason)}>
                              <table className="w-full text-sm text-left">
                                <thead className="text-base text-black ">
                                  <tr className="border-b rtl:text-right">
                                    <th
                                      scope="col"
                                      className="px-5 py-3 font-semibold bg-primarycolor/10 text-primarycolor"
                                    >
                                      <p className="font-medium whitespace-nowrap">
                                        <FormattedMessage id="Product" />
                                      </p>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-5 py-3 font-semibold bg-primarycolor/10 text-primarycolor"
                                    >
                                      <p className="font-medium whitespace-nowrap">
                                        <FormattedMessage id="Qty" />
                                      </p>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-5 py-3 font-semibold bg-primarycolor/10 text-primarycolor"
                                    >
                                      <p className="font-medium whitespace-nowrap">
                                        <FormattedMessage id="Measurement" />
                                      </p>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-5 py-3 font-semibold bg-primarycolor/10 text-primarycolor"
                                    >
                                      <p className="font-medium whitespace-nowrap">
                                        <FormattedMessage id="Price" />
                                      </p>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-5 py-3 font-semibold bg-primarycolor/10 text-primarycolor"
                                    >
                                      <p className="font-medium whitespace-nowrap">
                                        <FormattedMessage id="Reason" />
                                      </p>
                                    </th>
                                    {refundReq !== true && (
                                      <th
                                        scope="col"
                                        className="px-5 py-3 font-semibold bg-primarycolor/10 text-primarycolor"
                                      >
                                        <p className="font-medium whitespace-nowrap">
                                          <FormattedMessage id="action" />
                                        </p>
                                      </th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {orderData?.orders?.OrderProducts.map(
                                    (item: OrderProducts) => {
                                      const measurement =
                                        item?.supplierProductQuotes
                                          ?.ProductPurchaseRequests?.products
                                          ?.measurement;
                                      return (
                                        <>
                                          {item?.refund_request && (
                                            <tr className="bg-white border-b text-sm text-darkgrey/60 rtl:text-right">
                                              <td
                                                // eslint-disable-next-line jsx-a11y/scope
                                                scope="row"
                                                className="px-2 py-4 font-medium  "
                                              >
                                                <div className="flex items-center flex-wrap gap-2">
                                                  <img
                                                    src={`${REACT_APP_IMAGE_PATH}${
                                                      item
                                                        ?.supplierProductQuotes
                                                        ?.other_brand_product_uuid
                                                        ? item
                                                            ?.supplierProductQuotes
                                                            ?.otherBrandProduct
                                                            ?.featured_image
                                                        : item
                                                            ?.supplierProductQuotes
                                                            ?.ProductPurchaseRequests
                                                            ?.products
                                                            ?.featured_image
                                                        ? item
                                                            ?.supplierProductQuotes
                                                            ?.ProductPurchaseRequests
                                                            ?.products
                                                            ?.featured_image
                                                        : item?.product
                                                            ?.featured_image
                                                    }`}
                                                    alt="FoodSeven"
                                                    className="w-8 h-8 md:w-10 md:h-10"
                                                  />
                                                  <span className="font-normal w-[300px] inline-block flex-shrink">
                                                    {item?.supplierProductQuotes
                                                      ?.other_brand_product_uuid
                                                      ? item
                                                          ?.supplierProductQuotes
                                                          ?.otherBrandProduct?.[
                                                          `name_${language}`
                                                        ]
                                                      : item
                                                          ?.supplierProductQuotes
                                                          ?.ProductPurchaseRequests
                                                          ?.products?.[
                                                          `name_${language}`
                                                        ]
                                                      ? item
                                                          ?.supplierProductQuotes
                                                          ?.ProductPurchaseRequests
                                                          ?.products?.[
                                                          `name_${language}`
                                                        ]
                                                      : item?.product?.[
                                                          `name_${language}`
                                                        ]}
                                                  </span>
                                                </div>
                                              </td>
                                              <td className="px-2 py-4 ">
                                                <p className="whitespace-nowrap rtl:text-right">
                                                  {item.quantity}
                                                </p>
                                              </td>
                                              <td className="px-2 py-4">
                                                <p className="text-primarycolor">
                                                  {language === "en"
                                                    ? measurement?.unit_short_name ||
                                                      item?.product?.measurement
                                                        ?.unit_short_name
                                                    : measurement?.[
                                                        `unit_short_name_${language}`
                                                      ] ||
                                                      item?.product
                                                        ?.measurement?.[
                                                        `unit_short_name_${language}`
                                                      ]}
                                                </p>
                                              </td>

                                              <td className="px-2 py-4">
                                                <p className="whitespace-nowrap rtl:text-right">
                                                  <span className="inline-block">
                                                    SAR
                                                  </span>{" "}
                                                  {Number(item.price).toFixed(
                                                    2
                                                  )}
                                                </p>
                                              </td>
                                              <td className="px-2 py-4">
                                                <p className="whitespace-nowrap rtl:text-right">
                                                  <span className="inline-block  break-words"></span>{" "}
                                                  {item?.refund_reason}
                                                </p>
                                              </td>
                                              {refundReq !== true && (
                                                <td className="px-2 py-4">
                                                  {changeStatus.some(
                                                    (
                                                      value: singleChangeStatusType
                                                    ) =>
                                                      value.uuid === item.uuid
                                                  ) ? (
                                                    <span>
                                                      {changeStatus &&
                                                        changeStatus.length >
                                                          0 &&
                                                        changeStatus.find(
                                                          (
                                                            value: singleChangeStatusType
                                                          ) =>
                                                            value.uuid ===
                                                            item.uuid
                                                        )?.status}
                                                    </span>
                                                  ) : (
                                                    <div className="flex flex-row gap-2">
                                                      <div
                                                        className={`w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center   hover:cursor-pointer
                                                                                   
                                                                            `}
                                                        onClick={() =>
                                                          changeReqStatus(
                                                            `${item.uuid}`,
                                                            "ACCEPTED",
                                                            item
                                                              ?.supplierProductQuotes
                                                              ?.other_brand_product_uuid
                                                              ? item
                                                                  ?.supplierProductQuotes
                                                                  ?.otherBrandProduct
                                                                  ?.uuid
                                                              : item
                                                                  ?.supplierProductQuotes
                                                                  ?.ProductPurchaseRequests
                                                                  ?.products
                                                                  ?.uuid
                                                              ? item
                                                                  ?.supplierProductQuotes
                                                                  ?.ProductPurchaseRequests
                                                                  ?.products
                                                                  ?.uuid
                                                              : item?.product
                                                                  ?.uuid
                                                          )
                                                        }
                                                      >
                                                        <i className="icon-check-alt-2 text-24px text-primarycolor"></i>
                                                      </div>
                                                      <div
                                                        className={`w-10 h-10 rounded-xl bg-red-700/20 flex items-center justify-center hover:cursor-pointer`}
                                                        onClick={() =>
                                                          changeReqStatus(
                                                            `${item.uuid}`,
                                                            "REJECTED",
                                                            item
                                                              ?.supplierProductQuotes
                                                              ?.other_brand_product_uuid
                                                              ? item
                                                                  ?.supplierProductQuotes
                                                                  ?.otherBrandProduct
                                                                  ?.uuid
                                                              : item
                                                                  ?.supplierProductQuotes
                                                                  ?.ProductPurchaseRequests
                                                                  ?.products
                                                                  ?.uuid
                                                              ? item
                                                                  ?.supplierProductQuotes
                                                                  ?.ProductPurchaseRequests
                                                                  ?.products
                                                                  ?.uuid
                                                              : item?.product
                                                                  ?.uuid
                                                          )
                                                        }
                                                      >
                                                        <i className="icon-cross text-15px text-red-700"></i>
                                                      </div>
                                                    </div>
                                                  )}
                                                </td>
                                              )}
                                              {refundReq !== true &&
                                                changeStatus.some(
                                                  (
                                                    value: singleChangeStatusType
                                                  ) => value.uuid === item.uuid
                                                ) &&
                                                changeStatus.find(
                                                  (
                                                    value: singleChangeStatusType
                                                  ) => value.uuid === item.uuid
                                                )?.status === "REJECTED" && (
                                                  <td className="max-w-[150px] cs-action">
                                                    {item.uuid && (
                                                      <TextArea
                                                        id={item.uuid}
                                                        name={item.uuid}
                                                        register={reqRegister}
                                                        errors={reqErrors}
                                                        rows={1}
                                                      />
                                                    )}
                                                  </td>
                                                )}
                                            </tr>
                                          )}
                                        </>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                              <span className="text-primaryRed/90">
                                {refundError}
                              </span>
                              {refundReq !== true && (
                                <div className="m-2 flex justify-center">
                                  <Button
                                    text={<FormattedMessage id="Submit" />}
                                    loader={saveLoading}
                                    type="submit"
                                    className="w-28 px-3 py-2 text-sm font-bold  text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                                  ></Button>
                                </div>
                              )}
                            </form>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/4 md:px-3 xl:px-7 pt-4 lg:pt-0">
                          <h4 className="text-darkgrey text-sm md:text-lg font-semibold">
                            {orderData?.orders?.storeInfo?.company_name}
                          </h4>
                          <hr className="border-1 border-black/10 my-3" />
                          <ul className="space-y-3">
                            <li>
                              <h5 className="text-sm font-medium text-black">
                                <FormattedMessage id="Phone" />
                              </h5>
                              <p className="text-sm font-medium text-black/60 break-all">
                                {storeUserData && storeUserData.user.phone
                                  ? storeUserData.user.phone
                                  : "-"}
                              </p>
                            </li>
                            <li>
                              <h5 className="text-sm font-medium text-black">
                                <FormattedMessage id="email" />
                              </h5>
                              <p className="text-sm font-medium text-black/60 break-all">
                                {storeUserData && storeUserData.user.email}
                              </p>
                            </li>
                            <li>
                              <h5 className="text-sm font-medium text-black">
                                <FormattedMessage id="Registration_Date" />
                              </h5>
                              <p className="text-sm font-medium text-black/60 break-all">
                                {storeUserData &&
                                  utcToLocal(storeUserData.user.created_at)}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 md:mt-20 flex-wrap justify-center">
                <Button
                  type="button"
                  text={<FormattedMessage id="Back_To_HomePage" />}
                  className="uppercase px-7 py-3 text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
                  onClick={() => navigate("/refund-orders")}
                ></Button>
              </div>
            </div>
          ) : (
            <PageNotFound />
          )}
        </>
      )}
    </>
  );
};

export default ViewRefundOrderDetails;
