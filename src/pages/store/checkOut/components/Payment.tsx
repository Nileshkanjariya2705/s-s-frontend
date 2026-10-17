import { Button } from "components/button/Button";
import {
  PayableAmountType,
  PurchaseReqOrdType,
  SelectedProductProps,
} from "../types/checkout.types";

import {
  createCharge,
  getLatestCharge,
  paymentUsingSavedCard,
} from "../services/checkout.services";

import useUserData from "hooks/getUserData";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "components/globalLoader/Loading";
import { FormattedMessage } from "react-intl";
import { BankTransfer } from "./BankTransfer";
import CardConfimationModal from "./CardConfimationModal";
import moment from "moment";
import { REACT_APP_IMAGE_PATH } from "config";
import useLocale from "hooks/useLocale";

const Payment: React.FC<SelectedProductProps> = ({
  setTab,
  setDisableTab,
  orderDetail,
}) => {
  const { mergeId } = useParams();
  const { language } = useLocale();
  const { email, username, user_entity_uuid, phone } = useUserData();
  const [orderPrdData, setOrderPrdData] = useState<PurchaseReqOrdType[]>([]);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [saveCardButtonLoader, setSaveCardButtonLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [encodedId1, encodedId2, encodedId3] = mergeId?.split("|") as [
    string,
    string,
    string
  ];
  const purchaseReqId = atob(encodedId1);
  const supplier_info_uuid = atob(encodedId2);
  const supplierProdId = encodedId3 && atob(encodedId3);
  const [payableAmountDetails, setPayableAmountDetails] =
    useState<PayableAmountType>({
      subtotal: 0,
      charges: 0,
      vatPercent: 0,
      grandTotal: 0,
    });
  const [cardConfimation, setCardConfimation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [buyNow, setBuyNow] = useState("Purchase_Req");

  const getPurchaseReOrderData = async () => {
    try {
      setLoader(true);
      const orderProductDetails = orderDetail.orderProductDetails;
      if (orderProductDetails) {
        const OrderDetails = await getLatestCharge(orderDetail.order_uuid);
        const vatPercent = OrderDetails?.data?.data?.vat_percentage;
        setOrderPrdData(orderProductDetails);
        const AmountWithoutTax = orderProductDetails?.[0]?.supplierProductQuotes
          ?.SupplierQuotes?.charges_and_total
          ? orderProductDetails?.[0]?.supplierProductQuotes?.SupplierQuotes
              ?.charges_and_total
          : orderProductDetails?.[0]?.price *
              orderProductDetails?.[0]?.quantity +
            orderProductDetails?.[0]?.supplierProductQuotes?.SupplierQuotes
              ?.charges;
        const charges = orderProductDetails?.[0]?.supplierProductQuotes
          ?.SupplierQuotes?.charges
          ? orderProductDetails?.[0]?.supplierProductQuotes?.SupplierQuotes
              ?.charges
          : 0;
        setBuyNow(orderProductDetails?.[0]?.buy_now);
        const taxAmount = (AmountWithoutTax * vatPercent) / 100;
        const GrandTotal = AmountWithoutTax + taxAmount;
        setPayableAmountDetails(() => {
          return {
            subtotal: AmountWithoutTax - charges,
            charges: charges,
            vatPercent: vatPercent,
            grandTotal: GrandTotal,
          };
        });
      }
      setLoader(false);
    } catch (error) {
      setLoader(true);
      return error;
    }
  };
  useEffect(() => {
    if (orderDetail.orderProductDetails) {
      getPurchaseReOrderData();
    }
  }, []);

  const handlePayment = async (card_name: string | null) => {
    try {
      if (!card_name) {
        const [encodedId1, encodedId2, encodedId3] = mergeId?.split("|") as [
          string,
          string,
          string
        ];
        const purchaseReqId = atob(encodedId1);
        const supplierId = atob(encodedId2);
        const supplierProdId = encodedId3 && atob(encodedId3);
        setButtonLoader(true);

        if (orderPrdData) {
          const paymentData = {
            amount: payableAmountDetails.grandTotal,
            email: email,
            name: username,
            order: orderPrdData?.[0]?.order_id,
            req_id: purchaseReqId,
            phone: phone,
            supplierId: supplierId,
            store_info_uuid: user_entity_uuid,
            supplierProdId: supplierProdId ? supplierProdId : null,
          };
          const response = await createCharge(paymentData);
          localStorage.setItem("save_card", "true");
          if (response?.data?.responseType === "success") {
            window.location.href = response?.data?.data;
            if (response?.data?.data) {
              setButtonLoader(false);
            }
          } else {
            setButtonLoader(false);
          }
        }
        setDisableTab(() => {
          return {
            selectedProductsFlag: 1,
            shippingFlag: 1,
            confirmationFlag: 1,
            paymentFlag: 1,
          };
        });
      } else {
        const [encodedId1, encodedId2] = mergeId?.split("|") as [
          string,
          string
        ];
        const purchaseReqId = atob(encodedId1);
        const supplierId = atob(encodedId2);
        setSaveCardButtonLoader(true);
        localStorage.setItem("save_card", "false");
        if (orderPrdData) {
          const paymentData = {
            amount: payableAmountDetails.grandTotal,
            email: email,
            name: username,
            order: orderPrdData?.[0]?.order_id,
            req_id: purchaseReqId,
            phone: phone,
            supplierId: supplierId,
            card_name: card_name,
            store_info_uuid: user_entity_uuid,
            supplierProdId: supplierProdId ? supplierProdId : null,
          };
          const response = await paymentUsingSavedCard(paymentData);

          if (
            response?.data?.responseType === "success" &&
            response?.data?.data !== "CAPTURED"
          ) {
            window.location.href = response?.data?.data;
            if (response?.data?.data) {
              setSaveCardButtonLoader(false);
            }
          } else if (
            response?.data?.responseType === "success" &&
            response?.data?.data === "CAPTURED"
          ) {
            setCardConfimation(false);
            setDisableTab(() => {
              return {
                selectedProductsFlag: 1,
                shippingFlag: 1,
                confirmationFlag: 1,
                paymentFlag: 1,
              };
            });
            setTab(3);
            setSaveCardButtonLoader(false);
          } else {
            setSaveCardButtonLoader(false);
          }
        }
      }
    } catch (error) {
      setSaveCardButtonLoader(false);
      setButtonLoader(false);
    }
  };

  return (
    <>
      {loader ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          {orderDetail.payment_status === "SUCCESS" ? (
            <div className="max-w-xl mx-auto border-[1px] border-dashed border-black/10 rounded-lg mt-8 p-6">
              <div className="relative space-y-3 py-2 pb-6 border-b-[1px] border-dashed border-black/10">
                <div
                  className={`w-20 h-20 bg-white shadow-order-place rounded-full flex items-center justify-center  mx-auto mb-4`}
                >
                  <i className="w-12 h-12 rounded-full bg-primarycolor flex items-center justify-center mx-auto icon-check-alt-2 text-24px text-white"></i>
                </div>
                <h1 className="text-primarycolor font-semibold text-center font-poppins text-xl">
                  {<FormattedMessage id="placed" />}
                </h1>
              </div>
              <div className="relative space-y-3 py-5 pb-6 ">
                <p className="text-base text-black/40 text-center font-normal">
                  Total Payment
                </p>
                <h4 className="text-3xl font-semibold text-center">
                  SAR {payableAmountDetails.grandTotal.toFixed(2)}
                </h4>
              </div>

              <div>
                <h2 className="text-base text-darkgrey font-semibold">
                  {" "}
                  {<FormattedMessage id="Order_Details" />}
                </h2>
                <ul className="flex flex-wrap -mx-2 gap-y-4 mt-4">
                  <li className="w-1/2 px-2">
                    <div className="space-y-1 border-[1px] border-black/10 rounded-lg p-3">
                      <span className="text-sm text-secodarycolor font-medium w-full  flex justify-between">
                        {<FormattedMessage id="Order_date" />}{" "}
                      </span>
                      <span className="text-sm text-secodarycolor/60 font-normal w-full">
                        {orderDetail.payment_details?.created_at &&
                          moment(
                            orderDetail.payment_details?.created_at
                          ).format("DD-MM-YYYY")}
                      </span>
                    </div>
                  </li>
                  <li className="w-1/2 px-2">
                    <div className="space-y-1 border-[1px] border-black/10 rounded-lg p-3 ">
                      <span className="text-sm text-secodarycolor font-medium w-full  flex justify-between">
                        {<FormattedMessage id="Vat_Percentage" />}
                      </span>
                      <span className="text-sm text-secodarycolor/60 font-normal w-full">
                        {payableAmountDetails.vatPercent} %
                      </span>
                    </div>
                  </li>
                  <li className="w-1/2 px-2">
                    <div className="space-y-1 border-[1px] border-black/10 rounded-lg p-3 ">
                      <span className="text-sm text-secodarycolor font-medium w-full  flex justify-between">
                        {<FormattedMessage id="Order" />}
                      </span>
                      <span className="text-sm text-secodarycolor/60 font-normal w-full ">
                        # {orderDetail.payment_details?.order_id.slice(0, 8)}
                      </span>
                    </div>
                  </li>
                  <li className=" w-1/2 px-2">
                    <div className="space-y-1 border-[1px] border-black/10 rounded-lg p-3">
                      <span className="text-sm text-secodarycolor font-medium w-full  flex justify-between">
                        {<FormattedMessage id="Payment_method" />}{" "}
                      </span>
                      <span className="text-sm text-secodarycolor/60 font-normal w-full ">
                        {orderDetail.payment_details?.payment_method_type}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex  mt-5 border-t-[1px] border-dashed border-black/10 pt-5 flex-wrap justify-center">
                <Button
                  type="button"
                  text={<FormattedMessage id="Go to Confirmation" />}
                  onClick={() => setTab(3)}
                  className="uppercase px-4 py-3 text-sm font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
                ></Button>
              </div>
            </div>
          ) : (
            <>
              {orderDetail?.payment_details?.payment_mode !==
              "BANK_TRANSFER" ? (
                <>
                  {(orderDetail.payment_details !== null ||
                    orderDetail.payment_status === "FAILED") && (
                    <h1 className="text-primaryRed font-semibold text-center font-poppins text-xl mt-16">
                      {orderDetail?.payment_details?.payment_message}
                    </h1>
                  )}

                  <div className="flex flex-wrap mt-8">
                    <div className="w-full">
                      <div>
                        <h4 className="text-xl md:text-2xl font-medium text-black text-center">
                          {<FormattedMessage id="Order_Summary" />}
                        </h4>
                        <div className="border  border-black/10 rounded-2xl p-5 mt-4 ">
                          <div className="flex flex-wrap bg-primarycolor/10 ">
                            <div className="w-1/4 p-3 md:px-4 md:py-4  bg-primarycolor/10 text-primarycolor">
                              <p className="font-medium text-xs md:text-sm">
                                {<FormattedMessage id="Product_Title" />}
                              </p>
                            </div>
                            <div className="w-1/4 p-3 md:px-4 md:py-4  bg-primarycolor/10 text-primarycolor">
                              <p className="font-medium text-xs md:text-sm">
                                {<FormattedMessage id="Price" />}
                              </p>
                            </div>
                            <div className="w-1/4 p-3 md:px-4 md:py-4  bg-primarycolor/10 text-primarycolor">
                              <p className="font-medium text-xs md:text-sm">
                                {<FormattedMessage id="Quantity" />}
                              </p>
                            </div>
                            <div className="w-1/4 p-3 md:px-4 md:py-4  bg-primarycolor/10 text-primarycolor">
                              <p className="font-medium text-xs md:text-sm">
                                {<FormattedMessage id="Total" />}
                              </p>
                            </div>
                          </div>

                          <>
                            {orderPrdData &&
                            Array.isArray(orderPrdData) &&
                            orderPrdData?.length > 0
                              ? orderPrdData?.map(
                                  (item: PurchaseReqOrdType) => {
                                    const isOtherBrandProduct =
                                      item.supplierProductQuotes
                                        .other_brand_product_uuid;

                                    const image = isOtherBrandProduct
                                      ? item.supplierProductQuotes
                                          .otherBrandProduct.featured_image
                                      : item.supplierProductQuotes
                                          .ProductPurchaseRequests.products
                                          .featured_image;
                                    return (
                                      <>
                                        <div className="flex flex-wrap mt-5 bg-white text-xs md:text-sm shadow-primary-shadows rounded-lg text-darkgrey/75 rtl:text-right ">
                                          <div className="w-1/4 p-3 md:px-4 md:py-4">
                                            <div className="flex items-center gap-3 ">
                                              <img
                                                src={`${REACT_APP_IMAGE_PATH}${image}`}
                                                alt={`${item.supplierProductQuotes.ProductPurchaseRequests.products.name_en}`}
                                                className="w-10 h-10"
                                              />
                                              <span className="">
                                                <p className="font-semibold">
                                                  {isOtherBrandProduct
                                                    ? item.supplierProductQuotes
                                                        .otherBrandProduct[
                                                        `name_${language}`
                                                      ]
                                                    : item.supplierProductQuotes
                                                        .ProductPurchaseRequests
                                                        .products[
                                                        `name_${language}`
                                                      ]}
                                                </p>
                                              </span>
                                            </div>
                                          </div>
                                          <div className="w-1/4 p-3 md:px-4 md:py-4">
                                            <p className="font-semibold">
                                              SAR{" "}
                                              {Number(item?.price).toFixed(2)}{" "}
                                            </p>
                                          </div>
                                          <div className="w-1/4 p-3 md:px-4 md:py-4">
                                            <p className="font-semibold">
                                              {item?.quantity}
                                            </p>
                                          </div>
                                          <div className="w-1/4 p-3 md:px-4 md:py-4">
                                            <p className="font-semibold">
                                              {(
                                                Number(item?.price) *
                                                Number(item?.quantity)
                                              ).toFixed(2)}
                                            </p>
                                          </div>
                                        </div>
                                      </>
                                    );
                                  }
                                )
                              : null}
                          </>

                          <div className="mt-5 md:mt-8 border-t border-black/10 ">
                            <div className="my-4 md:my-5 px-4 mb-0">
                              <div className="flex justify-end rtl:justify-start">
                                <div className="md:min-w-150px px-2">
                                  <p className="text-sm font-semibold leading-7 flex justify-between text-primarycolor">
                                    {<FormattedMessage id="Subtotal" />}{" "}
                                    <span className="ml-1">:</span>
                                  </p>
                                </div>
                                <div className="px-2 md:min-w-150px">
                                  <p className="text-black/75 text-sm leading-7">
                                    SAR{" "}
                                    {payableAmountDetails.subtotal.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-end rtl:justify-start">
                                <div className="md:min-w-150px px-2">
                                  <p className="text-sm font-semibold leading-7 flex justify-between text-primarycolor">
                                    {<FormattedMessage id="Charges" />}{" "}
                                    <span className="ml-1 px-1">:</span>
                                  </p>
                                </div>
                                <div className="px-2 md:min-w-150px">
                                  <p className="text-black/75 text-sm leading-7">
                                    SAR{" "}
                                    {payableAmountDetails.charges.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-end rtl:justify-start">
                                <div className="md:min-w-150px px-2">
                                  <p className="text-sm font-semibold leading-7 flex justify-between text-primarycolor">
                                    {<FormattedMessage id="Vat_Tax" />}
                                    <span className="ml-1">:</span>
                                  </p>
                                </div>
                                <div className="px-2 md:min-w-150px">
                                  <p className="text-black/75 text-sm leading-7">
                                    {payableAmountDetails.vatPercent} %
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-end rtl:justify-start">
                                <div className="md:min-w-150px px-2">
                                  <p className="text-sm font-semibold leading-7 flex justify-between text-primarycolor">
                                    {<FormattedMessage id="Total" />}
                                    <span className="ml-1">:</span>
                                  </p>
                                </div>
                                <div className="px-2 md:min-w-150px">
                                  <p className="text-black/75 text-sm leading-7">
                                    SAR{" "}
                                    {payableAmountDetails.grandTotal.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-7  flex justify-between flex-wrap items-center space-y-4 rtl:space-y-0 md:space-y-0">
                    <p
                      className="text-primarycolor font-medium cursor-pointer"
                      onClick={() => setTab(1)}
                    >
                      {<FormattedMessage id="Return_To_Shop" />}
                    </p>

                    <div className="flex md:space-x-4 rtl:space-x-reverse flex-wrap space-y-4 md:space-y-0 rtl:space-y-0 rtl:space-x-4">
                      <Button
                        type="button"
                        onClick={() => setShowModal(true)}
                        disable={buttonLoader || saveCardButtonLoader}
                        className="py-3 px-6  text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                      >
                        <span>
                          {<FormattedMessage id="Direct_Bank_Transfer" />}
                        </span>
                      </Button>
                      <Button
                        type="button"
                        loader={buttonLoader || saveCardButtonLoader}
                        disable={buttonLoader || saveCardButtonLoader}
                        onClick={() => setCardConfimation(true)}
                        className="py-3 px-6  text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                      >
                        <span>{<FormattedMessage id="Card_payment" />}</span>
                      </Button>
                    </div>
                  </div>
                  {cardConfimation && (
                    <CardConfimationModal
                      setCardConfimation={setCardConfimation}
                      cardConfimation={cardConfimation}
                      handlePaymentMent={handlePayment}
                      buttonLoader={buttonLoader}
                      saveCardButtonLoader={saveCardButtonLoader}
                    ></CardConfimationModal>
                  )}
                  <BankTransfer
                    purchaseReqId={purchaseReqId}
                    orderData={orderPrdData}
                    payableAmount={payableAmountDetails.grandTotal}
                    finalAmount={payableAmountDetails.subtotal}
                    vatAmount={payableAmountDetails.vatPercent}
                    setShowModal={setShowModal}
                    showModal={showModal}
                    supplier_info_uuid={supplier_info_uuid}
                    buyNow={buyNow}
                    shipping_charges={payableAmountDetails.charges}
                    downloadQuotation={true}
                  />
                </>
              ) : (
                <>
                  {" "}
                  <div className="max-w-xl mx-auto border-[1px] border-dashed border-black/10 rounded-lg mt-8 p-6">
                    <div className="relative space-y-3 py-2 pb-6 border-b-[1px] border-dashed border-black/10">
                      <div
                        className={`w-20 h-20 bg-white shadow-order-place rounded-full flex items-center justify-center  mx-auto mb-4`}
                      >
                        <i className="w-12 h-12 rounded-full bg-secondaryOrange flex items-center justify-center mx-auto icon-payment-pending text-24px text-white"></i>
                      </div>
                      <h1 className="text-secondaryOrange font-semibold text-center font-poppins text-xl">
                        Your Approval is in Pending
                      </h1>
                    </div>
                    <div className="relative space-y-3 py-5 pb-6 ">
                      <p className="text-base text-black/40 text-center font-normal">
                        Total Payment
                      </p>
                      <h4 className="text-3xl font-semibold text-center">
                        SAR {payableAmountDetails.grandTotal}
                      </h4>
                    </div>

                    <div>
                      <h2 className="text-base text-darkgrey font-semibold">
                        {" "}
                        {<FormattedMessage id="Order_Details" />}
                      </h2>
                      <ul className="flex flex-wrap -mx-2 gap-y-4 mt-4">
                        <li className="w-1/2 px-2">
                          <div className="space-y-1 border-[1px] border-black/10 rounded-lg p-3">
                            <span className="text-sm text-secodarycolor font-medium w-full  flex justify-between">
                              {<FormattedMessage id="Order_date" />}{" "}
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full">
                              {orderDetail?.payment_details?.created_at &&
                                moment(
                                  orderDetail?.payment_details?.created_at
                                ).format("DD-MM-YYYY")}
                            </span>
                          </div>
                        </li>
                        <li className="w-1/2 px-2">
                          <div className="space-y-1 border-[1px] border-black/10 rounded-lg p-3 ">
                            <span className="text-sm text-secodarycolor font-medium w-full  flex justify-between">
                              {<FormattedMessage id="Vat_Percentage" />}
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full">
                              {payableAmountDetails.vatPercent} %
                            </span>
                          </div>
                        </li>
                        <li className="w-1/2 px-2">
                          <div className="space-y-1 border-[1px] border-black/10 rounded-lg p-3 ">
                            <span className="text-sm text-secodarycolor font-medium w-full  flex justify-between">
                              {<FormattedMessage id="Order" />}
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full ">
                              #{" "}
                              {orderDetail.payment_details?.order_id.slice(
                                0,
                                8
                              )}
                            </span>
                          </div>
                        </li>
                        <li className=" w-1/2 px-2">
                          <div className="space-y-1 border-[1px] border-black/10 rounded-lg p-3">
                            <span className="text-sm text-secodarycolor font-medium w-full  flex justify-between">
                              {<FormattedMessage id="Payment_method" />}{" "}
                            </span>
                            <span className="text-sm text-secodarycolor/60 font-normal w-full ">
                              {orderDetail.payment_details?.payment_method_type}
                              <FormattedMessage id="Bank_Transfer" />
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="flex  mt-5 border-t-[1px] border-dashed border-black/10 pt-5 flex-wrap justify-center">
                      <Link to={`/bank-transfer-order`}>
                        <Button
                          type="button"
                          text={<FormattedMessage id="go_to_bank_transfer" />}
                          className="uppercase px-4 py-3 text-sm font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
                        ></Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Payment;
