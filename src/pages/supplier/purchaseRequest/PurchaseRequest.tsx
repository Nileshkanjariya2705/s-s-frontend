import { DeleteModal } from "components/model/DeleteModal";
import { ApiParamsType } from "components/table/types";
import useUserData from "hooks/getUserData";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteSupplierProductRequest,
  getAllPurchaseRequests,
} from "./services/purchaseRequest.service";
import {
  MyObjectType,
  SupplierQuote,
  openPurchaseRequest,
  quotedPurchaseRequest,
  searchFilterType,
  selectedTabType,
} from "./types/purchaseRequest.type";
import {
  perPage,
  purchaseReuestStatus,
  responseType,
} from "constant/common.constant";
import PurchaseRequestFilters from "./component/PurchaseRequestFilters";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";
import { Modal } from "components/model/Model";
import { Button } from "components/button/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchFilterSchema } from "./schema/purchaseRequest.schema";
import { useOutsideClick } from "hooks/clickOutside";
import Input from "components/input/Input";
import RangeDatePicker from "components/datePicker/RangeDatePicker";
import { REACT_APP_IMAGE_PATH } from "config";
import Pagination from "components/pagination/Pagination";
import Loading from "components/globalLoader/Loading";
import { NoData } from "components/noDataFound/NoDataFound";
import { Countdown } from "components/countDown/Countdown";
import useLocale from "hooks/useLocale";

const SupplierPurchaseRequest = () => {
  const { language } = useLocale();
  const { uuid, user_entity_uuid } = useUserData();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [requestDeletedId, setRequestDeletedId] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<selectedTabType>("OPEN");
  const [openProductIndex, setOpenProductIndex] = useState<MyObjectType>({});
  const [quotedProductIndex, setQuotedProductIndex] = useState<MyObjectType>(
    {}
  );

  const [openPurchaseRequest, setOpenPurchaseRequest] =
    useState<openPurchaseRequest[]>();

  const [quotedPurchaseRequest, setQuotedPurchaseRequest] =
    useState<quotedPurchaseRequest[]>();

  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<number>(0);
  const [showAlertMsgModal, setShowAlertMsgModal] = useState<boolean>(false);
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    searchField: "name",
    extraParams: {},
  });
  const navigate = useNavigate();
  const [filterModel, setFilterModal] = useState<boolean>(false);
  const [quotedFilter, setQuotedFilter] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [quotedLoader, setQuotedLoader] = useState<boolean>(false);

  const intl = useIntl();

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  const getPurchaseRequestData = async () => {
    try {
      !debouncedHtmlContent && setLoading(true);

      const response = await getAllPurchaseRequests(
        apiParams,
        selectedTab,
        uuid,
        user_entity_uuid
      );
      if (response?.data.responseType === responseType.Success) {
        if (response?.data?.data?.tab === "OPEN") {
          setOpenPurchaseRequest(response?.data?.data.result.rows);
          const obj: { [key: string]: number } = {};
          response?.data?.data.result.rows.forEach((d: openPurchaseRequest) => {
            obj[d.uuid] = 0;
          });
          setOpenProductIndex(obj);
        } else {
          setQuotedPurchaseRequest(response?.data?.data.result.rows);
          const obj: { [key: string]: number } = {};
          response?.data?.data.result.rows.forEach(
            (d: quotedPurchaseRequest) => {
              obj[d.uuid] = 0;
            }
          );
          setQuotedProductIndex(obj);
        }
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: response?.data?.data.result?.count,
          };
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPurchaseRequestData();
  }, [
    selectedTab,
    apiParams?.page,
    apiParams.sort,
    apiParams.isAsc,
    debouncedHtmlContent,
  ]);

  const handleNext = (uuid: string) => {
    const requestedOpenData = openPurchaseRequest?.find(
      (item) => item.uuid === uuid
    );
    const requestedQuotedData = quotedPurchaseRequest?.find(
      (item) => item.uuid === uuid
    );

    if (requestedOpenData) {
      setOpenProductIndex((prev: MyObjectType) => ({
        ...prev,
        [uuid]: Math.min(
          requestedOpenData?.PurchaseRequestProducts.length - 1 ===
            (prev[uuid] || 0)
            ? 0
            : (prev[uuid] || 0) + 1,
          requestedOpenData?.PurchaseRequestProducts.length - 1
        ),
      }));
    }
    if (requestedQuotedData) {
      setQuotedProductIndex((prev: MyObjectType) => ({
        ...prev,
        [uuid]: Math.min(
          requestedQuotedData.supplier_quote[0].supplier_product_quotes.length -
            1 ===
            (prev[uuid] || 0)
            ? 0
            : (prev[uuid] || 0) + 1,
          requestedQuotedData.supplier_quote[0].supplier_product_quotes.length -
            1
        ),
      }));
    }
  };

  const handlePrev = (uuid: string) => {
    const requestedOpenData = openPurchaseRequest?.find(
      (item) => item.uuid === uuid
    );
    const requestedQuotedData = quotedPurchaseRequest?.find(
      (item) => item.uuid === uuid
    );
    if (requestedOpenData) {
      setOpenProductIndex((prev: MyObjectType) => ({
        ...prev,
        [uuid]: Math.min(
          prev[uuid] !== 0
            ? (prev[uuid] || 0) - 1
            : requestedOpenData?.PurchaseRequestProducts.length - 1,
          requestedOpenData?.PurchaseRequestProducts.length - 1
        ),
      }));
    }
    if (requestedQuotedData) {
      setQuotedProductIndex((prev: MyObjectType) => ({
        ...prev,
        [uuid]: Math.min(
          prev[uuid] !== 0 ? (prev[uuid] || 0) - 1 : 0,
          requestedQuotedData.supplier_quote[0].supplier_product_quotes.length -
            1
        ),
      }));
    }
  };
  const onDeleteClick = async () => {
    try {
      await deleteSupplierProductRequest(requestDeletedId);
      setRequestDeletedId("");
      await setShowDeleteModal(false);
    } catch (err) {}
  };

  const ref = useOutsideClick(() => {
    if (filterModel) {
      setFilterModal(false);
    }
  });
  const quotedRef = useOutsideClick(() => {
    if (quotedFilter) {
      setQuotedFilter(false);
    }
  });
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(searchFilterSchema),
  });
  const {
    register: quotedRegister,
    control: quotedControl,
    formState: { errors: quotedErrors },
    handleSubmit: quotedSubmit,
    reset: quotedReset,
  } = useForm({
    resolver: yupResolver(searchFilterSchema),
  });

  const applyFilters = async (values: searchFilterType) => {
    try {
      setButtonLoader(false);
      Object.keys(values).forEach((key) => {
        if (values[key as keyof searchFilterType] === "") {
          delete values[key as keyof searchFilterType];
        }
      });

      apiParams.extraParams = { ...values };
      const filteredData = await getAllPurchaseRequests(
        apiParams,
        selectedTab,
        uuid,
        user_entity_uuid
      );
      if (filteredData?.data.responseType === responseType.Success) {
        if (filteredData?.data?.data?.tab === "OPEN") {
          setOpenPurchaseRequest(filteredData?.data?.data.result.rows);
        }
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: filteredData?.data?.data.result?.count,
          };
        });
        setButtonLoader(false);
        setFilterModal(false);
      }
    } catch (error) {
      return error;
    }
  };

  const resetFilter = () => {
    reset();
    apiParams.extraParams = {};
    getPurchaseRequestData();
    setFilterModal(false);
  };
  const resetQuotedFilter = () => {
    quotedReset();
    apiParams.extraParams = {};
    getPurchaseRequestData();
    setQuotedFilter(false);
  };
  const applyQuotedFilters = async (values: searchFilterType) => {
    try {
      setQuotedLoader(false);
      Object.keys(values).forEach((key) => {
        if (values[key as keyof searchFilterType] === "") {
          delete values[key as keyof searchFilterType];
        }
      });

      apiParams.extraParams = { ...values };
      const filteredData = await getAllPurchaseRequests(
        apiParams,
        selectedTab,
        uuid,
        user_entity_uuid
      );
      if (filteredData?.data.responseType === responseType.Success) {
        if (filteredData?.data?.data?.tab === purchaseReuestStatus.QUOTED) {
          setQuotedPurchaseRequest(filteredData?.data?.data.result.rows);
        }
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: filteredData?.data?.data.result?.count,
          };
        });
        setQuotedLoader(false);
        setQuotedFilter(false);
      }
    } catch (error) {
      return error;
    }
  };

  const handleChange = (e: { target: HTMLInputElement }) => {
    setApiParams((params) => {
      return {
        ...params,
        page: 1,
        searchText: e.target.value,
      };
    });
  };

  return (
    <>
      {selectedTab === "OPEN" && (
        <>
          {loading ? (
            <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          ) : (
            <div className="w-full xl:w-3/4 space-y-30px relative">
              {openPurchaseRequest && (
                <div>
                  <div className="relative ">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                      <h2 className="text-xl md:text-2xl font-semibold text-black">
                        <div className="flex gap-3 items-center">
                          <FormattedMessage id="Purchase_Request" />
                          <div className="relative">
                            <div
                              className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center cursor-pointer"
                              onClick={() => setFilterModal(!filterModel)}
                            >
                              <Button
                                type="button"
                                className="icon-filter text-base text-primarycolor"
                              ></Button>
                            </div>
                          </div>
                        </div>
                      </h2>{" "}
                      <>
                        <div className="w-full md:w-1/3 xxl:w-1/5 ml-auto">
                          <input
                            name="search"
                            type="search"
                            className="block w-full py-2.5 px-4 gap-4 leading-5 text-sm text-gray-900 border border-gray-300 rounded-xl bg-white focus:customBorder focus:border-customBorder "
                            placeholder={intl.formatMessage({
                              id: "Search",
                            })}
                            onChange={(e) => handleChange(e)}
                          />
                        </div>
                      </>
                      <PurchaseRequestFilters
                        setSelectedTab={setSelectedTab}
                        setTab={setTab}
                        tab={tab}
                      />
                    </div>
                    {loading ? (
                      <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    ) : (
                      <div className="flex flex-wrap -mx-3 gap-y-5">
                        {openPurchaseRequest &&
                        Array.isArray(openPurchaseRequest) &&
                        openPurchaseRequest.length > 0 ? (
                          openPurchaseRequest.map(
                            (item: openPurchaseRequest, index: number) => {
                              const ind: number = Number(
                                openProductIndex[item.uuid as string]
                              );

                              return (
                                <>
                                  <div
                                    className="w-full md:w-1/2 px-3 lg:w-1/3 relative hover:cursor-pointer"
                                    key={index}
                                  >
                                    <div className="border border-black/10 p-3.5 rounded-14px flex flex-col h-full">
                                      <div className="relative">
                                        <div className="w-full h-56 overflow-hidden rounded-xl mb-4">
                                          <img
                                            src={`${REACT_APP_IMAGE_PATH}${item.PurchaseRequestProducts[ind].products?.featured_image}`}
                                            alt="FoodSeven"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="absolute top-10px left-10px flex bg-white shadow-lg   rounded-lg py-1.5 px-2.5">
                                          <span className="text-primarycolor text-xs font-semibold leading-6 inline-block">
                                            <Countdown
                                              end_date={
                                                item.quotes_accepted_upto
                                              }
                                              displaySec={true}
                                            />
                                          </span>
                                        </div>
                                        {item.PurchaseRequestProducts.length >
                                          1 && (
                                          <div className="w-full justify-between absolute top-1/2 -translate-y-1/2 flex left-0 py-5">
                                            <i
                                              className={`icon-left_arrow p-2 rounded-full bg-primarycolor text-white`}
                                              onClick={() =>
                                                handlePrev(item.uuid)
                                              }
                                            ></i>
                                            <i
                                              className={`icon-right_arrow p-2 rounded-full bg-primarycolor text-white `}
                                              onClick={() =>
                                                handleNext(item.uuid)
                                              }
                                            ></i>
                                          </div>
                                        )}
                                      </div>

                                      <div
                                        className="flex flex-col flex-auto relative min-h-200px"
                                        onClick={() => {
                                          navigate(
                                            `/purchase-request/view/${selectedTab.toLowerCase()}/${
                                              item?.PurchaseRequestProducts[ind]
                                                .purchase_request_uuid
                                            }`
                                          );
                                        }}
                                      >
                                        <div className="pb-3">
                                          <h4 className="font-semibold text-secodarycolor text-lg text-truncate">
                                            {`${
                                              item?.PurchaseRequestProducts[ind]
                                                ?.products?.[`name_${language}`]
                                            }`}
                                          </h4>
                                          <p className="text-sm text-black/60 my-1">
                                            {"Req.Id :"} {item.uuid.slice(0, 8)}
                                          </p>
                                          <p className="text-sm text-black/60 my-2 subtext-truncate">
                                            {`${item?.PurchaseRequestProducts[
                                              ind
                                            ]?.products?.[
                                              `description_${language}`
                                            ]
                                              .split(" ")
                                              .slice(0, 10)
                                              .join(" ")}`}
                                            {`${
                                              item?.PurchaseRequestProducts[
                                                ind
                                              ]?.products?.[
                                                `description_${language}`
                                              ].split(" ").length > 10
                                                ? "..."
                                                : ""
                                            }`}
                                          </p>
                                          <div className="flex justify-between">
                                            <p className="text-sm text-black/60">
                                              {"Qty : "}{" "}
                                              {
                                                item?.PurchaseRequestProducts[
                                                  ind
                                                ]?.requested_quantity
                                              }
                                            </p>
                                            <p className="text-sm text-black/60">
                                              {"Req.Price : "}{" "}
                                              <span className="text-black/60 text-sm font-normal mr-2">
                                                SAR
                                              </span>
                                              {
                                                item?.PurchaseRequestProducts[
                                                  ind
                                                ]?.requested_price
                                              }
                                              <span className="text-black/60 text-sm font-normal ml-1">
                                                /
                                              </span>
                                              <span className="text-black/60 text-sm font-normal ml-1">
                                                {language === "en"
                                                  ? item
                                                      ?.PurchaseRequestProducts[
                                                      ind
                                                    ]?.products?.measurement[
                                                      `unit_name`
                                                    ]
                                                  : `${
                                                      item
                                                        ?.PurchaseRequestProducts[
                                                        ind
                                                      ]?.products?.measurement[
                                                        `unit_name_${
                                                          language as
                                                            | "ar"
                                                            | "ur"
                                                        }`
                                                      ]
                                                    }`}
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                        <div className="border-t border-black/10 pt-4 flex justify-between items-center my-4 absolute bottom-0 w-full">
                                          <p className="text-black/60 text-l xl:text-20px">
                                            {"Total : "}
                                            {"SAR"}{" "}
                                            {(
                                              item?.PurchaseRequestProducts[ind]
                                                ?.requested_price *
                                              item?.PurchaseRequestProducts[ind]
                                                ?.requested_quantity
                                            ).toFixed(2)}{" "}
                                          </p>

                                          <div
                                            className="flex flex-row gap-2 hover:cursor-pointer items-center"
                                            onClick={() => {
                                              navigate(
                                                `/purchase-request/view/${selectedTab.toLowerCase()}/${
                                                  item?.PurchaseRequestProducts[
                                                    ind
                                                  ].purchase_request_uuid
                                                }`
                                              );
                                            }}
                                          >
                                            <i className="icon-eye text-base text-primarycolor"></i>
                                            <Button
                                              text={
                                                <FormattedMessage id="View" />
                                              }
                                              type="button"
                                              className="text-primarycolor"
                                            ></Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          )
                        ) : (
                          <div className="relative w-full min-w-0 flex-auto p-8">
                            <NoData
                              text={<FormattedMessage id="No_Data_Found" />}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {showDeleteModal && requestDeletedId && (
                      <DeleteModal
                        setShowModal={setShowDeleteModal}
                        showModal={showDeleteModal}
                        deleteId={requestDeletedId}
                        onDeleteClick={onDeleteClick}
                      />
                    )}
                  </div>

                  <div className="relative  mt-7">
                    {apiParams.count > perPage ? (
                      <div className="w-full">
                        <div className="w-full text-center ">
                          <Pagination
                            apiParams={apiParams}
                            setApiParams={setApiParams}
                          />
                        </div>
                        <div className="w-full">
                          <p className="text-base leading-[21px] h-fit font-semibold text-black -mt-10 w-full text-right pr-3 flex gap-1 rtl:justify-start justify-end">
                            <span>
                              {<FormattedMessage id="Showing" />}{" "}
                              {(apiParams.page - 1) * perPage + 1}{" "}
                            </span>
                            <span>{<FormattedMessage id="to" />}</span>
                            <span>
                              {Math.min(
                                apiParams.page * perPage,
                                apiParams.count
                              )}{" "}
                            </span>
                            <span>
                              {<FormattedMessage id="of" />} {apiParams.count}{" "}
                            </span>
                            <span> {<FormattedMessage id="entries" />}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <p className="text-base leading-[21px] h-fit font-semibold text-black w-full text-right pr-3 flex gap-1 rtl:justify-start justify-end">
                          <span>
                            {<FormattedMessage id="Showing" />}{" "}
                            {apiParams.count === 0
                              ? 0
                              : (apiParams.page - 1) * perPage + 1}{" "}
                          </span>
                          <span>{<FormattedMessage id="to" />}</span>
                          <span>
                            {Math.min(
                              apiParams.page * perPage,
                              apiParams.count
                            )}{" "}
                          </span>
                          <span>
                            {<FormattedMessage id="of" />} {apiParams.count}{" "}
                          </span>
                          <span> {<FormattedMessage id="entries" />}</span>
                        </p>
                      </div>
                    )}
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
                        <div className="flex flex-wrap my-2">
                          <form onSubmit={handleSubmit(applyFilters)}>
                            <div>
                              <div className="flex flex-wrap -mx-3">
                                <div className="relative w-full lg:w-1/3 px-3 mb-3 md:mb-5">
                                  <Input
                                    label={
                                      <FormattedMessage id="Purchase_Request_Id" />
                                    }
                                    errors={errors}
                                    id="purchaseReqId"
                                    register={register}
                                    type="text"
                                    placeholder={intl.formatMessage({
                                      id: "Enter_Purchase_Req_Id",
                                    })}
                                    required={false}
                                    style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                                  />
                                </div>
                                <div className="relative w-full lg:w-1/3 px-3 mb-3 md:mb-5">
                                  <Input
                                    label={<FormattedMessage id="Price" />}
                                    errors={errors}
                                    id="price"
                                    register={register}
                                    type="text"
                                    placeholder={intl.formatMessage({
                                      id: "Enter_Price",
                                    })}
                                    required={false}
                                    style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                                  />
                                </div>
                                <div className="relative w-full lg:w-1/3 px-3 mb-3 md:mb-5">
                                  <Input
                                    label={<FormattedMessage id="Quantity" />}
                                    errors={errors}
                                    id="quantity"
                                    register={register}
                                    type="text"
                                    placeholder={intl.formatMessage({
                                      id: "Enter_quantity",
                                    })}
                                    required={false}
                                    style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                                  />
                                </div>
                                <div className="relative  w-full  px-3 mb-3 md:mb-5 z-0">
                                  <RangeDatePicker
                                    label={
                                      <FormattedMessage id="Purchase_Request_After_Date" />
                                    }
                                    required={false}
                                    errors={errors}
                                    id="date"
                                    placeholder={intl.formatMessage({
                                      id: "Enter_date",
                                    })}
                                    control={control}
                                    name="date"
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
              )}
            </div>
          )}
        </>
      )}
      {selectedTab === purchaseReuestStatus.QUOTED && (
        <>
          {loading ? (
            <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          ) : (
            <div className="w-full xl:w-3/4 space-y-30px relative">
              {quotedPurchaseRequest && (
                <div className="relative ">
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-black">
                      <div className="flex gap-3 items-center">
                        <FormattedMessage id="Purchase_Request" />
                        <div className="relative">
                          <div
                            className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center cursor-pointer"
                            onClick={() => setQuotedFilter(!quotedFilter)}
                          >
                            <Button
                              type="button"
                              className="icon-filter text-base text-primarycolor"
                            ></Button>
                          </div>
                        </div>
                      </div>
                    </h2>{" "}
                    <>
                      <div className="w-full md:w-1/3 xxl:w-1/5 ml-auto">
                        <input
                          name="search"
                          type="search"
                          className="block w-full py-2.5 px-4 gap-4 leading-5 text-sm text-gray-900 border border-gray-300 rounded-xl bg-white focus:customBorder focus:border-customBorder "
                          placeholder={intl.formatMessage({
                            id: "Search",
                          })}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </>
                    <PurchaseRequestFilters
                      setSelectedTab={setSelectedTab}
                      setTab={setTab}
                      tab={tab}
                    />
                  </div>
                  {loading ? (
                    <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  ) : (
                    <div className="flex flex-wrap -mx-3 gap-y-5">
                      {quotedPurchaseRequest &&
                      Array.isArray(quotedPurchaseRequest) &&
                      quotedPurchaseRequest.length > 0 ? (
                        quotedPurchaseRequest.map(
                          (item: quotedPurchaseRequest, index: number) => {
                            const quotedIndex: number = Number(
                              quotedProductIndex[item.uuid]
                            );

                            return (
                              <>
                                <div
                                  className="w-full md:w-1/2 px-3 lg:w-1/3 relative hover:cursor-pointer"
                                  key={index}
                                >
                                  <div className="border border-black/10 p-3.5 rounded-14px flex flex-col h-full relative">
                                    <div className="relative">
                                      <div className="w-full h-56 overflow-hidden rounded-xl mb-4">
                                        <img
                                          src={`${REACT_APP_IMAGE_PATH}${item?.supplier_quote[0]?.supplier_product_quotes[quotedIndex]?.ProductPurchaseRequests?.products?.featured_image}`}
                                          alt="FoodSeven"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="absolute top-10px left-10px flex bg-white shadow-lg text-primarycolor font-medium text-xs gap-3 rounded-lg py-1.5 px-2.5">
                                        <Countdown
                                          end_date={item.quotes_accepted_upto}
                                          displaySec={true}
                                        />
                                      </div>
                                      {item.supplier_quote[0]
                                        ?.supplier_product_quotes.length >
                                        1 && (
                                        <div className="w-full justify-between absolute top-1/2 -translate-y-1/2 flex left-0 py-5">
                                          <i
                                            className={`icon-left_arrow p-2 rounded-full bg-primarycolor text-white`}
                                            onClick={() =>
                                              handlePrev(item.uuid)
                                            }
                                          ></i>
                                          <i
                                            className={`icon-right_arrow p-2 rounded-full bg-primarycolor text-white `}
                                            onClick={() =>
                                              handleNext(item.uuid)
                                            }
                                          ></i>
                                        </div>
                                      )}
                                    </div>
                                    <div
                                      className="flex flex-col flex-auto relative min-h-200px"
                                      onClick={() => {
                                        navigate(
                                          `/purchase-request/view/${selectedTab.toLowerCase()}/${
                                            item.uuid
                                          }`
                                        );
                                      }}
                                    >
                                      <div className="pb-3">
                                        <div className="flex">
                                          <h4
                                            className={`font-semibold text-secodarycolor text-lg text-truncate ${
                                              item?.supplier_quote[0]
                                                ?.supplier_product_quotes[
                                                quotedIndex
                                              ].other_brand_product_uuid
                                                ? "line-through"
                                                : ""
                                            }`}
                                          >
                                            {`${
                                              item?.supplier_quote[0]
                                                ?.supplier_product_quotes[
                                                quotedIndex
                                              ]?.ProductPurchaseRequests
                                                ?.products?.[`name_${language}`]
                                            }`}
                                          </h4>
                                          <h4 className="font-semibold text-secodarycolor text-lg ml-2 text-truncate">
                                            {item?.supplier_quote[0]
                                              ?.supplier_product_quotes[
                                              quotedIndex
                                            ].other_brand_product_uuid &&
                                              `${
                                                item?.supplier_quote[0]
                                                  ?.supplier_product_quotes[
                                                  quotedIndex
                                                ]?.otherBrandProduct?.[
                                                  `name_${language}`
                                                ]
                                              }`}
                                          </h4>
                                        </div>
                                        <p className="text-sm text-black/60 my-1 ">
                                          {"Req.Id:"}{" "}
                                          {item?.supplier_quote[0]?.supplier_product_quotes[
                                            quotedIndex
                                          ]?.ProductPurchaseRequests.purchase_request_uuid.slice(
                                            0,
                                            8
                                          )}
                                        </p>

                                        <p className="text-sm text-black/60 my-2 subtext-truncate">
                                          {`${item?.supplier_quote[0]?.supplier_product_quotes[
                                            quotedIndex
                                          ]?.ProductPurchaseRequests?.products?.[
                                            `description_${language}`
                                          ]
                                            .split(" ")
                                            .slice(0, 10)
                                            .join(" ")}`}
                                          {`${
                                            item?.supplier_quote[0]?.supplier_product_quotes[
                                              quotedIndex
                                            ]?.ProductPurchaseRequests?.products?.[
                                              `description_${language}`
                                            ].split(" ").length > 10
                                              ? "..."
                                              : ""
                                          }`}
                                        </p>
                                        <div className="flex justify-between">
                                          <p className="text-sm text-black/60">
                                            {"Qty : "}{" "}
                                            {
                                              item?.supplier_quote[0]
                                                ?.supplier_product_quotes[
                                                quotedIndex
                                              ]?.offered_quantity
                                            }
                                          </p>
                                          <p className="text-sm text-black/60">
                                            {"Req.Price : "}{" "}
                                            <span className="text-black/60 text-sm font-normal mr-2">
                                              SAR
                                            </span>
                                            {
                                              item?.supplier_quote[0]
                                                ?.supplier_product_quotes[
                                                quotedIndex
                                              ]?.offered_price
                                            }
                                            <span className="text-black/60 text-sm font-normal ml-1">
                                              /
                                            </span>
                                            <span className="text-black/60 text-sm font-normal ml-1">
                                              {language === "en"
                                                ? item?.supplier_quote[0]
                                                    ?.supplier_product_quotes[
                                                    quotedIndex
                                                  ]?.ProductPurchaseRequests
                                                    ?.products?.measurement[
                                                    `unit_name`
                                                  ]
                                                : `${
                                                    item?.supplier_quote[0]
                                                      ?.supplier_product_quotes[
                                                      quotedIndex
                                                    ]?.ProductPurchaseRequests
                                                      ?.products?.measurement[
                                                      `unit_name_${
                                                        language as "ar" | "ur"
                                                      }`
                                                    ]
                                                  }`}
                                            </span>
                                          </p>
                                        </div>
                                      </div>

                                      <div className="border-t border-black/10 pt-4 flex justify-between items-center my-4 absolute bottom-0 w-full">
                                        <p className="text-black/60 text-l xl:text-20px">
                                          {"Total : "}
                                          {"SAR"}{" "}
                                          {(
                                            item?.supplier_quote[0]
                                              ?.supplier_product_quotes[
                                              quotedIndex
                                            ]?.offered_price *
                                            item?.supplier_quote[0]
                                              ?.supplier_product_quotes[
                                              quotedIndex
                                            ]?.offered_quantity
                                          ).toFixed(2)}{" "}
                                        </p>

                                        {item?.supplier_quote &&
                                          item?.supplier_quote?.length > 0 &&
                                          Array.isArray(item?.supplier_quote) &&
                                          item?.supplier_quote?.map(
                                            (data: SupplierQuote) => {
                                              return data?.payment_method !==
                                                "BANK_TRANSFER" ? (
                                                <div className="flex flex-row gap-2 hover:cursor-pointer items-center">
                                                  <div
                                                    className="flex gap-3 items-center text-secondaryOrange"
                                                    onClick={() => {
                                                      navigate(
                                                        `/purchase-request/view/${selectedTab.toLowerCase()}/${
                                                          item.uuid
                                                        }`
                                                      );
                                                    }}
                                                  >
                                                    <i className="icon-edit-alt text-base"></i>
                                                    <Button
                                                      text={
                                                        <FormattedMessage id="Edit" />
                                                      }
                                                      type="button"
                                                    ></Button>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div
                                                  className="flex flex-row gap-2 hover:cursor-pointer items-center"
                                                  onClick={() => {
                                                    setShowAlertMsgModal(true);
                                                  }}
                                                >
                                                  <i className="icon-eye text-base text-primarycolor"></i>
                                                  <Button
                                                    text={
                                                      <FormattedMessage id="View" />
                                                    }
                                                    type="button"
                                                    className="text-primarycolor"
                                                  ></Button>
                                                </div>
                                              );
                                            }
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          }
                        )
                      ) : (
                        <div className="relative w-full min-w-0 flex-auto p-8">
                          <NoData
                            text={<FormattedMessage id="No_Data_Found" />}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="relative  mt-7">
                    {apiParams.count > perPage ? (
                      <div className="w-full">
                        <div className="w-full text-center ">
                          <Pagination
                            apiParams={apiParams}
                            setApiParams={setApiParams}
                          />
                        </div>
                        <div className="w-full">
                          <p className="text-base leading-[21px] h-fit font-semibold text-black -mt-10 w-full text-right pr-3 flex gap-1 rtl:justify-start justify-end">
                            <span>
                              {<FormattedMessage id="Showing" />}{" "}
                              {(apiParams.page - 1) * perPage + 1}{" "}
                            </span>
                            <span>{<FormattedMessage id="to" />}</span>
                            <span>
                              {Math.min(
                                apiParams.page * perPage,
                                apiParams.count
                              )}{" "}
                            </span>
                            <span>
                              {<FormattedMessage id="of" />} {apiParams.count}{" "}
                            </span>
                            <span> {<FormattedMessage id="entries" />}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <p className="text-base leading-[21px] h-fit font-semibold text-black w-full text-right pr-3 flex gap-1 rtl:justify-start justify-end">
                          <span>
                            {<FormattedMessage id="Showing" />}{" "}
                            {apiParams.count === 0
                              ? 0
                              : (apiParams.page - 1) * perPage + 1}{" "}
                          </span>
                          <span>{<FormattedMessage id="to" />}</span>
                          <span>
                            {Math.min(
                              apiParams.page * perPage,
                              apiParams.count
                            )}{" "}
                          </span>
                          <span>
                            {<FormattedMessage id="of" />} {apiParams.count}{" "}
                          </span>
                          <span> {<FormattedMessage id="entries" />}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {showDeleteModal && requestDeletedId && (
                    <DeleteModal
                      setShowModal={setShowDeleteModal}
                      showModal={showDeleteModal}
                      deleteId={requestDeletedId}
                      onDeleteClick={onDeleteClick}
                    />
                  )}
                </div>
              )}
              {quotedFilter === true && (
                <>
                  <div
                    className="!mt-3 p-8 bg-white block w-full md:w-620px left-0 absolute top-16 z-20 px-5 py-6 rounded-md shadow-box-search rtl:left-0 rtl:right-0 lg:rtl:right-14"
                    ref={quotedRef}
                  >
                    <h4 className="text-black font-semibold capitalize border-b border-black/10 pb-3">
                      <FormattedMessage id="Search Filter" />
                    </h4>
                    <div className="flex flex-wrap my-2">
                      <form onSubmit={quotedSubmit(applyQuotedFilters)}>
                        <div>
                          <div className="flex flex-wrap -mx-3">
                            <div className="relative w-full lg:w-1/3 px-3 mb-3 md:mb-5">
                              <Input
                                label={
                                  <FormattedMessage id="Purchase_Request_Id" />
                                }
                                errors={quotedErrors}
                                id="purchaseReqId"
                                register={quotedRegister}
                                type="text"
                                placeholder={intl.formatMessage({
                                  id: "Enter_Purchase_Req_Id",
                                })}
                                required={false}
                                style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                              />
                            </div>
                            <div className="relative w-full lg:w-1/3 px-3 mb-3 md:mb-5">
                              <Input
                                label={<FormattedMessage id="Price" />}
                                errors={quotedErrors}
                                id="price"
                                register={quotedRegister}
                                type="text"
                                placeholder={intl.formatMessage({
                                  id: "Enter_Price",
                                })}
                                required={false}
                                style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                              />
                            </div>
                            <div className="relative w-full lg:w-1/3 px-3 mb-3 md:mb-5">
                              <Input
                                label={<FormattedMessage id="Quantity" />}
                                errors={quotedErrors}
                                id="quantity"
                                register={quotedRegister}
                                type="text"
                                placeholder={intl.formatMessage({
                                  id: "Enter_quantity",
                                })}
                                required={false}
                                style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                              />
                            </div>
                            <div className="relative  w-full  px-3 mb-3 md:mb-5 z-0">
                              <RangeDatePicker
                                label={
                                  <FormattedMessage id="Purchase_Request_After_Date" />
                                }
                                required={false}
                                errors={quotedErrors}
                                id="date"
                                placeholder={intl.formatMessage({
                                  id: "Enter_date",
                                })}
                                control={quotedControl}
                                name="date"
                                minDate={false}
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap">
                            <div className="mt-5 flex justify-center gap-5 w-full">
                              <Button
                                text={<FormattedMessage id="Reset" />}
                                type="button"
                                onClick={() => resetQuotedFilter()}
                                className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                              />{" "}
                              <Button
                                text={<FormattedMessage id="Apply" />}
                                type="submit"
                                loader={quotedLoader}
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
          )}
        </>
      )}

      {showAlertMsgModal && (
        <Modal
          title={<FormattedMessage id="Alert" />}
          setShowModal={setShowAlertMsgModal}
          showModal={showAlertMsgModal}
        >
          <div>
            <p>{<FormattedMessage id="Bank_Transfer_Initiated_Alert" />}</p>
            <Button
              type="button"
              text={<FormattedMessage id="Close" />}
              onClick={() => setShowAlertMsgModal(false)}
              className="px-6 py-2 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl mr-5 hover:bg-primarycolor hover:text-white focus:ring-0 focus:outline-0 uppercase mt-5"
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default SupplierPurchaseRequest;
