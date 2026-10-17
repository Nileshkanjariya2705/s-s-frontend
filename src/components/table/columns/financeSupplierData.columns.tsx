import { Button } from "components/button/Button"
import { ColumnProps, onBtnClickFunc } from "../types"
import { FormattedMessage } from "react-intl"

export const financeSupplierDataColumns: (
    onViewFunc: onBtnClickFunc
) => ColumnProps[] = (onViewFunc) => [
    {
        title: "Sr.No.",
        dataIndex: "sr_no",
        id: 1,
        willBeSorted: false,
        render: ({ index }: { index: number }) => (
            <p className='whitespace-nowrap rtl:text-right'>{index}</p>
        ),
    },

    {
        title: "Name",
        dataIndex: "username",
        id: 2,
        willBeSorted: true,
        render: ({ username }) => (
            <p className='whitespace-nowrap rtl:text-right'>{username}</p>
        ),
    },
    {
        title: "Email",
        dataIndex: "email",
        id: 3,
        willBeSorted: true,
        render: ({ email }) => (
            <p className='whitespace-nowrap rtl:text-right'>{email}</p>
        ),
    },
    {
        title: "Company Name",
        dataIndex: "company_name",
        id: 4,
        willBeSorted: true,
        render: ({ company_name }) => (
            <p className='whitespace-nowrap rtl:text-right'>{company_name}</p>
        ),
    },
    {
        title: "CR-Number",
        dataIndex: "cr_number",
        id: 4,
        willBeSorted: true,
        render: ({ cr_number }) => (
            <p className='whitespace-nowrap rtl:text-right'>{cr_number}</p>
        ),
    },
    {
        title: "Actions",
        dataIndex: "actions",
        id: 5,
        render: ({ uuid }) => (
            <>
                <div className='flex flex-row gap-5'>
                    <div
                        onClick={() => onViewFunc(uuid)}
                        className='flex gap-1 items-center text-primarycolor  cursor-pointer'
                    >
                        <i className='icon-eye text-base text-primarycolor'></i>
                        <Button
                            text={<FormattedMessage id='View' />}
                            type='button'
                            className='text-primarycolor'
                        ></Button>
                    </div>
                </div>
            </>
        ),
    },
]
