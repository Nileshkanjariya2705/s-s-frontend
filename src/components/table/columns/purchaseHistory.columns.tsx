import { Button } from "components/button/Button";
import { ColumnProps, onBtnClickFunc } from "components/table/types";
import { OrderDetails } from "pages/store/purchaseHistory/types/purchaseHistory.type";

import { FormattedMessage } from "react-intl";
import moment from "moment";
import { OrderStatus } from "constant/dropdown.constant";
import { statusStyles } from "constant/common.constant";
import useLocale from "hooks/useLocale";

export const PurchaseHistoryColumns: (
  onViewFunc: onBtnClickFunc
) => ColumnProps[] = (onViewFunc) => {
  const { language} = useLocale()
  return [
    {
      title: "Payment Id",
      dataIndex: "uuid",
      id: 1,
      willBeSorted: false,
      render: ({ uuid }: { uuid: string }) => (
        <p className=" flex items-start leading-5 gap-1">
          <span className="inline-block">#</span>
          <span>{uuid.slice(0, 8)}</span>
        </p>
      ),
    },
    {
      title: "Purchase Request Id",
      dataIndex: "uuid",
      id: 2,
      willBeSorted: false,
      render: ({ orders }: { orders: OrderDetails }) => (
        <p className=" flex items-start leading-5 gap-1">
          <span className="inline-block">#</span>
          <span>{orders.purchase_request_id.slice(0, 8)}</span>
        </p>
      ),
    },
    {
      title: "Supplier Name",
      dataIndex: "company_name",
      id: 3,
      willBeSorted: true,
      render: ({ orders }: { orders: OrderDetails }) => (
        <p className=" flex items-start leading-5 gap-1">
          {orders.supplierInfo.company_name}
        </p>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      id: 4,
      willBeSorted: true,
      render: ({ orders }: { orders: OrderDetails }) => (
        <p className="flex items-start leading-5 gap-1">
          <span>{moment(orders.created_at).format("DD-MM-YYYY, HH:mm")} </span>
        </p>
      ),
    },
    {
      title: "Product Count",
      dataIndex: "name",
      id: 5,
      willBeSorted: false,
      render: ({ orders }: { orders: OrderDetails }) => (
        <p className=" flex items-start leading-5 gap-1 ">
          <span>{orders.OrderProducts.length}</span>
        </p>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      id: 6,
      willBeSorted: true,
      render: ({ amount }: { amount: number }) => (
        <p className="  flex items-start leading-5 gap-1 ">
          <span>SAR</span> <span>{amount.toFixed(2)}</span>
        </p>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "status",
      id: 7,
      willBeSorted: true,
      render: ({ orders }: { orders: OrderDetails }) => {
        const statusOptions = OrderStatus(language);
        const upperCaseStatus = orders.status?.toLocaleUpperCase();
        const statusOption = statusOptions?.find(
          (option) => option.value === upperCaseStatus
        );

        const isReplaced = orders.replacement_request;
        const isRefundable = orders.refund_request;
        const className = statusStyles[orders.status] || "";
        return (
          <p className=" flex flex-col items-start leading-5 gap-1">
            <div className={className}>
              {" "}
              <p>{statusOption?.label}</p>
            </div>
            {isReplaced && (
              <div className="text-primaryRed bg-primaryRed/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center">
                <p className="text-center">
                  {"Replacement".toLocaleUpperCase()}
                </p>
              </div>
            )}
            {isRefundable && (
              <div className="text-primarycolor bg-primarycolor/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center">
                <p className="text-center">
                  {"Refund".toLocaleUpperCase()}
                </p>
              </div>
            )}
          </p>
        );
      },
    },

    {
      title: "Actions",
      dataIndex: "actions",
      id: 8,
      render: ({ uuid }: { uuid: string }) => (
        <>
          <div className="relative inline-block w-full rtl:text-right">
            <div
              className="flex flex-row gap-2 hover:cursor-pointer items-center"
              onClick={() => {
                onViewFunc(uuid);
              }}
            >
              <i className="icon-eye  text-primarycolor"></i>
              <Button
                text={<FormattedMessage id="View" />}
                type="button"
                className="text-primarycolor"
              ></Button>
            </div>
          </div>
        </>
      ),
    },
  ];
};
