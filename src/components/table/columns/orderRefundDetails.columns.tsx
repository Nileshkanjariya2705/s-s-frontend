/* eslint-disable jsx-a11y/img-redundant-alt */
import { ColumnProps } from "components/table/types";
import { REACT_APP_IMAGE_PATH } from "config";
import { ProductDataType } from "pages/admin/products/types/product.type";
import {
  SupplierProductQuotesDetails,
  SupplierResponseType,
} from "pages/store/purchaseHistory/types/purchaseHistory.type";
import { OrderStatus } from "constant/dropdown.constant";
import { statusStyles } from "constant/common.constant";
import useLocale from "hooks/useLocale";

export const OrderRefundDetails: (lang: string) => ColumnProps[] = (
  lang: string
) => {
  const { language } = useLocale()
  return [
    {
      title: "Product_Image",
      dataIndex: "image",
      id: 1,
      willBeSorted: false,
      render: ({
        product,
        supplierProductQuotes,
      }: {
        product: ProductDataType;
        supplierProductQuotes: SupplierProductQuotesDetails;
      }) => (
        <>
          <p className="flex items-start leading-5 gap-1">
            <div className="text-base w-10 h-10 overflow-hidden rounded-lg">
              {product ? (
                <>
                  <img
                    src={`${REACT_APP_IMAGE_PATH}/${product?.featured_image}`}
                    alt="product image"
                    className="w-full h-full object-cover"
                  />
                </>
              ) : (
                <>
                  <img
                    src={`${REACT_APP_IMAGE_PATH}/${
                      supplierProductQuotes?.other_brand_product_uuid
                        ? supplierProductQuotes?.otherBrandProduct
                            ?.featured_image
                        : supplierProductQuotes?.ProductPurchaseRequests
                            ?.products?.featured_image
                    }`}
                    alt="product image"
                    className="w-full h-full object-cover"
                  />
                </>
              )}
            </div>
          </p>
        </>
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      id: 1,
      willBeSorted: false,
      render: ({
        product,
        supplierProductQuotes,
      }: {
        product: ProductDataType;
        supplierProductQuotes: SupplierProductQuotesDetails;
      }) => (
        <p className="flex items-start leading-5 gap-1">
          {product ? (
            <>
              <div className="text-base">
                {product?.[`name_${lang as "en" | "ar" | "ur"}`]}
              </div>
            </>
          ) : (
            <>
              <div className="text-base">
                {supplierProductQuotes &&
                supplierProductQuotes?.other_brand_product_uuid
                  ? supplierProductQuotes?.otherBrandProduct?.[
                      `name_${lang as "en" | "ar" | "ur"}`
                    ]
                  : supplierProductQuotes?.ProductPurchaseRequests?.products?.[
                      `name_${lang as "en" | "ar" | "ur"}`
                    ]}
              </div>
            </>
          )}
        </p>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "created_at",
      id: 2,
      willBeSorted: false,
      render: ({ quantity }: { quantity: string }) => (
        <p className="flex items-start leading-5 gap-1">
          <span className="text-base"> {quantity}</span>
        </p>
      ),
    },
    {
      title: "Price",
      dataIndex: "name",
      id: 3,
      willBeSorted: false,
      render: ({ price }: { price: string }) => (
        <p className="flex items-start leading-5 gap-1">
          <span className="text-base">SAR</span>
          <span className="text-base"> {Number(price).toFixed(2)}</span>
        </p>
      ),
    },
    {
      title: "Reason",
      dataIndex: "refund_reason",
      id: 4,
      willBeSorted: false,
    },
    {
      title: "Product status",
      dataIndex: "name",
      id: 4,
      willBeSorted: false,
      render: ({
        supplierResponse,
      }: {
        supplierResponse: SupplierResponseType[];
      }) => {
        return (
          <>
            {supplierResponse.length > 0 ? (
              supplierResponse.map((response, index) => {
                const statusOptions = OrderStatus(language);
                const upperCaseStatus =
                response?.refund_product_status?.toLocaleUpperCase();
                const statusOption = statusOptions?.find(
                  (option) => option.value === upperCaseStatus
                );
                const className =
                  statusStyles[response?.refund_product_status as string] ||
                  "text-primaryRed bg-primaryRed/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center";

                return (
                  <p key={index} className={className}>
                    {response?.refund_product_status
                      ? statusOption?.label?.replace("_", " ")
                      : "In Progress"}
                  </p>
                );
              })
            ) : (
              <>
                <p className="text-primaryRed bg-primaryRed/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center ">
                  In Progress
                </p>
              </>
            )}
          </>
        );
      },
    },
    {
      title: "Notes",
      dataIndex: "name",
      id: 5,
      willBeSorted: false,
      render: ({
        supplierResponse,
      }: {
        supplierResponse: SupplierResponseType[];
      }) => {
        return (
          <>
            {supplierResponse.length > 0 ? (
              supplierResponse.map((response, index) => {
                return (
                  <>
                    {response?.reason ? (
                      <p
                        key={index}
                        className="flex items-start leading-5 gap-1"
                      >
                        <span className="font-s text-sm">
                          {" "}
                          <i>{response?.reason} </i>
                        </span>
                      </p>
                    ) : (
                      <>
                        <p>--</p>
                      </>
                    )}
                  </>
                );
              })
            ) : (
              <>
                <>
                  <p>--</p>
                </>
              </>
            )}
          </>
        );
      },
    },
  ];
};
