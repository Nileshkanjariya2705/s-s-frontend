import { Button } from "components/button/Button";
import { ColumnProps, onBtnClickFunc } from "components/table/types";
import { statusStyles } from "constant/common.constant";
import { OrderStatus } from "constant/dropdown.constant";
import useLocale from "hooks/useLocale";
import moment from "moment";
import { FormattedMessage } from "react-intl";
export type statusStyle = {
  [key: string]: string;
  PENDING: string;
  ACCEPTED: string;
  PACKAGED: string;
  IN_TRANSIT: string;
  DELIVERED: string;
};

export const BankTransferColumns: (
  onRowView: onBtnClickFunc
) => ColumnProps[] = (onRowView: onBtnClickFunc) => {
  const { language } = useLocale()
  return [
    {
      title: "Sr.No.",
      dataIndex: "uuid",
      id: 1,
      render: ({ index }: { uuid: string; index: number }) => (
        <p className="whitespace-nowrap rtl:text-right">{index}</p>
      ),
      willBeSorted: false,
    },
  
    {
      title: "Order_ID",
      dataIndex: "orderId",
      id: 2,
      willBeSorted: false,
      render: ({ order_id }: { order_id: string }) => (
        <p className="flex flex-row gap-1 whitespace-nowrap rtl:text-right items-start leading-5 ">
          {" "}
          <span className="inline-block">#</span><span>{order_id.slice(0, 8)}</span>
        </p>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      id: 3,
      render: ({ amount }) => (
        <p className=" flex items-start leading-5 gap-1">
          <span>SAR</span> <span>{Number(amount).toFixed(2)}</span>
        </p>
      ),
      willBeSorted: true,
    },
    {
      title: "Order_date",
      dataIndex: "date",
      id: 4,
      willBeSorted: true,
      render: ({ created_at }: { created_at: string }) => (
        <p className="whitespace-nowrap rtl:text-right">
          {moment(created_at).format("DD-MM-YYYY, HH:mm")}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      id: 5,
      willBeSorted: true,
      render: ({ orders }: { orders: { status:string} }) => {
        const statusOptions = OrderStatus(language);
        const upperCaseStatus = orders?.status?.toLocaleUpperCase();
        const statusOption = statusOptions?.find(
          (option) => option.value === upperCaseStatus
        );
        const className = statusStyles[orders?.status] || "";
        return (
          <div>
            <p className={className}>{statusOption?.label}</p>
          </div>
        );
      },
    },
  
    {
      title: "Actions",
      dataIndex: "actions",
      id: 7,
      render: ({ order_id }: { order_id: string }) => (
        <div
          onClick={() => onRowView({ order_id })}
          className="flex gap-1 items-center text-primarycolor  cursor-pointer"
        >
          <i className="icon-eye text-base text-primarycolor"></i>
          <Button
            text={<FormattedMessage id="View" />}
            type="button"
            className="text-primarycolor"
          ></Button>
        </div>
      ),
    },
  ];
  
}