import { ApiParamsType, ColumnProps } from "components/table/types";
import { perPage } from "constant/common.constant";
import { useEffect, useState } from "react";
import { getOrders } from "./services/order.services";
import { Table } from "components/table/Table";
import { OrderDetailsColumns } from "components/table/columns/orderDetails.column";
import { useNavigate } from "react-router-dom";
import useUserData from "hooks/getUserData";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";
import { Button } from "components/button/Button";
import { useOutsideClick } from "hooks/clickOutside";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supplierOrderSearchFilter } from "pages/store/purchaseHistory/schema/FilterModelSchema";
import Input from "components/input/Input";
import CustomSelect from "components/customSelect/CustomSelect";
import { OrderStatus } from "constant/dropdown.constant";
import { DropdownType } from "pages/store/purchaseHistory/types/purchaseHistory.type";
import { searchFilterType } from "./types/order.type";
import RangeDatePicker from "components/datePicker/RangeDatePicker";
import useLocale from "hooks/useLocale";

const OrderDetails = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    searchField: "company_name",
    extraParams: {},
  });
  const { user_entity_uuid } = useUserData();
  const navigate = useNavigate();
  const [filterModel, setFilterModal] = useState<boolean>(false);
  const [storeDetail, setStoreDetail] = useState<DropdownType[]>([]);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const { language } = useLocale()
  
  const intl = useIntl();
  const OrderStatusLanguageWise = OrderStatus(language);

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  const getOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrders(user_entity_uuid, apiParams);
      if (response?.data?.data?.orderDetail?.rows) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: response?.data.data.orderDetail.count,
          };
        });
      }
      if (response) {
        const uniqueOrders = response?.data?.data?.orderDetail?.rows.reduce(
          (unique: any, order: any) => {
            const existingOrder = unique.find(
              (item: any) => item.uuid === order.uuid
            );

            if (!existingOrder) {
              unique.push(order);
            }

            return unique;
          },
          []
        );
        setOrderData(uniqueOrders);
        setStoreDetail(response?.data?.data?.allStores);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      return error;
    }
  };
  const columns: ColumnProps[] = OrderDetailsColumns((uuid: string) =>
    navigate(`/orders/view/${uuid}`)
  );
  useEffect(() => {
    getOrderDetails();
  }, [
    apiParams?.page,
    apiParams?.sort,
    apiParams?.isAsc,
    debouncedHtmlContent,
  ]);

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
    resolver: yupResolver(supplierOrderSearchFilter),
  });
  const applyFilters = async (values: searchFilterType) => {
    try {
      setButtonLoader(true);
      Object.keys(values).forEach((key) => {
        if (values[key as keyof searchFilterType] === "") {
          delete values[key as keyof searchFilterType];
        }
      });
      apiParams.extraParams = { ...values };
      const filteredData = await getOrders(user_entity_uuid, apiParams);
      if (filteredData?.data?.data?.orderDetail?.rows) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: filteredData?.data.data.orderDetail.count,
          };
        });
      }
      if (filteredData) {
        const uniqueOrders = filteredData?.data?.data?.orderDetail?.rows.reduce(
          (unique: any, order: any) => {
            const existingOrder = unique.find(
              (item: any) => item.uuid === order.uuid
            );

            if (!existingOrder) {
              unique.push(order);
            }

            return unique;
          },
          []
        );
        setOrderData(uniqueOrders);
        setStoreDetail(filteredData?.data?.data?.allStores);
        setFilterModal(false);
        setButtonLoader(false);
        setLoading(false);
      }
    } catch (error) {
      return error;
    }
  };
  const resetFilter = () => {
    apiParams.extraParams = {};
    reset();
    getOrderDetails();
    setFilterModal(false);
  };

  return (
    <>
      {/* {loading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : ( */}
      <div className="w-full xl:w-3/4 space-y-30px relative">
        <Table
          header={
            <>
              <div className="flex gap-3 items-center">
                <FormattedMessage id="Orders" />
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
                <form className="w-full" onSubmit={handleSubmit(applyFilters)}>
                  <div>
                    <div className="flex flex-wrap -mx-3">
                      <div className="relative w-full lg:w-1/2 px-3 mb-3 md:mb-5">
                        <Input
                          label={<FormattedMessage id="Order_Id" />}
                          errors={errors}
                          id="order_id"
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
                          name="order_status"
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
                        <CustomSelect
                          label={<FormattedMessage id="Store_Company" />}
                          options={storeDetail}
                          control={control}
                          register={register}
                          name="store_company"
                          error={errors}
                          required={false}
                          isSearchable={true}
                        />
                      </div>
                      <div className="relative  w-full  px-3 mb-3 md:mb-5 z-0">
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
                          label={<FormattedMessage id="Order_date" />}
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
      {/* )} */}
    </>
  );
};

export default OrderDetails;
