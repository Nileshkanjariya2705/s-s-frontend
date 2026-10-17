import { Table } from "components/table/Table";

import { ApiParamsType, ColumnProps } from "components/table/types";
import { useEffect, useState } from "react";
import { perPage } from "constant/common.constant";

import {
  AdminOrderTypes,
  AmountCardWiseTypes,
  TabType,
} from "../orders/types/order.type";

import { adminPaymentInfo } from "./services/adminPayment.services";
import FiltersTab from "./components/FiltersTab";
import { FormattedMessage } from "react-intl";
import useDebounce from "hooks/useDebounce";
import { adminPayment } from "components/table/columns/adminPayment.columns";

const PaymentList = () => {
  const [orderData, setOrderData] = useState<AdminOrderTypes[]>([]);
  const [amountPaidByCard, setamountPaidByCard] =
    useState<AmountCardWiseTypes>();
  const [loading, setLoading] = useState<boolean>(true);

  const columns: ColumnProps[] = adminPayment();
  const [tab, setTab] = useState<TabType>("MADA");
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    searchField: "",
  });
  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  const getAllOrder = async () => {
    try {
      setLoading(true);
      const newApiParams = { ...apiParams, tab: tab };
      const getOrders = await adminPaymentInfo(newApiParams);

      if (getOrders?.data?.data) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: getOrders?.data.data.count,
          };
        });
      }
      let AmountRecived_MADA = 0;
      let AmountRecived_VISA = 0;
      let AmountRecived_MASTERCARD = 0;
      getOrders?.data?.data?.rows.reduce(
        (acc: number, item: { PaymentDetail: any[] }) => {
          if (item?.PaymentDetail?.[0]?.payment_method_type === "MADA") {
            AmountRecived_MADA += item?.PaymentDetail?.[0]?.amount;
          } else if (item?.PaymentDetail?.[0]?.payment_method_type === "VISA") {
            AmountRecived_VISA += item?.PaymentDetail?.[0]?.amount;
          } else if (
            item?.PaymentDetail?.[0]?.payment_method_type === "MASTERCARD"
          ) {
            AmountRecived_MASTERCARD += item?.PaymentDetail?.[0]?.amount;
          }
          return acc + item?.PaymentDetail?.[0]?.amount;
        },
        0
      );
      let AmountCardWise = {
        AmountRecived_MADA,
        AmountRecived_VISA,
        AmountRecived_MASTERCARD,
      };

      setOrderData(getOrders?.data?.data?.rows);
      setamountPaidByCard(AmountCardWise);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllOrder();
  }, [
    apiParams.isAsc,
    apiParams.sort,
    apiParams.page,
    debouncedHtmlContent,
    tab,
  ]);

  return (
    <div>
      <Table
        header={<FormattedMessage id="Orders" />}
        data={orderData}
        columns={columns}
        apiParams={apiParams}
        setApiParams={setApiParams}
        pagination={true}
        search={true}
        loading={loading}
        filters={
          <>
            <FiltersTab
              tab={tab}
              setTab={setTab}
              setApiParams={setApiParams}
              amountPaidByCard={amountPaidByCard}
            />
          </>
        }
      />
    </div>
  );
};

export default PaymentList;
