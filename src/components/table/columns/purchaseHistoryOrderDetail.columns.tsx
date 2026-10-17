import { ColumnProps } from "components/table/types";
import { REACT_APP_IMAGE_PATH } from "config";
import { SupplierProductQuote } from "pages/store/purchaseHistory/types/purchaseHistory.type";

export const purchaseHistoryOrderDetail: (lang: string) => ColumnProps[] = (
  lang: string
) => {
  return [
    {
      title: "Product_Image",
      dataIndex: "image",
      id: 1,
      willBeSorted: false,
      render: ({
        supplierProductQuotes,
      }: {
        supplierProductQuotes: SupplierProductQuote;
      }) => (
        <>
          <p className="flex items-start leading-5 gap-1">
            <div className="text-base w-10 h-10 overflow-hidden rounded-lg">
              <img
                src={`${REACT_APP_IMAGE_PATH}/${
                  supplierProductQuotes?.other_brand_product_uuid
                    ? supplierProductQuotes?.otherBrandProduct?.featured_image
                    : supplierProductQuotes?.ProductPurchaseRequests?.products
                        ?.featured_image
                }`}
                alt="product image"
                className="w-full h-full object-cover"
              />
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
        supplierProductQuotes,
      }: {
        supplierProductQuotes: SupplierProductQuote;
      }) => (
        <p className="flex items-start leading-5 gap-1">
          <div className="text-base">
            {supplierProductQuotes &&
            supplierProductQuotes?.other_brand_product_uuid
              ? supplierProductQuotes?.otherBrandProduct[`name_${lang}`]
              : supplierProductQuotes?.ProductPurchaseRequests?.products?.[
                  `name_${lang as "en" | "ar" | "ur"}`
                ]}
          </div>
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
  ];
};
