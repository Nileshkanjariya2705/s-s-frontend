import { Button } from "components/button/Button";
import { ColumnProps, onBtnClickFunc } from "components/table/types";
import { REACT_APP_IMAGE_PATH } from "config";
import { StatusStyles } from "constant/common.constant";
import { statusDropdown } from "constant/dropdown.constant";
import { FormattedMessage } from "react-intl";

export const categoriesColumns: (
  onRowEdit: onBtnClickFunc,
  onRowView: onBtnClickFunc,
  onRowDelete: onBtnClickFunc,
  lang: string
) => ColumnProps[] = (
  onRowEdit: onBtnClickFunc,
  onRowView: onBtnClickFunc,
  onRowDelete: onBtnClickFunc,
  lang: string
) => [
  {
    title: "Sr.No.",
    dataIndex: "uuid",
    id: 6,
    render: ({ index }: { uuid: string; index: number }) => <p className="whitespace-nowrap rtl:text-right">{index}</p>,
    willBeSorted: false,
  },

  {
    title: "Image",
    dataIndex: "image",
    id: 6,
    render: ({ image }: { image: string }) => (
      <img
        src={`${REACT_APP_IMAGE_PATH}/${image}`}
        width={25}
        height={25}
        className="w-8 h-8 md:w-10 md:h-10 object-contain"
        alt="logo"
      />
    ),
    willBeSorted: false,
  },
  {
    title: "Name",
    dataIndex: "name",
    id: 3,
    willBeSorted: true,
    render: ({
      name,
      name_ar,
      name_ur,
    }: {
      name: string;
      name_ar: string;
      name_ur: string;
    }) =>
      lang === "en" ? (
        <p className="whitespace-nowrap rtl:text-right">{name}</p>
      ) : lang === "ar" ? (
          <p className="whitespace-nowrap rtl:text-right">{name_ar}</p>
      ) : (
            <p className="whitespace-nowrap rtl:text-right">{[name_ur]}</p>
      ),
  },
  {
    title: "No of Products",
    dataIndex: "product_count",
    id: 4,
    render: ({ product_count }) => <p className="whitespace-nowrap rtl:text-right">{product_count}</p>,
    willBeSorted: false,
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
    id: 7,
    render: ({ uuid }: { uuid: string }) => (
      <div className="flex flex-row gap-5">
        <div
          onClick={() => onRowEdit({ uuid })}
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
