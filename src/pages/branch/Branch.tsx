import { ApiParamsType } from "components/table/types";
import { perPage, responseType, toastType } from "constant/common.constant";
import { useEffect, useState } from "react";
import useUserData from "hooks/getUserData";
import { Table } from "components/table/Table";
import { DeleteModal } from "components/model/DeleteModal";
import { showToast } from "helper/toast.helper";
import { deleteBranch, getBranches } from "./services/branch.service";
import AddEditBranchDetails from "./components/AddEditBranchDetails";
import { BranchColumns } from "components/table/columns/BranchColumns";
import { Branch } from "./types/branches.type";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";

const Staff = () => {
  const [branch, setBranch] = useState<Branch[]>([]);
  const [branchuuid, setBranchuuid] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
  const { user_entity_uuid, uuid, given_permissions } = useUserData();

  const columns = BranchColumns(
    (uuid: string) => {
      setBranchuuid(uuid);
      setShowAddModal(true);
    },
    (uuid: string) => {
      setBranchuuid(uuid);
      setShowDeleteModal(true);
    },
    given_permissions
  );

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  const getAllBranches = async () => {
    try {
      setIsLoading(true);
      const response = await getBranches({
        user_uuid: uuid,
        user_entity_uuid,
        apiParams,
      });
      if (response?.data?.responseType === responseType.Success) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: response?.data?.data?.count,
          };
        });

        setBranch(response?.data?.data?.data.branches);
        setIsLoading(false);
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (showAddModal === false) {
      getAllBranches();
    }
  }, [
    apiParams?.page,
    apiParams?.count,
    apiParams?.sort,
    apiParams?.isAsc,
    debouncedHtmlContent,
    showAddModal,
  ]);

  const intl = useIntl();

  const onDeleteClick = async () => {
    try {
      setDeleteLoader(true);
      const response = await deleteBranch(branchuuid);
      if (response?.data.responseType === responseType.Success) {
        showToast(response?.data.message, toastType.Success, intl);
        getAllBranches();
        setApiParams((params) => {
          return {
            ...params,
            page: 1,
          };
        });
      } else {
        showToast(response?.data.message, toastType.Error, intl);
      }
      setShowDeleteModal(false);
      setDeleteLoader(false);
    } catch (error) {
      return error;
    }
  };
  return (
    <>
      {/* {isLoading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : ( */}
      <div className="w-full xl:w-3/4 space-y-30px relative">
        <>
          <Table<Branch>
            apiParams={apiParams}
            columns={columns}
            data={branch}
            pagination={true}
            header={<FormattedMessage id="All_Branches" />}
            search={true}
            setApiParams={setApiParams}
            loading={isLoading}
            filters={
              <>
                {given_permissions.find((item) => item.name === "Add Branches")
                  ?.granted && (
                  <button
                    className="relative px-4 py-2 border rounded-xl border-primarycolor text-primarycolor text-sm font-medium md:text-base hover:text-white hover:bg-primarycolor"
                    onClick={() => {
                      setShowAddModal(true);
                      setBranchuuid("");
                    }}
                  >
                    {<FormattedMessage id="Add_Branch" />}
                  </button>
                )}
              </>
            }
          />

          {showDeleteModal && branchuuid && (
            <DeleteModal
              setShowModal={setShowDeleteModal}
              showModal={showDeleteModal}
              deleteId={branchuuid}
              onDeleteClick={onDeleteClick}
              deleteLoader={deleteLoader}
              text={<FormattedMessage id="Branch_Delete_Text" />}
            />
          )}
          {showAddModal && branchuuid === "" && (
            <AddEditBranchDetails
              setShowAddModal={setShowAddModal}
              showAddModal={showAddModal}
            />
          )}
          {showAddModal && branchuuid?.length > 0 && (
            <AddEditBranchDetails
              setShowAddModal={setShowAddModal}
              showAddModal={showAddModal}
              branch_uuid={branchuuid}
            />
          )}
        </>
      </div>
      {/* )} */}
    </>
  );
};

export default Staff;
