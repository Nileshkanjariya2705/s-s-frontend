import useUserData from "hooks/getUserData";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteRole, getAllRole } from "./services/staffRoles.service";
import { Table } from "components/table/Table";
import { ApiParamsType } from "components/table/types";
import { perPage, responseType, toastType } from "constant/common.constant";
import { ColumnProps } from "components/table/types";
import { RolesColumns } from "components/table/columns/Roles.columns";
import { DeleteModal } from "components/model/DeleteModal";
import { showToast } from "helper/toast.helper";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";

const StaffRoles = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user_entity_uuid, role, given_permissions } = useUserData();
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    searchField: "name",
  });
  const [roleData, setRoleData] = useState([]);
  const [deleteId, setDeleteId] = useState<string>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  const getAllRoles = async () => {
    try {
      setLoading(true);
      const response = await getAllRole(user_entity_uuid, role, apiParams);
      if (response?.data?.data?.rows) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: response?.data.data.count,
          };
        });
      }
      setRoleData(response?.data.data.rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllRoles();
  }, [apiParams.page, debouncedHtmlContent, apiParams.sort, apiParams.isAsc]);

  const columns: ColumnProps[] = RolesColumns(
    ({ role_uuid }: { role_uuid: string }) => {
      onRowEdit({ role_uuid });
    },
    ({ role_uuid }: { role_uuid: string }) => {
      onRowDelete({ role_uuid });
    },
    given_permissions
  );
  function onRowEdit({ role_uuid }: { role_uuid: string }) {
    navigate(`/roles/add/${role_uuid}`);
  }
  function onRowDelete({ role_uuid }: { role_uuid: string }) {
    setDeleteId(role_uuid);
    setDeleteModal(true);
  }

  const intl = useIntl();

  const handleDeleteApi = async (id: string) => {
    setDeleteLoader(true);
    const respone = await deleteRole(id);
    setDeleteModal(false);

    if (respone?.data.responseType === responseType.Failed) {
      showToast(respone.data.message, toastType.Error, intl);
    } else {
      showToast(respone?.data.message, toastType.Success, intl);
      getAllRoles();
      setApiParams((params) => {
        return {
          ...params,
          page: 1,
        };
      });
      setDeleteModal(false);
    }

    setDeleteLoader(false);
  };

  return (
    <>
      {/* {loading ? (
          <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        ) : ( */}
      <>
        <div className="w-full xl:w-3/4 space-y-30px">
          <Table
            header={<FormattedMessage id="All_Roles" />}
            data={roleData}
            columns={columns}
            apiParams={apiParams}
            setApiParams={setApiParams}
            pagination={true}
            search={true}
            loading={loading}
            filters={
              <>
                {given_permissions.find((item) => item.name === "Add Roles")
                  ?.granted && (
                  <button
                    onClick={() => navigate("/roles/add")}
                    className="relative px-4 py-2 border rounded-xl border-primarycolor text-primarycolor text-sm font-medium md:text-base hover:text-white hover:bg-primarycolor"
                  >
                    {<FormattedMessage id="Add_new_Permission" />}
                  </button>
                )}
              </>
            }
          />
          {deleteModal ? (
            <DeleteModal
              setShowModal={setDeleteModal}
              showModal={deleteModal}
              deleteId={deleteId}
              onDeleteClick={handleDeleteApi}
              deleteLoader={deleteLoader}
            />
          ) : null}
        </div>
      </>
      {/* )} */}
      {/* </div> */}
    </>
  );
};

export default StaffRoles;
