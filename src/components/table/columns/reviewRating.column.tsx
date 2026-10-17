import { Button } from "components/button/Button";
import { FormattedMessage } from "react-intl";
import { ColumnProps, onBtnClickFunc } from "../types";
import { productInfo } from "pages/supplier/reviewRating/types/reviewRating.type";
import { JSX } from "react/jsx-runtime";

export const reviewRatingColumns: (
  onViewFunc: onBtnClickFunc,
  language: string
) => ColumnProps[] = (onViewFunc, language) => {
  return [
    {
      title: "Sr.No.",
      dataIndex: "uuid",
      id: 1,
      willBeSorted: false,
      render: ({ index }: { uuid: string; index: number }) => (
        <p className="rtl:text-right">{index}</p>
      ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      id: 2,
      willBeSorted: true,
      render: ({ product_info }: { product_info: productInfo }) =>
        language === "en" ? (
          <p className="rtl:text-right">
            {product_info.name_en}
          </p>
        ) : language === "ur" ? (
          <p className="rtl:text-right">
            {product_info.name_ur}
          </p>
        ) : (
          <p className="rtl:text-right">
            {product_info.name_ar}
          </p>
        ),
    },
    {
      title: "Store Id",
      dataIndex: "Store_Id",
      id: 3,
      willBeSorted: false,
      render: ({ store_info_uuid }: { store_info_uuid: string }) => (
        <p className="text-sm  rtl:text-right flex items-start leading-5 gap-1 text-primarycolor font-semibold">
          #{store_info_uuid.slice(0, 8)}
        </p>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      id: 4,
      willBeSorted: true,
      render: ({ rating }: { rating: number }) => {
        const stars: number[] = [];
        const items: JSX.Element[] = [];
        for (let i = 0; i < rating; i++) {
          stars.push(i + 1);
        }
        [1, 2, 3, 4, 5].map((_ele: any, index: number) => {
          stars.includes(index + 1)
            ? items.push(
                <i className="icon-star-fill text-PrimaryYellow text-base"></i>
              )
            : items.push(
                <i className="icon-star-outline text-base text-PrimaryYellow"></i>
              );
        });
        return items as any;
      },
    },

    {
      title: "Actions",
      dataIndex: "Actions",
      id: 5,
      render: ({ uuid }: { uuid: string }) => (
        <div
          className="flex flex-row gap-2 hover:cursor-pointer items-center"
          onClick={() => {
            onViewFunc(uuid);
          }}
        >
          <i className="icon-eye text-base text-primarycolor"></i>
          <Button
            text={<FormattedMessage id="View" />}
            type="button"
            className="text-primarycolor"
          ></Button>
        </div>
      ),
    },
  ];
};
