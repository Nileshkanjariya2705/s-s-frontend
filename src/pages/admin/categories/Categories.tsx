import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCategory, getAllCategory } from "./services/category.service";
import { ApiParamsType, ColumnProps } from "components/table/types";
import { Table } from "components/table/Table";
import { DataProps } from "../store/types/store.type";
import { DeleteModal } from "components/model/DeleteModal";
import { showToast } from "helper/toast.helper";
import { perPage, responseType, toastType } from "constant/common.constant";
import { categoriesColumns } from "components/table/columns/Categories.columns";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";
import useLocale from "hooks/useLocale";

const Categories = () => {
  const { language } = useLocale();

  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [opneModel, setOpenModel] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    searchField: "name",
  });
  const navigate = useNavigate();
  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  const getAllCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategory(apiParams);
      if (response?.data?.data?.rows) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: response?.data.data.count,
          };
        });
      }
      setCategoryData(response?.data?.data?.rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, [apiParams.page, apiParams.sort, apiParams.isAsc, debouncedHtmlContent]);

  function onRowEdit({ uuid }: { uuid: string }) {
    navigate(`/admin/categories/edit-category/${uuid}`);
  }
  function onRowView({ uuid }: { uuid: string }) {
    navigate(`/admin/categories/view-category/${uuid}`);
  }
  function onRowDelete({ uuid }: { uuid: string }) {
    setOpenModel(true);
    setId(uuid);
  }

  const intl = useIntl();

  const handleDeleteApi = async (id: string) => {
    setDeleteLoader(true);
    const response = await deleteCategory(id);
    setOpenModel(false);
    if (response?.data.responseType === responseType.Success) {
      showToast(response?.data.message, toastType.Success, intl);
      getAllCategories();
      setApiParams((params) => {
        return {
          ...params,
          page: 1,
        };
      });
    } else {
      showToast(response?.data.message, toastType.Error, intl);
    }
    setDeleteLoader(false);
  };
  const columns: ColumnProps[] = categoriesColumns(
    ({ uuid }: { uuid: string }) => {
      onRowEdit({ uuid });
    },
    ({ uuid }: { uuid: string }) => {
      onRowView({ uuid });
    },
    ({ uuid }: { uuid: string }) => {
      onRowDelete({ uuid });
    },
    language 
  );

  return (
    <>
      {/* {loading ? (
        <Loading />
      ) : ( */}
      <>
        <div className="relative w-full min-w-0 flex-auto">
          <Table<DataProps>
            header={<FormattedMessage id="Categories" />}
            data={categoryData}
            columns={columns}
            apiParams={apiParams}
            setApiParams={setApiParams}
            pagination={true}
            search={true}
            loading={loading}
            filters={
              <button
                onClick={() => navigate("/admin/categories/add-category")}
                className="relative px-4 py-2 border rounded-xl border-primarycolor text-primarycolor text-sm font-medium md:text-base hover:text-white hover:bg-primarycolor"
              >
                {<FormattedMessage id="Add_new_Category" />}
              </button>
            }
          />
          {opneModel ? (
            <DeleteModal
              setShowModal={setOpenModel}
              showModal={opneModel}
              deleteId={id}
              onDeleteClick={handleDeleteApi}
              deleteLoader={deleteLoader}
            />
          ) : null}
        </div>
      </>
      {/* )} */}
    </>
  );
};
export default Categories;
