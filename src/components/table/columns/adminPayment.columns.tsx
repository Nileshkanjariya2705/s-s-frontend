import { ColumnProps } from "components/table/types";
import moment from "moment";

export type statusStyle = {
  [key: string]: string;
  PENDING: string;
  ACCEPTED: string;
  PACKAGED: string;
  IN_TRANSIT: string;
  DELIVERED: string;
};

export const adminPayment: () => ColumnProps[] = () => [
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
    title: "Order Id",
    dataIndex: "uuid",
    id: 2,
    render: ({ uuid }: { uuid: string }) => (
      <p className="whitespace-nowrap rtl:text-right flex items-start leading-5 gap-1 ">
        <span className="inline-block">#</span><span>{uuid.slice(0, 8)}</span>
      </p>
    ),
    willBeSorted: false,
  },
  {
    title: "Supplier Company",
    dataIndex: "supplier",
    id: 3,
    willBeSorted: true,
    render: ({ supplierInfo }: { supplierInfo: { company_name: string } }) => {
      return (
        <p className="whitespace-nowrap rtl:text-right">
          {supplierInfo?.company_name}
        </p>
      );
    },
  },
  {
    title: "Store Company",
    dataIndex: "store",
    id: 4,
    willBeSorted: true,
    render: ({ storeInfo }: { storeInfo: { company_name: string } }) => {
      return (
        <p className="whitespace-nowrap rtl:text-right">
          {storeInfo?.company_name}
        </p>
      );
    },
  },
  {
    title: "Amount",
    dataIndex: "amount",
    id: 5,
    render: ({ PaymentDetail }: { PaymentDetail: any }) => (
      <p className="flex items-start leading-5 gap-1">
        <span>SAR</span>{" "}
        <span>{PaymentDetail?.[0]?.amount.toFixed(2)}</span>
      </p>
    ),
    willBeSorted: true,
  },

  {
    title: "Date",
    dataIndex: "Date",
    id: 6,
    render: ({ created_at }) => {
      return (
        <>
          <p className="whitespace-nowrap rtl:text-right">
            {moment(created_at).format("DD-MM-YYYY, HH:mm")}
          </p>
        </>
      );
    },
    willBeSorted: false,
  },
];
