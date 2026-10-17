import { Button } from "components/button/Button";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleOrder, updateOrderStatus } from "../services/order.services";
import { utcToLocal } from "helper/timezone.helper";
import { OrderStatus } from "constant/dropdown.constant";
import { OrderDataType, OrderProducts, storeUser } from "../types/order.type";
import { REACT_APP_IMAGE_PATH } from "config";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FormattedMessage } from "react-intl";
import CustomSelect from "components/customSelect/CustomSelect";
import { useForm } from "react-hook-form";
import { PageNotFound } from "components/pageNotFound/PageNotFound";
import InvoicePdfView from "./InvoicePdfView";
import GlobalLoader from "components/globalLoader/GlobalLoader";
import { sendConfirmationMail } from "pages/store/checkOut/services/checkout.services";
import useLocale from "hooks/useLocale";

const ViewOrderDetails = () => {
  const { language } = useLocale();
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState<OrderDataType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [storeUserData, setStoreUserData] = useState<storeUser>();
  const [subTotal, setSubTotal] = useState<number>();
  const [total, setTotal] = useState<number>();
  const [src, setSrc] = useState<string>("");
  const OrderStatusLanguageWise = OrderStatus(language);

  const {
    register,
    control,
    formState: { errors },
  } = useForm();
  const getSingleOrderDetails = async () => {
    try {
      const response = await getSingleOrder(orderId);
      setOrderData(response?.data?.data.PaymentDetail);
      setStoreUserData(response?.data?.data.UserDetail);
      if (response?.data?.data.PaymentDetail) {
        setTotal(
          parseFloat(response?.data?.data.PaymentDetail?.amount.toFixed(2))
        );
        const totalPrice =
          response?.data?.data.PaymentDetail?.orders?.OrderProducts &&
          response?.data?.data.PaymentDetail?.orders?.OrderProducts.reduce(
            (sum: number, obj: { price: string; quantity: number }) =>
              sum + parseFloat(obj.price) * obj.quantity,
            0
          );
        setSubTotal(parseFloat(totalPrice.toFixed(2)));
      }

      setSrc(response?.data?.data?.Qr_code);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  useEffect(() => {
    getSingleOrderDetails();
  }, []);

  const handleDropdownValue = async (e: ChangeEvent<HTMLSelectElement>) => {
    try {
      setLoading(true);
      await updateOrderStatus(
        orderId,
        e.target.value,
        orderData?.orders?.storeInfo.uuid as string
      );
      getSingleOrderDetails();
      await sendConfirmationMail(orderId);
      setLoading(false);
    } catch (error) {
      //   setLoading(false);
      return error;
    }
  };
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

  return (
    <>
      {loading ? (
        <GlobalLoader />
      ) : (
        <>
          {orderData?.orders?.status ? (
            <div className="w-full space-y-30px">
              <div className="border border-black/10 rounded-14px p-20px md:p-30px">
                <div className="flex justify-between flex-wrap space-y-5 md:space-y-0">
                  <div className="flex items-center gap-3 w-full md:w-unset">
                    <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                      <i
                        className="icon-left_arrow text-24px text-primarycolor cursor-pointer"
                        onClick={() => navigate("/orders")}
                      ></i>
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-black pr-90">
                      <FormattedMessage id="Order_Details" />
                    </h2>
                    {orderData.orders.refund_accepted_supplier ===
                      "ACCEPTED" && (
                      <p className="text-primarycolor bg-primarycolor/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center">
                        <FormattedMessage id="Accepted_for_refund" />
                      </p>
                    )}
                    {orderData.orders.refund_accepted_supplier ===
                      "PENDING" && (
                      <p className="text-secondaryOrange bg-secondaryOrange/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center">
                        <FormattedMessage id="Pending_for_refund" />
                      </p>
                    )}
                    {orderData.orders.refund_accepted_supplier ===
                      "REJECTED" && (
                      <p className="text-primaryRed bg-primaryRed/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center">
                        <FormattedMessage id="Rejected_for_refund" />
                      </p>
                    )}
                  </div>
                  {orderData?.orders?.status !== "CANCELLED" &&
                    orderData.orders.refund_accepted_supplier !== "ACCEPTED" &&
                    orderData.orders.refund_accepted_supplier !== "PENDING" && (
                      <div className="order-detail-select w-full md:w-unset">
                        <CustomSelect
                          control={control}
                          name="order_status"
                          options={
                            OrderStatusLanguageWise as {
                              value: string | boolean;
                              label?: string;
                              isdisabled?: boolean;
                            }[]
                          }
                          register={register}
                          required={false}
                          error={errors}
                          isSearchable={false}
                          selectedOption={orderData?.orders?.status as string}
                          handleSelectChange={(e) => handleDropdownValue(e)}
                        />
                      </div>
                    )}
                </div>

                {orderData?.orders?.status !== "CANCELLED" && (
                  <>
                    <hr className="border-1 border-black/10 my-6" />
                    <div className="flex -mx-2.5 flex-wrap gap-y-5 md:gap-y-0">
                      <div className="w-1/2 md:w-1/4 px-2.5 space-y-2">
                        <div className="w-full h-1.5 rounded-full bg-primarycolor"></div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-black text-base font-semibold">
                            {<FormattedMessage id="Accepted" />}
                          </h4>
                        </div>
                      </div>
                      <div className="w-1/2 md:w-1/4 px-2.5 space-y-2">
                        <div
                          className={
                            ["PACKAGED", "IN_TRANSIT", "DELIVERED"].includes(
                              orderData?.orders?.status as string
                            )
                              ? "w-full h-1.5 rounded-full bg-primarycolor"
                              : "w-full h-1.5 rounded-full bg-stepsgray"
                          }
                        ></div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-black text-base font-semibold">
                            {<FormattedMessage id="Packed" />}
                          </h4>
                        </div>
                      </div>
                      <div className="w-1/2 md:w-1/4 px-2.5 space-y-2">
                        <div
                          className={
                            ["IN_TRANSIT", "DELIVERED"].includes(
                              orderData?.orders?.status
                            )
                              ? "w-full h-1.5 rounded-full bg-primarycolor"
                              : "w-full h-1.5 rounded-full bg-stepsgray"
                          }
                        ></div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-black text-base font-semibold">
                            {<FormattedMessage id="In_Transit" />}
                          </h4>
                        </div>
                      </div>
                      <div className="w-1/2 md:w-1/4 px-2.5 space-y-2">
                        <div
                          className={
                            "DELIVERED" === orderData?.orders?.status
                              ? "w-full h-1.5 rounded-full bg-primarycolor"
                              : "w-full h-1.5 rounded-full bg-stepsgray"
                          }
                        ></div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-black text-base font-semibold">
                            {<FormattedMessage id="Delivered" />}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex -mx-2.5 mt-5 md:mt-10 lg:mt-16 flex-wrap space-y-5 lg:space-y-0">
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
                    <div className="border border-black/10 rounded-xl p-5">
                      <h2 className="text-darkgrey text-base font-semibold">
                        <FormattedMessage id="Invoice" />
                      </h2>

                      <div className="relative overflow-x-auto mt-2 md:mt-5">
                        <table className="w-full text-sm text-left">
                          <thead className="text-base text-black font-medium">
                            <tr className="border-b rtl:text-right">
                              <th scope="col" className="px-2 py-3">
                                <p className="font-medium whitespace-nowrap">
                                  <FormattedMessage id="Date" />
                                </p>
                              </th>

                              <th scope="col" className="px-2 py-3">
                                <p className="font-medium whitespace-nowrap">
                                  <FormattedMessage id="Number" />
                                </p>
                              </th>
                              <th scope="col" className="px-2 py-3">
                                <p className="font-medium whitespace-nowrap">
                                  <FormattedMessage id="Total_Price" />
                                </p>
                              </th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white border-b text-sm text-darkgrey/60 rtl:text-right">
                              <td
                                scope="row"
                                className="px-2 py-4 font-medium "
                              >
                                <p className="font-medium whitespace-nowrap">
                                  {orderData &&
                                    utcToLocal(
                                      orderData?.orders?.created_at as string
                                    )}
                                </p>
                              </td>

                              <td className="px-2 py-4">
                                <p className="text-primarycolor whitespace-nowrap">
                                  {orderData?.uuid?.slice(0, 8)}
                                </p>
                              </td>
                              <td className="px-2 py-4">
                                <p className="text-primarycolor whitespace-nowrap">
                                  <span className="inline-block">SAR</span>{" "}
                                  {orderData?.amount.toFixed(2)}
                                </p>
                              </td>
                              <td>
                                <PDFDownloadLink
                                  document={
                                    <InvoicePdfView
                                      orderData={orderData}
                                      total={total}
                                      subtotal={subTotal}
                                      src={src}
                                      shipping_charges={
                                        orderData?.orders.OrderProducts[0]
                                          .supplierProductQuotes?.SupplierQuotes
                                          ?.charges
                                          ? orderData?.orders.OrderProducts[0]
                                              .supplierProductQuotes
                                              ?.SupplierQuotes?.charges
                                          : 0
                                      }
                                    />
                                  }
                                  fileName={`${orderData?.uuid.slice(
                                    0,
                                    8
                                  )}-invoice`}
                                >
                                  {({ loading }) => (
                                    <Button
                                      type="button"
                                      className="relative px-2.5 py-1.5 border rounded-lg border-primarycolor text-primarycolor text-sm whitespace-nowrap"
                                    >
                                      {loading ? (
                                        "Loading document..."
                                      ) : (
                                        <FormattedMessage id="Download_Invoice" />
                                      )}
                                    </Button>
                                  )}
                                </PDFDownloadLink>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="border border-black/10 rounded-xl p-5">
                      <div className="flex flex-wrap items-start md:-mx-3 xl:-mx-7">
                        <div className="w-full lg:w-4/6 md:px-3 xl:px-7 border-b pb-4 lg:pb-0 lg:border-b-0 lg:border-r lg:rtl:border-l lg:rtl:border-r-0 border-black/10">
                          <h2 className="text-darkgrey text-sm md:text-base font-semibold">
                            <FormattedMessage id="Order_Code" />:
                            {orderData?.orders?.uuid}
                          </h2>

                          <div className="relative overflow-x-auto mt-2">
                            <table className="w-full text-sm text-left">
                              <thead className="text-base text-black ">
                                <tr className="border-b rtl:text-right">
                                  <th scope="col" className="px-2 py-3">
                                    <p className="font-medium whitespace-nowrap">
                                      <FormattedMessage id="Product" />
                                    </p>
                                  </th>
                                  <th scope="col" className="px-2 py-3">
                                    <p className="font-medium whitespace-nowrap">
                                      <FormattedMessage id="Qty" />
                                    </p>
                                  </th>
                                  <th scope="col" className="px-2 py-3">
                                    <p className="font-medium whitespace-nowrap">
                                      <FormattedMessage id="Measurement" />
                                    </p>
                                  </th>
                                  <th scope="col" className="px-2 py-3">
                                    <p className="font-medium whitespace-nowrap">
                                      <FormattedMessage id="Price" />
                                    </p>
                                  </th>
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
                                      <tr className="bg-white border-b text-sm text-darkgrey/60 rtl:text-right">
                                        <td
                                          scope="row"
                                          className="px-2 py-4 font-medium  "
                                        >
                                          <div className="flex items-center  gap-2">
                                            <img
                                              src={`${REACT_APP_IMAGE_PATH}${
                                                item?.supplierProductQuotes
                                                  ?.other_brand_product_uuid
                                                  ? item?.supplierProductQuotes
                                                      ?.otherBrandProduct
                                                      ?.featured_image
                                                  : item?.supplierProductQuotes
                                                      ?.ProductPurchaseRequests
                                                      ?.products?.featured_image
                                                  ? item?.supplierProductQuotes
                                                      ?.ProductPurchaseRequests
                                                      ?.products?.featured_image
                                                  : item?.product
                                                      ?.featured_image
                                              }`}
                                              alt="FoodSeven"
                                              className="w-8 h-8 md:w-10 md:h-10"
                                            />
                                            <span className="font-normal w-[300px] inline-block flex-shrink">
                                              {item?.supplierProductQuotes
                                                ?.other_brand_product_uuid
                                                ? item?.supplierProductQuotes
                                                    ?.otherBrandProduct?.[
                                                    `name_${
                                                      language as "en" | "ur" | "ar"
                                                    }`
                                                  ]
                                                : item?.supplierProductQuotes
                                                    ?.ProductPurchaseRequests
                                                    ?.products?.[`name_${language}`]
                                                ? item?.supplierProductQuotes
                                                    ?.ProductPurchaseRequests
                                                    ?.products?.[`name_${language}`]
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
                                                item?.product?.measurement?.[
                                                  `unit_short_name_${language}`
                                                ]}
                                          </p>
                                        </td>
                                        <td className="px-2 py-4">
                                          <p className="whitespace-nowrap rtl:text-right">
                                            <span className="inline-block">
                                              SAR
                                            </span>{" "}
                                            {Number(item.price).toFixed(2)}
                                          </p>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/3 md:px-3 xl:px-7 pt-4 lg:pt-0">
                          <ul className="space-y-2 w-full">
                            <li className="w-full flex flex-wrap space-y-2 md:space-y-0">
                              <span className="text-sm text-secodarycolor font-medium w-full md:w-1/2  flex justify-between">
                                <FormattedMessage id="Subtotal" />{" "}
                                <span className="hidden md:inline-block">
                                  :
                                </span>
                              </span>
                              <span className="text-sm text-secodarycolor/60 font-normal w-full md:w-1/2 md:px-2 md:pr-5">
                                <span className="inline-block">SAR</span>{" "}
                                {subTotal
                                  ? subTotal.toFixed(2)
                                  : orderData.amount}
                              </span>
                            </li>
                            <li className="w-full flex flex-wrap space-y-2 md:space-y-0">
                              <span className="text-sm text-secodarycolor font-medium w-full md:w-1/2  flex justify-between">
                                <FormattedMessage id="Charges" />{" "}
                                <span className="hidden md:inline-block">
                                  :
                                </span>
                              </span>
                              <span className="text-sm text-secodarycolor/60 font-normal w-full md:w-1/2 md:px-2 md:pr-5">
                                <span className="inline-block">SAR</span>{" "}
                                {orderData?.orders.OrderProducts[0]
                                  .supplierProductQuotes?.SupplierQuotes
                                  ?.charges
                                  ? orderData?.orders.OrderProducts[0].supplierProductQuotes?.SupplierQuotes?.charges.toFixed(
                                      2
                                    )
                                  : 0}
                              </span>
                            </li>
                            <li className="w-full flex flex-wrap space-y-2 md:space-y-0">
                              <span className="text-sm text-secodarycolor font-medium w-full md:w-1/2  flex justify-between">
                                <FormattedMessage id="Tax" />{" "}
                                <span className="hidden md:inline-block">
                                  :
                                </span>
                              </span>
                              <span className="text-sm text-secodarycolor/60 font-normal w-full md:w-1/2 md:px-2 md:pr-5">
                                {orderData?.orders?.vat_percentage} %
                              </span>
                            </li>
                          </ul>
                          <hr className="border-1 border-black/10 my-5" />
                          <ul className="space-y-3 w-full">
                            <li className="w-full flex flex-wrap space-y-2 md:space-y-0">
                              <span className="text-base text-secodarycolor font-semibold w-full md:w-1/2  flex justify-between">
                                <FormattedMessage id="Total" />{" "}
                                <span className="hidden md:inline-block">
                                  :
                                </span>
                              </span>
                              <span className="text-base text-secodarycolor/60 font-semibold w-full md:w-1/2 md:px-2 md:pr-5">
                                <span className="text-primarycolor">
                                  <span className="inline-block">SAR</span>{" "}
                                  {total?.toFixed(2)}
                                </span>
                              </span>
                            </li>
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

                    <div className="border border-black/10 rounded-xl p-5 min-h-234px">
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
                        <li>
                          <h5 className="text-sm font-medium text-black">
                            <FormattedMessage id="Rank" />
                          </h5>
                          <p className="text-sm font-medium text-black/60 break-all">
                            Level-1
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 md:mt-20 flex-wrap justify-center">
                <Button
                  type="button"
                  text={<FormattedMessage id="Back_To_HomePage" />}
                  className="uppercase px-7 py-3 text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
                  onClick={() => navigate("/orders")}
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

export default ViewOrderDetails;
