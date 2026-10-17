import { AdminSupportTicketColumns } from "components/table/columns/adminSupportTicket.columns";
import { Table } from "components/table/Table";
import { ApiParamsType } from "components/table/types";
import { perPage } from "constant/common.constant";
import { getSupportTicketData } from "pages/supportTicket/services/supportTicket.services";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import {
  AdminSupportTicketFilerType,
  AdminSupportTicketTableType,
} from "./types/supportTicket.types";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";
import { Button } from "components/button/Button";
import { useOutsideClick } from "hooks/clickOutside";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supportTicketFilterSchema } from "./schema/supportTicketFilterSchema";
import Input from "components/input/Input";
import CustomSelect from "components/customSelect/CustomSelect";
import { supportTicketOptions } from "constant/dropdown.constant";
import RangeDatePicker from "components/datePicker/RangeDatePicker";
import { language } from "i18n/messages/messages";

const SupportTicket = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const columns = AdminSupportTicketColumns((ticketId: string) =>
    navigate(`/admin/support-ticket/view/${ticketId}`)
  );
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [filterModel, setFilterModal] = useState<boolean>(false);
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
  });
  const ref = useOutsideClick(() => {
    if (filterModel) {
      setFilterModal(false);
    }
  });
  const [supportTicketData, setSupportTicketData] = useState([]);
  const { role, uuid } = useSelector((state: RootState) => ({
    role: state.account.role,
    uuid: state.account.uuid,
  }));
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm<AdminSupportTicketFilerType>({
    resolver: yupResolver(supportTicketFilterSchema),
  });
  const getSupportTicket = async () => {
    try {
      setIsLoading(true);
      const resp = await getSupportTicketData(uuid, apiParams, role);
      if (resp?.data?.data) {
        setSupportTicketData(resp.data.data.allSupportTickets);
        setApiParams((params) => {
          return {
            ...params,
            count: resp?.data?.data?.count,
          };
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  useEffect(() => {
    getSupportTicket();
  }, [apiParams.page, apiParams.count, apiParams.isAsc, debouncedHtmlContent]);
  const applyFilters = async (values: AdminSupportTicketFilerType) => {
    try {
      setButtonLoader(true);
      Object.keys(values).forEach((key) => {
        if (values[key as keyof AdminSupportTicketFilerType] === "") {
          delete values[key as keyof AdminSupportTicketFilerType];
        }
      });
      apiParams.extraParams = { ...values };
      const applyFilter = await getSupportTicketData(uuid, apiParams, role);
      if (applyFilter) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: applyFilter?.data?.data?.count,
          };
        });
      }
      setSupportTicketData(applyFilter.data.data.allSupportTickets);
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
    getSupportTicket();
    setFilterModal(false);
  };
  return (
    <>
      <div className="w-full space-y-30px relative">
        <Table<AdminSupportTicketTableType>
          header={
            <>
              <div className="flex gap-3 items-center">
                <FormattedMessage id="Support_Ticket" />
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
          data={supportTicketData}
          apiParams={apiParams}
          setApiParams={setApiParams}
          search={true}
          loading={isLoading}
        />
        {filterModel == true && (
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
                          label={<FormattedMessage id="Ticket_ID" />}
                          errors={errors}
                          id="ticket_uuid"
                          register={register}
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "Enter_Ticket_Id",
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
                          options={supportTicketOptions(language) ?? []}
                          register={register}
                          required={false}
                          error={errors}
                          isSearchable={false}
                        />
                      </div>
                      <div className="relative w-full  px-3 mb-3 md:mb-5">
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

                      <div className="relative  w-full  px-3 mb-3 md:mb-5 z-0">
                      <RangeDatePicker
                          label={<FormattedMessage id="Tickets_By_Date" />}
                          required={false}
                          errors={errors}
                          id="created_at"
                          placeholder={intl.formatMessage({
                            id: "Enter_date",
                          })}
                          control={control}
                          name="created_at"
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

export default SupportTicket;
