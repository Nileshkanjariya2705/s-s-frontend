import { Table } from "components/table/Table";
import { purchaseHistoryOrderDetail } from "components/table/columns/purchaseHistoryOrderDetail.columns";
import { ApiParamsType } from "components/table/types";
import { perPage, responseType, toastType } from "constant/common.constant";
import useUserData from "hooks/getUserData";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CreateRefundRequest,
  CreateReplacementRequest,
  getOrderDetails,
} from "../services/purchaseHistory.service";
import {
  OrderProducts,
  purchaseHistoryUserInfo,
} from "../types/purchaseHistory.type";
import Loading from "components/globalLoader/Loading";
import { FormattedMessage, useIntl } from "react-intl";
import { Modal } from "components/model/Model";
import { useFieldArray, useForm } from "react-hook-form";
import {
  ReviewAndRatingtype,
  ReviewsAndRating,
  refundProduct,
  replacementProduct,
} from "pages/store/checkOut/types/checkout.types";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  refundProductSchema,
  replacementProductSchema,
  reviewsAndRatingSchema,
} from "pages/store/checkOut/schema/reviewsAndRating.schema";
import { addReviewsAndRatings } from "pages/store/checkOut/services/checkout.services";
import { showToast } from "helper/toast.helper";
import TextArea from "components/textArea/Textarea";
import { Button } from "components/button/Button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePdfView from "pages/supplier/order/component/InvoicePdfView";
import CustomSelect from "components/customSelect/CustomSelect";
import { DropdownOptionType } from "constant/dropdown.constant";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { getAdminSettingData } from "pages/admin/payment/services/adminPayment.services";
import Tooltip from "components/tooltip/tooltip";

const PurchaseHistoryOderDetail = () => {
  const { uuid } = useUserData();
  const params = useParams();
  const intl = useIntl();
  const payment_uuid: string = params.orderId as string;
  const navigate = useNavigate();
  const { user_entity_uuid } = useUserData();
  const [loading, setLoading] = useState<boolean>(false);
  const [orderSummary, setOrderSummary] = useState<purchaseHistoryUserInfo>();
  const [orderProducts, setOrderProducts] = useState<OrderProducts>([]);
  const [isReplaceable, setIsReplaceable] = useState<boolean>(false);
  const [isRefundable, setIsRefundable] = useState<boolean>(false);
  const [editReview, setEditReview] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [replacementModal, setReplacementModal] = useState<boolean>(false);
  const [refundModal, setRefundModal] = useState<boolean>(false);
  const [productList, setProductList] = useState<DropdownOptionType>();
  const [defaultValues, setDefaultValues] = useState<ReviewAndRatingtype>();
  const [ratingCount, setRatingCount] = useState(0);
  const [src, setSrc] = useState<string>("");
  const [subTotal, setSubTotal] = useState<number>();
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [refundButtonLoader, setRefundButtonLoader] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string[]>([]);
  const [replacementPossible, setReplacementPossible] = useState<boolean>();
  const [refundPossible, setRefundPossible] = useState<boolean>();
  const [selectedRefundProduct, setSelectedRefundProduct] = useState<string[]>(
    []
  );

  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ReviewsAndRating>({
    resolver: yupResolver(reviewsAndRatingSchema),
    values: defaultValues && defaultValues,
  });

  const {
    handleSubmit: replacementSubmit,
    register: replacementRegister,
    formState: { errors: replacementErrors },
    control,
    setError,
    clearErrors,
  } = useForm<replacementProduct>({
    resolver: yupResolver(replacementProductSchema),
    defaultValues: {
      replace_product: [
        {
          product: "",
          reason: "",
        },
      ],
    },
  });

  const {
    handleSubmit: refundSubmit,
    register: refundRegister,
    formState: { errors: refundErrors },
    control: refundControl,
    setError: setRefundErrors,
    clearErrors: clearRefundErrors,
  } = useForm<refundProduct>({
    resolver: yupResolver(refundProductSchema),
    defaultValues: {
      refund_product: [
        {
          product: "",
          reason: "",
        },
      ],
    },
  });

  const { langauge } = useSelector((state: RootState) => ({
    langauge: state.language.language,
  }));

  const handleReviewAndRating = async (values: { reviews: string }) => {
    try {
      const response = await addReviewsAndRatings({
        purchaseReqId: orderSummary?.orderDetail?.purchase_request_id,
        supplier_info_uuid: orderSummary?.orderDetail?.supplier_info_uuid,
        reviews: values.reviews,
        orderId: orderSummary?.orderDetail?.uuid
          ? orderSummary?.orderDetail?.uuid
          : null,
        rating: ratingCount,
      });
      if (response) {
        if (response?.data.responseType === responseType.Success) {
          showToast(response?.data.message, toastType.Success, intl);
          setShowModal(false);
        } else {
          showToast(response?.data.message, toastType.Error, intl);
          setShowModal(false);
        }
      }
    } catch (error) {
      setShowModal(false);
    }
  };
  const handleStarClick = (index: number) => {
    setRatingCount(index + 1);
  };

  const getAllPurchaseHistoryOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderDetails({
        payment_uuid,
        user_entity_uuid,
        apiParams,
      });
      if (response?.data.responseType === responseType.Success) {
        const productNameDropdown: DropdownOptionType = [];
        response?.data?.data?.OrderProducts?.rows.map((item: any) => {
          productNameDropdown.push({
            label: item.supplierProductQuotes?.other_brand_product_uuid
              ? item.supplierProductQuotes?.otherBrandProduct?.[
                  `name_${langauge as "en" | "ar" | "ur"}`
                ]
              : item.supplierProductQuotes?.ProductPurchaseRequests?.products?.[
                  `name_${langauge as "en" | "ar" | "ur"}`
                ],
            value: item?.quote_id
              ? item?.quote_id
              : item.supplierProductQuotes?.ProductPurchaseRequests?.products
                  ?.uuid,
          });
        });
        setProductList(productNameDropdown as DropdownOptionType);
        setOrderProducts(response?.data?.data?.OrderProducts?.rows);
        setIsReplaceable(response?.data?.data?.replacement_available);
        setIsRefundable(response?.data?.data?.refund_request);
        setOrderSummary(response?.data?.data?.OrderSummary);
        setSrc(response?.data?.data?.OrderSummary.Qr_code);
        const totalPrice = response?.data?.data?.OrderProducts?.rows.reduce(
          (sum: number, obj: { price: string; quantity: number }) =>
            sum + parseFloat(obj.price) * obj.quantity,
          0
        );
        setSubTotal(parseFloat(totalPrice.toFixed(2)));
        setLoading(false);

        if (response?.data?.data?.OrderSummary?.ratings !== "") {
          setEditReview(true);
        }
        setRatingCount(response?.data?.data?.OrderSummary?.ratings?.rating);
        setDefaultValues(response?.data?.data?.OrderSummary?.ratings);
      } else {
        setLoading(false);
        // navigate("/purchase-history");
      }
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  const columns = purchaseHistoryOrderDetail(langauge as string);
  useEffect(() => {
    getAllPurchaseHistoryOrderDetails();
  }, []);

  const isSubstitutionPossible = async () => {
    const today = new Date();
    const order_created_date = new Date(
      orderSummary?.orderDetail.updated_at as string
    );
    const remainigTime = Number(today.getTime() - order_created_date.getTime());
    const remainingDays = Math.ceil(remainigTime / (1000 * 3600 * 24));
    const response = await getAdminSettingData();
    if (remainingDays <= response?.data.data.replacement_days) {
      setReplacementPossible(true);
    } else {
      setReplacementPossible(false);
    }
    if (remainingDays <= response?.data.data.refundable_days) {
      setRefundPossible(true);
    } else {
      setRefundPossible(false);
    }
  };

  useEffect(() => {
    if (
      orderSummary &&
      orderSummary.orderDetail &&
      orderSummary.orderDetail.updated_at &&
      orderSummary.orderDetail.status === "DELIVERED"
    ) {
      isSubstitutionPossible();
    }
  }, [orderSummary]);

  const orders = {
    ...orderSummary?.orderDetail,
    OrderProducts: orderProducts,
  };
  const orderData = {
    ...orderSummary?.paymentDetails,
    orders: orders,
  };

  const replaceProduct = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const productValue =
      selectedProduct && selectedProduct.find((item: string) => item === value);
    if (productValue) {
      setError(name as "replace_product", {
        message: intl.formatMessage({
          id: "Can_not_select_same_product",
        }),
      });
    } else {
      clearErrors(name as "replace_product");
      setSelectedProduct((prev: string[]) => [...prev, value]);
    }
  };

  const handleReplacement = async (values: replacementProduct) => {
    try {
      setButtonLoader(true);
      const response = await CreateReplacementRequest({
        values,
        payment_uuid: payment_uuid,
        supplier_info_uuid: orderSummary?.orderDetail?.supplier_info_uuid
          ? orderSummary?.orderDetail?.supplier_info_uuid
          : "",
        requested_by: uuid,
      });
      if (response) {
        setButtonLoader(false);
        setIsReplaceable(false);
        setReplacementModal(false);
      }
    } catch (error) {
      setButtonLoader(false);
      setReplacementModal(false);
      return error;
    }
  };

  const { append, fields, remove } = useFieldArray({
    control,
    name: "replace_product",
  });

  const {
    append: refundAppend,
    fields: refundFields,
    remove: refundRemove,
  } = useFieldArray({
    control: refundControl,
    name: "refund_product",
  });

  const refundProduct = (e: any) => {
    const value =
      selectedRefundProduct &&
      selectedRefundProduct.find((item: string) => item === e.target.value);
    if (value) {
      setRefundErrors(e.target.name, {
        message: intl.formatMessage({
          id: "Can_not_select_same_product",
        }),
      });
    } else {
      clearRefundErrors(e.target.name);
      setSelectedRefundProduct((prev: string[]) => [...prev, e.target.value]);
    }
  };
  const handleRefund = async (values: refundProduct) => {
    try {
      setRefundButtonLoader(true);
      const response = await CreateRefundRequest({
        values,
        order_uuid: orderSummary?.orderDetail?.uuid
          ? orderSummary?.orderDetail?.uuid
          : "",
        supplier_info_uuid: orderSummary?.orderDetail?.supplier_info_uuid
          ? orderSummary?.orderDetail?.supplier_info_uuid
          : "",
        requested_by: uuid,
      });
      if (response) {
        setRefundButtonLoader(false);
        setIsRefundable(false);
        setRefundModal(false);
      }
    } catch (error) {
      setRefundButtonLoader(false);
      setRefundModal(false);
      return error;
    }
  };

  return (
    <div className="w-full border border-black/10 rounded-xl p-5 ">
      <div className="flex items-center justify-between mt-4">
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
            <i
              className="icon-left_arrow text-24px text-primarycolor hover:cursor-pointer"
              onClick={() => navigate("/purchase-history")}
            ></i>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-black ">
            {<FormattedMessage id="Purchase_History" />}
          </h2>
        </div>
      </div>
      {loading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <>
          {orderProducts && orderSummary && (
            <div>
              <div className="mt-6 border px-8 py-8 rounded-xl">
                <h3 className="font-semibold text-lg ">
                  {<FormattedMessage id="Order_Summary" />}
                </h3>
                <div className="flex flex-wrap mt-4 mb-3 -mx-4">
                  <div className="relative w-full md:w-1/2  px-4 border-b-2 md:border-b-0 pb-5 md:pb-0 md:border-r-2 md:rtl:border-l-2 md:rtl:border-r-0 border-black/10 ">
                    <ul className="space-y-2 lg:space-y-4 w-full md:w-11/12">
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                          {<FormattedMessage id="Order_date" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                          {orderSummary?.orderDetail.created_at.slice(0, 10)}
                        </span>
                      </li>
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                          {<FormattedMessage id="Name" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                          {orderSummary?.userDetail.username}
                        </span>
                      </li>
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                          {<FormattedMessage id="Email" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                          {orderSummary?.userDetail.email}
                        </span>
                      </li>
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                          {<FormattedMessage id="Shipping_Address" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                          {orderSummary?.orderDetail.address.address +
                            "," +
                            " " +
                            orderSummary?.orderDetail.address.city +
                            "," +
                            " " +
                            orderSummary?.orderDetail.address.state +
                            "," +
                            " " +
                            orderSummary?.orderDetail.address.country +
                            " " +
                            orderSummary?.orderDetail.address.postal_code}
                        </span>
                      </li>
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                          {<FormattedMessage id="Order_Status" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                          {orderSummary?.orderDetail.status.replaceAll("_"," ")}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative w-full md:w-1/2 px-4 pt-5 md:pt-0">
                    <div className="flex">
                      <ul className="space-y-2 lg:space-y-4 w-full md:w-11/12">
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Vat_Charges" />}{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                            {orderSummary?.orderDetail.vat_percentage} %
                          </span>
                        </li>
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Total_order_amount" />}{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                            <span className="inline-block">SAR</span>{" "}
                            {orderSummary?.paymentDetails.amount.toFixed(2)}
                          </span>
                        </li>
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Payment_method" />}{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                            {orderSummary?.orderDetail?.payment_mode ===
                            "BANK_TRANSFER"
                              ? "Bank Transfer"
                              : "Card Payment"}
                          </span>
                        </li>
                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Payment_status" />}{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                            {orderSummary?.paymentDetails.payment_status}
                          </span>
                        </li>

                        <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                          <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                            {<FormattedMessage id="Invoice" />}{" "}
                            <span className="hidden lg:inline-block">:</span>
                          </span>
                          <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                            <PDFDownloadLink
                              document={
                                <InvoicePdfView
                                  orderData={orderData as any}
                                  total={parseFloat(
                                    orderSummary?.paymentDetails.amount.toFixed(
                                      2
                                    )
                                  )}
                                  shipping_charges={
                                    orderData?.orders.OrderProducts[0]
                                      .supplierProductQuotes?.SupplierQuotes
                                      ?.charges
                                      ? orderData?.orders.OrderProducts[0]
                                          .supplierProductQuotes?.SupplierQuotes
                                          ?.charges
                                      : 0
                                  }
                                  subtotal={subTotal}
                                  src={src}
                                />
                              }
                              fileName={`${
                                orderData?.orders?.uuid &&
                                orderData?.orders?.uuid.slice(0, 8)
                              }-invoice`}
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
                          </span>
                        </li>
                        {orderSummary.orderDetail.refund_accepted_admin && (
                          <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                            <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                              {<FormattedMessage id="Admin_Refund" />}{" "}
                              <span className="hidden lg:inline-block">:</span>
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                              <Tooltip
                                tooltip={intl.formatMessage({
                                  id: "Tooltip_order_refunded",
                                })}
                              >
                                <Link
                                  to={`/refund-orders/${orderSummary.paymentDetails.uuid}`}
                                  className="text-Primarygreen bg-Primarygreen/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center"
                                >
                                  <p>Refunded Order</p>
                                </Link>
                              </Tooltip>
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="w-full px-4 flex gap-4 items-center mt-4">
                    {orderSummary?.orderDetail.status !== "FAILED" && (
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
                        className="px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                      ></Button>
                    )}{" "}
                    <></>
                    {orderSummary?.orderDetail.status === "DELIVERED" &&
                      isReplaceable &&
                      replacementPossible &&
                      isRefundable && (
                        <Button
                          text={
                            <FormattedMessage id="Replacement_Of_Order_Product" />
                          }
                          type="button"
                          onClick={() => {
                            setReplacementModal(true);
                          }}
                          className="px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                        ></Button>
                      )}
                    {orderSummary?.orderDetail.status === "DELIVERED" &&
                      isRefundable &&
                      refundPossible && (
                        <Button
                          text={
                            <FormattedMessage id="Refund_Of_Order_Product" />
                          }
                          type="button"
                          onClick={() => {
                            setRefundModal(true);
                          }}
                          className="px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                        ></Button>
                      )}
                    {orderSummary?.orderDetail.status === "CANCELLED" && (
                      <p>
                        {<FormattedMessage id="Reason_for_Cancel_Order" />}{" "}
                        {":"}
                        <span className="pl-0.5">
                          {orderSummary?.orderDetail?.reason_for_cancel}
                        </span>
                      </p>
                    )}
                  </div>
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
                      <div className="mt-8 flex justify-center gap-4 flex-wrap">
                        <Button
                          text={<FormattedMessage id="Cancel" />}
                          type="button"
                          onClick={() => {
                            setShowModal(false);
                          }}
                          className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                        ></Button>
                        <Button
                          text={
                            editReview === true ? (
                              <FormattedMessage id="Update" />
                            ) : (
                              <FormattedMessage id="Save" />
                            )
                          }
                          type="submit"
                          className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                        ></Button>
                      </div>
                    </form>
                  </Modal>
                  <Modal
                    showModal={replacementModal}
                    setShowModal={setReplacementModal}
                    title={<FormattedMessage id="Replace_Product" />}
                  >
                    <div className="max-h-[450px] overflow-y-auto">
                      <form onSubmit={replacementSubmit(handleReplacement)}>
                        {fields.map((_item, index: number) => (
                          <>
                            <div className="border border-secondaryGreen border-dashed p-5 m-3 rounded-lg overflow-auto">
                              <div
                                className="space-y-4 flex gap-5 w-full flex-wrap "
                                key={_item.id}
                              >
                                <div className="w-full">
                                  <CustomSelect
                                    label={<FormattedMessage id="Product" />}
                                    options={productList as DropdownOptionType}
                                    control={control}
                                    register={replacementRegister}
                                    name={`replace_product.${index}.product`}
                                    errorKey={`replace_product.${index}.product`}
                                    required={true}
                                    error={replacementErrors}
                                    handleSelectChange={() => replaceProduct}
                                  />
                                </div>
                                <div className="relative w-full !mt-0">
                                  <TextArea
                                    id={`replace_product.${index}.reason`}
                                    name={`replace_product.${index}.reason`}
                                    label={<FormattedMessage id="Reason" />}
                                    register={replacementRegister}
                                    required={true}
                                    errorKey={`replace_product.${index}.reason`}
                                    errors={replacementErrors}
                                    rows={1}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end mt-3">
                                {fields.length > 1 && (
                                  <Button
                                    className="text-sm font-medium text-secondaryOrange border border-secondaryOrange py-2 px-4 rounded-lg transition-all duration-300 hover:bg-secondaryOrange hover:text-white"
                                    type="button"
                                    onClick={() => remove(index)}
                                  >
                                    {<FormattedMessage id="Remove" />}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </>
                        ))}
                        {productList?.length !== fields.length && (
                          <Button
                            className="text-sm font-medium text-secondaryOrange border border-secondaryOrange py-2 px-5 rounded-lg transition-all duration-300 hover:bg-secondaryOrange hover:text-white"
                            type="button"
                            onClick={() =>
                              append({
                                reason: "",
                                product: "",
                              })
                            }
                            text={<FormattedMessage id="Add_Product" />}
                          />
                        )}
                        <div className="mt-8 flex justify-center gap-4 flex-wrap">
                          <Button
                            text={<FormattedMessage id="Cancel" />}
                            type="button"
                            onClick={() => {
                              setReplacementModal(false);
                            }}
                            className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                          ></Button>
                          <Button
                            text={
                              <FormattedMessage id="Send_Replacement_Request" />
                            }
                            loader={buttonLoader}
                            type="submit"
                            className="min-w-150px px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                          ></Button>
                        </div>
                      </form>
                    </div>
                  </Modal>
                  <Modal
                    showModal={refundModal}
                    setShowModal={setRefundModal}
                    title={<FormattedMessage id="Refund_Product" />}
                  >
                    <div className="max-h-[450px] overflow-y-auto">
                      <form onSubmit={refundSubmit(handleRefund)}>
                        {refundFields.map((_item, index: number) => (
                          <>
                            <div className="border border-secondaryGreen border-dashed  p-4 m-3 rounded-lg overflow-auto ">
                              <div
                                className="space-y-4 flex gap-5 w-full flex-wrap "
                                key={_item.id}
                              >
                                <div className="w-full">
                                  <CustomSelect
                                    label={<FormattedMessage id="Product" />}
                                    options={productList as DropdownOptionType}
                                    control={refundControl}
                                    register={refundRegister}
                                    name={`refund_product.${index}.product`}
                                    errorKey={`refund_product.${index}.product`}
                                    required={true}
                                    error={refundErrors}
                                    handleSelectChange={refundProduct}
                                  />
                                </div>
                                <div className="relative w-full !mt-0">
                                  <TextArea
                                    id={`refund_product.${index}.reason`}
                                    name={`refund_product.${index}.reason`}
                                    label={<FormattedMessage id="Reason" />}
                                    register={refundRegister}
                                    required={true}
                                    errorKey={`refund_product.${index}.reason`}
                                    errors={refundErrors}
                                    rows={1}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end mt-3">
                                {refundFields.length > 1 && (
                                  <Button
                                    className="text-sm font-medium text-secondaryOrange border border-secondaryOrange py-2 px-4 rounded-lg transition-all duration-300 hover:bg-secondaryOrange hover:text-white"
                                    type="button"
                                    onClick={() => refundRemove(index)}
                                  >
                                    {<FormattedMessage id="Remove" />}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </>
                        ))}
                        {productList?.length !== refundFields.length && (
                          <Button
                            className="text-sm font-medium text-secondaryOrange border border-secondaryOrange py-2 px-5 rounded-lg transition-all duration-300 hover:bg-secondaryOrange hover:text-white"
                            type="button"
                            onClick={() =>
                              refundAppend({
                                reason: "",
                                product: "",
                              })
                            }
                            text={<FormattedMessage id="Add_Product" />}
                          />
                        )}
                        <div className="mt-8 flex justify-center gap-4 flex-wrap">
                          <Button
                            text={<FormattedMessage id="Cancel" />}
                            type="button"
                            onClick={() => {
                              setRefundModal(false);
                            }}
                            className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                          ></Button>
                          <Button
                            text={<FormattedMessage id="Send_Refund_Request" />}
                            loader={refundButtonLoader}
                            type="submit"
                            className="min-w-150px px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                          ></Button>
                        </div>
                      </form>
                    </div>
                  </Modal>
                </div>
              </div>
              <div className="mt-6 border px-8 py-8 rounded-xl">
                <div className="flex flex-wrap -mx-4">
                  <div className="relative w-full lg:w-2/3  px-4 border-b-2 lg:border-b-0 pb-5 lg:pb-0 lg:border-r-2 border-black/10 lg:rtl:border-l-2 lg:rtl:border-r-0">
                    <Table
                      apiParams={apiParams}
                      setApiParams={setApiParams}
                      columns={columns}
                      data={orderProducts}
                      header={`${intl.formatMessage({
                        id: "Order_Code",
                      })} # ${orderSummary?.orderDetail.uuid.slice(0, 8)}`}
                      search={false}
                      pagination={false}
                      additionalStyle={`border-black/10 rounded-14px p-0`}
                    />
                  </div>
                  <div className="relative w-full lg:w-1/3 px-4 pt-5 lg:pt-0">
                    <ul className="space-y-3 w-full md:w-11/12">
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/2  flex justify-between">
                          {<FormattedMessage id="Total_order_amount" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-1/2 lg:px-2 md:pr-5">
                          <span className="inline-block">SAR</span>{" "}
                          {orderSummary?.paymentDetails.amount.toFixed(2)}
                        </span>
                      </li>
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/2  flex justify-between">
                          {<FormattedMessage id="Payment_method" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-1/2 lg:px-2 md:pr-5">
                          {" "}
                          {orderSummary?.orderDetail?.payment_mode ===
                          "BANK_TRANSFER"
                            ? "Bank Transfer"
                            : "Card Payment"}
                        </span>
                      </li>
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/2  flex justify-between">
                          {<FormattedMessage id="Payment_status" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-1/2 lg:px-2 md:pr-5">
                          {" "}
                          {orderSummary?.paymentDetails.payment_status}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PurchaseHistoryOderDetail;
