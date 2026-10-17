import { ApiParamsType, ColumnProps } from "components/table/types"
import { perPage } from "constant/common.constant"
import { useEffect, useState } from "react"
import { Table } from "components/table/Table"
import { useNavigate } from "react-router-dom"
import { FormattedMessage } from "react-intl"
import useDebounce from "hooks/useDebounce"
import { reviewRatingColumns } from "components/table/columns/reviewRating.column"
import { getReviewRating } from "./services/reviewRating.services"
import useUserData from "hooks/getUserData"

const ReviewRatingDetails = () => {
    const [ratingData, setRatingData] = useState([])
    const [loading, setLoading] = useState<boolean>(false)
    const [apiParams, setApiParams] = useState<ApiParamsType>({
        limit: perPage,
        count: 0,
        page: 1,
        isAsc: true,
        sort: `uuid`,
        searchText: "",
        searchField: "name_en",
    })
    const { user_entity_uuid } = useUserData()
    const navigate = useNavigate()
    const language = localStorage.getItem("S&S_Lang")
    const debouncedHtmlContent = useDebounce(
        apiParams.searchText as string | number,
        500
    )

    const getReviewRatingDetails = async () => {
        try {
            setLoading(true)
            const response = await getReviewRating(user_entity_uuid, apiParams)
            if (response?.data?.data?.rows) {
                setApiParams((params: ApiParamsType) => {
                    return {
                        ...params,
                        count: response?.data.data.count,
                    }
                })
            }
            setRatingData(response?.data?.data?.rows)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            return error
        }
    }
    const columns: ColumnProps[] = reviewRatingColumns(
        (uuid: string) => navigate(`/ratings/${uuid}`),
        language as string
    )
    useEffect(() => {
        getReviewRatingDetails()
    }, [
        apiParams?.page,
        apiParams?.sort,
        apiParams?.isAsc,
        debouncedHtmlContent,
    ])
    return (
        <>
            {/* {loading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : ( */}
            <div className='w-full xl:w-3/4 space-y-30px'>
                <Table
                    header={<FormattedMessage id='Review_Rating' />}
                    data={ratingData}
                    columns={columns}
                    apiParams={apiParams}
                    setApiParams={setApiParams}
                    pagination={true}
                    search={true}
                    loading={loading}
                />
            </div>
            {/* )} */}
        </>
    )
}

export default ReviewRatingDetails
