import { Button } from "components/button/Button"
import { ColumnProps, onBtnClickFunc } from "components/table/types"
import moment from "moment"
import {
    PaymentDetailType,
    RefundOrderType,
} from "pages/admin/orders/types/order.type"
import { FormattedMessage } from "react-intl"

export type statusStyle = {
    [key: string]: string
    PENDING: string
    PAID: string
}

export const adminRefundOrderColumns: (
    onRowView: onBtnClickFunc
) => ColumnProps[] = (onRowView: onBtnClickFunc) => [
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
            <p className='flex items-start leading-5 gap-1 text-primarycolor font-semibold'>
                #{uuid.slice(0, 8)}
            </p>
        ),
        willBeSorted: false,
    },
    {
        title: "Supplier Company",
        dataIndex: "supplier",
        id: 3,
        willBeSorted: true,
        render: ({
            supplierInfo,
        }: {
            supplierInfo: { company_name: string }
        }) => {
            return <p>{supplierInfo?.company_name}</p>
        },
    },
    {
        title: "Store Company",
        dataIndex: "store",
        id: 4,
        willBeSorted: true,
        render: ({ storeInfo }: { storeInfo: { company_name: string } }) => {
            return <p>{storeInfo?.company_name}</p>
        },
    },
    {
        title: "Refundable Amount",
        dataIndex: "amount",
        id: 5,
        render: ({ RefundOrders }: { RefundOrders: RefundOrderType[] }) => (
            <p className='flex items-start leading-5 gap-1'>
                <span>SAR</span>{" "}
                <span>{RefundOrders?.[0]?.refundable_amount.toFixed(2)}</span>
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
                    <p className='whitespace-nowrap rtl:text-right'>
                        {moment(PaymentDetail?.[0]?.created_at).format(
                            "DD-MM-YYYY, HH:mm"
                        )}
                    </p>
                </>
            )
        },
        willBeSorted: false,
    },
    {
        title: "Admin Status",
        dataIndex: "status",
        id: 7,
        render: ({
            refund_accepted_admin,
        }: {
            refund_accepted_admin: string
        }) => {
            const statusStyles: statusStyle = {
                PENDING:
                    "text-primaryRed bg-primaryRed/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
                PAID: "text-Primarygreen bg-Primarygreen/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
            }

            const adminStatus = refund_accepted_admin ? "PAID" : "PENDING"
            const className = statusStyles[adminStatus] || ""
            return (
                <div>
                    <p className={className}>{adminStatus}</p>
                </div>
            )
        },
        willBeSorted: true,
    },
    {
        title: "Actions",
        dataIndex: "actions",
        id: 8,
        render: ({ uuid }: { uuid: string }) => (
            <div
                onClick={() => onRowView({ uuid })}
                className='flex gap-1 items-center text-primarycolor  cursor-pointer'
            >
                <i className='icon-eye text-base text-primarycolor'></i>
                <Button
                    text={<FormattedMessage id='View' />}
                    type='button'
                    className='text-primarycolor'
                ></Button>
            </div>
        ),
    },
]
