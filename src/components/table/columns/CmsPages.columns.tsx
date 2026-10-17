import { Button } from "components/button/Button";
import { ColumnProps, onBtnClickFunc } from "../types";
import { FormattedMessage } from "react-intl";

export const cmsPagesColumn: (
  onEditFunc: onBtnClickFunc,
  onSlugClick: onBtnClickFunc
) => ColumnProps[] = (onEditFunc, onSlugClick) => [
  {
    title: "Sr.No.",
    dataIndex: "id",
    id: 1,
    render: ({ index }) => <p className="whitespace-nowrap rtl:text-right">{index}</p>,
    willBeSorted: false,
  },
  {
    title: "Title",
    dataIndex: "page_title",
    id: 1,
    render: ({ page_title }) => <p className="whitespace-nowrap rtl:text-right">{page_title}</p>,
    willBeSorted: false,
  },
  {
    title: "Slug",
    dataIndex: "slug",
    id: 3,
    willBeSorted: false,
    render: ({ slug }: { slug: string }) => (
      <>
        <div
          className="flex gap-3 items-center text-primarycolor cursor-pointer"
          onClick={() => {
            onSlugClick({ slug });
          }}
        >
          <i className="icon-slug"></i>
          <span className="">{slug}</span>
        </div>
      </>
    ),
  },
  {
    title: "Actions",
    dataIndex: "actions",
    id: 4,
    render: ({ uuid, page_title }: { uuid: string; page_title: string }) => {
      let Page_title = page_title.toLowerCase().replace(/\s+/g, "-");

      return (
        <div className="flex flex-row gap-2 hover:cursor-pointer">
          <div
            className="flex gap-3 items-center text-secondaryOrange"
            onClick={() => {
              onEditFunc({ uuid, Page_title });
            }}
          >
            <i className="icon-edit-alt text-base"></i>
            <Button
              text={<FormattedMessage id="Edit" />}
              type="button"
            ></Button>
          </div>
        </div>
      );
    },
  },
];

export const dataSourceColumn: (onViewFunc: onBtnClickFunc) => ColumnProps[] = (
  onViewFunc
) => [
  {
    title: "Sr.No.",
    dataIndex: "id",
    id: 1,
    render: ({ index }) => index,
    willBeSorted: false,
  },

  {
    title: "Cards",
    dataIndex: "title",
    id: 1,
    willBeSorted: false,
  },
  {
    title: "count",
    dataIndex: "id",
    id: 1,
    render: ({ getCountOfBlogs }) => (
      <>
        <div className="text-start pl-3">{getCountOfBlogs}</div>
      </>
    ),
    willBeSorted: false,
  },
  {
    title: "Actions",
    dataIndex: "actions",
    id: 2,
    render: ({ uuid, url }: any) => (
      <>
        <div
          className="flex flex-row gap-2 hover:cursor-pointer items-center"
          onClick={() => {
            onViewFunc({ uuid, url });
          }}
        >
          <i className="icon-eye text-base text-primarycolor"></i>
          <Button
            text={<FormattedMessage id="View" />}
            type="button"
            className="text-primarycolor"
          ></Button>
        </div>
      </>
    ),
  },
];
