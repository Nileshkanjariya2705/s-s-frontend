import { Button } from "components/button/Button";
import { ColumnProps, onBtnClickFunc } from "components/table/types";
import { OrderDetails } from "pages/store/purchaseHistory/types/purchaseHistory.type";

import { FormattedMessage } from "react-intl";
import moment from "moment";
import { OrderStatus } from "constant/dropdown.constant";
import { statusStyles } from "constant/common.constant";
import useLocale from "hooks/useLocale";
export type adminStatus = {
  [key: string]: string;
  PENDING: string;
  PAID: string;
};
export const OrderRefundColumns: (
  onViewFunc: onBtnClickFunc
) => ColumnProps[] = (onViewFunc) => {
  const {  language } = useLocale()
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
      dataIndex: "uuid",
      id: 3,
      willBeSorted: false,
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
      willBeSorted: false,
      render: ({ orders }: { orders: OrderDetails }) => (
        <p className="flex items-start leading-5 gap-1">
          <span>{moment(orders.created_at).format("DD-MM-YYYY, HH:mm")} </span>
        </p>
      ),
    },

    {
      title: "Supplier Refund Status",
      dataIndex: "Supplier_Refund_Status",
      id: 7,
      willBeSorted: false,
      render: ({ orders }: { orders: OrderDetails }) => {
        const statusOptions = OrderStatus(language);
          const upperCaseStatus = orders.refund_accepted_supplier?.toLocaleUpperCase();
          const statusOption = statusOptions?.find(
            (option) => option.value === upperCaseStatus
          );
          const className = statusStyles[orders.refund_accepted_supplier] || "";
        return <p className={className}>{statusOption?.label}</p>;
      },
    },
    {
      title: "Admin Refund Status",
      dataIndex: "refund_request",
      id: 7,
      willBeSorted: false,
      render: ({ orders }: { orders: OrderDetails }) => {      
        const statusOptions = OrderStatus(language);
        const statusName = orders.refund_accepted_admin ? "PAID" : "PENDING";
          const upperCaseStatus = statusName.toLocaleUpperCase();
          const statusOption = statusOptions?.find(
            (option) => option.value === upperCaseStatus
          );
        const className = statusStyles[statusName] || "";
        return (
          <p className=" flex items-start leading-5 gap-1">
            <div className={className}>{statusOption?.label}</div>
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
