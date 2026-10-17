import { useState } from "react";
import { ColumnProps, onBtnClickFunc } from "../types";
import { role } from "pages/roles/types/staffRoles.types";
import { FormattedMessage } from "react-intl";
import { useOutsideClick } from "hooks/clickOutside";
import { StatusStyles } from "constant/common.constant";
import useLocale from "hooks/useLocale";
import { statusDropdown } from "constant/dropdown.constant";
type DropdownState = {
  [uuid: string]: "open" | "closed";
};

export const RolesColumns: (
  onRowEdit: onBtnClickFunc,
  onRowDelete: onBtnClickFunc,
  given_permissions: {
    uuid: string;
    name: string;
    permission_type: string;
    granted: boolean;
  }[]
) => ColumnProps[] = (onRowEdit, onRowDelete, given_permissions) => {
  const { language } = useLocale()
  const [isDropdownOpen, setIsDropdownOpen] = useState<DropdownState>({});
  const toggleDropdown = (uuid: string) => {
    setIsDropdownOpen((prevState) => ({
      [uuid]: prevState[uuid] === "open" ? "closed" : "open",
    }));
  };
  const ref = useOutsideClick(() => {
    if (isDropdownOpen) {
      setIsDropdownOpen((prevIsDropdownOpen) => {
        return Object.keys(prevIsDropdownOpen).reduce((acc, curr) => {
          return {
            ...acc,
            [curr]: "closed",
          };
        }, {});
      });
    }
  });
  return [
    {
      title: "Sr.No.",
      dataIndex: "uuid",
      id: 1,
      willBeSorted: false,
      render: ({ index }: { uuid: string; index: number }) => (
        <p className="text-black/80 rtl:text-right">{index}</p>
      ),
    },

    {
      title: "Name",
      dataIndex: "name",
      id: 2,
      willBeSorted: true,
      render: ({ role_id }: { role_id: role }) => (
        <p className="text-black/80 rtl:text-right flex items-start leading-5 gap-1 ">
          {role_id.name}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      id: 3,
      willBeSorted: false,
      render: ({ role_id }: { role_id: role }) => {
        const statusOptions = statusDropdown(language);
        const res = role_id.status === "ACTIVE" ? "ACTIVE" : "INACTIVE";
        const statusOption = statusOptions?.find(
          (option) => option.value === res
        );
        const className = StatusStyles[res] || "";
        return <span className={className}>{statusOption ? statusOption.label : res}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      id: 4,
      render: ({ uuid, role_uuid }: { uuid: string; role_uuid: string }) => (
        <div className="relative inline-block w-full rtl:text-right">
          <button
            id="dropdownMenuIconButton"
            data-dropdown-toggle="dropdownDots"
            className="inline-flex items-center text-xs font-medium text-center text-gray-900 bg-white rounded-lg  focus:ring-4 focus:outline-none  focus:ring-gray-50 "
            type="button"
            onClick={() => toggleDropdown(uuid)}
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 4 15"
            >
              <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          </button>

          {isDropdownOpen?.[uuid] === "open" && (
            <>
              <div
                id="dropdownDots"
                ref={ref}
                className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-34 "
              >
                <ul
                  className="py-2 text-xs text-gray-700 "
                  aria-labelledby="dropdownMenuIconButton"
                >
                  {given_permissions.find((item) => item.name === "Edit Roles")
                    ?.granted && (
                    <li
                      className="cursor-pointer"
                      onClick={() => onRowEdit({ role_uuid })}
                    >
                      <p className="block px-4 py-2 hover:bg-gray-100 ">
                        {<FormattedMessage id="Edit" />}
                      </p>
                    </li>
                  )}
                  {given_permissions.find(
                    (item) => item.name === "Delete Roles"
                  )?.granted && (
                    <li
                      className="cursor-pointer"
                      onClick={() => onRowDelete({ role_uuid })}
                    >
                      <p className="block px-4 py-2 hover:bg-gray-100 hover:text-red-700 ">
                        {<FormattedMessage id="Delete" />}
                      </p>
                    </li>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];
};
