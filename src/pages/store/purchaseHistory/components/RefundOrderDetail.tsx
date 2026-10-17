import { Table } from "components/table/Table";
import { ApiParamsType } from "components/table/types";
import { perPage, responseType, statusStyles } from "constant/common.constant";
import useUserData from "hooks/getUserData";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "store";
import { getRefundOrderDetails } from "../services/purchaseHistory.service";
import {
  RefundProduct,
  RefundProductResponseType,
  SupplierResponseType,
  refundDetailsType,
} from "../types/purchaseHistory.type";
import Loading from "components/globalLoader/Loading";
import { OrderRefundDetails } from "components/table/columns/orderRefundDetails.columns";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RefundOrderPdfView from "./RefundOrderPdfView";
import { Button } from "components/button/Button";

const RefundOrderDetail = () => {
  const navigate = useNavigate();
  const { user_entity_uuid } = useUserData();
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [refundDetails, setRefundDetails] = useState<refundDetailsType>();
  const payment_uuid: string = params.orderId as string;
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
  });
  const { langauge } = useSelector((state: RootState) => ({
    langauge: state.language.language,
  }));
  const columns = OrderRefundDetails(langauge as string);

  const getRefundDetails = async () => {
    try {
      setLoading(true);
      const RefundOrderResponse = await getRefundOrderDetails({
        payment_uuid,
        user_entity_uuid,
        apiParams,
      });
      if (RefundOrderResponse.data.responseType === responseType.Success) {
        const mergedData: RefundProduct[] =
          RefundOrderResponse?.data?.data.refundProducts.map(
            (refund: RefundProductResponseType) => ({
              ...refund,
              refundOrderDetail:
                RefundOrderResponse?.data?.data.refundOrderDetail,
              supplierResponse:
                RefundOrderResponse?.data?.data.supplierResponse.filter(
                  (response: SupplierResponseType) =>
                    response.product_uuid ===
                    refund?.supplierProductQuotes?.ProductPurchaseRequests
                      ?.product_uuid
                      ? refund?.supplierProductQuotes?.ProductPurchaseRequests
                          ?.product_uuid
                      : refund.product?.uuid
                ),
            })
          );

        setRefundDetails({
          RefundProductDetails: mergedData,
          RefundOrderDetails: RefundOrderResponse?.data?.data.refundOrderDetail,
          OrderDetails: RefundOrderResponse?.data?.data.orderDetails,
          src: RefundOrderResponse?.data?.data.Qr_Code,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  useEffect(() => {
    getRefundDetails();
  }, [payment_uuid]);

  return (
    <div className="w-full border border-black/10 rounded-xl p-5 ">
      <div className="flex items-center justify-between mt-4">
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
            <i
              className="icon-left_arrow text-24px text-primarycolor hover:cursor-pointer"
              onClick={() => navigate("/refund-orders")}
            ></i>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-black flex gap-4">
            <p>{<FormattedMessage id="Refund_order_detail" />}</p>
          </h2>
        </div>
      </div>
      {loading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <>
          {refundDetails?.OrderDetails && refundDetails.RefundOrderDetails? (
            <>
              <div className="mt-6 border px-8 py-8 rounded-xl">
                <h3 className="font-semibold text-lg mb-2">
                  {<FormattedMessage id="Refund_Order_Summary" />}
                </h3>
                <div className="flex flex-wrap mt-4 mb-3 -mx-4">
                  <div className="relative w-full md:w-1/2  px-4 border-b-2 md:border-b-0 pb-5 md:pb-0 md:border-r-2 md:rtl:border-l-2 md:rtl:border-r-0 border-black/10 ">
                    <ul className="space-y-2 lg:space-y-4 w-full md:w-11/12">
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                          {<FormattedMessage id="Order_Id" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                          <span className="text-primarycolor font-semibold">
                            # {refundDetails.OrderDetails.uuid.slice(0, 8)}
                          </span>
                        </span>
                      </li>
                      {refundDetails.RefundOrderDetails?.uuid && (
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                          {<FormattedMessage id="Refund_Order_Id" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                          <span className="text-primarycolor font-semibold">
                            #{" "}
                            {refundDetails.RefundOrderDetails?.uuid.slice(0, 8)}
                          </span>
                        </span>
                      </li>
                      )}
                    </ul>
                  </div>
                  <div className="relative w-full md:w-1/2  px-4  ">
                    <ul className="space-y-2 lg:space-y-4 w-full md:w-11/12">
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/2  flex justify-between">
                          {<FormattedMessage id="Supplier_Refund_Status" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-1/2 lg:px-2 md:pr-5">
                          <span
                            className={
                              statusStyles[
                                refundDetails.OrderDetails
                                  .refund_accepted_supplier
                              ]
                            }
                          >
                            {
                              refundDetails.OrderDetails
                                .refund_accepted_supplier
                            }
                          </span>
                        </span>
                      </li>
                      <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                        <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/2  flex justify-between">
                          {<FormattedMessage id="Admin_Refund_Status" />}{" "}
                          <span className="hidden lg:inline-block">:</span>
                        </span>
                        <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-1/2 lg:px-2 md:pr-5">
                          <span
                            className={
                              statusStyles[
                                refundDetails.OrderDetails.refund_accepted_admin
                                  ? "PAID"
                                  : "PENDING"
                              ]
                            }
                          >
                            {refundDetails.OrderDetails.refund_accepted_admin
                              ? "PAID"
                              : "PENDING"}
                          </span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {refundDetails.RefundOrderDetails?.order_amount_left !== null &&
                refundDetails.OrderDetails.refund_accepted_admin && (
                  <div className="mt-6 border px-8 py-8 rounded-xl">
                    <div className="flex flex-wrap">
                      <h3 className="font-semibold text-lg mb-2">
                        Download Refund Invoice
                      </h3>
                      <div className="ml-2">
                        <PDFDownloadLink
                          document={
                            <>
                              <RefundOrderPdfView
                                refundOrderData={refundDetails}
                              />
                            </>
                          }
                          fileName={`${
                            refundDetails.OrderDetails.uuid &&
                            refundDetails.OrderDetails.uuid.slice(0, 8)
                          }-refund-invoice`}
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
                      </div>
                    </div>
                  </div>
                )}
            </>
          ) : (
            <>
              <div className="mt-5">
                <p className={statusStyles["IN_TRANSIT"]}>
                  This order is currently in-progress
                </p>
              </div>
            </>
          )}
          {refundDetails?.RefundProductDetails && (
            <Table
              apiParams={apiParams}
              setApiParams={setApiParams}
              columns={columns}
              data={refundDetails?.RefundProductDetails}
              header={<></>}
              search={false}
              pagination={false}
              additionalStyle={`border-black/10 rounded-14px p-0`}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RefundOrderDetail;
