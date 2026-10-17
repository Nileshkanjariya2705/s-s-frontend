import { ColumnProps, onBtnClickFunc } from "../types"
import { FormattedMessage } from "react-intl"
import { useState } from "react"
import { useOutsideClick } from "hooks/clickOutside"
type DropdownState = {
    [uuid: string]: "open" | "closed"
}

export const FinanceMonthDataColumns: (
    onPdfViewFunc: onBtnClickFunc,
    onExcelViewFunc: onBtnClickFunc
) => ColumnProps[] = (
    onPdfViewFunc, onExcelViewFunc
) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<DropdownState>({})
    const toggleDropdown = (uuid: string) => {
        setIsDropdownOpen((prevState) => ({
            [uuid]: prevState[uuid] === "open" ? "closed" : "open",
        }))
    }

    const ref = useOutsideClick(() => {
        if (isDropdownOpen) {
            setIsDropdownOpen((prevIsDropdownOpen) => {
                return Object.keys(prevIsDropdownOpen).reduce((acc, curr) => {
                    return {
                        ...acc,
                        [curr]: "closed",
                    }
                }, {})
            })
        }
    })

    return [
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
            title: "Month",
            dataIndex: "month",
            id: 2,
            willBeSorted: false,
            render: ({ month, year }) => {
                return (
                    <p className='whitespace-nowrap rtl:text-right'>
                        {month}{" "}{year}
                    </p>
                )
            },
        },
        {
            title: "Actions",
            dataIndex: "actions",
            id: 3,
            render: ({ uuid }) => (
                <>
                    <div className='relative inline-block w-full rtl:text-right '>
                        <button
                            id='dropdownMenuIconButton'
                            data-dropdown-toggle='dropdownDots'
                            className='inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none  focus:ring-gray-50 '
                            type='button'
                            onClick={() => toggleDropdown(uuid)}
                        >
                            <svg
                                className='w-5 h-5'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 4 15'
                            >
                                <path d='M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z' />
                            </svg>
                        </button>

                        {isDropdownOpen?.[uuid] === "open" && (
                            <>
                                <div
                                    id='dropdownDots'
                                    ref={ref}
                                    className='absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-34'
                                >
                                    <ul
                                        className='py-2 text-sm text-gray-700'
                                        aria-labelledby='dropdownMenuIconButton'
                                    >
                                        <li
                                            className='cursor-pointer'
                                            onClick={() => onPdfViewFunc(uuid)}
                                        >
                                            <p className='block px-4 py-2 hover:bg-gray-100 '>
                                                {
                                                    <FormattedMessage id='View_Pdf' />
                                                }
                                            </p>
                                        </li>

                                        <li
                                            className='cursor-pointer'
                                            onClick={() =>
                                                onExcelViewFunc(uuid)
                                            }
                                        >
                                            <p className='block px-4 py-2 hover:bg-gray-100 hover:text-red-700 '>
                                                <FormattedMessage id='View_Excel' />
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </>
            ),
        },
    ]
}
