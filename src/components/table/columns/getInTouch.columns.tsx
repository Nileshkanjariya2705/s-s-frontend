import { Button } from "components/button/Button";
import { FormattedMessage } from "react-intl";
import { ColumnProps, onBtnClickFunc } from "../types";

export const getInTouchColumns: (
  onRowView: onBtnClickFunc,
  onRowDelete: onBtnClickFunc
) => ColumnProps[] = (onRowView: onBtnClickFunc, onRowDelete) => [
  {
    title: "Sr.No.",
    dataIndex: "sr_no",
    id: 1,
    willBeSorted: false,
    render: ({ index }: { uuid: string; index: number }) => <div>{index}</div>,
  },
  {
    title: "Firstname",
    dataIndex: "firstname",
    id: 2,
    willBeSorted: true,
  },
  {
    title: "Lastname",
    dataIndex: "lastname",
    id: 3,
    willBeSorted: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    id: 4,
    willBeSorted: true,
  },
  {
    title: "Phone",
    dataIndex: "phone",
    id: 5,
    willBeSorted: true,
  },
  {
    title: "Actions",
    dataIndex: "actions",
    id: 6,
    render: ({ uuid }: { uuid: string }) => (
      <div className="flex flex-row gap-5">
        <div
          onClick={() => onRowView({ uuid })}
          className="flex gap-1 items-center text-primarycolor  cursor-pointer"
        >
          <i className="icon-eye text-base text-primarycolor"></i>
          <Button
            text={<FormattedMessage id="View" />}
            type="button"
            className="text-primarycolor"
          ></Button>
        </div>
        <div
          onClick={() => onRowDelete({ uuid })}
          className="flex gap-1 items-center text-primarycolor  cursor-pointer"
        >
          <i className="icon-trash-alt text-base text-red-600"></i>
          <Button
            text={<FormattedMessage id="Delete" />}
            type="button"
            className="text-red-600"
          ></Button>
        </div>
      </div>
    ),
  },
];
