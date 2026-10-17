import { Button } from "components/button/Button";
import { ColumnProps, onBtnClickFunc } from "components/table/types";
import { statusStyles } from "constant/common.constant";
import { OrderStatus } from "constant/dropdown.constant";
import moment from "moment";
import { PaymentDetailType } from "pages/admin/orders/types/order.type";
import { FormattedMessage } from "react-intl";

export type statusStyle = {
  [key: string]: string;
  PENDING: string;
  ACCEPTED: string;
  PACKAGED: string;
  IN_TRANSIT: string;
  DELIVERED: string;
};

export const adminBankTranferColumns: (
  onRowView: onBtnClickFunc,
  language: string,
) => ColumnProps[] = (onRowView: onBtnClickFunc, language) => {
  return [
    {
      title: "Sr.No.",
      dataIndex: "uuid",
      id: 1,
      render: ({ index }: { uuid: string; index: number }) => <p>{index}</p>,
      willBeSorted: false,
    },
    {
      title: "Order Id",
      dataIndex: "uuid",
      id: 2,
      render: ({ uuid }: { uuid: string }) => (
        <p className="flex items-start leading-5 gap-1 text-primarycolor font-semibold">
          #{uuid?.slice(0, 8)}
        </p>
      ),
      willBeSorted: false,
    },
    {
      title: "Purchase_Request_Id",
      dataIndex: "purchase_request_id",
      id: 3,
      willBeSorted: false,
      render: ({ purchase_request_id }: { purchase_request_id: string }) => (
        <>
          <p className="flex flex-row gap-1 whitespace-nowrap rtl:text-right items-start leading-5 ">
            {" "}
            <span className="inline-block">#</span>
            <span>{purchase_request_id?.slice(0, 8)}</span>
          </p>
        </>
      ),
    },
    {
      title: "Supplier Name",
      dataIndex: "supplier",
      id: 3,
      willBeSorted: true,
      render: ({
        supplierInfo,
      }: {
        supplierInfo: { company_name: string };
      }) => {
        return <div>{supplierInfo?.company_name}</div>;
      },
    },
    {
      title: "Store Name",
      dataIndex: "store",
      id: 4,
      willBeSorted: true,
      render: ({ storeInfo }: { storeInfo: { company_name: string } }) => {
        return <div>{storeInfo?.company_name}</div>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      id: 5,
      render: ({ PaymentDetail }: { PaymentDetail: PaymentDetailType[] }) => (
        <p className="flex items-start leading-5 gap-1">
          <span>SAR</span> <span>{PaymentDetail?.[0]?.amount.toFixed(2)}</span>
        </p>
      ),
      willBeSorted: true,
    },

    {
      title: "Date",
      dataIndex: "Date",
      id: 6,
      render: ({ PaymentDetail }: { PaymentDetail: PaymentDetailType[] }) => {
        return (
          <>
            <p className="whitespace-nowrap rtl:text-right">
              {moment(PaymentDetail?.[0]?.created_at).format(
                "DD-MM-YYYY, HH:mm"
              )}
            </p>
          </>
        );
      },
      willBeSorted: false,
    },
    {
      title: "Status",
      dataIndex: "status",
      id: 5,
      willBeSorted: true,
      render: ({ status }: { status: string }) => {
        const statusOptions = OrderStatus(language);
        const upperCaseStatus = status?.toLocaleUpperCase();
        const statusOption = statusOptions?.find(
          (option) => option.value === upperCaseStatus
        );
        const className = statusStyles[status] || "";
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
      id: 8,
      render: ({ uuid }: { uuid: string }) => (
        <div
          onClick={() => onRowView({ uuid })}
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
};
