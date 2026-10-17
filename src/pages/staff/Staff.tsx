import { ApiParamsType } from "components/table/types";
import { perPage, toastType } from "constant/common.constant";
import { useEffect, useState } from "react";
import { getRoles, getStaffMember } from "./services/staff.service";
import useUserData from "hooks/getUserData";
import { Table } from "components/table/Table";
import { StaffColumns } from "components/table/columns/Staff.columns";
import { StaffMember } from "./types/staff.type";
import AddEditStaffDetails from "./components/AddEditStaffDetails";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";
import { showToast } from "helper/toast.helper";

const Staff = () => {
  const [staffMember, setStaffMember] = useState<StaffMember[]>([]);
  const [staffMemberuuid, setStaffMemberuuid] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    searchField: "username",
  });

  const { user_entity_uuid, role, uuid, given_permissions } = useUserData();

  const columns = StaffColumns((uuid: string) => {
    setStaffMemberuuid(uuid);
    setShowAddModal(true);
  }, given_permissions);

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  const getAllStaffMembers = async () => {
    try {
      setIsLoading(true);
      const response = await getStaffMember({
        user_uuid: uuid,
        user_entity_uuid,
        apiParams,
      });
      if (response?.data?.data?.rows) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: response?.data?.data?.count,
          };
        });
        setStaffMember(response?.data?.data?.rows);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };
  const intl = useIntl();

  useEffect(() => {
    if (showAddModal === false) {
      getAllStaffMembers();
    }
  }, [
    apiParams?.page,
    apiParams?.sort,
    apiParams?.isAsc,
    debouncedHtmlContent,
  ]);

  const StaffDetailModal = async () => {
    const response = await getRoles(user_entity_uuid, role);
    if (response?.data?.data?.count === 0) {
      showToast("Role_First_Error", toastType.Error, intl);
    } else {
      setShowAddModal(true);
      setStaffMemberuuid("");
    }
  };
  return (
    <>
      <div className="w-full xl:w-3/4 space-y-30px relative">
        <>
          <Table<StaffMember>
            apiParams={apiParams}
            columns={columns}
            data={staffMember}
            pagination={true}
            header={<FormattedMessage id="Staff_Member" />}
            search={true}
            setApiParams={setApiParams}
            loading={isLoading}
            filters={
              <>
                {given_permissions.find((item) => item.name === "Add staff")
                  ?.granted && (
                  <button
                    className="relative px-4 py-2 border rounded-xl border-primarycolor text-primarycolor text-base font-medium hover:text-white hover:bg-primarycolor"
                    onClick={StaffDetailModal}
                  >
                    {<FormattedMessage id="Add_Staff_Member" />}
                  </button>
                )}
              </>
            }
          />

          {showAddModal && staffMemberuuid === "" && (
            <AddEditStaffDetails
              setShowAddModal={setShowAddModal}
              showAddModal={showAddModal}
              getAllStaffMembers={getAllStaffMembers}
            />
          )}
          {showAddModal && staffMemberuuid?.length > 0 && (
            <AddEditStaffDetails
              setShowAddModal={setShowAddModal}
              showAddModal={showAddModal}
              user_uuid={staffMemberuuid}
              getAllStaffMembers={getAllStaffMembers}
            />
          )}
        </>
      </div>
    </>
  );
};

export default Staff;
