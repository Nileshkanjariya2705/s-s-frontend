import { Table } from "components/table/Table";
import { ApiParamsType, ColumnProps } from "components/table/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { perPage } from "constant/common.constant";
import { adminBankTransfer } from "./services/bankTransfer.service";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";
import { adminBankTranferColumns } from "components/table/columns/adminBankTransfer.columns";
import { AdminOrderFinalTypes } from "../orders/types/order.type";
import { Button } from "components/button/Button";
import { useOutsideClick } from "hooks/clickOutside";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "components/input/Input";
import { BankTransferFilterSchema } from "./schema/BankTransferFilterSchema";
import RangeDatePicker from "components/datePicker/RangeDatePicker";
import useLocale from "hooks/useLocale";

const AdminOrder = () => {
  const intl = useIntl();
  const { language } = useLocale()
  const [loading, setLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<AdminOrderFinalTypes[]>([]);
  const [filterModel, setFilterModal] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    extraParams: {},
  });
  const ref = useOutsideClick(() => {
    if (filterModel) {
      setFilterModal(false);
    }
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(BankTransferFilterSchema),
  });

  const navigate = useNavigate();
  const columns: ColumnProps[] = adminBankTranferColumns(
    ({ uuid  }: { uuid: string }) => {
      navigate(`/admin/bank-transfer/view/${uuid}`)
    },
    language
  );

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  const getAllOrder = async () => {
    try {
      setLoading(true);
      const getOrders = await adminBankTransfer(apiParams);
      if (getOrders?.data?.data) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: getOrders?.data.data?.count,
          };
        });
      }
      setOrderData(getOrders?.data?.data?.rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const applyFilters = async (values: FieldValues) => {
    try {
      setButtonLoader(true);
      Object.keys(values).forEach((key) => {
        if (values[key as keyof FieldValues] === "") {
          delete values[key as keyof FieldValues];
        }
      });
      apiParams.extraParams = { ...values };
      const applyFilter = await adminBankTransfer(apiParams);
      if (applyFilter) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: applyFilter?.data.data.count,
          };
        });
      }
      setOrderData(applyFilter?.data?.data?.rows);
      setFilterModal(false);
      setButtonLoader(false);
    } catch (error) {
      setButtonLoader(false);
      return error;
    }
  };
  const resetFilter = () => {
    apiParams.extraParams = {};
    reset();
    getAllOrder();
    setFilterModal(false);
  };
  useEffect(() => {
    getAllOrder();
  }, [debouncedHtmlContent, apiParams.isAsc, apiParams.sort, apiParams.page]);
  return (
    <>
      <div className="relative">
        <Table
          header={
            <>
              <div className="flex gap-3 items-center">
                <FormattedMessage id="Bank_Transfer_Request" />
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center cursor-pointer"
                    onClick={() => setFilterModal(!filterModel)}
                  >
                    <Button
                      type="button"
                      className="icon-filter text-base text-primarycolor"
                    />
                  </div>
                </div>
              </div>
            </>
          }
          data={orderData}
          columns={columns}
          apiParams={apiParams}
          setApiParams={setApiParams}
          pagination={true}
          search={true}
          loading={loading}
        />
        {filterModel === true && (
          <>
            <div
              className="!mt-3 p-8 bg-white block w-full md:w-620px left-0 absolute top-16 z-20 px-5 py-6 rounded-md shadow-box-search rtl:left-0 rtl:right-0 lg:rtl:right-14"
              ref={ref}
            >
              <h4 className="text-black font-semibold capitalize border-b border-black/10 pb-3">
                <FormattedMessage id="Search_Filter" />
              </h4>
              <div className="flex flex-wrap my-2">
                <form onSubmit={handleSubmit(applyFilters)} className="w-full">
                  <div>
                    <div className="flex flex-wrap -mx-3">
                      <div className="relative w-full lg:w-1/2 px-3 mb-3 md:mb-5">
                        <Input
                          label={<FormattedMessage id="Order_Id" />}
                          errors={errors}
                          id="order_uuid"
                          register={register}
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "Enter_Order_Id",
                          })}
                          required={false}
                          style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                        />
                      </div>

                      <div className="relative w-full px-3 lg:w-1/2 mb-3 md:mb-5 ">
                        <Input
                          label={<FormattedMessage id="Amount" />}
                          errors={errors}
                          id="amount"
                          register={register}
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "Enter_Amount",
                          })}
                          required={false}
                          style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                        />
                      </div>
                      <div className="relative w-full lg:w-1/2 px-3 mb-3 md:mb-5 ">
                        <Input
                          label={<FormattedMessage id="Supplier_Name" />}
                          errors={errors}
                          id="supplier_company"
                          register={register}
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "Enter_Supplier_Company_Name",
                          })}
                          required={false}
                          style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                        />
                      </div>
                      <div className="relative w-full px-3 mb-3 md:mb-5 ">
                        <Input
                          label={<FormattedMessage id="Store_Name" />}
                          errors={errors}
                          id="store_company"
                          register={register}
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "Enter_Store_Company_Name",
                          })}
                          required={false}
                          style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                        />
                      </div>
                      <div className="relative  w-full  px-3 mb-3 md:mb-5 z-0">
                        <RangeDatePicker
                          label={<FormattedMessage id="Orders_After_Date" />}
                          required={false}
                          errors={errors}
                          id="order_date"
                          placeholder={intl.formatMessage({
                            id: "Enter_date",
                          })}
                          control={control}
                          name="order_date"
                          //cannot select past dates
                          minDate={false}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="mt-5 flex justify-center gap-5 w-full">
                        <Button
                          text={<FormattedMessage id="Reset" />}
                          type="button"
                          onClick={() => resetFilter()}
                          className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                        />{" "}
                        <Button
                          text={<FormattedMessage id="Apply" />}
                          type="submit"
                          loader={buttonLoader}
                          className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                        />{" "}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminOrder;
