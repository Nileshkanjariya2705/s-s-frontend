import { Button } from "components/button/Button";
import { ColumnProps, onBtnClickFunc } from "../types";
import { FormattedMessage } from "react-intl";
import { StatusStyles } from "constant/common.constant";
import { statusDropdown } from "constant/dropdown.constant";
export type statusStyle = {
  [key: string]: string;
  INACTIVE: string;
  ACTIVE: string;
};
export const supplierColumns: (
  onViewFunc: onBtnClickFunc,
  onEditFunc: onBtnClickFunc,
  language:string
) => ColumnProps[] = (onViewFunc, onEditFunc, language) => [
  {
    title: "Sr.No.",
    dataIndex: "sr_no",
    id: 1,
    willBeSorted: false,
    render: ({ index }: { index: number }) => (
      <p className="whitespace-nowrap rtl:text-right">{index}</p>
    ),
  },

  {
    title: "Name",
    dataIndex: "username",
    id: 2,
    willBeSorted: true,
    render: ({ username }) => (
      <p className="whitespace-nowrap rtl:text-right">{username}</p>
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    id: 3,
    willBeSorted: true,
    render: ({ email }) => (
      <p className="whitespace-nowrap rtl:text-right">{email}</p>
    ),
  },
  {
    title: "Company Name",
    dataIndex: "company_name",
    id: 4,
    willBeSorted: true,
    render: ({ company_name }) => (
      <p className="whitespace-nowrap rtl:text-right">{company_name}</p>
    ),
  },
  {
    title: "Phone Number",
    dataIndex: "phone",
    id: 5,
    willBeSorted: true,
    render: ({ phone }) => (
      <p className="whitespace-nowrap rtl:text-right">{phone || "-"}</p>
    ),
  },
  {
    title: "Status",
    dataIndex: "is_verified",
    id: 6,
    willBeSorted: true,
    render: ({ is_verified }: { is_verified: boolean }) => (
      <p className="whitespace-nowrap rtl:text-right">
        {is_verified ? "Verified" : "Unverified"}{" "}
      </p>
    ),
  },
  {
    title: "Activation Status",
    dataIndex: "is_active",
    id: 7,
    willBeSorted: true,
    render: ({ is_active }) => {
      const statusOptions = statusDropdown(language);
      const res = is_active ? "ACTIVE" : "INACTIVE";
      const statusOption = statusOptions?.find(
        (option) => option.value === res
      );
      const className = StatusStyles[res] || "";
      return <span className={className}>{statusOption?.label}</span>;
    },
  },
  {
    title: "Actions",
    dataIndex: "actions",
    id: 8,
    render: ({ uuid }) => (
      <>
        <div className="flex flex-row gap-5">
          <div
            onClick={() => onEditFunc(uuid)}
            className="flex gap-1 items-center text-secondaryOrange cursor-pointer"
          >
            <i className="icon-edit-alt text-base"></i>
            <Button
              text={<FormattedMessage id="Edit" />}
              type="button"
              className="text-secondaryOrange"
            ></Button>
          </div>

          <div
            onClick={() => onViewFunc(uuid)}
            className="flex gap-1 items-center text-primarycolor  cursor-pointer"
          >
            <i className="icon-eye text-base text-primarycolor"></i>
            <Button
              text={<FormattedMessage id="View" />}
              type="button"
              className="text-primarycolor"
            ></Button>
          </div>
        </div>
      </>
    ),
  },
];
