import { Button } from "components/button/Button";
import { ColumnProps, onBtnClickFunc } from "components/table/types";
import moment from "moment";
import { FormattedMessage } from "react-intl";

export const CardsColumns: (onRowDelete: onBtnClickFunc) => ColumnProps[] = (
  onRowDelete: onBtnClickFunc
) => [
  {
    title: "Sr.No.",
    dataIndex: "uuid",
    id: 1,
    render: ({ index }: { uuid: string; index: number }) => (
      <p className="whitespace-nowrap rtl:text-right">{index}</p>
    ),
    willBeSorted: false,
  },

  {
    title: "Card Name",
    dataIndex: "card_name",
    id: 2,
    willBeSorted: true,
    render: ({ card_name }: { card_name: string }) => (
      <p className="flex flex-row gap-2 whitespace-nowrap rtl:text-right">
        {" "}
        {card_name}
      </p>
    ),
  },

  {
    title: "Created_Date",
    dataIndex: "created_at",
    id: 3,
    render: ({ created_at }: { created_at: string }) => (
      <p className="flex flex-row gap-2 whitespace-nowrap rtl:text-right">
        {" "}
        {moment(created_at).format("DD-MM-YYYY, HH:mm")}{" "}
      </p>
    ),
    willBeSorted: true,
  },
  {
    title: "Actions",
    dataIndex: "actions",
    id: 6,
    render: ({ uuid, card_name }: { uuid: string; card_name: string }) => (
      <div
        onClick={() => onRowDelete({ uuid, card_name })}
        className="flex gap-1 items-center text-primarycolor  cursor-pointer"
      >
        <i className="icon-trash-alt text-base text-red-600"></i>
        <Button
          text={<FormattedMessage id="Delete" />}
          type="button"
          className="text-red-600"
        ></Button>
      </div>
    ),
  },
];
