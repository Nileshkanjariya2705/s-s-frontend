import { ColumnProps, onBtnClickFunc } from "components/table/types";
import { purchaseRequestStatusOptions, purchaseReuestStatus, statusStyles } from "constant/common.constant";
import { remainingTime } from "helper/timezone.helper";
import { useOutsideClick } from "hooks/clickOutside";
import useLocale from "hooks/useLocale";
import moment from "moment";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

export type statusStyle = {
  [key: string]: string;
  QUOTED: string;
  EXPIRED: string;
  NEW: string;
  COMPLETED: string;
};
type DropdownState = {
  [uuid: string]: "open" | "closed";
};

export const PurchaseRequestColumns: (
  onViewFunc: onBtnClickFunc,
  onDeleteFunc: onBtnClickFunc,
  onExpiredClickFunc: onBtnClickFunc,
  onEditFunc: onBtnClickFunc,
  given_permissions: {
    uuid: string;
    name: string;
    permission_type: string;
    granted: boolean;
  }[]
) => ColumnProps[] = (
  onViewFunc,
  onDeleteFunc,
  onExpiredClickFunc,
  onEditFunc,
  given_permissions
) => {
  const { language } =useLocale()
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
      title: "Request ID",
      dataIndex: "uuid",
      id: 1,
      willBeSorted: false,
      render: ({ uuid }: { uuid: string }) => (
        <p className="whitespace-nowrap "># {uuid?.slice(0, 8)}</p>
      ),
    },
    {
      title: "Expiry Date",
      dataIndex: "quotes_accepted_upto",
      id: 2,
      willBeSorted: true,
      render: ({ quotes_accepted_upto }: { quotes_accepted_upto: string }) => {
        return (
          <>
            <p className="whitespace-nowrap">
              {moment(quotes_accepted_upto).format("YYYY-MM-DD, HH:mm")}
            </p>
          </>
        );
      },
    },
    {
      title: "requested amount",
      dataIndex: "requested_amount",
      id: 3,
      willBeSorted: true,
      render: ({ total_price }: { total_price: string }) => (
        <p className="flex items-start leading-5 gap-1">
          <span>SAR</span> <span>{Number(total_price).toFixed(2)}</span>
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      id: 4,
      willBeSorted: true,
      render: ({
        status,
        quotes_accepted_upto,
        uuid,
      }: {
        status: string;
        quotes_accepted_upto: string;
        uuid?: string;
      }) => {
        remainingTime(quotes_accepted_upto) === "End date has passed" &&
          onExpiredClickFunc(uuid);
          const statusOptions = purchaseRequestStatusOptions(language);
        const upperCaseStatus = status?.toLocaleUpperCase();
        const statusOption = statusOptions?.find(
          (option) => option.value === upperCaseStatus
        );
        const className = statusStyles[status] || "";
        return (
          <div>
            {remainingTime(quotes_accepted_upto) === "End date has passed" ? (
              <p className="text-primaryRed bg-primaryRed/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center ">
                {statusOption?.label}
              </p>
            ) : (
              <>
                <p className={className}>{statusOption?.label}</p>
              </>
            )}
          </div>
        );
      },
    },

    {
      title: "Actions",
      dataIndex: "actions",
      id: 4,
      render: ({ uuid, status }: { uuid: string; status: string }) => (
        <div className="relative inline-block w-full rtl:text-right ">
          <button
            id="dropdownMenuIconButton"
            data-dropdown-toggle="dropdownDots"
            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none  focus:ring-gray-50 "
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
                  className="py-2 text-sm text-gray-700"
                  aria-labelledby="dropdownMenuIconButton"
                >
                  <li
                    className="cursor-pointer"
                    onClick={
                      status === "NEW"
                        ? () => onEditFunc(uuid)
                        : () => onViewFunc(uuid)
                    }
                  >
                    <p className="block px-4 py-2 hover:bg-gray-100 ">
                      {status === "NEW" ? (
                        <FormattedMessage id="Edit" />
                      ) : (
                        <FormattedMessage id="View" />
                      )}
                    </p>
                  </li>
                  {given_permissions.find(
                    (item) => item.name === "Delete Purchase Request"
                  )?.granted &&
                    status !== purchaseReuestStatus.QUOTED &&
                    status !== purchaseReuestStatus.COMPLETED &&
                    status !== purchaseReuestStatus.EXPIRED && (
                      <li
                        className="cursor-pointer"
                        onClick={() => onDeleteFunc(uuid)}
                      >
                        <p className="block px-4 py-2 hover:bg-gray-100 hover:text-red-700 ">
                          <FormattedMessage id="Delete" />
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
