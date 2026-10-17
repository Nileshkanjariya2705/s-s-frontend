import { ApiParamsType } from "components/table/types"
import { perPage } from "constant/common.constant"
import {
    AmountCardWiseTypes,
    TabType,
} from "pages/admin/orders/types/order.type"
import { FormattedMessage, useIntl } from "react-intl"

interface FilterModelProps {
    tab: TabType
    setTab: React.Dispatch<React.SetStateAction<TabType>>
    setApiParams: React.Dispatch<React.SetStateAction<ApiParamsType>>
    amountPaidByCard?: AmountCardWiseTypes
}
const FiltersTab: React.FC<FilterModelProps> = ({
    setApiParams,
    setTab,
    tab,
    amountPaidByCard,
}) => {
    const intl = useIntl()
    return (
        <div className='flex items-center flex-wrap gap-3 w-full md:w-unset'>
            {amountPaidByCard && (
                <div className=' gap-4'>
                    <p className='text-sm md:text-base text-white bg-primarycolor px-4 py-2.5 rounded-lg'>
                        <span className='font-semibold'>
                            {`${intl.formatMessage({
                                id: "Amount_Received_From",
                            })} ${
                                tab.toUpperCase() === "MADA"
                                    ? intl.formatMessage({ id: "Mada" })
                                    : tab.toUpperCase() === "VISA"
                                    ? intl.formatMessage({ id: "Visa" })
                                    : tab.toUpperCase() === "MASTERCARD"
                                    ? intl.formatMessage({ id: "Mastercard" })
                                    : null
                            }`}
                            :{" "}
                            <span>
                                SAR
                            </span>{" "}
                            <span className='font-bold text-lg md:text-xl'>
                                {amountPaidByCard[
                                    `AmountRecived_${tab}`
                                ].toFixed(2)}{" "}
                            </span>
                        </span>
                    </p>
                </div>
            )}
            <ul className='flex items-center bg-primarycolor/10 p-1.5 rounded-xl'>
                <li
                    className='mx-1 cursor-pointer'
                    onClick={() => {
                        setTab("MADA")
                        setApiParams({
                            limit: perPage,
                            count: 0,
                            page: 1,
                            isAsc: true,
                            sort: `uuid`,
                            searchText: "",
                            searchField: "",
                        })
                    }}
                >
                    <span
                        className={`text-xs md:text-sm font-normal px-2 md:px-4  ${
                            tab === "MADA"
                                ? "text-white bg-primarycolor"
                                : "text-black"
                        }  py-2 rounded-xl inline-block `}
                    >
                        <FormattedMessage id='Mada' />
                    </span>
                </li>
                <li
                    className='mx-1 cursor-pointer'
                    onClick={() => {
                        setTab("VISA")
                        setApiParams({
                            limit: perPage,
                            count: 0,
                            page: 1,
                            isAsc: true,
                            sort: `uuid`,
                            searchText: "",
                            searchField: "",
                        })
                    }}
                >
                    <span
                        className={`text-xs md:text-sm font-normal px-2 md:px-4  ${
                            tab === "VISA"
                                ? "text-white bg-primarycolor"
                                : "text-black"
                        }  py-2 rounded-xl inline-block`}
                    >
                        <FormattedMessage id='Visa' />
                    </span>
                </li>
                <li
                    className='mx-1 cursor-pointer'
                    onClick={() => {
                        setTab("MASTERCARD")
                        setApiParams({
                            limit: perPage,
                            count: 0,
                            page: 1,
                            isAsc: true,
                            sort: `uuid`,
                            searchText: "",
                            searchField: "",
                        })
                    }}
                >
                    <span
                        className={`text-xs md:text-sm font-normal px-2 md:px-4  ${
                            tab === "MASTERCARD"
                                ? "text-white bg-primarycolor"
                                : "text-black"
                        }  py-2 rounded-xl inline-block `}
                    >
                        <FormattedMessage id='Mastercard' />
                    </span>
                </li>
            </ul>
        </div>
    )
}

export default FiltersTab
