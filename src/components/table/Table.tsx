import Pagination from "components/pagination/Pagination";
import { perPage } from "constant/common.constant";
import { ApiParamsType, ColumnProps } from "./types";
import { NoData } from "components/noDataFound/NoDataFound";
import { FormattedMessage, useIntl } from "react-intl";
import { supplierProductQuotesType } from "pages/store/purchaseRequest/types/purchaseRequest.types";
import { AdditionalRow } from "./additionalRow";
import Loading from "components/globalLoader/Loading";
import { useNavigate } from "react-router-dom";

interface TableProps<dataProps> {
    header: React.ReactNode;
    data: dataProps[];
}
type targetDropdownState = {
  [supplier_info_uuid: string]: {
    isOpen: boolean;
    supplier_product_quotes: supplierProductQuotesType[];
  };
};
interface TableProps<dataProps> {
  header: React.ReactNode;
  data: dataProps[];
  apiParams: ApiParamsType;
  setApiParams: React.Dispatch<React.SetStateAction<ApiParamsType>>;
  columns: ColumnProps[];
  search: boolean;
  pagination: boolean;
  filters?: React.ReactNode;
  targetDropdown?: targetDropdownState;
  seeMore?: string;
  additionalStyle?: string;
  isDropdownOpen?: boolean;
  supplierId?: string;
  loading?: boolean;
}
export const Table = <dataProps extends Record<string, any>>({
  data,
  columns,
  header,
  apiParams,
  setApiParams,
  search,
  pagination,
  filters,
  targetDropdown,
  seeMore,
  additionalStyle,
  loading = false,
}: TableProps<dataProps>) => {
  const supplierIds = Object.keys(targetDropdown || {});
  const { page, limit, count } = apiParams;
  const intl = useIntl();
  const renderCell = (item: dataProps, column: ColumnProps, index: number) => {
    return column.render
      ? column.render({ ...item, index: index + (page - 1) * limit + 1 })
      : item[column.dataIndex];
  };
  const renderColumn = ({ title, colRender }: ColumnProps) => {
    const name = title.includes(" ")
      ? title.replace(/ /g, "_")
      : title === "Sr.No."
      ? "SR_NO"
      : title;

    return colRender ? (
      colRender()
    ) : name ? (
      <FormattedMessage id={name} />
    ) : null;
  };

  const handleChange = (e: { target: HTMLInputElement }) => {
    setApiParams((params) => {
      return {
        ...params,
        page: 1,
        searchText: e.target.value,
      };
    });
  };
  const navigate = useNavigate();
  return (
    <>
      <div
        className={`${
          additionalStyle
            ? additionalStyle
            : `border border-black/10 rounded-xl p-5`
        }`}
      >
        <div className="relative ">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-black">
              {header}
            </h2>{" "}
            {search ? (
              <>
                <div className="w-full md:w-1/3 xxl:w-1/5 ml-auto">
                  <input
                    name="search"
                    type="search"
                    className="block w-full py-2.5 px-4 gap-4 leading-5 text-sm text-gray-900 border border-gray-300 rounded-xl bg-white focus:customBorder focus:border-customBorder "
                    placeholder={intl.formatMessage({
                      id: "Search",
                    })}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </>
            ) : null}
            {filters && <>{filters}</>}
          </div>
          <div className="relative overflow-x-auto px-4 -mx-4 pb-11">
            <table className="w-full text-left border-spacing-y-6 border-separate  ">
              <thead className="text-sm  text-gray-600">
                <tr>
                  {columns.map((column: ColumnProps, index: number) => (
                    <th
                      scope="col"
                      className="px-5 py-3 font-semibold bg-primarycolor/10 text-primarycolor"
                      key={index}
                      onClick={() => {
                        if (column.willBeSorted && count > 1) {
                          setApiParams((params) => {
                            return {
                              ...params,
                              page: 1,
                              sort: column.dataIndex,
                              isAsc: !params.isAsc,
                            };
                          });
                        }
                      }}
                    >
                      <div className="flex gap-1 ">
                        <p className="whitespace-nowrap rtl:text-right">
                          {renderColumn(column)}
                        </p>
                        <span
                          className={` mt-1 cursor-pointer ${
                            column.willBeSorted && "icon-arrow-swap"
                          }`}
                        ></span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              {loading ? (
                <Loading className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              ) : (
                <>
                  <tbody>
                    {(data && Array.isArray(data) && data?.length === 0) ||
                    data === undefined ? (
                      <>
                        <td colSpan={columns.length}>
                          <div className="relative w-full min-w-0 flex-auto p-8">
                            <NoData
                              text={<FormattedMessage id="No_Data_Found" />}
                            />
                          </div>
                        </td>
                      </>
                    ) : (
                      data &&
                      data?.length > 0 &&
                      data?.map((item: dataProps, dataIndex: number) => (
                          <>
                          <tr
                            key={dataIndex}
                            className={`bg-white text-sm shadow-primary-shadows rounded-lg text-darkgrey/75 rtl:text-right ${
                              (item?.deleted_at && item?.deleted_at) ||
                              (item?.status && item?.status === "INACTIVE")
                                ? "bg-gray-300"
                                : ""
                            }`}
                          >
                            {columns.map(
                              (column: ColumnProps, index: number) => (
                                <td className="px-5 py-4" key={index}>
                                  {renderCell(item, column, dataIndex)}
                                </td>
                              )
                            )}
                          </tr>
                          {supplierIds.map((supplierId) => {
                            if (
                              supplierId === item.supplier_info_uuid &&
                              targetDropdown &&
                              targetDropdown[supplierId].isOpen
                            ) {
                              return (
                                <tr className="w-full">
                                  <td colSpan={10}>
                                    <>
                                      <AdditionalRow
                                        allSupplierDropdown={targetDropdown}
                                        clickedSupplierId={supplierId}
                                      />
                                    </>
                                  </td>
                                </tr>
                              );
                            }
                          })}
                        </>
                      ))
                    )}
                  </tbody>
                </>
              )}
            </table>
          </div>
          {pagination ? (
            count > perPage ? (
              <div className="w-full">
                <div className="w-full text-center ">
                  <Pagination
                    apiParams={apiParams}
                    setApiParams={setApiParams}
                  />
                </div>
                <div className="w-full mt-7">
                  <p className="text-base leading-[21px] h-fit font-semibold text-black -mt-10 w-full text-right pr-3 flex gap-1 rtl:justify-start justify-end">
                    <span>
                      {<FormattedMessage id="Showing" />}{" "}
                      {(page - 1) * perPage + 1}{" "}
                    </span>
                    <span>{<FormattedMessage id="to" />}</span>
                    <span>{Math.min(page * perPage, count)} </span>
                    <span>
                      {<FormattedMessage id="of" />} {count}{" "}
                    </span>
                    <span> {<FormattedMessage id="entries" />}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full mt-14">
                <p className="text-base leading-[21px] h-fit font-semibold text-black -mt-10 w-full text-right pr-3 flex gap-1 rtl:justify-start justify-end">
                  <span>
                    {<FormattedMessage id="Showing" />}{" "}
                    {apiParams.count === 0 ? 0 : (page - 1) * perPage + 1}{" "}
                  </span>
                  <span>{<FormattedMessage id="to" />}</span>
                  <span>{Math.min(page * perPage, count)} </span>
                  <span>
                    {<FormattedMessage id="of" />} {count}{" "}
                  </span>
                  <span> {<FormattedMessage id="entries" />}</span>
                </p>
              </div>
            )
          ) : (
            ""
          )}
          {seeMore && count > 0 && limit < count && (
            <>
              <hr className="border-black/10 my-1" />
              <div
                onClick={() => navigate(`${seeMore}`)}
                className="flex mt-5  gap-1 justify-end  cursor-pointer"
              >
                <span className="text-primarycolor font-base">
                  {<FormattedMessage id="SEE_MORE" />}
                </span>
                <i className="icon-down-arrow text-20px"></i>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
