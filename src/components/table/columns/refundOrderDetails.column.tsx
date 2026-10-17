import { Button } from "components/button/Button"
import { ColumnProps, onBtnClickFunc } from "components/table/types"
import { statusStyles } from "constant/common.constant"
import { OrderStatus } from "constant/dropdown.constant"
import useLocale from "hooks/useLocale"
import moment from "moment"
import { FormattedMessage } from "react-intl"
export type statusStyle = {
    [key: string]: string
    PENDING: string
    ACCEPTED: string
    REJECTED: string
}
export const RefundOrderDetailsColumns: (
    onViewFunc: onBtnClickFunc
) => ColumnProps[] = (onViewFunc) => {
    const { language} = useLocale()
    return [
        {
            title: "ID",
            dataIndex: "order_id",
            id: 1,
            willBeSorted: false,
            render: ({ uuid }: { uuid: string }) => (
                <p className='whitespace-nowrap rtl:text-right flex items-start leading-5 gap-1 '>
                    <span className='inline-block'>#</span>
                    <span>{uuid?.slice(0, 8)}</span>
                </p>
            ),
        },
        {
            title: "Purchase_Request_Id",
            dataIndex: "purchase_request_id",
            id: 1,
            willBeSorted: false,
            render: ({
                purchase_request_id,
            }: {
                purchase_request_id: string
            }) => (
                <p className='whitespace-nowrap rtl:text-right flex items-start leading-5 gap-1 '>
                    <span className='inline-block'>#</span>
                    <span>{purchase_request_id?.slice(0, 8)}</span>
                </p>
            ),
        },
        {
            title: "Store Name",
            dataIndex: "company_name",
            id: 2,
            willBeSorted: true,
            render: ({ storeInfo }) => {
                return (
                    <p className='whitespace-nowrap rtl:text-right'>
                        {storeInfo?.company_name}
                    </p>
                )
            },
        },
        {
            title: "Amount",
            dataIndex: "amount",
            id: 3,
            willBeSorted: true,
            render: ({ PaymentDetail }: { PaymentDetail: any }) => (
                <p className='  flex items-start leading-5 gap-1'>
                    <span>SAR</span>{" "}
                    <span>{Number(PaymentDetail?.[0]?.amount).toFixed(2)}</span>
                </p>
            ),
        },
        {
            title: "Order date",
            dataIndex: "orderDate",
            id: 4,
            willBeSorted: true,
            render: ({ PaymentDetail }: { PaymentDetail: any }) => (
                <p className='  flex items-start leading-5 gap-1'>
                    {moment(PaymentDetail?.[0]?.created_at).format(
                        "YYYY-MM-DD, HH:mm"
                    )}
                </p>
            ),
        },

        {
            title: "Refund Status",
            dataIndex: "status",
            id: 6,
            willBeSorted: false,
            render: ({ refund_accepted_supplier }) => {
                const statusOptions = OrderStatus(language);
                const upperCaseStatus =refund_accepted_supplier?.toLocaleUpperCase();
                const statusOption = statusOptions?.find(
                  (option) => option.value === upperCaseStatus
                );
                const className = statusStyles[refund_accepted_supplier] || ""

                return (
                    <>
                        <p className={className}>{statusOption?.label}</p>
                    </>
                )
            },
        },

        {
            title: "Actions",
            dataIndex: "actions",
            id: 7,
            render: ({ uuid }: { uuid: string }) => (
                <div
                    className='flex flex-row gap-2 hover:cursor-pointer items-center'
                    onClick={() => {
                        onViewFunc(uuid)
                    }}
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
}
