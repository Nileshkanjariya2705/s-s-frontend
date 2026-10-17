import { Button } from "components/button/Button"
import { ColumnProps, onBtnClickFunc } from "../types"
import { FormattedMessage } from "react-intl"
import { PaymentDetailType } from "pages/admin/dashboard/types/dashboard.type"

export const BankTransferDetailColumns: (
    onRowView: onBtnClickFunc
) => ColumnProps[] = (onRowView: onBtnClickFunc) => [
    {
        title: "Order_ID",
        dataIndex: "orderId",
        id: 1,
        willBeSorted: false,
        render: ({ uuid }: { uuid: string }) => (
            <p className='flex flex-row gap-1 whitespace-nowrap rtl:text-right items-start leading-5 '>
                {" "}
                <span className='inline-block'>#</span>
                <span>{uuid.slice(0, 8)}</span>
            </p>
        ),
    },
    {
        title: "Supplier Name",
        dataIndex: "",
        id: 2,
        render: ({
            supplierInfo,
        }: {
            supplierInfo: { company_name: string }
        }) => (
            <p className=' flex items-start leading-5 gap-1'>
                <span>{supplierInfo?.company_name}</span>
            </p>
        ),
        willBeSorted: true,
    },
    {
        title: "Store Name",
        dataIndex: "",
        id: 3,
        render: ({ storeInfo }: { storeInfo: { company_name: string } }) => (
            <p className=' flex items-start leading-5 gap-1'>
                <span>{storeInfo?.company_name}</span>
            </p>
        ),
        willBeSorted: true,
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
        title: "Actions",
        dataIndex: "actions",
        id: 5,
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
