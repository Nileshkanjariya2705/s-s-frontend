import { Button } from "components/button/Button"
import { ColumnProps } from "components/table/types"
import moment from "moment"
import { FormattedMessage } from "react-intl"

export const openPurchaseRequestColumns: (
    onViewFunc: (id: string) => void,
    lang: string
) => ColumnProps[] = (onViewFunc, lang) => {
    return [
        {
            title: "Request ID",
            dataIndex: "request_id",
            id: 1,
            willBeSorted: false,
            render: ({ uuid }: { uuid: string }) => (
                <p className='whitespace-nowrap rtl:text-right flex items-start leading-5 gap-1 '>
                    <span className='inline-block'> #</span>
                    <span>{uuid.slice(0, 8)}</span>
                </p>
            ),
        },
        {
            title: "Date",
            dataIndex: "created_at",
            id: 2,
            willBeSorted: true,
            render: ({ created_at }) => {
                return (
                    <>
                        <p className='whitespace-nowrap rtl:text-right'>
                            {moment(created_at).format("DD-MM-YYYY, HH:mm")}
                        </p>
                    </>
                )
            },
        },
        {
            title: "Product Name",
            dataIndex: "product_name",
            id: 3,
            willBeSorted: false,
            render: ({ PurchaseRequestProducts }) => {
                return (
                    <>
                        {PurchaseRequestProducts &&
                            PurchaseRequestProducts?.length > 0 &&
                            Array.isArray(PurchaseRequestProducts) &&
                            PurchaseRequestProducts?.map((arrayItem) => {
                                return (
                                    <>
                                        <p className='flex whitespace-nowrap rtl:text-right'>
                                            {
                                                arrayItem?.products?.[
                                                    `name_${lang}`
                                                ]
                                            }
                                        </p>
                                    </>
                                )
                            })}
                    </>
                )
            },
        },
        {
            title: "Requested Quantity",
            dataIndex: "quantity",
            id: 4,
            willBeSorted: true,
            render: ({ PurchaseRequestProducts }) => {
                return (
                    <>
                        {PurchaseRequestProducts &&
                            PurchaseRequestProducts?.length > 0 &&
                            Array.isArray(PurchaseRequestProducts) &&
                            PurchaseRequestProducts?.map((arrayItem) => {
                                return (
                                    <>
                                        <p className='flex whitespace-nowrap rtl:text-right'>
                                            {arrayItem?.requested_quantity}
                                        </p>
                                    </>
                                )
                            })}
                    </>
                )
            },
        },
        {
            title: "Requested Price",
            dataIndex: "requested_price",
            id: 5,
            willBeSorted: true,
            render: ({ PurchaseRequestProducts }) => {
                return (
                    <p>
                        {PurchaseRequestProducts &&
                            PurchaseRequestProducts?.length > 0 &&
                            Array.isArray(PurchaseRequestProducts) &&
                            PurchaseRequestProducts?.map((arrayItem) => {
                                return (
                                    <>
                                        <p className='flex items-start leading-5 gap-1'>
                                            <span>SAR</span>{" "}
                                            <span>
                                                {arrayItem?.requested_price}
                                            </span>
                                            <span>/</span>
                                            <span>
                                                {
                                                    arrayItem?.products
                                                        ?.measurement
                                                        ?.unit_short_name
                                                }
                                            </span>
                                        </p>
                                    </>
                                )
                            })}
                    </p>
                )
            },
        },
        {
            title: "Options",
            dataIndex: "actions",
            id: 6,
            render: ({ uuid }: { uuid: string }) => {
                return (
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
                )
            },
        },
    ]
}

export const quotedPurchaseRequestColumns: (
    onEditFunc: (id: string) => void,
    onViewFunc: () => void,
    lang: string
) => ColumnProps[] = (onEditFunc, onViewFunc, lang) => {
    return [
        {
            title: "Request ID",
            dataIndex: "request_id",
            id: 1,
            willBeSorted: false,
            render: ({ uuid }: { uuid: string }) => (
                <p className='whitespace-nowrap rtl:text-right flex items-start leading-5 gap-1 '>
                    <span className='inline-block'>#</span>
                    <span>{uuid.slice(0, 8)}</span>
                </p>
            ),
        },
        {
            title: "Date",
            dataIndex: "created_at",
            id: 2,
            willBeSorted: true,
            render: ({ created_at }) => {
                return (
                    <>
                        <p className='whitespace-nowrap rtl:text-right'>
                            {moment(created_at).format("DD-MM-YYYY, HH:mm")}
                        </p>
                    </>
                )
            },
        },

        {
            title: "Product Name",
            dataIndex: "product_name",
            id: 4,
            willBeSorted: false,
            render: ({ supplier_quote }) => {
                const proudctsInQuotes =
                    supplier_quote &&
                    supplier_quote?.length > 0 &&
                    Array.isArray(supplier_quote) &&
                    supplier_quote?.flatMap((arrayItem) => {
                        return arrayItem?.supplier_product_quotes
                    })
                const productQuoteDetail =
                    proudctsInQuotes &&
                    proudctsInQuotes?.length > 0 &&
                    Array.isArray(proudctsInQuotes) &&
                    proudctsInQuotes?.map((arrayItem) => {
                        return arrayItem?.ProductPurchaseRequests
                    })
                return (
                    <>
                        {productQuoteDetail &&
                            productQuoteDetail?.length > 0 &&
                            Array.isArray(productQuoteDetail) &&
                            productQuoteDetail?.map((arrayItem) => {
                                return (
                                    <>
                                        <p className='flex whitespace-nowrap rtl:text-right'>
                                            {
                                                arrayItem?.products?.[
                                                    `name_${lang}`
                                                ]
                                            }
                                        </p>
                                    </>
                                )
                            })}
                    </>
                )
            },
        },
        {
            title: "Alternate product",
            dataIndex: "product_name",
            id: 5,
            willBeSorted: false,
            render: ({ supplier_quote }) => {
                const offeredproudctsInQuotes =
                    supplier_quote &&
                    supplier_quote?.length > 0 &&
                    Array.isArray(supplier_quote) &&
                    supplier_quote?.flatMap((arrayItem) => {
                        return arrayItem?.supplier_product_quotes
                    })

                return (
                    <>
                        {offeredproudctsInQuotes &&
                            offeredproudctsInQuotes?.length > 0 &&
                            Array.isArray(offeredproudctsInQuotes) &&
                            offeredproudctsInQuotes?.map((arrayItem) => {
                                return (
                                    <>
                                        <p className='flex whitespace-nowrap rtl:text-right'>
                                            {arrayItem?.otherBrandProduct
                                                ? arrayItem
                                                      ?.otherBrandProduct?.[
                                                      `name_${lang}`
                                                  ]
                                                : "-"}
                                        </p>
                                    </>
                                )
                            })}
                    </>
                )
            },
        },
        {
            title: "Offered Quantity",
            dataIndex: "offered_quantity",
            id: 6,
            willBeSorted: true,
            render: ({ supplier_quote }) => {
                const proudctsInQuotes =
                    supplier_quote &&
                    supplier_quote?.length > 0 &&
                    Array.isArray(supplier_quote) &&
                    supplier_quote?.flatMap((arrayItem) => {
                        return arrayItem?.supplier_product_quotes
                    })
                return (
                    <>
                        {proudctsInQuotes &&
                            proudctsInQuotes?.length > 0 &&
                            Array.isArray(proudctsInQuotes) &&
                            proudctsInQuotes?.map((arrayItem) => {
                                return (
                                    <>
                                        <p className='flex whitespace-nowrap rtl:text-right'>
                                            {arrayItem?.offered_quantity}
                                        </p>
                                    </>
                                )
                            })}
                    </>
                )
            },
        },
        {
            title: "Offered Price",
            dataIndex: "requested_price",
            id: 7,
            willBeSorted: true,
            render: ({ supplier_quote }) => {
                const proudctsInQuotes =
                    supplier_quote &&
                    supplier_quote?.length > 0 &&
                    Array.isArray(supplier_quote) &&
                    supplier_quote?.flatMap((arrayItem) => {
                        return arrayItem?.supplier_product_quotes
                    })

                return (
                    <>
                        {proudctsInQuotes &&
                            proudctsInQuotes?.length > 0 &&
                            Array.isArray(proudctsInQuotes) &&
                            proudctsInQuotes?.map((arrayItem) => {
                                return (
                                    <>
                                        {arrayItem?.offered_price ? (
                                            <p className='flex whitespace-nowrap rtl:text-right'>
                                                SAR{" "}
                                                {parseFloat(
                                                    Number(
                                                        arrayItem?.offered_price
                                                    ).toFixed(2)
                                                )}
                                                <span>/</span>
                                                <span>
                                                    {
                                                        arrayItem
                                                            ?.ProductPurchaseRequests
                                                            ?.products
                                                            ?.measurement
                                                            ?.unit_short_name
                                                    }
                                                </span>
                                            </p>
                                        ) : (
                                            <p className='flex whitespace-nowrap rtl:text-right'>
                                                SAR -
                                            </p>
                                        )}
                                    </>
                                )
                            })}
                    </>
                )
            },
        },
        {
            title: "Offered deal at",
            dataIndex: "charges_and_total",
            id: 3,
            willBeSorted: true,
            render: ({ supplier_quote }) => {
                return (
                    <>
                        {supplier_quote &&
                            supplier_quote?.length > 0 &&
                            Array.isArray(supplier_quote) &&
                            supplier_quote?.map((arrayItem) => {
                                return (
                                    <>
                                        <p className='flex whitespace-nowrap rtl:text-right'>
                                            SAR{" "}
                                            {parseFloat(
                                                Number(
                                                    arrayItem?.charges_and_total
                                                ).toFixed(2)
                                            )}
                                        </p>
                                    </>
                                )
                            })}
                    </>
                )
            },
        },
        {
            title: "Options",
            dataIndex: "actions",
            id: 8,
            render: ({ uuid, supplier_quote }) => {
                return (
                    <>
                        {supplier_quote &&
                            supplier_quote?.length > 0 &&
                            Array.isArray(supplier_quote) &&
                            supplier_quote?.map((item) => {
                                return item?.payment_method !==
                                    "BANK_TRANSFER" ? (
                                    <div className='flex flex-row gap-2 hover:cursor-pointer items-center'>
                                        <div
                                            className='flex gap-3 items-center text-secondaryOrange'
                                            onClick={() => {
                                                onEditFunc(uuid)
                                            }}
                                        >
                                            <i className='icon-edit-alt text-base'></i>
                                            <Button
                                                text={
                                                    <FormattedMessage id='Edit' />
                                                }
                                                type='button'
                                            ></Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className='flex flex-row gap-2 hover:cursor-pointer items-center'
                                        onClick={() => {
                                            onViewFunc()
                                        }}
                                    >
                                        <i className='icon-eye text-base text-primarycolor'></i>
                                        <Button
                                            text={
                                                <FormattedMessage id='View' />
                                            }
                                            type='button'
                                            className='text-primarycolor'
                                        ></Button>
                                    </div>
                                )
                            })}
                    </>
                )
            },
        },
    ]
}
