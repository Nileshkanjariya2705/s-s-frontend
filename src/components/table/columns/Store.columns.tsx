import { Button } from "components/button/Button";
import { ColumnProps } from "components/table/types";
import { StatusStyles } from "constant/common.constant";
import { statusDropdown } from "constant/dropdown.constant";
import { FormattedMessage } from "react-intl";

export const storeColumns: (
  onEditFunc: (id: string) => void,
  onViewFunc: (id: string) => void,
  language:string
) => ColumnProps[] = (onEditFunc, onViewFunc, language) => [
  {
    title: "Sr.No.",
    dataIndex: "created_at",
    id: 1,
    render: ({ index }) => (
      <p className="whitespace-nowrap rtl:text-right">{index}</p>
    ),
  },

  {
    title: "Name",
    dataIndex: "username",
    id: 2,
    render: ({ username }) => (
      <p className="whitespace-nowrap rtl:text-right">{username}</p>
    ),
    willBeSorted: true,
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
    render: ({ company_name }) => (
      <p className="whitespace-nowrap rtl:text-right">{company_name}</p>
    ),
    willBeSorted: true,
  },
  {
    title: "Phone Number",
    dataIndex: "phone",
    id: 5,
    render: ({ phone }) => (
      <p className="whitespace-nowrap rtl:text-right">{phone || "-"}</p>
    ),
    willBeSorted: true,
  },
  {
    title: "Verification Status",
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
    ),
  },
];
