import useLocale from "hooks/useLocale";
import { supplierProductQuotesType } from "pages/store/purchaseRequest/types/purchaseRequest.types";
import { FormattedMessage } from "react-intl";
type targetDropdownState = {
  [supplier_info_uuid: string]: {
    isOpen: boolean;
    supplier_product_quotes: supplierProductQuotesType[];
  };
};
export const AdditionalRow = ({
  allSupplierDropdown,
  clickedSupplierId,
}: {
  allSupplierDropdown: targetDropdownState;
  clickedSupplierId: string;
}) => {
  const { language } = useLocale();
  const targetValues = allSupplierDropdown[clickedSupplierId];

  return (
    <>
      {targetValues.isOpen === true && (
        <div className="border border-black/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-tblgray/20 border-b border-black/10">
                <th className="py-4 px-6 text-black text-sm font-medium">
                  <p className="whitespace-nowrap rtl:text-right">
                    {<FormattedMessage id="Category" />}
                  </p>
                </th>
                <th className="py-4 px-6 text-black text-sm font-medium">
                  <p className="whitespace-nowrap rtl:text-right">
                    {<FormattedMessage id="Product_Name" />}
                  </p>
                </th>
                <th className="py-4 px-6 text-black text-sm font-medium">
                  <p className="whitespace-nowrap rtl:text-right">
                    {<FormattedMessage id="Offered_Quantity" />}
                  </p>
                </th>
                <th className="py-4 px-6 text-black text-sm font-medium">
                  <p className="whitespace-nowrap rtl:text-right">
                    {<FormattedMessage id="Offered_Price" />}
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {targetValues.supplier_product_quotes.map((data: any) => {
                const category =
                  data?.ProductPurchaseRequests?.products?.category;
                const measurements =
                data?.ProductPurchaseRequests?.products?.measurement;
                return (
                  <tr className="bg-white text-sm shadow-primary-shadows rounded-lg text-darkgrey/75 rtl:text-right ">
                    <td className="py-4 px-6">
                      <span>
                        {language === "en"
                          ? category?.name
                          : category?.[`name_${language}`]}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`${
                          data?.otherBrandProduct && "line-through"
                        }`}
                      >
                        {
                          data?.ProductPurchaseRequests?.products?.[
                            `name_${language}`
                          ]
                        }
                      </span>
                      {data?.otherBrandProduct && (
                        <p>
                          {data.otherBrandProduct?.[`name_${language}`]}
                          <span className="text-gray-400">
                            {<FormattedMessage id="Edited" />}
                          </span>
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p>
                        <span
                          className={`${
                            data.ProductPurchaseRequests.requested_quantity !==
                              data.offered_quantity && "line-through"
                          }`}
                        >
                          {data.ProductPurchaseRequests.requested_quantity}
                        </span>
                        {data.ProductPurchaseRequests.requested_quantity !==
                          data.offered_quantity && (
                          <>
                            <span className="ml-2 rtl:mr-2 rtl:ml-0">
                              {data.offered_quantity} {" "}
                            </span>
                            <span className="text-gray-400">(Edited)</span>
                          </>
                        )}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block">SAR</span>{" "}
                      {Number(data?.offered_price).toFixed(2)} {" "} 
                      <span className="text-gray-400">
                      per{" "} 

                       {language === "en"
                          ? measurements?.unit_name
                          : measurements?.[`unit_name_${language}`]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
