import { ColumnProps, onBtnClickFunc } from "components/table/types";
import { supplierProductQuotesType } from "pages/store/purchaseRequest/types/purchaseRequest.types";
import { useState } from "react";
import GoldenBadge from "../../../assets/images/gold.png";
import SilverBadge from "../../../assets/images/Silver.png";
import PlatinumBadge from "../../../assets/images/platinum.png";

export const PurchaseRequestDetailColumn: (
  onPurchaseReqCheck: onBtnClickFunc,
  onPurchaseReqDelete: onBtnClickFunc,
  toggleDropdown: (supplier_info_uuid: string) => void,
  given_permissions: {
    uuid: string;
    name: string;
    permission_type: string;
    granted: boolean;
  }[]
) => ColumnProps[] = (
  onPurchaseReqCheck: onBtnClickFunc,
  onPurchaseReqDelete: onBtnClickFunc,
  toggleDropdown: (supplier_info_uuid: string) => void,
  given_permissions
) => {
  const [arrowStates, setArrowStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  return [
    {
      title: "",
      dataIndex: "",
      id: 1,
      render: ({
        supplier_info_uuid,
        uuid,
      }: {
        supplier_info_uuid: string;
        supplier_product_quotes: supplierProductQuotesType[];
        uuid: string;
      }) => (
        <>
          <div
            onClick={() => {
              setArrowStates((prevState) => ({
                ...prevState,
                [uuid]: !prevState[uuid],
              }));
              toggleDropdown(supplier_info_uuid);
            }}
            className="w-5 h-5 rounded-full bg-tblgray flex items-center justify-center cursor-pointer"
          >
            <i
              className={`icon-down-arrow text-sm text-darkgrey ${
                arrowStates[uuid] ? "rotate-180" : ""
              }`}
            ></i>
          </div>
        </>
      ),
    },
    {
      title: "Supplier ID",
      dataIndex: "",
      id: 2,
      willBeSorted: false,
      render: ({ supplier_info_uuid }: { supplier_info_uuid: string }) => (
        <div>
          <p className="flex items-start leading-5 gap-1">
            <span className="inline-block">#</span><span>{supplier_info_uuid.slice(0, 8)}</span>
          </p>
        </div>
      ),
    },
    {
      title: "Offered Count",
      dataIndex: "",
      id: 3,
      render: ({
        totalPrd,
        supplier_product_quotes,
      }: {
        totalPrd: number;
        supplier_product_quotes: supplierProductQuotesType[];
      }) => (
        <div>
          {supplier_product_quotes.length} / {totalPrd}
        </div>
      ),
    },

    {
      title: "Subtotal",
      dataIndex: "Subtotal",
      id: 4,
      render: ({ charges_and_total,charges }: { charges: number,charges_and_total:string }) => (
        <>
        <p className="  flex items-start leading-5 gap-1 ">
          <span>SAR</span>
          <span>{(Number(charges_and_total)-charges).toFixed(2)}</span>          
        </p>
        </>
      ), 
    },
    {
      title: "Charges",
      dataIndex: "charges",
      id: 4,
      render: ({ charges }: { charges: number }) => (
        <>
        <p className="  flex items-start leading-5 gap-1 ">
          <span>SAR</span>
          <span>{charges.toFixed(2)}</span>          
        </p>
        </>
      ), 
    },
    {
      title: "Subtotal Charges",
      dataIndex: "Subtotal_Charges",
      id: 4,
      render: ({ charges_and_total }: { charges_and_total: string }) => (
        <p className="flex items-start leading-5 gap-1 ">
          <span>SAR</span>
          <span>{Number(charges_and_total).toFixed(2)}</span>          
        </p>
      ), 
    },
    {
      title: "Ranking Level",
      dataIndex: "level",
      id: 5,
      willBeSorted: false,
      render: ({ averageRating }: { averageRating: string }) => {
        const numericRating = parseFloat(averageRating);
        let src;
        const badge =
          numericRating >= 4.5
            ? "Platinum Badge"
            : numericRating >= 4
            ? "Golden Badge"
            : numericRating >= 3
            ? "Silver Badge"
            : "No Badge";
        if (badge === "Platinum Badge") {
          src = PlatinumBadge;
        } else if (badge === "Golden Badge") {
          src = GoldenBadge;
        }
        if (badge === "Silver Badge" || badge === "No Badge") {
          src = SilverBadge;
        }

        return (
          <div>
            <img src={`${src}`} height={50} width={50} />
          </div>
        );
      },
    },
    {
      title: "Options",
      dataIndex: "options",
      id: 6,
      render: ({
        supplier_info_uuid,
        tab,
        is_paid,
        payment_method,
      }: {
        supplier_info_uuid: string;
        tab: string;
        is_paid: boolean;
        payment_method: string;
      }) => {
        const data = given_permissions.find(
          (item) => item.name === "Checkout Quote"
        );

        return (
          <>
            <div className="text-base text-black flex items-start flex-wrap leading-5 gap-1">
              {tab === "REJECTED" ? (
                <div className="w-10 h-10 rounded-full bg-red-700/20 flex items-center justify-center hover:cursor-pointer">
                  <i
                    className="icon-cross text-15px text-red-700"
                    onClick={() => onPurchaseReqDelete(supplier_info_uuid)}
                  ></i>
                </div>
              ) : (
                <div className="w-full flex items-start gap-1 ">
                  {(is_paid === false || is_paid === null) &&
                  payment_method !== "BANK_TRANSFER" ? (
                    <div className="flex flex-row gap-2">
                      <div
                        className={`w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center  ${
                          data?.granted
                            ? "hover:cursor-pointer"
                            : "pointer-events-none grayscale"
                        }`}
                      >
                        <i
                          className="icon-check-alt-2 text-24px text-primarycolor"
                          onClick={() =>
                            onPurchaseReqCheck({
                              supplier_info_uuid,
                            })
                          }
                        ></i>
                      </div>
                      <div
                        className={`w-10 h-10 rounded-xl bg-red-700/20 flex items-center justify-center hover:cursor-pointer  ${
                          data?.granted
                            ? "hover:cursor-pointer"
                            : "pointer-events-none grayscale"
                        }`}
                      >
                        <i
                          className="icon-cross text-15px text-red-700"
                          onClick={() =>
                            onPurchaseReqDelete(supplier_info_uuid)
                          }
                        ></i>
                      </div>
                    </div>
                  ) : (
                    <>
                      {(is_paid === false || is_paid === null) &&
                      payment_method === "BANK_TRANSFER" ? (
                        <p className="text-secondaryGreen bg-secondaryGreen/20 text-sm font-medium  rounded-lg px-2 py-1.5 inline-flex items-center justify-center ">
                          APPROVAL IS PENDING
                        </p>
                      ) : (
                              <p className="text-secondaryGreen bg-secondaryGreen/20 text-sm font-medium  rounded-lg px-2 py-1.5 inline-flex items-center justify-center ">
                          Purchased
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        );
      },
    },
  ];
};
