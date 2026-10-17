import { useEffect, useState } from "react";
import Payment from "./components/Payment";
import SelectedProduct from "./components/SelectedProduct";
import ShippingInfo from "./components/ShippingInfo";
import Confirmation from "./components/Confirmation";
import { DisableTabType, PaymentInfo, orderDetail } from "./types/checkout.types";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router-dom";
import { checkPaymentStatus, getOrderData } from "./services/checkout.services";
import useUserData from "hooks/getUserData";
import Loading from "components/globalLoader/Loading";
const CheckOut = () => {
  const { user_entity_uuid } = useUserData();
  const { mergeId } = useParams();
  const delimiter = "|";
  const [tab, setTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disableTab, setDisableTab] = useState({
    selectedProductsFlag: 0,
    shippingFlag: 0,
    paymentFlag: 0,
    confirmationFlag: 0,
  });
  const [orderDetail, setOrderDetial] = useState<orderDetail>({
    mode: "",
    payment_status: "PENDING",
    order_uuid: "",
    address_uuid: null,
    orderProductDetails: undefined,
    order_status: "PENDING",
    payment_details: undefined,
  });

  const [chargeId, setChargeId] = useState<string>();
  const url = new URL(window?.location.href);
  const tapId = url.searchParams.get("tap_id");
  useEffect(() => {
    if (tapId) {
      setDisableTab((params: DisableTabType) => {
        return {
          ...params,
          shippingFlag: 1,
          confirmationFlag: 1,
          paymentFlag: 1,
        };
      });
      setTab(3);
    }
  }, [tapId]);

  const getOrderStatus = async () => {
    try {
      const [encodedId1, encodedId2, encodedId3] = mergeId?.split(
        delimiter
      ) as [string, string, string];
      const purchaseReqId = atob(encodedId1);
      const supplier_info_uuid = atob(encodedId2);
      const supplierProdId = encodedId3 && atob(encodedId3);
      setIsLoading(true);
      const orderProductDetails = await getOrderData(
        purchaseReqId as string,
        user_entity_uuid,
        supplier_info_uuid,
        supplierProdId
      );
      if (supplierProdId !== undefined) {
        const paymentStatus = await checkPaymentStatus({
          purchaseReqId,
          orderId: orderProductDetails?.data?.data?.[0]?.order_id,
          tapId: tapId,
        });
        
        setOrderDetial(() => {
          return {
            mode: paymentStatus?.data?.data?.payment_mode,
            payment_status: paymentStatus?.data?.data?.payment_status,
            order_uuid: orderProductDetails?.data?.data?.[0]?.order_id,
            address_uuid: orderProductDetails?.data?.data?.[0].address_uuid,
            orderProductDetails: orderProductDetails?.data?.data,
            order_status: orderProductDetails?.data?.data?.[0]?.order_status,
            payment_details: {
              ...paymentStatus?.data?.data as PaymentInfo
            }
          };
        });
        setIsLoading(false);
      } else {
        const paymentStatus = await checkPaymentStatus({
          purchaseReqId,
          orderId: orderProductDetails?.data?.data?.data?.[0]?.order_id,
          tapId: tapId,
        });

        setOrderDetial(() => {
          return {
            mode: paymentStatus?.data?.data?.payment_mode,
            payment_status: paymentStatus?.data?.data?.payment_status,
            order_uuid: orderProductDetails?.data?.data?.data?.[0]?.order_id,
            address_uuid: orderProductDetails?.data?.data?.address_uuid,
            orderProductDetails: orderProductDetails?.data?.data?.data,
            order_status: orderProductDetails?.data?.data?.order_status,
            payment_details: {
              ...paymentStatus?.data?.data
            }
          };
        });
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      return error;
    }
  };
  useEffect(() => {
    getOrderStatus();
  }, [tapId]);

  const renderTabWiseComponent = () => {
    switch (tab) {
      case 0:
        return (
          <SelectedProduct
            setTab={setTab}
            setDisableTab={setDisableTab}
            disableTab={disableTab}
            orderDetail={orderDetail}
          />
        );
      case 1:
        return (
          <ShippingInfo
            setTab={setTab}
            setDisableTab={setDisableTab}
            disableTab={disableTab}
            orderDetail={orderDetail}
          />
        );
      case 2:
        return (
          <Payment
            setTab={setTab}
            setDisableTab={setDisableTab}
            setChargeId={setChargeId}
            orderDetail={orderDetail}
            setOrderDetial={setOrderDetial}
          />
        );
      case 3:
        return (
          <Confirmation
            setTab={setTab}
            setDisableTab={setDisableTab}
            chargeId={chargeId}
            orderDetail={orderDetail}
          />
        );
      default:
        return (
          <SelectedProduct
            setTab={setTab}
            setDisableTab={setDisableTab}
            orderDetail={orderDetail}
          />
        );
    }
  };
  return (
    <>
      <div className="shadow-primary-shadow bg-white p-5 xl:p-8 rounded-14px min-h-600px">
        <div className="flex items-center flex-wrap max-w-7xl mx-auto gap-y-4">
          <div className="w-full md:w-1/2 lg:w-1/4 px-2 xl:px-3">
            <div
              className={`flex items-center gap-3 xl:gap-4 ${"bg-primarycolor"} border border-black/10 rounded-xl p-3 xl:p-5 cursor-pointer group/hs hover:bg-primarycolor hover:border-primarycolor `}
              onClick={() => setTab(0)}
            >
              <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-white/10 flex items-center justify-center group-hover/hs:bg-white/10">
                <i className="icon-product text-2xl md:text-3xl text-white group-hover/hs:text-white"></i>
              </div>
              <div className="flex-1 w-auto">
                <h4 className="text-base xl:text-lg text-white font-medium group-hover/hs:text-white">
                  {<FormattedMessage id="Selected_Product" />}
                </h4>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 px-2 xl:px-3">
            <div
              className={`flex items-center gap-3 xl:gap-4 ${
                tab !== 0 ? "bg-primarycolor" : "bg-white"
              } border border-black/10 rounded-xl p-3 xl:p-5 cursor-pointer group/hs ${
                disableTab.shippingFlag === 0
                  ? "pointer-events-none"
                  : "cursor-pointer"
              } hover:bg-primarycolor hover:border-primarycolor`}
              onClick={() => setTab(1)}
            >
              <div
                className={`w-14 h-14 xl:w-16 xl:h-16 rounded-full  ${
                  tab !== 0 ? "bg-white/10" : "bg-primarycolor/10"
                }  flex items-center justify-center group-hover/hs:bg-white/10`}
              >
                <i
                  className={`icon-truck text-2xl md:text-3xl ${
                    tab !== 0 ? "text-white" : "text-primarycolor"
                  }  group-hover/hs:text-white`}
                ></i>
              </div>
              <div className="flex-1 w-auto">
                <h4
                  className={`text-base xl:text-lg  ${
                    tab !== 0 ? "text-white" : "text-secodarycolor"
                  } font-medium group-hover/hs:text-white`}
                >
                  {<FormattedMessage id="Shipping_Info" />}
                </h4>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 px-2 xl:px-3">
            <div
              className={`flex items-center gap-3 xl:gap-4 ${
                tab === 2 || tab === 3 ? "bg-primarycolor" : "bg-white"
              } border border-black/10 rounded-xl p-3 xl:p-5 cursor-pointer group/hs hover:bg-primarycolor
               hover:border-primarycolor ${
                 disableTab.paymentFlag === 0
                   ? "pointer-events-none"
                   : "cursor-pointer"
               }`}
              onClick={() => setTab(2)}
            >
              <div
                className={`w-14 h-14 xl:w-16 xl:h-16 rounded-full  ${
                  tab === 2 || tab === 3 ? "bg-white/10" : "bg-primarycolor/10"
                }  flex items-center justify-center group-hover/hs:bg-white/10`}
              >
                <i
                  className={`icon-pay text-2xl md:text-3xl ${
                    tab === 2 || tab === 3 ? "text-white" : "text-primarycolor"
                  }  group-hover/hs:text-white`}
                ></i>
              </div>
              <div className="flex-1 w-auto">
                <h4
                  className={`text-base xl:text-lg  ${
                    tab === 2 || tab === 3 ? "text-white" : "text-secodarycolor"
                  } font-medium group-hover/hs:text-white`}
                >
                  {<FormattedMessage id="Payment" />}
                </h4>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 px-2 xl:px-3">
            <div
              className={`flex items-center gap-3 xl:gap-4 ${
                tab === 3 ? "bg-primarycolor" : "bg-white"
              } border border-black/10 rounded-xl p-3 xl:p-5  group/hs hover:bg-primarycolor
               hover:border-primarycolor ${
                 disableTab.confirmationFlag !== 0
                   ? "pointer-events-none"
                   : "cursor-pointer"
               }`}
              onClick={() => setTab(3)}
            >
              <div
                className={`w-14 h-14 xl:w-16 xl:h-16 rounded-full  ${
                  tab === 3 ? "bg-white/10" : "bg-primarycolor/10"
                }  flex items-center justify-center group-hover/hs:bg-white/10`}
              >
                <i
                  className={`icon-booking text-2xl md:text-3xl ${
                    tab === 3 ? "text-white" : "text-primarycolor"
                  }  group-hover/hs:text-white`}
                ></i>
              </div>
              <div className="flex-1 w-auto">
                <h4
                  className={`text-base xl:text-lg  ${
                    tab === 3 ? "text-white" : "text-secodarycolor"
                  } font-medium group-hover/hs:text-white`}
                >
                  {<FormattedMessage id="Confirmation" />}
                </h4>
              </div>
            </div>
          </div>
        </div>
        {isLoading ? (
          <>
            <Loading />
          </>
        ) : (
          renderTabWiseComponent()
        )}
      </div>
    </>
  );
};

export default CheckOut;
