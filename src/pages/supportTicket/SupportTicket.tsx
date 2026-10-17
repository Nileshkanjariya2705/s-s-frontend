import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button/Button";
import Input from "components/input/Input";
import InputImage from "components/input/InputImage";
import { DeleteModal } from "components/model/DeleteModal";
import { Modal } from "components/model/Model";
import { SupportTicketColumns } from "components/table/columns/supportTicket.columns";
import { Table } from "components/table/Table";
import { ApiParamsType } from "components/table/types";
import TextArea from "components/textArea/Textarea";
import { perPage, responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  supportTicketFilterSchema,
  supportTicketValidation,
} from "./schema/supportTicket.schema";
import {
  createSupportTicket,
  deleteSupportTicket,
  getSupportTicketData,
} from "./services/supportTicket.services";
import {
  SupportTicketFilterFormType,
  SupportTicketFormType,
  SupportTicketTableType,
} from "./types/supportTicket";
import useUserData from "hooks/getUserData";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";
import { useOutsideClick } from "hooks/clickOutside";
import { supportTicketOptions } from "constant/dropdown.constant";
import CustomSelect from "components/customSelect/CustomSelect";
import RangeDatePicker from "components/datePicker/RangeDatePicker";
import useLocale from "hooks/useLocale";

const SupportTicket = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [ticketDeletedId, setTicketDeletedId] = useState<string>("");
  const [showSupportTicket, setShowSupportTicket] = useState<boolean>(false);
  const [supportTicketData, setSupportTicketData] = useState([]);
  const [createButtonLoader, setCreateButtonLoader] = useState<boolean>(false);
  const [filterModel, setFilterModal] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const handleCancel = () => {
    setShowSupportTicket(false);
    reset();
  };
  const columns = SupportTicketColumns(
    (uuid: string) => {
      navigate(`/support-ticket/view/${uuid}`);
    },
    (uuid: string) => {
      setShowDeleteModal(true);
      setTicketDeletedId(uuid);
    }
  );
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
  });
  const { given_permissions, uuid } = useUserData();
  const { language } = useLocale();

  const { user_entity_uuid, entity_type } = useUserData();
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SupportTicketFormType>({
    resolver: yupResolver(supportTicketValidation),
  });
  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    control,
  } = useForm<SupportTicketFilterFormType>({
    resolver: yupResolver(supportTicketFilterSchema),
    // defaultValues: searchedFilter,
  });

  const ref = useOutsideClick(() => {
    if (filterModel) {
      setFilterModal(false);
    }
  });
  const getSupportTicket = async () => {
    try {
      setIsLoading(true);
      let type :string= entity_type;
      if (entity_type === "STORE") {
        type = "STORE_OWNER";
      } else {
        type = "SUPPLIER_OWNER";
      }
      const resp = await getSupportTicketData(
        user_entity_uuid,
        apiParams,
        type
      );
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

  const onSubmit = handleSubmit(async (values: SupportTicketFormType) => {
    try {
      setCreateButtonLoader(true);
      let type :string= entity_type;
      if (entity_type === "STORE") {
        type = "STORE_OWNER";
      } else {
        type = "SUPPLIER_OWNER";
      }
      const formData: FormData = new FormData();
      formData.append("attachment", values?.attachment?.[0] as string | Blob);
      formData.append("subject", values?.subject);
      formData.append("text", values?.text);
      formData.append("entity_type", type);
      formData.append("user_uuid", uuid);
      formData.append("entity_uuid", user_entity_uuid);
      formData.append("language", language);

      const response = await createSupportTicket(formData);

      if (response?.data.responseType === responseType.Success) {
        showToast(response?.data.message, toastType.Success, intl);
        setShowSupportTicket(false);
        reset();
        getSupportTicket();
      } else {
        showToast(response?.data.message, toastType.Error, intl);
      }
      setCreateButtonLoader(false);
    } catch (error) {
      setCreateButtonLoader(false);
    }
  });

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  useEffect(() => {
    getSupportTicket();
  }, [apiParams.page, apiParams.isAsc, user_entity_uuid, debouncedHtmlContent]);

  const onSupportTicketDelete = async () => {
    try {
      setDeleteLoader(true);
      const response = await deleteSupportTicket(ticketDeletedId);
      if (response?.data.responseType === responseType.Success) {
        showToast(response?.data.message, toastType.Success, intl);
        await setShowDeleteModal(false);
        getSupportTicket();
        setApiParams((params) => {
          return {
            ...params,
            page: 1,
          };
        });
      } else {
        showToast(response?.data.message, toastType.Error, intl);
      }
      setDeleteLoader(false);
    } catch (err) {
      setDeleteLoader(false);
    }
  };
  const applyFilters = async (values: SupportTicketFilterFormType) => {
    try {
      setButtonLoader(true);

      Object.keys(values).forEach((key) => {
        if (values[key as keyof SupportTicketFilterFormType] === "") {
          delete values[key as keyof SupportTicketFilterFormType];
        }
      });
      apiParams.extraParams = { ...values };
      let type:string = entity_type;
      if (entity_type === "STORE") {
        type = "STORE_OWNER";
      } else {
        type = "SUPPLIER_OWNER";
      }
      const applyFilter = await getSupportTicketData(
        user_entity_uuid,
        apiParams,
        type
      );
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
      <div className="w-full xl:w-3/4 space-y-30px relative">
        <Table<SupportTicketTableType>
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
          filters={
            <>
              {given_permissions.find((item) => item.name === "Add Ticket")
                ?.granted && (
                <button
                  className="relative px-4 py-2 border rounded-xl border-primarycolor text-primarycolor text-base font-medium hover:text-white hover:bg-primarycolor"
                  onClick={() => {
                    setShowSupportTicket(true);
                  }}
                >
                  + <FormattedMessage id="Create_Ticket" />
                </button>
              )}
            </>
          }
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
                <form className="w-full" onSubmit={handleSubmit2(applyFilters)}>
                  <div>
                    <div className="flex flex-wrap -mx-3">
                      <div className="relative w-full lg:w-1/2 px-3 mb-3 md:mb-5">
                        <Input
                          label={<FormattedMessage id="Ticket_ID" />}
                          errors={errors2}
                          id="ticket_uuid"
                          register={register2}
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
                          register={register2}
                          required={false}
                          error={errors2}
                          isSearchable={false}
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
        {showSupportTicket && (
          <Modal
            showModal={showSupportTicket}
            title={<FormattedMessage id="Create_A_Ticket" />}
            setShowModal={setShowSupportTicket}
          >
            <div>
              <form onSubmit={onSubmit}>
                <div className="-mx-2">
                  <div className="relative px-2">
                    <Input
                      id="subject"
                      type="text"
                      label={<FormattedMessage id="Subject" />}
                      register={register}
                      required={true}
                      errors={errors}
                      placeholder={intl.formatMessage({
                        id: "Enter_Subject",
                      })}
                    />
                  </div>
                  <div className="relative mt-5 px-2">
                    <TextArea
                      id="text"
                      type="text"
                      name="text"
                      label={<FormattedMessage id="Description" />}
                      register={register}
                      required={true}
                      errors={errors}
                      placeholder={intl.formatMessage({
                        id: "Type_your_reply",
                      })}
                    />
                  </div>
                  <div className="relative mt-5 px-2 ">
                    <InputImage
                      type="file"
                      height={32}
                      errors={errors}
                      id="attachment"
                      register={register}
                      setValue={setValue}
                      isMulitple={false}
                      label={<FormattedMessage id="Upload_File" />}
                      style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]"
                    />
                  </div>
                </div>
                <hr className="border-black/10 my-1 mt-10" />
                <div className="flex justify-center gap-4 mt-4 md:!mt-8 w-full px-3 ">
                  <Button
                    text={<FormattedMessage id="Cancel" />}
                    type="button"
                    onClick={handleCancel}
                    disable={createButtonLoader}
                    className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                  ></Button>
                  <Button
                    text={<FormattedMessage id="Create_Ticket" />}
                    type="submit"
                    loader={createButtonLoader}
                    className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                  ></Button>
                </div>
              </form>
            </div>
          </Modal>
        )}
        {showDeleteModal ? (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            showModal={showDeleteModal}
            deleteId={ticketDeletedId}
            onDeleteClick={onSupportTicketDelete}
            deleteLoader={deleteLoader}
          />
        ) : null}
      </div>
    </>
  );
};
export default SupportTicket;
