import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { getAllUnits, deleteUnit } from "./services/measurement.services";
import { perPage, responseType, toastType } from "constant/common.constant";
import { MeasurementType } from "./types/measurement.types";
import { ApiParamsType, ColumnProps } from "components/table/types";
import { Table } from "components/table/Table";
import { DeleteModal } from "components/model/DeleteModal";
import { measurementColumns } from "components/table/columns/Mesurement.columns";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";
import { showToast } from "helper/toast.helper";
import useLocale from "hooks/useLocale";

const Categories = () => {
  const navigate = useNavigate();
  const [measurement, setMeasurement] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [unitDeletedId, setUnitDeletedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const { language } = useLocale();


  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    searchField: "name",
  });

  const intl = useIntl();

  const onDeleteClick = async () => {
    try {
      setDeleteLoader(true);
      const response = await deleteUnit(unitDeletedId);
      if (response?.data?.responseType === responseType.Failed) {
        showToast(response.data.message, toastType.Error, intl);
      } else {
        showToast(response.data.message, toastType.Success, intl);
        setApiParams((params) => {
          return {
            ...params,
            page: 1,
          };
        });
      }
      setUnitDeletedId("");
      await setShowDeleteModal(false);
      setDeleteLoader(false);
    } catch (err) {}
  };
  const columns: ColumnProps[] = measurementColumns(
    (uuid: string) => navigate(`/admin/measurement/edit/${uuid}`),
    (uuid: string) => {
      setUnitDeletedId(uuid);
      setShowDeleteModal(true);
    },
    language
  );

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const getUnitsOfMeasurement = await getAllUnits(apiParams);
      if (getUnitsOfMeasurement) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: getUnitsOfMeasurement?.data.data.count,
          };
        });
      }
      setIsLoading(false);
      setMeasurement(getUnitsOfMeasurement.data.data.rows);
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [
    unitDeletedId,
    apiParams.page,
    apiParams.sort,
    apiParams.isAsc,
    debouncedHtmlContent,
  ]);
  return (
    <>
      <div className="relative w-full min-w-0 flex-auto ">
        <Table<MeasurementType>
          header={<FormattedMessage id="Measurement" />}
          data={measurement}
          columns={columns}
          apiParams={apiParams}
          setApiParams={setApiParams}
          pagination={true}
          search={true}
          loading={isLoading}
          filters={
            <button
              className="relative px-4 py-2 border rounded-xl border-primarycolor text-primarycolor text-sm font-medium md:text-base hover:text-white hover:bg-primarycolor"
              onClick={() => navigate(`/admin/measurement/add`)}
            >
              {<FormattedMessage id="Add_Measurement" />}
            </button>
          }
        />

        {showDeleteModal && unitDeletedId && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            showModal={showDeleteModal}
            deleteId={unitDeletedId}
            onDeleteClick={onDeleteClick}
            deleteLoader={deleteLoader}
          />
        )}
      </div>
    </>
  );
};

export default Categories;
