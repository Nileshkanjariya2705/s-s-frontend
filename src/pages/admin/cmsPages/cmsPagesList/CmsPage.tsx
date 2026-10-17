import { Table } from "components/table/Table"
import { ApiParamsType, ColumnProps } from "components/table/types"
import { dataSourceRows, perPage } from "constant/common.constant"
import { useEffect, useState } from "react"
import {
    cmsPagesColumn,
    dataSourceColumn,
} from "components/table/columns/CmsPages.columns"
import { useNavigate } from "react-router-dom"
import { getCmsPagesInfo, getDataSourceCount } from "./services/cmsPage.service"
import { DataProps, DataSourceProps } from "./types/cmsPages.type"
import { FormattedMessage } from "react-intl"
import Loading from "components/globalLoader/Loading"

function CmsPages() {
    const [apiParams, setApiParams] = useState<ApiParamsType>({
        limit: perPage,
        count: 0,
        page: 1,
        isAsc: true,
        sort: ``,
        searchText: "",
        searchField: "",
    })
    const [cmsPages, setCmsPages] = useState([])
    const [dataSourceCount, setDataSourceCount] = useState<DataSourceProps>({
        getCountOfBlogs: 0,
        getCountOfReview: 0,
        getCountOfFaqs: 0,
        title: "",
    })
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const navigate = useNavigate()
    const fetchCmsPageData = async () => {
        try {
            const getCmsPagesResponse = await getCmsPagesInfo()
            setCmsPages(getCmsPagesResponse?.data.data.rows)
            const response = await getDataSourceCount()
            setDataSourceCount(response?.data.data || {})
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            return error
        }
    }
    useEffect(() => {
        fetchCmsPageData()
    }, [])

    const cmsPagesCol: ColumnProps[] = cmsPagesColumn(
        ({ uuid, Page_title }: { uuid: string; Page_title: string }) => {
            onEditClick({ uuid, Page_title })
        },
        ({ slug }: { slug: string }) => {
            onSlugClick({ slug })
        }
    )

    const dataSource: ColumnProps[] = dataSourceColumn(
        ({ uuid, url }: { uuid: string; url: string }) => {
            onViewClick({ uuid, url })
        }
    )

    async function onEditClick({
        Page_title,
    }: {
        uuid: string
        Page_title: string
    }) {
        navigate(`/admin/cms-pages/${Page_title}`)
    }
    async function onViewClick({ url }: { uuid: string; url: string }) {
        navigate(`/admin/cms-pages/${url}`)
    }

    async function onSlugClick({ slug }: { slug: string }) {
        if (slug === "/faq") {
            navigate("/about-us")
        } else if (slug === "/review") {
            navigate("/")
        } else if (slug === "/home") {
            navigate("/")
        } else {
            navigate(`${slug}`)
        }
    }

    const counts = dataSourceRows(dataSourceCount)
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div className='relative w-full min-w-0 flex-auto'>
                        <Table<DataProps>
                            header={<FormattedMessage id='Cms Pages' />}
                            data={cmsPages}
                            columns={cmsPagesCol}
                            apiParams={apiParams}
                            setApiParams={setApiParams}
                            search={false}
                            pagination={false}
                            // loading={isLoading}
                        />
                    </div>
                    <div className='mt-8'>
                        <Table<DataSourceProps>
                            header={<FormattedMessage id='Data_Source' />}
                            data={counts}
                            columns={dataSource}
                            apiParams={apiParams}
                            setApiParams={setApiParams}
                            search={false}
                            pagination={false}
                            // loading={isLoading}
                        />
                    </div>
                </>
            )}
        </>
    )
}

export default CmsPages
