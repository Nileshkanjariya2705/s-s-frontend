import { Button } from "components/button/Button";

import { REACT_APP_IMAGE_PATH } from "config";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getLatestCharge,
  updateOrderQuantity,
} from "../services/checkout.services";
import {
  DisableTabType,
  PayableAmountType,
  PurchaseReqOrdType,
  SelectedProductProps,
} from "../types/checkout.types";
import Loading from "components/globalLoader/Loading";
import { FormattedMessage } from "react-intl";
import useLocale from "hooks/useLocale";
const SelectedProduct: React.FC<SelectedProductProps> = ({
  setTab,
  setDisableTab,
  orderDetail,
}) => {
  const { language } = useLocale();
  const [orderPrdData, setOrderPrdData] = useState<PurchaseReqOrdType[]>([]);
  const [totalValues, setTotalValues] = useState<number[]>([]);
  const [loader, setLoader] = useState(true);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [payableAmountDetails, setPayableAmountDetails] =
    useState<PayableAmountType>({
      subtotal: 0,
      charges: 0,
      vatPercent: 0,
      grandTotal: 0,
    });
  useEffect(() => {
    const initialTotalValues =
      orderPrdData &&
      orderPrdData?.length > 0 &&
      Array.isArray(orderPrdData) &&
      orderPrdData.map(
        (item: PurchaseReqOrdType) =>
          parseFloat(item.quantity) * parseFloat(Number(item.price).toFixed(2))
      );
    setTotalValues(initialTotalValues as []);
  }, [orderPrdData]);

  const getPurchaseReOrderData = async () => {
    setLoader(true);
    const orderProductDetails = orderDetail?.orderProductDetails;
    if (orderProductDetails?.length > 0) {
      setOrderPrdData(orderProductDetails);
      //for this order get me VAT & order details
      const OrderDetails = await getLatestCharge(orderDetail.order_uuid);
      const vatPercent = OrderDetails?.data?.data?.vat_percentage;
      const AmountWithoutTax = orderProductDetails?.[0]?.supplierProductQuotes
        ?.SupplierQuotes?.charges_and_total
        ? orderProductDetails?.[0]?.supplierProductQuotes?.SupplierQuotes
            ?.charges_and_total
        : orderProductDetails?.[0]?.price * orderProductDetails?.[0]?.quantity +
          orderProductDetails?.[0]?.supplierProductQuotes?.SupplierQuotes
            ?.charges;
      const charges = orderProductDetails?.[0]?.supplierProductQuotes
        ?.SupplierQuotes?.charges
        ? orderProductDetails?.[0]?.supplierProductQuotes?.SupplierQuotes
            ?.charges
        : 0;
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
  };

  useEffect(() => {
    getPurchaseReOrderData();
  }, [orderDetail?.orderProductDetails]);

  const handleContinueShipping = async () => {
    try {
      setButtonLoader(true);
      const response = await updateOrderQuantity(orderPrdData);
      if (response) {
        setButtonLoader(false);
        setDisableTab((params: DisableTabType) => {
          return {
            ...params,
            shippingFlag: 1,
          };
        });
        setTab(1);
      }
    } catch (error) {
      return error;
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
          <div>
            <div className="border border-black/10 rounded-2xl md:p-30px mt-8">
              <>
                <div className="relative overflow-x-auto px-4 md:-mx-4">
                  <table className="w-full text-left border-spacing-y-6 border-separate  ">
                    <thead className="text-sm  text-gray-600">
                      <tr className="">
                        <th
                          scope="col"
                          className="px-5 py-4 font-semibold bg-primarycolor/10 text-primarycolor"
                        >
                          <p className=" whitespace-nowrap rtl:text-right">
                            {<FormattedMessage id="Product_Title" />}
                          </p>
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-4 font-semibold bg-primarycolor/10 text-primarycolor"
                        >
                          <p className="whitespace-nowrap rtl:text-right">
                            {<FormattedMessage id="Price" />}
                          </p>
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-4 font-semibold bg-primarycolor/10 text-primarycolor"
                        >
                          <p className="whitespace-nowrap rtl:text-right">
                            {<FormattedMessage id="Quantity" />}
                          </p>
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-4 font-semibold bg-primarycolor/10 text-primarycolor"
                        >
                          <p className="whitespace-nowrap rtl:text-right">
                            {<FormattedMessage id="Total" />}
                          </p>
                        </th>
                      </tr>
                    </thead>
                    {orderPrdData &&
                      orderPrdData.length > 0 &&
                      Array.isArray(orderPrdData) &&
                      orderPrdData.map(
                        (productDetail: PurchaseReqOrdType, index: number) => {
                          const isOtherBrandProduct =
                            productDetail.supplierProductQuotes
                              .other_brand_product_uuid;

                          const image = isOtherBrandProduct
                            ? productDetail.supplierProductQuotes
                                .otherBrandProduct.featured_image
                            : productDetail.supplierProductQuotes
                                .ProductPurchaseRequests.products
                                .featured_image;
                          return (
                            <>
                              <tbody>
                                <tr className="bg-white text-sm shadow-primary-shadows rounded-lg text-darkgrey/75 rtl:text-right  ">
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={`${REACT_APP_IMAGE_PATH}${image}`}
                                        alt={`${productDetail.supplierProductQuotes.ProductPurchaseRequests.products.name_en}`}
                                        className="w-10 h-10"
                                      />
                                      <span className="">
                                        {isOtherBrandProduct
                                          ? productDetail.supplierProductQuotes
                                              .otherBrandProduct[
                                              `name_${language}`
                                            ]
                                          : productDetail?.supplierProductQuotes
                                              .ProductPurchaseRequests.products[
                                              `name_${language}`
                                            ]}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <p className="whitespace-nowrap rtl:text-right">
                                      SAR{" "}
                                      {Number(productDetail?.price).toFixed(2)}{" "}
                                    </p>
                                  </td>
                                  <td className="px-4 py-4">
                                    <p className="whitespace-nowrap rtl:text-right">
                                      {productDetail?.quantity}
                                    </p>
                                  </td>
                                  <td className="px-4 py-4">
                                    <p className="whitespace-nowrap rtl:text-right">
                                      {" "}
                                      SAR {totalValues[index].toFixed(2)}
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </>
                          );
                        }
                      )}
                  </table>
                </div>
              </>
              <div className="mt-4 border-t border-black/10 ">
                <div className=" my-5 px-4 mb-0">
                  <div className="flex justify-end rtl:justify-start">
                    <div className="md:min-w-150px px-2">
                      <p className="text-sm font-semibold leading-7 flex justify-between text-primarycolor">
                        {<FormattedMessage id="Subtotal" />}{" "}
                        <span className="ml-1 px-1">:</span>
                      </p>
                    </div>
                    <div className="px-2 md:min-w-150px">
                      <p className="text-black/75 text-sm leading-7">
                        SAR {payableAmountDetails.subtotal.toFixed(2)}
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
                        SAR {payableAmountDetails.charges.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end rtl:justify-start">
                    <div className="md:min-w-150px px-2">
                      <p className="text-sm font-semibold leading-7 flex justify-between text-primarycolor">
                        {<FormattedMessage id="Vat_Tax" />}
                        <span className="ml-1 px-1">:</span>
                      </p>
                    </div>
                    <div className="px-2 md:min-w-150px">
                      <p className="text-black/75 text-sm leading-7 ">
                        {payableAmountDetails.vatPercent} %
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end rtl:justify-start">
                    <div className="md:min-w-150px px-2">
                      <p className="text-sm font-semibold leading-7 flex justify-between text-primarycolor">
                        {<FormattedMessage id="Grand_Total" />}
                        <span className="ml-1 px-1">:</span>
                      </p>
                    </div>
                    <div className="px-2 md:min-w-150px">
                      <p className="text-black/75 text-sm leading-7 font-semibold">
                        SAR {payableAmountDetails.grandTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-7  flex justify-between flex-wrap items-center space-y-4 rtl:space-y-0 md:space-y-0">
              <Link
                className="text-primarycolor font-medium cursor-pointer"
                to={`/purchase-request`}
              >
                {<FormattedMessage id="Return_To_Shop" />}
              </Link>
              {orderDetail.order_status === "PENDING" && (
                <Button
                  type="button"
                  disable={orderPrdData?.length === 0}
                  onClick={handleContinueShipping}
                  loader={buttonLoader}
                  className="py-3 px-6  text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                >
                  <span>{<FormattedMessage id="Continue_To_Shipping" />}</span>
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SelectedProduct;
