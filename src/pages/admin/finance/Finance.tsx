import { Table } from "components/table/Table"
import { ApiParamsType, ColumnProps } from "components/table/types"
import { perPage } from "constant/common.constant"
import { useEffect, useState } from "react"
import { getStoreInfo } from "../store/services/store.service"
import { useNavigate } from "react-router-dom"
import { FormattedMessage } from "react-intl"
import useDebounce from "hooks/useDebounce"
import { DataProps } from "../store/types/store.type"
import { financesupplierType } from "./types/finance.types"
import { financeSupplierDataColumns } from "components/table/columns/financeSupplierData.columns"

const Finance = () => {
    const [financeData, setFinanceData] = useState<financesupplierType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
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

    const debouncedHtmlContent = useDebounce(
        apiParams.searchText as string | number,
        500
    )
  
    const fetchData = async () => {
        try {
            setIsLoading(true)
            const getsupplierInfoData = await getStoreInfo({
                type: "supplier",
                apiParams: apiParams,
            })
            if (getsupplierInfoData) {
                setApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: getsupplierInfoData?.data.data.count,
                    }
                })
            }
            setIsLoading(false)
            setFinanceData(getsupplierInfoData?.data.data.getStoreInfo)
        } catch (error) {
            return error
        }
    }

    useEffect(() => {
        fetchData()
    }, [apiParams.page, apiParams.sort, apiParams.isAsc, debouncedHtmlContent])

    const columns: ColumnProps[] = financeSupplierDataColumns(
        (uuid: string) => navigate(`/admin/finance/view/${uuid}`),
    )

    return (
        <>
            {/* {!isLoading ? ( */}
            <>
                <div className='relative w-full min-w-0 flex-auto '>
                    <Table<DataProps>
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
                        pagination={true}
                        search={true}
                        loading={isLoading}
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
