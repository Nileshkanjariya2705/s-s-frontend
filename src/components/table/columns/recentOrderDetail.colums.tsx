import { Button } from "components/button/Button"
import { ColumnProps, onBtnClickFunc } from "components/table/types"
import { PaymentDetailType } from "pages/admin/orders/types/order.type"
import { FormattedMessage } from "react-intl"

export const RecetOrderDetailColumns: (
    onRowView: onBtnClickFunc
) => ColumnProps[] = (onRowView: onBtnClickFunc) => [
    {
        title: "Order Id",
        dataIndex: "uuid",
        id: 1,
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
        id: 2,
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
        id: 3,
        willBeSorted: true,
        render: ({ storeInfo }: { storeInfo: { company_name: string } }) => {
            return <p>{storeInfo?.company_name}</p>
        },
    },
    {
        title: "Amount",
        dataIndex: "amount",
        id: 4,
        render: ({ PaymentDetail }: { PaymentDetail: PaymentDetailType[] }) => (
            <p className='flex items-start leading-5 gap-1'>
                <span>SAR</span>{" "}
                <span>{PaymentDetail?.[0]?.amount.toFixed(2)}</span>
            </p>
        ),
        willBeSorted: true,
    },
    {
        title: "Payment method",
        dataIndex: "paymentMethod",
        id: 5,
        render: ({ PaymentDetail }: { PaymentDetail: PaymentDetailType[] }) => (
            <p className='flex items-start leading-5 gap-1'>
                <span>
                    {PaymentDetail?.[0]?.payment_method_type
                        ? PaymentDetail?.[0]?.payment_method_type
                        : "Bank-Transfer"}
                </span>
            </p>
        ),
        willBeSorted: true,
    },
    {
        title: "Actions",
        dataIndex: "actions",
        id: 6,
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
