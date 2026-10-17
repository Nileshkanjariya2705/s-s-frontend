import { useNavigate, useParams } from "react-router-dom";
import { addReason, getOrderDetailInfo } from "./services/order.service";
import { useEffect, useState } from "react";
import { AdminOrderDetailTypes, OrderCancelInfo } from "./types/order.type";
import moment from "moment";
import { FormattedMessage, useIntl } from "react-intl";
import { responseType } from "constant/common.constant";
import Loading from "components/globalLoader/Loading";
import PageNotFound from "components/pageNotFound/PageNotFound";
import { REACT_APP_IMAGE_PATH } from "config";
import { OrderProducts } from "pages/supplier/order/types/order.type";
import { Button } from "components/button/Button";
import { Modal } from "components/model/Model";
import Input from "components/input/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { orderCancelSchema } from "./schema/AdminOrderFilter";
import Tooltip from "components/tooltip/tooltip";
import useLocale from "hooks/useLocale";

const ViewOrder = () => {
  const navigate = useNavigate();
  const { language } = useLocale()
  const { orderId } = useParams();
  const [orderDetailData, setOrderDetailData] =
    useState<AdminOrderDetailTypes>();

  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>();
  const [subTotal, setSubTotal] = useState<number>();
  const [charges, setCharges] = useState<number>();
  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const getSingleOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderDetailInfo(orderId as string);
      if (response?.data?.responseType === responseType.Success) {
        setOrderDetailData(response?.data?.data);
        setTotal(
          parseFloat(response?.data?.data.singleData?.amount.toFixed(2))
        );
        const totalPrice =
          response?.data?.data.singleData?.orders?.OrderProducts &&
          response?.data?.data.singleData?.orders?.OrderProducts.reduce(
            (sum: number, obj: { price: string; quantity: number }) =>
              sum + parseFloat(obj.price) * obj.quantity,
            0
          );
        setSubTotal(parseFloat(totalPrice.toFixed(2)));
        setCharges(
          response?.data.data.singleData.orders.OrderProducts[0]
            .supplierProductQuotes.SupplierQuotes.charges
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  useEffect(() => {
    getSingleOrderDetails();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderCancelInfo>({
    resolver: yupResolver(orderCancelSchema),
  });
  const intl = useIntl();

  const changeOrderStatus = async (values: OrderCancelInfo) => {
    setCancelModal(false);
    if (orderId) {
      const response = await addReason(values.reason, orderId);
      if (response?.data.responseType === responseType.Success) {
        getSingleOrderDetails();
      }
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {orderDetailData ? (
            <div>
              <div className="flex mt-8 gap-3">
                <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                  <i
                    className="icon-left_arrow text-24px text-primarycolor cursor-pointer"
                    onClick={() => navigate("/admin/orders")}
                  ></i>
                </div>
                <h2 className="text-2xl font-semibold text-black pr-90 mt-1">
                  {<FormattedMessage id="Order_Details" />}
                </h2>
              </div>

              <div>
                <div className="border border-black/10 rounded-xl p-5 mt-8">
                  <div className="flex flex-wrap -mx-4">
                    <div className="relative w-full md:w-1/2  px-4">
                      <div className="border-b-2 md:border-b-0 pb-5 md:pb-0 md:border-r-2 border-black/10 md:rtl:border-l-2 md:rtl:border-r-0">
                        <h2 className="text-darkgrey text-base font-semibold mb-4">
                          {<FormattedMessage id="Order_Details" />}
                        </h2>
                        <ul className="space-y-2 lg:space-y-4 w-full">
                          <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Order_date" />}{" "}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                              {" "}
                              {moment(
                                orderDetailData?.singleData?.orders?.created_at
                              ).format("DD-MM-YYYY, HH:mm")}
                            </span>
                          </li>
                          <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Order_Status" />}{" "}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                              {" "}
                              {orderDetailData?.singleData?.orders?.status}
                            </span>
                          </li>
                          <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Amount" />}{" "}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <p className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                              {" "}
                              <span className="inline-block">SAR</span>{" "}
                              <span>{orderDetailData?.singleData?.amount}</span>
                            </p>
                          </li>
                          <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Shipping_Address" />}{" "}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                              {" "}
                              {
                                orderDetailData?.singleData?.orders?.address
                                  ?.address
                              }
                              ,{" "}
                              {
                                orderDetailData?.singleData?.orders?.address
                                  ?.city
                              }
                              ,{" "}
                              {
                                orderDetailData?.singleData?.orders?.address
                                  ?.state
                              }
                              ,{" "}
                              {
                                orderDetailData?.singleData?.orders?.address
                                  ?.country
                              }
                              ,{" "}
                              {
                                orderDetailData?.singleData?.orders?.address
                                  ?.postal_code
                              }
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="relative w-full md:w-1/2 px-4 pt-5 md:pt-0">
                      <ul className="space-y-2 lg:space-y-4 w-full ">
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Payment_status" />}{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                            {orderDetailData?.singleData?.payment_status}
                          </span>
                        </li>
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Payment_Mode" />}{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                            {orderDetailData?.singleData?.orders?.payment_mode}
                          </span>
                        </li>
                        <li>
                          <Tooltip
                            tooltip={intl.formatMessage({
                              id:
                                orderDetailData?.singleData?.orders?.status ===
                                "CANCELLED"
                                  ? "cancel_tooltip"
                                  : orderDetailData?.singleData?.orders
                                      ?.status === "DELIVERED"
                                  ? "delivered_tooltip"
                                  : "order_tooltip",
                            })}
                            showTooltip={true}
                          >
                            <Button
                              text={<FormattedMessage id="Cancel" />}
                              type="button"
                              onClick={() => setCancelModal(true)}
                              disable={
                                orderDetailData?.singleData?.orders?.status ===
                                  "CANCELLED" ||
                                orderDetailData?.singleData?.orders?.status ===
                                  "DELIVERED"
                                  ? true
                                  : false
                              }
                              className="w-42 px-1 md:px-5 py-3 text-sm font-bold text-center   text-secondaryOrange border-2 border-secondaryOrange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                            ></Button>
                          </Tooltip>
                        </li>
                      </ul>
                      {cancelModal && (
                        <>
                          <Modal
                            title={<FormattedMessage id="Cancel_Order" />}
                            setShowModal={setCancelModal}
                            showModal={cancelModal}
                            width="400px"
                          >
                            <form
                              className="mt-12px"
                              onSubmit={handleSubmit(changeOrderStatus)}
                            >
                              <div className="w-full relative px-1 mb-3">
                                <Input
                                  errors={errors}
                                  id="reason"
                                  register={register}
                                  type="text"
                                  label={<FormattedMessage id="Reason" />}
                                  placeholder={intl.formatMessage({
                                    id: "Enter_Reason",
                                  })}
                                  required={true}
                                />
                              </div>
                              <div className="text-center">
                                <Button
                                  type="button"
                                  text={<FormattedMessage id="Close" />}
                                  onClick={() => setCancelModal(false)}
                                  className="px-6 py-2 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl mr-5 hover:bg-secondaryOrange hover:text-white focus:ring-0 focus:outline-0 uppercase mt-5"
                                />
                                <Button
                                  type="submit"
                                  text={<FormattedMessage id="SUbmit" />}
                                  className="px-6 py-2 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl mr-5 hover:bg-primarycolor hover:text-white focus:ring-0 focus:outline-0 uppercase mt-5"
                                />
                              </div>
                            </form>
                          </Modal>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border border-black/10 rounded-xl p-5 mt-8">
                  <div className="flex flex-wrap  -mx-4">
                    <div className="relative w-full md:w-1/2  px-4">
                      <div className="border-b-2 md:border-b-0 pb-5 md:pb-0 md:border-r-2 border-black/10 md:rtl:border-l-2 md:rtl:border-r-0">
                        <h2 className="text-darkgrey text-base font-semibold mb-4">
                          {<FormattedMessage id="Supplier_Details" />}
                        </h2>
                        <ul className="space-y-3 w-full ">
                          <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Name" />}{" "}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                              {orderDetailData?.ownerData?.supplierOwnerName}
                            </span>
                          </li>
                          <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Company_Name" />}{" "}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                              {
                                orderDetailData?.singleData?.orders
                                  ?.supplierInfo?.company_name
                              }
                            </span>
                          </li>
                          <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="CR_Number" />}{" "}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                              {
                                orderDetailData?.singleData?.orders
                                  ?.supplierInfo?.cr_number
                              }
                            </span>
                          </li>
                          <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Tax_Number" />}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                              {
                                orderDetailData?.singleData?.orders
                                  ?.supplierInfo?.tax_number
                              }
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* 02 */}
                    <div className="relative w-full md:w-1/2  px-4">
                      <h2 className="text-darkgrey text-base font-semibold mb-4">
                        {<FormattedMessage id="Store_Details" />}
                      </h2>
                      <ul className="space-y-3 w-full ">
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Name" />}{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                            {orderDetailData?.ownerData?.storeOwnerName}
                          </span>
                        </li>
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Company_Name" />}{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                            {
                              orderDetailData?.singleData?.orders?.storeInfo
                                ?.company_name
                            }
                          </span>
                        </li>
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="CR_Number" />}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                            {
                              orderDetailData?.singleData?.orders?.storeInfo
                                ?.cr_number
                            }
                          </span>
                        </li>
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Tax_Number" />}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2">
                            {
                              orderDetailData?.singleData?.orders?.storeInfo
                                ?.tax_number
                            }
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-black/10 rounded-xl p-5 mt-8">
                  <div className="flex flex-wrap  -mx-4">
                    <div className="relative w-full md:w-1/2  px-4">
                      <div className="border-b-2 md:border-b-0 pb-5 md:pb-0 md:border-r-2 border-black/10 md:rtl:border-l-2 md:rtl:border-r-0">
                        <h2 className="text-darkgrey text-base font-semibold mb-4">
                          {<FormattedMessage id="Product_Details" />}
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
                              {orderDetailData?.singleData?.orders?.OrderProducts.map(
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
                                        <div className="flex items-center flex-wrap gap-2">
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
                                                : item?.product?.featured_image
                                            }`}
                                            alt="FoodSeven"
                                            className="w-8 h-8 md:w-10 md:h-10"
                                          />
                                          <span className="font-normal whitespace-nowrap w-full md:w-auto">
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
                                              : item?.product?.[`name_${language}`]}
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
                    </div>
                    {/* 02 */}
                    <div className="relative w-full md:w-1/2  px-4">
                      <ul className="space-y-3 w-full ">
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            <FormattedMessage id="Subtotal" />{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full md:w-1/2 md:px-2 md:pr-5">
                            <span className="inline-block">SAR</span>{" "}
                            {subTotal
                              ? subTotal.toFixed(2)
                              : orderDetailData?.singleData.amount}
                          </span>
                        </li>
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Charges" />}{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full md:w-1/2 md:px-2 md:pr-5">
                            <span className="inline-block">SAR</span> {charges}
                          </span>
                        </li>
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Tax" />}{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full md:w-1/2 md:px-2 md:pr-5">
                            {
                              orderDetailData?.singleData?.orders
                                ?.vat_percentage
                            }{" "}
                            %
                          </span>
                        </li>
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            <FormattedMessage id="Subtotal" />
                            <span className="hidden lg:inline-block">:</span>
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
            </div>
          ) : (
            <PageNotFound />
          )}
        </>
      )}
    </>
  );
};

export default ViewOrder;
