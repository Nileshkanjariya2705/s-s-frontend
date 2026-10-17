import { Table } from "components/table/Table";
import { ApiParamsType, ColumnProps } from "components/table/types";
import { perPage } from "constant/common.constant";
import { useEffect, useState } from "react";
import { getStoreInfo } from "../store/services/store.service";
import { DataProps, supplierEditType } from "./types/supplier.type";
import { supplierColumns } from "components/table/columns/Supplier.column";
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchFilterSchema } from "../store/schema/store.schema";
import { useOutsideClick } from "hooks/clickOutside";
import { searchFilterType } from "../store/types/store.type";
import { Button } from "components/button/Button";
import Input from "components/input/Input";
import CustomSelect from "components/customSelect/CustomSelect";
import { statusDropdown } from "constant/dropdown.constant";
import useLocale from "hooks/useLocale";

const Supplier = () => {
  const { language } = useLocale()
  const [supplierData, setSupplierData] = useState<supplierEditType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    searchField: "username",
    extraParams: {},
  });
  const navigate = useNavigate();

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );
  const intl = useIntl();
  const ProductStatusLanguageWise = statusDropdown(language);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const getsupplierInfoData = await getStoreInfo({
        type: "supplier",
        apiParams: apiParams,
      });
      if (getsupplierInfoData) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: getsupplierInfoData?.data.data.count,
          };
        });
      }
      setIsLoading(false);
      setSupplierData(getsupplierInfoData?.data.data.getStoreInfo);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiParams.page, apiParams.sort, apiParams.isAsc, debouncedHtmlContent]);

  const columns: ColumnProps[] = supplierColumns(
    (uuid: string) => navigate(`/admin/supplier/view/${uuid}`),
    (uuid: string) => navigate(`/admin/supplier/edit/${uuid}`),
    language
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(searchFilterSchema) });
  const ref = useOutsideClick(() => {
    if (filterModal) {
      setFilterModal(false);
    }
  });

  const resetFilter = () => {
    apiParams.extraParams = {};
    reset();
    fetchData();
    setFilterModal(false);
  };

  const applyFilters = async (values: searchFilterType) => {
    try {
      setButtonLoader(true);
      apiParams.extraParams = { ...values };
      const filterdData = await getStoreInfo({
        type: "supplier",
        apiParams: apiParams,
      });

      if (filterdData) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: filterdData?.data.data.count,
          };
        });
      }
      setSupplierData(filterdData?.data?.data?.getStoreInfo);
      setButtonLoader(false);
      setFilterModal(false);
    } catch (error) {
      return error;
    }
  };
  return (
      <>
        <div className="relative w-full min-w-0 flex-auto ">
          <Table<DataProps>
            header={
              <>
                <div className="flex gap-3 items-center">
                  <FormattedMessage id="Supplier_Info" />
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center cursor-pointer"
                      onClick={() => setFilterModal(!filterModal)}
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
            data={supplierData}
            columns={columns}
            apiParams={apiParams}
            setApiParams={setApiParams}
            pagination={true}
            search={true}
            loading={isLoading}
          />
          {filterModal === true && (
            <>
              <div
                className=" p-8 bg-white block w-[calc(100vw-50px)] md:w-620px left-0 absolute top-16 z-20 px-5 py-6 rounded-md shadow-box-search rtl:left-0 rtl:right-0 lg:rtl:right-14"
                ref={ref}
              >
                <h4 className="text-black font-semibold capitalize border-b border-black/10 pb-3">
                  <FormattedMessage id="Search_Filter" />
                </h4>
                <div className="flex flex-wrap my-2 ">
                  <form onSubmit={handleSubmit(applyFilters)}>
                    <div>
                      <div className="flex flex-wrap -mx-3">
                        <div className="relative w-full lg:w-1/2 px-3 mb-3 md:mb-5">
                          <Input
                            label={<FormattedMessage id="Name" />}
                            errors={errors}
                            id="name"
                            register={register}
                            type="text"
                            placeholder={intl.formatMessage({
                              id: "Enter_Username",
                            })}
                            required={false}
                            style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                          />
                        </div>
                        <div className="relative w-full lg:w-1/2 px-3 mb-3 md:mb-5">
                          <Input
                            label={<FormattedMessage id="Email" />}
                            errors={errors}
                            id="email"
                            register={register}
                            type="text"
                            placeholder={intl.formatMessage({
                              id: "Enter_Email",
                            })}
                            required={false}
                            style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                          />
                        </div>
                        <div className="relative w-full px-3 mb-3 md:mb-5 ">
                          <CustomSelect
                            label={<FormattedMessage id="Activation_Status" />}
                            options={
                              ProductStatusLanguageWise as {
                                value: string | boolean;
                                label?: string;
                                isdisabled?: boolean;
                              }[]
                            }
                            control={control}
                            register={register}
                            name="status"
                            error={errors}
                            required={false}
                            isSearchable={true}
                          />
                        </div>
                        <div className="relative  w-full  px-3 mb-3 md:mb-5 z-0">
                          <Input
                            label={<FormattedMessage id="Company_Name" />}
                            errors={errors}
                            id="company_name"
                            register={register}
                            type="text"
                            placeholder={intl.formatMessage({
                              id: "Enter_Company_Name",
                            })}
                            required={false}
                            style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
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

export default Supplier;
