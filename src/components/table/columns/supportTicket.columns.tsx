import { ColumnProps, onBtnClickFunc } from "components/table/types";
import { statusStyles } from "constant/common.constant";
import { supportTicketOptions } from "constant/dropdown.constant";
import { useOutsideClick } from "hooks/clickOutside";
import useLocale from "hooks/useLocale";
import moment from "moment";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

export type statusStyle = {
  [key: string]: string;
  OPEN: string;
  CLOSED: string;
  NEW: string;
};
type DropdownState = {
  [uuid: string]: "open" | "closed";
};
export const SupportTicketColumns: (
  onViewFunc: onBtnClickFunc,
  onDeleteFunc: onBtnClickFunc
) => ColumnProps[] = (onViewFunc, onDeleteFunc) => {
  const { language } = useLocale();
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
      title: "Ticket ID",
      dataIndex: "ticket_number",
      id: 1,
      willBeSorted: true,
      render: ({
        ticket_number,
        supportTicketMessages,
      }: {
        ticket_number: string;
        supportTicketMessages: [];
      }) => (
        <>
          {supportTicketMessages.length > 0 ? (
            <span className="flex gap-1 items-center ">
              {ticket_number}
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primarycolor/30  ">
                <p className="text-black font-semibold  text-xs ">
                  {supportTicketMessages.length}{" "}
                </p>
              </span>
            </span>
          ) : (
            <p className="whitespace-nowrap rtl:text-right">{ticket_number}</p>
          )}
        </>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      id: 2,
      willBeSorted: true,
      render: ({ sending_date }) => {
        return (
          <>
            <p className="whitespace-nowrap rtl:text-right">
              {moment(sending_date).format("DD-MM-YYYY, HH:mm")}
            </p>
          </>
        );
      },
    },
    {
      title: "Subject",
      dataIndex: "subject",
      id: 3,
      willBeSorted: false,
      render: ({ subject }: { subject: string }) => (
        <>
          <p className="whitespace-nowrap rtl:text-right">{subject}</p>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      id: 4,
      willBeSorted: true,
      render: ({ status }: { status: string }) => {
        const statusOptions = supportTicketOptions(language);
        const upperCaseStatus = status.toLocaleUpperCase();
        const statusOption = statusOptions?.find(
          (option) => option.value === upperCaseStatus
        );
        const className = statusStyles[status] || "";
        return (
          <div>
            <div className={className}>{statusOption?.label}</div>
          </div>
        );
      },
    },

    {
      title: "Actions",
      dataIndex: "actions",
      id: 5,
      render: ({ uuid }: { uuid: string }) => (
        <div className="relative inline-block w-full rtl:text-right">
          <button
            id="dropdownMenuIconButton"
            data-dropdown-toggle="dropdownDots"
            className="inline-flex items-center p-2 text-xs font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
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
                className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-34"
              >
                <ul
                  className="py-2 text-xs text-gray-700"
                  aria-labelledby="dropdownMenuIconButton"
                >
                  <li
                    className="cursor-pointer"
                    onClick={() => onViewFunc(uuid)}
                  >
                    <p className="block px-4 py-2 hover:bg-gray-100">
                      {<FormattedMessage id="View" />}
                    </p>
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => onDeleteFunc(uuid)}
                  >
                    <p className="block px-4 py-2 hover:bg-gray-100 hover:text-red-700">
                      {<FormattedMessage id="Delete" />}
                    </p>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];
};
