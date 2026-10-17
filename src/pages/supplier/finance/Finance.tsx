import { Table } from "components/table/Table"
import { ApiParamsType, ColumnProps } from "components/table/types"
import { monthData_ar, monthData_en, monthData_ur, perPage } from "constant/common.constant"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FormattedMessage } from "react-intl"
import { Dataprops } from "pages/admin/finance/types/finance.types"
import { FinanceMonthDataColumns } from "components/table/columns/financeMonthData.columns"
import {  getSupplierMonthData } from "./services/finance.service"
import useUserData from "hooks/getUserData"
import useLocale from "hooks/useLocale"

const Finance = () => {
    const { user_entity_uuid } = useUserData()
    const [financeData, setFinanceData] = useState<any>([])
    const [apiParams, setApiParams] = useState<ApiParamsType>({
        limit: perPage,
        count: 0,
        page: 1,
        isAsc: true,
        sort: `uuid`,
        searchText: "",
        searchField: "username",
    })
    const navigate = useNavigate()
     const { language } = useLocale();

    const columns: ColumnProps[] = FinanceMonthDataColumns(
        (uuid: string) => navigate(`/finance/pdfView/${uuid}`),
        (uuid: string) => navigate(`/finance/excelView/${uuid}`)
    )
    const monthlyFinanceData = async () => {
        try {
            const response = await getSupplierMonthData(user_entity_uuid)
            const data = response?.data.data.map(
                (element: { month: number; year: number }) => {
                    if (language === "en") {
                        return ({
                            ...element,
                            month: monthData_en[element.month],
                        })
                    } else if (language === "ar") {
                        return ({
                            ...element,
                            month: monthData_ar[element.month],
                        })
                    } else {
                        return ({
                            ...element,
                            month: monthData_ur[element.month],
                        })
                    }
                }
            )
            setFinanceData(data)
        } catch (error) {
            return error
        }
    }
    useEffect(() => {
        monthlyFinanceData()
    }, [user_entity_uuid])
    
    return (
        <>
            {/* {!isLoading ? ( */}
            <>
                <div className='relative w-full min-w-0 flex-auto '>
                    <Table<Dataprops>
                        header={
                            <>
                                <div className='flex gap-3 items-center'>
                                    <FormattedMessage id='Finance_Info' />
                                </div>
                            </>
                        }
                        data={financeData}
                        columns={columns}
                        apiParams={apiParams}
                        setApiParams={setApiParams}
                        pagination={false}
                        search={true}
                    />
                </div>
            </>
            {/* ) : (
                <Loading />
            )} */}
        </>
    )
}

export default Finance
