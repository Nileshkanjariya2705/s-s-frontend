import { Button } from "components/button/Button";
import { ColumnProps } from "../types";
import { FormattedMessage } from "react-intl";
import { StatusStyles } from "constant/common.constant";
import useLocale from "hooks/useLocale";
import { statusDropdown } from "constant/dropdown.constant";
export const BranchColumns: (
  onDeleteFunc: (uuid: string) => void,
  onEditFunc: (uuid: string) => void,
  given_permissions: {
    uuid: string;
    name: string;
    permission_type: string;
    granted: boolean;
  }[]
) => ColumnProps[] = (onEditFunc, onDeleteFunc, given_permissions) => {
  const { language } = useLocale();
  return [
    {
      title: "Sr.No.",
      dataIndex: "created_at",
      id: 1,
      render: ({ index }) => <p className="rtl:text-right">{index}</p>,
      willBeSorted: false,
    },
    {
      title: "Branch_Name",
      dataIndex: "name",
      id: 2,
      willBeSorted: true,
      render: ({ name }: { name: string }) => (
        <p className=" rtl:text-right">{name}</p>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      id: 3,
      willBeSorted: true,
      render: ({ address }: { address: string }) => (
        <p className="rtl:text-right truncate max-w-sm">{address}</p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      id: 5,
      willBeSorted: true,
      render: ({ status }) => {
        const statusOptions = statusDropdown(language);
        const statusOption = statusOptions?.find(
          (option) => option.value === status
        );
        const res = status === "ACTIVE" ? "ACTIVE" : "INACTIVE";
        const className = StatusStyles[res] || "";
        return (
          <>
            <span className={className}>
              {" "}
              {statusOption ? statusOption.label : res}
            </span>
          </>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      id: 7,
      render: ({ uuid }: { uuid: string }) => (
        <div className="flex flex-row gap-5">
          <div
            onClick={() => onEditFunc(uuid)}
            className="flex gap-1 items-center text-secondaryOrange  cursor-pointer"
          >
            {given_permissions.find((item) => item.name === "Edit Branches")
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
          <div
            onClick={() => onDeleteFunc(uuid)}
            className="flex gap-1 items-center text-primarycolor  cursor-pointer"
          >
            {given_permissions.find((item) => item.name === "Delete Branches")
              ?.granted && (
              <>
                <i className="icon-trash-alt text-base text-red-600"></i>
                <Button
                  text={<FormattedMessage id="Delete" />}
                  type="button"
                  className="text-red-600"
                ></Button>
              </>
            )}
          </div>
        </div>
      ),
    },
  ];
};
