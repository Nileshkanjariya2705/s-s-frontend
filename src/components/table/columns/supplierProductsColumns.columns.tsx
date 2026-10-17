import { Button } from "components/button/Button"
import { ColumnProps, onBtnClickFunc } from "components/table/types"
import { REACT_APP_IMAGE_PATH } from "config"
import { StatusStyles } from "constant/common.constant"
import { remainingTime } from "helper/timezone.helper"
import { useOutsideClick } from "hooks/clickOutside"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

type DropdownState = {
    [uuid: string]: "open" | "closed"
}
export type statusStyle = {
    [key: string]: string
    INACTIVE: string
    ACTIVE: string
}
export const SupplierProductsColumns: (
    onEditFunc: onBtnClickFunc,
    onDeleteFunc: onBtnClickFunc,
    given_permissions: {
        uuid: string
        name: string
        permission_type: string
        granted: boolean
    }[],
    lang: string
) => ColumnProps[] = (onEditFunc, onDeleteFunc, given_permissions, lang) => {
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

    type CountdownProps = {
        end_date: string
    }

    const Countdown: React.FC<CountdownProps> = ({ end_date }) => {
        const [remainingTimeString, setRemainingTimeString] = useState<string>(
            remainingTime(end_date)
        )

        useEffect(() => {
            const intervalId = setInterval(() => {
                setRemainingTimeString(remainingTime(end_date))
            }, 1000)

            return () => clearInterval(intervalId)
        }, [end_date])

        return <span>{remainingTimeString}</span>
    }

    return [
        {
            title: "SR NO",
            dataIndex: "sr_no",
            id: 1,
            willBeSorted: false,
            render: ({ index }: { index: number }) => (
                <p className='whitespace-nowrap rtl:text-right'>{index}</p>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            id: 3,
            willBeSorted: true,
            render: ({
                category,
                category_ar,
                category_ur,
            }: {
                category: string
                category_ar: string
                category_ur: string
            }) =>
                lang === "en" ? (
                    <p>{category}</p>
                ) : lang === "ar" ? (
                    <p>{category_ar}</p>
                ) : (
                    <p>{category_ur}</p>
                ),
        },
        {
            title: "Image",
            dataIndex: "product_images",
            id: 2,
            willBeSorted: false,
            render: ({ product_image }: { product_image: string }) => (
                <>
                    <img
                        src={`${REACT_APP_IMAGE_PATH}/${product_image}`}
                        width={25}
                        height={25}
                        className='w-8 h-8 md:w-10 md:h-10 object-contain'
                        alt='logo'
                    />
                </>
            ),
        },
        {
            title: "Name",
            dataIndex: "product",
            id: 3,
            willBeSorted: true,
            render: ({
                product,
                product_ar,
                product_ur,
            }: {
                product: string
                product_ar: string
                product_ur: string
            }) =>
                lang === "en" ? (
                    <p>{product}</p>
                ) : lang === "ar" ? (
                    <p>{product_ar}</p>
                ) : (
                    <p>{product_ur}</p>
                ),
        },
        {
            title: "Offered Price",
            dataIndex: "price",
            id: 4,
            willBeSorted: true,
            render: ({ price }: { price: string }) => (
                <p className='whitespace-nowrap rtl:text-right flex items-start leading-5 gap-1'>
                    <span>SAR</span> <span>{Number(price).toFixed(2)}</span>
                </p>
            ),
        },
        {
            title: "Offer Duration",
            dataIndex: "end_date",
            id: 5,
            willBeSorted: true,
            render: ({ end_date }) => {
                return <Countdown end_date={end_date} />
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            id: 6,
            willBeSorted: true,
            render: ({ status }) => {
                const res = status === "ACTIVE" ? "ACTIVE" : "INACTIVE"
                const className = StatusStyles[res] || ""
                return <span className={className}>{res}</span>
            },
        },
        {
            title: "Actions",
            dataIndex: "actions",
            id: 7,
            render: ({
                uuid,
                deleted_at,
                status,
            }: {
                uuid: string
                deleted_at: string | null
                status: string
            }) => {
                const delete_permission = given_permissions.find(
                    (item) => item.name === "Delete Products"
                )?.granted
                const edit_permission = given_permissions.find(
                    (item) => item.name === "Edit Products"
                )?.granted

                return (
                    <>
                        {deleted_at == null && status === "ACTIVE" ? (
                            <div className='relative inline-block w-full rtl:text-right '>
                                {(delete_permission || edit_permission) ===
                                    true && (
                                    <button
                                        id='dropdownMenuIconButton'
                                        data-dropdown-toggle='dropdownDots'
                                        className='inline-flex items-center p-2 text-xs font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none  focus:ring-gray-50'
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
                                )}
                                {isDropdownOpen?.[uuid] === "open" && (
                                    <>
                                        <div
                                            id='dropdownDots'
                                            ref={ref}
                                            className='absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-34 '
                                        >
                                            <ul
                                                className='py-2 text-xs text-gray-700 '
                                                aria-labelledby='dropdownMenuIconButton'
                                            >
                                                {edit_permission && (
                                                    <li
                                                        className='cursor-pointer'
                                                        onClick={() =>
                                                            onEditFunc(uuid)
                                                        }
                                                    >
                                                        <p className='block px-4 py-2 hover:bg-gray-100 '>
                                                            {
                                                                <FormattedMessage id='Edit' />
                                                            }
                                                        </p>
                                                    </li>
                                                )}
                                                {delete_permission && (
                                                    <li
                                                        className='cursor-pointer'
                                                        onClick={() =>
                                                            onDeleteFunc(uuid)
                                                        }
                                                    >
                                                        <p className='block px-4 py-2 hover:bg-gray-100 hover:text-red-700 '>
                                                            {
                                                                <FormattedMessage id='Delete' />
                                                            }
                                                        </p>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                {delete_permission === true && (
                                    <div
                                        onClick={() => onDeleteFunc(uuid)}
                                        className='flex gap-1 items-center text-primarycolor  cursor-pointer'
                                    >
                                        <i className='icon-trash-alt text-base text-red-600'></i>
                                        <Button
                                            text={
                                                <FormattedMessage id='Delete' />
                                            }
                                            type='button'
                                            className='text-red-600'
                                        ></Button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )
            },
        },
    ]
}
