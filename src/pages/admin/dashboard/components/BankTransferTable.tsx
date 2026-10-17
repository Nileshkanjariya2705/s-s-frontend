import { useEffect, useState } from "react"
import { AdminOrderFinalTypes } from "../types/dashboard.type"
import { ApiParamsType, ColumnProps } from "components/table/types"
import { adminBankTransfer } from "pages/admin/bankTransfer/services/bankTransfer.service"
import { Table } from "components/table/Table"
import { FormattedMessage } from "react-intl"
import { BankTransferDetailColumns } from "components/table/columns/bankTransferDetail.columns"
import { useNavigate } from "react-router-dom"

export const BankTransferDetails = () => {
    const [bankDataLoading, setBankDataLoading] = useState<boolean>(true)
    const [bankTransferDetails, setBankTransferDetails] = useState<
        AdminOrderFinalTypes[]
    >([])
    const [bankDataApiParams, setBankDataApiParams] = useState<ApiParamsType>({
        limit: 5,
        count: 0,
        page: 1,
        isAsc: true,
    })
    const navigate = useNavigate()

    const columns: ColumnProps[] = BankTransferDetailColumns(
        ({ uuid }: { uuid: string }) => {
            navigate(`/admin/bank-transfer/view/${uuid}`)
        }
    )

    const bankTransfer = async () => {
        try {
            setBankDataLoading(true)
            const response = await adminBankTransfer(bankDataApiParams)
            if (response?.data?.data) {
                setBankDataApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: response?.data?.data?.count,
                    }
                })
            }
            setBankTransferDetails(response?.data?.data?.rows)
            setBankDataLoading(false)
        } catch (error) {
            setBankDataLoading(false)
        }
    }
    useEffect(() => {
        bankTransfer()
    }, [bankDataApiParams.limit])

    return (
        <>
            {!bankDataLoading && (
                <Table
                    header={<FormattedMessage id='Bank_Transfer' />}
                    data={bankTransferDetails}
                    columns={columns}
                    apiParams={bankDataApiParams}
                    setApiParams={setBankDataApiParams}
                    pagination={false}
                    search={false}
                    seeMore='/admin/bank-transfer'
                />
            )}
        </>
    )
}
