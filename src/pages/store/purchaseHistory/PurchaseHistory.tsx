import { Table } from "components/table/Table";
import { ApiParamsType } from "components/table/types";
import { perPage } from "constant/common.constant";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PurchaseHistoryColumns } from "components/table/columns/purchaseHistory.columns";
import { getAllPurchaseHistory } from "./services/purchaseHistory.service";

import useUserData from "hooks/getUserData";
import {
  DropdownType,
  purchaseHistoryType,
  searchFilterType,
} from "./types/purchaseHistory.type";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";
import { Button } from "components/button/Button";
import Input from "components/input/Input";
import { useForm } from "react-hook-form";
import CustomSelect from "components/customSelect/CustomSelect";
import { OrderStatus } from "constant/dropdown.constant";
import { yupResolver } from "@hookform/resolvers/yup";
import { myOrdersSearchFilter } from "./schema/FilterModelSchema";
import { useOutsideClick } from "hooks/clickOutside";
import RangeDatePicker from "components/datePicker/RangeDatePicker";
import useLocale from "hooks/useLocale";

const PurchaseRequest = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { language } = useLocale()
  const OrderStatusLanguageWise = OrderStatus(language);
  const [purchaseHistory, setPurchaseHistory] = useState<purchaseHistoryType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterModel, setFilterModal] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [tab, setTab] = useState("SUCCESS");
  const [supplierDropdownOptions, setSupplierDropdownOptions] = useState<
    DropdownType[]
  >([]);

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
    resolver: yupResolver(myOrdersSearchFilter),
  });
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    extraParams: {},
  });

  const debounceSearch = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  const { user_entity_uuid } = useUserData();
  const handleTabChange = (tab: string) => {
    setTab(tab);
  };
  const getAllPurchaseHistoryDetail = async () => {
    try {
      !debounceSearch && setIsLoading(true);
      const res = await getAllPurchaseHistory({
        user_entity_uuid,
        apiParams,
        tab,
      });
      if (res) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: res?.data?.data?.purchaseHistory.count,
          };
        });
      }
      setPurchaseHistory(res?.data?.data?.purchaseHistory.rows);
      setSupplierDropdownOptions(res?.data?.data?.AllSupplier);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const columns = PurchaseHistoryColumns((uuid: string) =>
    navigate(`/purchase-history/${uuid}`)
  );

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  useEffect(() => {
    getAllPurchaseHistoryDetail();
  }, [
    apiParams.page,
    tab,
    apiParams.sort,
    debouncedHtmlContent,
    apiParams.isAsc,
  ]);

  const applyFilters = async (values: searchFilterType) => {
    try {
      setButtonLoader(true);
      Object.keys(values).forEach((key) => {
        if (values[key as keyof searchFilterType] === "") {
          delete values[key as keyof searchFilterType];
        }
      });
      apiParams.extraParams = { ...values };
      const applyFilter = await getAllPurchaseHistory({
        user_entity_uuid,
        apiParams,
        tab,
      });
      if (applyFilter) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: applyFilter?.data?.data?.purchaseHistory.count,
          };
        });
      }
      setPurchaseHistory(applyFilter?.data?.data?.purchaseHistory.rows);
      setSupplierDropdownOptions(applyFilter?.data?.data?.AllSupplier);
      setFilterModal(false);
      setButtonLoader(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setButtonLoader(false);
      return error;
    }
  };

  const resetFilter = () => {
    apiParams.extraParams = {};
    reset();
    getAllPurchaseHistoryDetail();
    setFilterModal(false);
  };
  return (
    <>
      <div className="w-full xl:w-3/4 space-y-30px relative">
        <div>
          <Table
            header={
              <>
                <div className="flex gap-3 items-center">
                  <FormattedMessage id="Purchase_History" />
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
                </div>{" "}
              </>
            }
            columns={columns}
            pagination={true}
            data={purchaseHistory}
            apiParams={apiParams}
            setApiParams={setApiParams}
            search={true}
            loading={isLoading}
            filters={
              <>
                <ul className="flex items-center bg-primarycolor/10 p-1.5 rounded-xl">
                  <li
                    className="mx-1 cursor-pointer"
                    onClick={() => handleTabChange("SUCCESS")}
                  >
                    <span
                      className={`text-xs md:text-sm font-normal px-3 md:px-5  ${
                        tab === "SUCCESS"
                          ? "text-white bg-primarycolor"
                          : "text-black"
                      }  py-2 rounded-xl inline-block `}
                    >
                      <FormattedMessage id="Success" />
                    </span>
                  </li>
                  <li
                    className="mx-1 cursor-pointer"
                    onClick={() => handleTabChange("FAILED")}
                  >
                    <span
                      className={`text-xs md:text-sm font-normal px-3 md:px-5  ${
                        tab === "FAILED"
                          ? "text-white bg-primarycolor"
                          : "text-black"
                      }  py-2 rounded-xl inline-block`}
                    >
                      <FormattedMessage id="Failed" />
                    </span>
                  </li>
                </ul>
              </>
            }
          />
        </div>
        {filterModel === true && (
          <>
            <div
              className="!mt-3 p-8 bg-white block w-full md:w-620px left-0 absolute top-16 z-20 px-5 py-6 rounded-md shadow-box-search rtl:left-0 rtl:right-0 lg:rtl:right-14"
              ref={ref}
            >
              <h4 className="text-black font-semibold capitalize border-b border-black/10 pb-3">
                <FormattedMessage id="Search_Filter" />
              </h4>
              <div className="flex flex-wrap my-2 ">
                <form className="w-full" onSubmit={handleSubmit(applyFilters)}>
                  <div>
                    <div className="flex flex-wrap -mx-3">
                      <div className="relative w-full lg:w-1/2 px-3 mb-3 md:mb-5">
                        <Input
                          label={<FormattedMessage id="Payment_Id" />}
                          errors={errors}
                          id="payment_uuid"
                          register={register}
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "Enter_Payment_Id",
                          })}
                          required={false}
                          // eslint-disable-next-line react/style-prop-object
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
                          label={<FormattedMessage id="Supplier_Company" />}
                          options={supplierDropdownOptions}
                          control={control}
                          register={register}
                          name="supplier_company"
                          error={errors}
                          required={false}
                          isSearchable={true}
                        />
                      </div>
                      <div className="relative  w-full  px-3 mb-3 md:mb-5 z-0">
                        <RangeDatePicker
                          label={<FormattedMessage id="Orders_After_Date" />}
                          required={false}
                          errors={errors}
                          id="expiry_date"
                          placeholder={intl.formatMessage({
                            id: "Enter_date",
                          })}
                          control={control}
                          name="expiry_date"
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

export default PurchaseRequest;
