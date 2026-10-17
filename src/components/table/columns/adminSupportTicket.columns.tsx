import { Button } from "components/button/Button";
import { ColumnProps, onBtnClickFunc } from "components/table/types";
import { statusStyles } from "constant/common.constant";
import { supportTicketOptions } from "constant/dropdown.constant";
import useLocale from "hooks/useLocale";
import moment from "moment";

export type statusStyle = {
  [key: string]: string;
  OPEN: string;
  NEW: string;
  CLOSED: string;
};

export const AdminSupportTicketColumns: (
  onViewFunc: onBtnClickFunc
) => ColumnProps[] = (onViewFunc) => {
  const { language } = useLocale();
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
        <div>
          {supportTicketMessages.length > 0 ? (
            <span className="flex gap-1 items-center">
              {ticket_number}
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primarycolor/30">
                <p className="text-black font-semibold text-xs">
                  {supportTicketMessages.length}{" "}
                </p>
              </span>
            </span>
          ) : (
            <span>{ticket_number}</span>
          )}
        </div>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      id: 2,
      willBeSorted: false,
      render: ({ sending_date }) => {
        return (
          <>
            <span>{moment(sending_date).format("DD-MM-YYYY, HH:mm")}</span>
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
          <span>{subject}</span>
        </>
      ),
    },
    {
      title: "Company Name",
      dataIndex: "company_name",
      id: 4,
      willBeSorted: true,
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
      id: 4,
      render: ({ uuid }: { uuid: string }) => (
        <div>
          <div
            onClick={() => onViewFunc(uuid)}
            className="flex gap-1 items-center text-primarycolor  cursor-pointer "
          >
            <i className="icon-eye text-base text-primarycolor"></i>
            <Button
              text="View"
              type="button"
              className="text-primarycolor"
            ></Button>
          </div>
        </div>
      ),
    },
  ];
};
