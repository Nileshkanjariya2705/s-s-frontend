import { Button } from "components/button/Button";
import { ColumnProps, onBtnClickFunc } from "../types";
import { FormattedMessage } from "react-intl";
import { StatusStyles } from "constant/common.constant";
import { statusDropdown } from "constant/dropdown.constant";

export const measurementColumns: (
  onEditFunc: onBtnClickFunc,
  onDeleteFunc: onBtnClickFunc,
  lang: string
) => ColumnProps[] = (onEditFunc, onDeleteFunc, lang) => [
  {
    title: "Sr.No.",
    dataIndex: "sr_no",
    id: 1,
    willBeSorted: false,
    render: ({ index }: { index: number }) => <p className="whitespace-nowrap rtl:text-right">{index}</p>,
  },
  {
    title: "Unit Name",
    dataIndex: "unit_name",
    id: 2,
    willBeSorted: true,
    render: ({
      unit_name,
      unit_name_ar,
      unit_name_ur,
    }: {
      unit_name: string;
      unit_name_ar: string;
      unit_name_ur: string;
    }) =>
      lang === "en" ? (
        <p className="whitespace-nowrap rtl:text-right">{unit_name}</p>
      ) : lang === "ar" ? (
          <p className="whitespace-nowrap rtl:text-right">{unit_name_ar}</p>
      ) : (
            <p className="whitespace-nowrap rtl:text-right">{unit_name_ur}</p>
      ),
  },
  {
    title: "Unit Short Name",
    dataIndex: "unit_short_name",
    id: 3,
    willBeSorted: true,
    render: ({
      unit_short_name,
      unit_short_name_ar,
      unit_short_name_ur,
    }: {
      unit_short_name: string;
      unit_short_name_ar: string;
      unit_short_name_ur: string;
    }) =>
      lang === "en" ? (
        <p className="whitespace-nowrap rtl:text-right">{unit_short_name}</p>
      ) : lang === "ar" ? (
          <p className="whitespace-nowrap rtl:text-right">{unit_short_name_ar}</p>
      ) : (
            <p className="whitespace-nowrap rtl:text-right">{unit_short_name_ur}</p>
      ),
  },
  {
    title: "Status",
    dataIndex: "status",
    id: 5,
    willBeSorted: true,
    render: ({ status }: { status: string }) => {
      const statusOptions = statusDropdown(lang);
      const upperCaseStatus = status?.toLocaleUpperCase();
      const statusOption = statusOptions?.find(
        (option) => option.value === upperCaseStatus
      );
      const res = status === "ACTIVE" ? "ACTIVE" : "INACTIVE";
      const className = StatusStyles[res] || "";
      return <span className={className}>{statusOption?.label}</span>;
    },
  },
  {
    title: "Actions",
    dataIndex: "actions",
    id: 4,
    render: ({ uuid }: { uuid: string }) => (
      <div className="flex flex-row gap-5">
        <div
          onClick={() => onEditFunc(uuid)}
          className="flex gap-1 items-center text-secondaryOrange  cursor-pointer"
        >
          <i className="icon-edit-alt text-base"></i>
          <Button
            text={<FormattedMessage id="Edit" />}
            type="button"
            className="text-secondaryOrange"
          ></Button>
        </div>

        <div
          onClick={() => onDeleteFunc(uuid)}
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
