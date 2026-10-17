import { Table } from "components/table/Table";
import { OrderReplacementDetails } from "components/table/columns/orderReplacementDetails.columns";
import { ApiParamsType } from "components/table/types";
import { perPage, responseType } from "constant/common.constant";
import useUserData from "hooks/getUserData";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "store";
import { getReplacementOrderDetails } from "../services/purchaseHistory.service";
import {
  ReplacementProduct,
  ReplacementProductResponseType,
  SupplierResponseType,
} from "../types/purchaseHistory.type";
import Loading from "components/globalLoader/Loading";
import { statusStyle } from "components/table/columns/Supplier.column";

const ReplacementOrderDetail = () => {
  const navigate = useNavigate();
  const { user_entity_uuid } = useUserData();
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [replacementDetails, setReplacementDetails] = useState<
    ReplacementProduct[]
  >([]);
  const payment_uuid: string = params.orderId as string;
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
  });
  const { langauge } = useSelector((state: RootState) => ({
    langauge: state.language.language,
  }));
  const columns = OrderReplacementDetails(langauge as string);

  const getReplacementDetails = async () => {
    try {
      setLoading(true);
      const ReplacementOrderResponse = await getReplacementOrderDetails({
        payment_uuid,
        user_entity_uuid,
        apiParams,
      });
      if (ReplacementOrderResponse.data.responseType === responseType.Success) {
        const mergedData: ReplacementProduct[] =
          ReplacementOrderResponse?.data?.data.replacementProducts.map(
            (replacement: ReplacementProductResponseType) => ({
              ...replacement,
              supplierResponse:
                ReplacementOrderResponse?.data?.data.supplierResponse.filter(
                  (response: SupplierResponseType) =>
                    response.product_uuid ===
                    replacement?.supplierProductQuotes?.ProductPurchaseRequests
                      ?.product_uuid
                      ? replacement?.supplierProductQuotes
                          ?.ProductPurchaseRequests?.product_uuid
                      : replacement.product?.uuid
                ),
            })
          );
        setReplacementDetails(mergedData);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };
  useEffect(() => {
    getReplacementDetails();
  }, [payment_uuid]);

  const statusStyles: statusStyle = {
    IN_TRANSIT:
      "text-secondaryOrange bg-secondaryOrange/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center whitespace-nowrap",
    PACKAGED:
      "text-darkgrey bg-darkgrey/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center",
    ACCEPTED:
      "text-secondaryBlue bg-secondaryBlue/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
    DELIVERED:
      "text-lightgreen bg-lightgreen/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
    CANCELLED:
      "text-primaryRed bg-primaryRed/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center",
    PENDING:
      "text-primaryRed bg-primaryRed/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
    INACTIVE: "",
    ACTIVE: "",
    REJECTED:
      "text-purple bg-purple/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
  };
  let className = "";
  if (replacementDetails[0]?.supplierResponse) {
    className =
      statusStyles[
        replacementDetails[0]?.supplierResponse[0]?.orders
          ?.replacement_status as string
      ];
  }
  return (
    <div className="w-full border border-black/10 rounded-xl p-5 ">
      <div className="flex items-center justify-between mt-4">
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
            <i
              className="icon-left_arrow text-24px text-primarycolor hover:cursor-pointer"
              onClick={() => navigate("/replacement-orders")}
            ></i>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-black flex gap-4">
            <p>{<FormattedMessage id="Replacement_order_detail" />}</p>
            {replacementDetails[0]?.supplierResponse && (
              <p className={className}>
                {
                  replacementDetails[0]?.supplierResponse[0]?.orders?.replacement_status.replace(
                    "_",
                    " "
                  ) as string
                }
              </p>
            )}
          </h2>
        </div>
      </div>
      {loading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <>
          <Table
            apiParams={apiParams}
            setApiParams={setApiParams}
            columns={columns}
            data={replacementDetails}
            header={<></>}
            search={false}
            pagination={false}
            additionalStyle={`border-black/10 rounded-14px p-0`}
          />
        </>
      )}
    </div>
  );
};

export default ReplacementOrderDetail;
