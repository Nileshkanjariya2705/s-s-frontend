import { BankTransferColumns } from "components/table/columns/bankTransfer.columns";
import { Table } from "components/table/Table";
import { ApiParamsType } from "components/table/types";
import { perPage } from "constant/common.constant";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { bankTransferList } from "./service/storeBankPayment.service";
import useOwnerData from "hooks/getOwnerData";
import useDebounce from "hooks/useDebounce";
import { Button } from "components/button/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchFilterType } from "./types/bankTransfer.types";
import { BankTransferFilterSchema } from "./schema/BankTransferFilterSchema";
import { useOutsideClick } from "hooks/clickOutside";
import Input from "components/input/Input";
import CustomSelect from "components/customSelect/CustomSelect";
import { OrderStatus } from "constant/dropdown.constant";
import RangeDatePicker from "components/datePicker/RangeDatePicker";
import useLocale from "hooks/useLocale";

const BankTransfer = () => {
  const intl = useIntl();
  const { language } = useLocale()
  const navigate = useNavigate();
  const [bankPaymentOrder, setBankPaymentOrder] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { store_uuid } = useOwnerData();

  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
  });
  const [filterModel, setFilterModal] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);


  const OrderStatusLanguageWise = OrderStatus(language);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(BankTransferFilterSchema),
  });

  const ref = useOutsideClick(() => {
    if (filterModel) {
      setFilterModal(false);
    }
  });
  const getAllOrder = async () => {
    try {
      setLoading(true);
      const bankPaymentList = await bankTransferList({
        store_info_uuid: store_uuid,
        apiParams,
      });

      if (bankPaymentList?.data?.data?.rows) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: bankPaymentList?.data.data.count,
          };
        });
      }

      setBankPaymentOrder(bankPaymentList?.data?.data?.rows);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  useEffect(() => {
    if (store_uuid) {
      getAllOrder();
    }
  }, [apiParams.isAsc, apiParams.sort, apiParams.page, debouncedHtmlContent]);

  const columns = BankTransferColumns(({ order_id }: { order_id: string }) => {
    onRowView({ order_id });
  });

  const onRowView = ({ order_id }: { order_id: string }) => {
    navigate(`/bank-transfer-order/${order_id}`);
  };
  const applyFilters = async (values: searchFilterType) => {
    try {
      setButtonLoader(true);
      Object.keys(values).forEach((key) => {
        if (values[key as keyof searchFilterType] === "") {
          delete values[key as keyof searchFilterType];
        }
      });
      apiParams.extraParams = { ...values };
      const applyFilter = await bankTransferList({
        store_info_uuid: store_uuid,
        apiParams,
      });
      if (applyFilter) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: applyFilter?.data.data.count,
          };
        });
      }
      setBankPaymentOrder(applyFilter?.data?.data?.rows);
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
  return (
    <>
      <div className="w-full xl:w-3/4 space-y-30px relative">
        <Table
          header={
            <>
              <div className="flex gap-3 items-center">
                <FormattedMessage id="Bank_transfer" />
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
          columns={columns}
          pagination={true}
          data={bankPaymentOrder}
          apiParams={apiParams}
          setApiParams={setApiParams}
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
                <form className="w-full" onSubmit={handleSubmit(applyFilters)}>
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
                      <div className="relative w-full lg:w-1/2 px-3 mb-3 md:mb-5">
                        <CustomSelect
                          label={<FormattedMessage id="Status" />}
                          control={control}
                          name="status"
                          options={
                            OrderStatusLanguageWise as {
                              value: string | boolean;
                              label?: string;
                              isdisabled?: boolean;
                            }[]
                          }
                          register={register}
                          required={false}
                          error={errors}
                          isSearchable={false}
                        />
                      </div>
                      <div className="relative w-full px-3 mb-3 md:mb-5 ">
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

export default BankTransfer;
