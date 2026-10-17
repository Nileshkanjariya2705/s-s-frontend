import { useState } from "react";
import { ApiParamsType } from "components/table/types";

import { Table } from "components/table/Table";
import {
  CategoryType,
  SupplierProductType,
  searchFilterType,
} from "./types/supplierProducts.types";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  getAllSuppProducts,
  supplierDeleteProduct,
} from "./services/supplierProducts.services";
import { DeleteModal } from "components/model/DeleteModal";
import { SupplierProductsColumns } from "components/table/columns/supplierProductsColumns.columns";
import { perPage, responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import useUserData from "hooks/getUserData";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "hooks/useDebounce";
import { Button } from "components/button/Button";
import { useOutsideClick } from "hooks/clickOutside";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productFilterSchema } from "./schema/supplierProducts.schema";
import Input from "components/input/Input";
import CustomSelect from "components/customSelect/CustomSelect";
import { statusDropdown } from "constant/dropdown.constant";
import RangeDatePicker from "components/datePicker/RangeDatePicker";
import useLocale from "hooks/useLocale";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [productDeletedId, setProductDeletedId] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [productDropdown, setProductDropdown] = useState<CategoryType[]>([]);
  const navigate = useNavigate();
  const { language } = useLocale();

  const { given_permissions, user_entity_uuid } = useUserData();
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
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
  const [filterModel, setFilterModal] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);

  const ProductStatusLanguageWise = statusDropdown(language);
  const columns = SupplierProductsColumns(
    (uuid: string) => navigate(`/products/edit/${uuid}`),
    (uuid: string) => {
      setProductDeletedId(uuid);
      setShowDeleteModal(true);
    },
    given_permissions,
    language
  );

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );

  const getAllSupplierProducts = async () => {
    try {
      setIsLoading(true);
      const res = await getAllSuppProducts(apiParams, user_entity_uuid, language);
      if (res) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: res?.data?.data?.[0]?.count,
          };
        });
        setProducts(res?.data?.data?.[0]?.productInfo);
        setIsLoading(false);
      }
      setCategories(res?.data?.data?.[0].categoryDropdown);
      setProductDropdown(res?.data?.data?.[0].productDropdown);
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllSupplierProducts();
  }, [
    debouncedHtmlContent,
    // apiParams.count,
    apiParams.limit,
    apiParams.page,
    apiParams.sort,
    apiParams.isAsc,
  ]);

  const intl = useIntl();

  const onDeleteClick = async () => {
    try {
      setDeleteLoader(true);
      const response = await supplierDeleteProduct(productDeletedId);
      await setShowDeleteModal(false);
      if (response?.data.responseType === responseType.Success) {
        showToast(response?.data.message, toastType.Success, intl);
        getAllSupplierProducts();
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

  const ref = useOutsideClick(() => {
    if (filterModel) {
      setFilterModal(false);
    }
  });

  const resetFilter = () => {
    apiParams.extraParams = {};
    reset();
    getAllSupplierProducts();
    setFilterModal(false);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(productFilterSchema),
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
      const filteredData = await getAllSuppProducts(
        apiParams,
        user_entity_uuid,
        language
      );
      if (filteredData) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: filteredData?.data?.data?.[0]?.count,
          };
        });
        setProducts(filteredData?.data?.data?.[0]?.productInfo);
        setIsLoading(false);
        setButtonLoader(false);
        setFilterModal(false);
      }
    } catch (error) {
      return error;
    }
  };
  return (
    <>
      <>
        <div className="w-full xl:w-3/4 space-y-30px relative">
          <Table<SupplierProductType>
            header={
              <>
                <div className="flex gap-3 items-center">
                  <FormattedMessage id="Products" />
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
              </>
            }
            data={products}
            columns={columns}
            apiParams={apiParams}
            setApiParams={setApiParams}
            pagination={true}
            search={true}
            loading={isLoading}
            filters={
              <>
                {given_permissions.find((item) => item.name === "Add Products")
                  ?.granted && (
                  <button
                    className="relative px-4 py-2 border rounded-xl border-primarycolor text-primarycolor text-base font-medium hover:text-white hover:bg-primarycolor"
                    onClick={() => navigate(`/products/add`)}
                  >
                    {<FormattedMessage id="Add_Product" />}
                  </button>
                )}
              </>
            }
          />
          {showDeleteModal && productDeletedId && (
            <DeleteModal
              setShowModal={setShowDeleteModal}
              showModal={showDeleteModal}
              deleteId={productDeletedId}
              onDeleteClick={onDeleteClick}
              deleteLoader={deleteLoader}
            />
          )}
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
                  <form
                    className="w-full"
                    onSubmit={handleSubmit(applyFilters)}
                  >
                    <div>
                      <div className="flex flex-wrap -mx-3">
                        <div className="relative w-full lg:w-1/2 px-3 mb-3 md:mb-5">
                          <CustomSelect
                            label={<FormattedMessage id="Category_Name" />}
                            options={categories}
                            control={control}
                            register={register}
                            name="category_name"
                            error={errors}
                            required={false}
                            isSearchable={true}
                          />
                        </div>
                        <div className="relative w-full lg:w-1/2 px-3 mb-3 md:mb-5">
                          <CustomSelect
                            label={<FormattedMessage id="Product_Name" />}
                            options={productDropdown}
                            control={control}
                            register={register}
                            name="product_name"
                            error={errors}
                            required={false}
                            isSearchable={true}
                          />
                        </div>
                        <div className="relative w-full  px-3 mb-3 md:mb-5">
                          <Input
                            label={<FormattedMessage id="Offered_Price" />}
                            errors={errors}
                            id="offered_price"
                            register={register}
                            type="text"
                            placeholder={intl.formatMessage({
                              id: "Enter_Price",
                            })}
                            required={false}
                            style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                          />
                        </div>
                        <div className="relative w-full px-3 mb-3 md:mb-5 ">
                          <CustomSelect
                            label={<FormattedMessage id="Status" />}
                            control={control}
                            name="status"
                            options={
                              ProductStatusLanguageWise as {
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
                        <div className="relative  w-full  px-3 mb-3 md:mb-5 z-0">
                          <RangeDatePicker
                            label={<FormattedMessage id="Created_Date" />}
                            required={false}
                            errors={errors}
                            id="created_date"
                            placeholder={intl.formatMessage({
                              id: "Enter_date",
                            })}
                            control={control}
                            name="created_date"
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
    </>
  );
};

export default Products;
