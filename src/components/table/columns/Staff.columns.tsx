import { Button } from "components/button/Button";
import { ColumnProps } from "../types";
import { StaffMemberInfo, Staffuser } from "pages/staff/types/staff.type";
import { FormattedMessage } from "react-intl";
import { StatusStyles } from "constant/common.constant";
import { statusDropdown } from "constant/dropdown.constant";
import useLocale from "hooks/useLocale";
// import { statusStyle } from "./Store.columns";

export const StaffColumns: (
  onEditFunc: (uuid: string) => void,
  given_permissions: {
    uuid: string;
    name: string;
    permission_type: string;
    granted: boolean;
  }[]
) => ColumnProps[] = (onEditFunc, given_permissions) => {
  const { language } = useLocale()
  return [
    {
      title: "Sr.No.",
      dataIndex: "created_at",
      id: 1,
      render: ({ index }) => (
        <p className="rtl:text-right">{index}</p>
      ),
      willBeSorted: false,
    },
    {
      title: "Username",
      dataIndex: "username",
      id: 2,
      willBeSorted: true,
      render: ({ user }: { user: StaffMemberInfo }) => (
        <p className="rtl:text-right">{user.username}</p>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      id: 3,
      willBeSorted: true,
      render: ({ user }: { user: StaffMemberInfo }) => (
        <p className="rtl:text-right">{user.email}</p>
      ),
    },
    {
      title: "Assigned Role",
      dataIndex: "role",
      id: 4,
      willBeSorted: false,
      render: ({ role_id }: { role_id: { name: string } }) => (
        <p className="rtl:text-right">{role_id.name}</p>
      ),
    },
    {
      title: "Branch",
      dataIndex: "branch",
      id: 5,
      willBeSorted: false,
      render: ({ user }: { user: StaffMemberInfo }) => (
        <p className="text-sm font-medium  rtl:text-right">
          {user.branch_name ? user.branch_name : "-"}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      id: 7,
      willBeSorted: true,
      render: ({ user }: { user: StaffMemberInfo }) => {
        const statusOptions = statusDropdown(language);
        const res = user.is_active ? "ACTIVE" : "INACTIVE";
        const statusOption = statusOptions?.find(
          (option) => option.value === res
        );
        const className = StatusStyles[res] || "";
        return <span className={className}> {statusOption ? statusOption.label : res}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      id: 6,
      render: ({ user }: { user: Staffuser }) => (
        <div className="flex flex-row gap-5">
          <div
            onClick={() => onEditFunc(user.uuid)}
            className="flex gap-1 items-center text-secondaryOrange  cursor-pointer"
          >
            {given_permissions.find((item) => item.name === "Edit staff")
              ?.granted && (
              <>
                <i className="icon-edit-alt text-base"></i>
                <Button
                  text={<FormattedMessage id="Edit" />}
                  type="button"
                  className="text-secondaryOrange"
                ></Button>
              </>
            )}
          </div>
        </div>
      ),
    },
  ];
}
  
