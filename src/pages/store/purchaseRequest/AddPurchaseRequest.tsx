import { Button } from "components/button/Button";
import Input from "components/input/Input";
import TextArea from "components/textArea/Textarea";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ProductImageState,
  PurchaseReqType,
  productData,
} from "./types/purchaseRequest.types";
import { purchaseRequest } from "./schema/purchaseRequestAdd.schema";

import DatePicker from "components/datePicker/DatePicker";

import useUserData from "hooks/getUserData";
import useOwnerData from "hooks/getOwnerData";
import { CategoryType } from "pages/supplier/supplierProduct/types/supplierProducts.types";
import { ChangeEvent, useEffect, useState } from "react";
import {
  getAllCategory,
  getAllProduct,
  getCategoryWiseProductAdd,
  getProductWiseData,
} from "pages/supplier/supplierProduct/services/supplierProducts.services";
import { REACT_APP_IMAGE_PATH } from "config";
import { createDirectPurchaseRequest } from "./services/purchaseRequest.services";

import { FormattedMessage, useIntl } from "react-intl";
import { showToast } from "helper/toast.helper";
import CustomSelect from "components/customSelect/CustomSelect";
import Loading from "components/globalLoader/Loading";
import { responseType, toastType } from "constant/common.constant";
import Tooltip from "components/tooltip/tooltip";
import { BranchDropdown } from "../checkOut/types/checkout.types";
import { getallBranches } from "../checkOut/services/checkout.services";
import useLocale from "hooks/useLocale";

const AddPurchaseRequest = () => {
  const { uuid } = useUserData();
  const { store_uuid } = useOwnerData();
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [product, setProduct] = useState<productData>({});
  const [productImage, setProductImage] = useState<ProductImageState>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [dropdownLoader, setDropdownLoader] = useState<boolean>(false);
  const intl = useIntl();
  const [checkedReq, setCheckedReq] = useState<boolean>(true);
  const [unitsOfMeasurement, setUnitsOfMeesurement] = useState<string>("unit");
  const [branch, setBranch] = useState<BranchDropdown[]>([]);
  const { language } = useLocale()
  const [defaultValues] = useState<PurchaseReqType>({
    offer_for_entire_request: true,
    expiry_date: "",
    address_uuid: "" ,
    product_details: [
      {
        category: "",
        product: "",
        unit_of_measurement: "",
        quantity: "",
        subtotal: "",
        requested_price: "",
        description: "",
        other_brands_allowed: false,
      },
    ],
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    getValues,
  } = useForm<PurchaseReqType>({
    resolver: yupResolver(purchaseRequest),
    defaultValues: defaultValues,
  });

  const getAllCategories = async () => {
    try {
      setIsLoading(true);
      const catResponse = await getAllCategory(language);
      setCategory(catResponse?.data?.data);

      const prodResponse = await getAllProduct(language);
      setProduct(prodResponse.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllBranches();
  }, [language]);

  const handleCategorySelect = async (
    event: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    setDropdownLoader(true);
    const res = await getCategoryWiseProductAdd(event.target.value, language);

    setValue(
      `product_details[${index}].unit_of_measurement`,
      res?.data?.data?.measurement
    );
    setValue(`product_details[${index}].description`, "");
    setValue(`product_details[${index}].unit_of_measurement`, "");
    setValue(`product_details[${index}].product`, "");

    setProductImage((prevProductImage) => ({
      ...prevProductImage,
      [index]: null,
    }));
    setDropdownLoader(false);
  };

  const handleProductSelect = async (
    event: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    setDropdownLoader(true);
    const res = await getProductWiseData(event.target.value);
    setUnitsOfMeesurement(res?.data?.data?.measurement);
    setValue(
      `product_details[${index}].unit_of_measurement`,
      res?.data?.data?.measurement
    );
    setProductImage((prevProductImage) => ({
      ...prevProductImage,
      [index]: JSON.parse(res?.data?.data?.images),
    }));
    setDropdownLoader(false);
  };

  const navigate = useNavigate();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "product_details",
  });

  const finalValue: number[] = [];

  const formValues = watch();
  const { user_entity_uuid } = useUserData();
  const getAllBranches = async () => {
    try {
      setDropdownLoader(true);
      const response = await getallBranches({
        user_entity_uuid,
      });
      if (response?.data?.responseType === responseType.Success) {
        setBranch(response?.data?.data);
        setDropdownLoader(false);
      }
    } catch (error) {
      return error;
    }
  };

  const getSubtotal = () => {
    Array.isArray(formValues?.product_details) &&
      formValues?.product_details.map((item, index) => {
        const total = parseFloat(
          (Number(item.requested_price) * Number(item.quantity)).toFixed(2)
        );
        if (
          !isNaN(total) &&
          item.requested_price >= "0" &&
          item.quantity >= "0"
        ) {
          finalValue.push(total);
          setValue(
            `product_details.${index}.subtotal`,
            finalValue[index]?.toString()
          );
        } else {
          setValue(`product_details.${index}.subtotal`, "0");
        }
      });
  };

  const submitRequest = async (values: PurchaseReqType) => {
    try {
      setButtonLoader(true);
      let data = {
        ...values,
        store_info_uuid: store_uuid,
        requester_uuid: uuid,
      };

      const findIndexRepeatingProducts = (dataArray: []) => {
        const oldProducts = new Set();

        return dataArray.findIndex((item) => {
          const { product } = item;

          if (oldProducts.has(product)) {
            return true;
          }

          oldProducts.add(product);
          return false;
        });
      };

      const indexOfRepeatingProduct = findIndexRepeatingProducts(
        data?.product_details as []
      );

      if (indexOfRepeatingProduct !== -1) {
        showToast("Product_Cannot_Be_Repeated_Toast", "error", intl);
      } else {
        const response = await createDirectPurchaseRequest(data);

        if (response?.data?.responseType === "success") {
          showToast(response?.data.message, toastType.Success, intl);
          navigate("/purchase-request");
        }
      }
      setButtonLoader(false);
    } catch (error) {
      setButtonLoader(false);
      return error;
    }
  };

  const handleCheckReq = () => {
    setCheckedReq((prev) => !prev);
  };

  return (
    <>
      {isLoading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <>
          {dropdownLoader && (
            <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
          <div className="w-full space-y-30px">
            <div className="border border-black/10 rounded-14px p-20px md:p-30px">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-semibold text-black">
                  {<FormattedMessage id="Purchase_Requests" />}
                </h2>
              </div>
              <form className="mt-7" onSubmit={handleSubmit(submitRequest)}>
                <div className="flex flex-wrap gap-y-5 -mx-3 pb-8">
                  <div className="relative w-full md:w-1/2 px-3 ">
                    <DatePicker
                      label={<FormattedMessage id="Requests_Expiry" />}
                      required={true}
                      errors={errors}
                      id="expiry_date"
                      placeholder={intl.formatMessage({
                        id: "Enter_date",
                      })}
                      control={control}
                      name="expiry_date"
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 px-3 mt-11">
                    <Tooltip
                      tooltip={intl.formatMessage({
                        id: "tooltip_req",
                      })}
                    >
                      <div className="flex gap-3 items-center ">
                        <div className="flex flex-row-reverse cs-checkout gap-3 items-center justify-end ">
                          <Input
                            id="offer_for_entire_request"
                            type="checkbox"
                            label={
                              <FormattedMessage id="Receive_offers_for_the_entire_request" />
                            }
                            register={register}
                            errors={errors}
                            checked={checkedReq}
                            handleClick={handleCheckReq}
                          />
                        </div>
                        <div className="relative ">
                          <svg
                            className="w-5 fill-black"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M10 2C5.58173 2 2 5.58167 2 10C2 14.4183 5.58173 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58167 14.4183 2 10 2ZM0 10C0 4.47717 4.47717 0 10 0C15.5228 0 20 4.47717 20 10C20 15.5228 15.5228 20 10 20C4.47717 20 0 15.5228 0 10ZM9 6C9 5.44775 9.44769 5 10 5H10.01C10.5623 5 11.01 5.44775 11.01 6C11.01 6.55225 10.5623 7 10.01 7H10C9.44769 7 9 6.55225 9 6ZM9 9C8.44769 9 8 9.44775 8 10C8 10.5522 8.44769 11 9 11V14C9 14.5522 9.44769 15 10 15H11C11.5523 15 12 14.5522 12 14C12 13.4478 11.5523 13 11 13V10C11 9.44775 10.5523 9 10 9H9Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </Tooltip>
                  </div>

                  <div className="relative w-full md:w-1/2 px-3">
                    <CustomSelect
                      label={<FormattedMessage id="Choose_Branch" />}
                      register={register}
                      options={branch}
                      name="address_uuid"
                      error={errors}
                      required={true}
                      placeholder={intl.formatMessage({
                        id: "Choose_Branch",
                      })}
                      control={control}
                      isSearchable={false}
                    />
                  </div>
                </div>

                {fields.map(
                  (field, index) =>
                    field && (
                      <div className="relative py-4 border-t border-black/10">
                        <div className="flex flex-wrap -mx-3 gap-y-4">
                          <div className="w-full md:w-1/2 px-3">
                            <CustomSelect
                              label={<FormattedMessage id="Categories" />}
                              options={category}
                              control={control}
                              register={register}
                              name={`product_details.${index}.category`}
                              errorKey={`product_details.${index}.category`}
                              error={errors}
                              required={true}
                              handleSelectChange={(e) =>
                                handleCategorySelect(e, index)
                              }
                            />
                          </div>
                          <div className="w-full md:w-1/2 px-3">
                            <CustomSelect
                              label={<FormattedMessage id="Product_Name" />}
                              options={
                                product[
                                  getValues(`product_details.${index}.category`)
                                ] || []
                              }
                              control={control}
                              register={register}
                              name={`product_details.${index}.product`}
                              errorKey={`product_details.${index}.product`}
                              error={errors}
                              required={true}
                              placeholder={intl.formatMessage({
                                id: "Select_Product",
                              })}
                              handleSelectChange={(e) =>
                                handleProductSelect(e, index)
                              }
                            />
                          </div>
                          <div className="w-full md:w-1/2 px-3">
                            <Tooltip
                              tooltip={intl.formatMessage({
                                id: "tooltip_another_req",
                              })}
                            >
                              <div className="flex gap-3 items-center">
                                <div className="flex flex-row-reverse cs-checkout gap-3 items-center justify-end ">
                                  <Input
                                    id={`product_details.${index}.other_brands_allowed`}
                                    type="checkbox"
                                    label={
                                      <FormattedMessage id="another_brand" />
                                    }
                                    register={register}
                                    errors={errors}
                                  />
                                </div>
                                <div className="relative ">
                                  <svg
                                    className="w-5 fill-black"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      clip-rule="evenodd"
                                      d="M10 2C5.58173 2 2 5.58167 2 10C2 14.4183 5.58173 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58167 14.4183 2 10 2ZM0 10C0 4.47717 4.47717 0 10 0C15.5228 0 20 4.47717 20 10C20 15.5228 15.5228 20 10 20C4.47717 20 0 15.5228 0 10ZM9 6C9 5.44775 9.44769 5 10 5H10.01C10.5623 5 11.01 5.44775 11.01 6C11.01 6.55225 10.5623 7 10.01 7H10C9.44769 7 9 6.55225 9 6ZM9 9C8.44769 9 8 9.44775 8 10C8 10.5522 8.44769 11 9 11V14C9 14.5522 9.44769 15 10 15H11C11.5523 15 12 14.5522 12 14C12 13.4478 11.5523 13 11 13V10C11 9.44775 10.5523 9 10 9H9Z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </Tooltip>

                            <div className="css-disable-border">
                              <div className="relative w-full mt-5 border border-black/10 rounded-xl p-2.5 text-center space-y-3">
                                {productImage && productImage[index] && (
                                  <div className="bg-slate-100 p-2 rounded-lg w-full md:w-150px h-150px">
                                    <img
                                      src={`${REACT_APP_IMAGE_PATH}${productImage[index]?.[0]}`}
                                      className={`w-full mx-auto h-full md:w-full md:h-full object-contain rounded-xl`}
                                    />
                                  </div>
                                )}
                                <label className="text-base block font-medium text-black/80 w-full md:w-150px">
                                  {<FormattedMessage id="Product_Image" />}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="w-full md:w-1/2 px-3">
                            <div className="flex flex-wrap -mx-2 gap-y-4 ">
                              <div className="w-full md:w-1/2 px-2">
                                <Input
                                  id={`product_details.${index}.unit_of_measurement`}
                                  type="text"
                                  label={
                                    <FormattedMessage id="Unit_of_measurement" />
                                  }
                                  register={register}
                                  errorKey={`product_details.${index}.unit_of_measurement`}
                                  name={`product_details.${index}.unit_of_measurement`}
                                  errors={errors}
                                  required={true}
                                  readonly={true}
                                  placeholder={intl.formatMessage({
                                    id: "UOM",
                                  })}
                                />
                              </div>
                              <div className="w-full md:w-1/2 px-2">
                                <Input
                                  id={`product_details.${index}.quantity`}
                                  type="string"
                                  label={<FormattedMessage id="Quantity" />}
                                  register={register}
                                  errorKey={`product_details.${index}.quantity`}
                                  errors={errors}
                                  required={true}
                                  placeholder={intl.formatMessage({
                                    id: "Enter_Quantity",
                                  })}
                                  HandleChange={getSubtotal}
                                />
                              </div>
                              <div className="w-full md:w-1/2 px-2">
                                <Input
                                  id={`product_details.${index}.requested_price`}
                                  type="text"
                                  label={
                                    <>
                                      <FormattedMessage id="Requested_Price" />
                                      <span className="text-gray-500">
                                        {" "}
                                        (per {unitsOfMeasurement as string})
                                      </span>
                                    </>
                                  }
                                  register={register}
                                  errorKey={`product_details.${index}.requested_price`}
                                  errors={errors}
                                  required={true}
                                  placeholder="SAR 000.00"
                                  HandleChange={getSubtotal}
                                  fixDecimal={true}
                                />
                              </div>
                              <div className="w-full md:w-1/2 px-2">
                                <Input
                                  id={`product_details.${index}.subtotal`}
                                  type="text"
                                  label={<FormattedMessage id="Subtotal" />}
                                  register={register}
                                  errors={errors}
                                  required={false}
                                  readonly={true}
                                  fixDecimal={true}
                                />
                              </div>
                              <div className="w-full px-2">
                                <TextArea
                                  id={`product_details.${index}.description`}
                                  label={<FormattedMessage id="Description" />}
                                  name={`product_details.${index}.description`}
                                  errorKey={`product_details.${index}.description`}
                                  register={register}
                                  type="textarea"
                                  errors={errors}
                                  required={true}
                                  parentClass="mb-30px last:mb-0 !min-h-250px"
                                  placeholder={intl.formatMessage({
                                    id: "final",
                                  })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="relative w-full mt-5 ">
                          {fields.length > 1 && (
                            <Button
                              className="text-base font-medium text-secondaryOrange border border-secondaryOrange py-2.5 px-10 rounded-xl transition-all duration-300 hover:bg-secondaryOrange hover:text-white"
                              type="button"
                              disable={buttonLoader}
                              onClick={() => remove(index)}
                            >
                              {<FormattedMessage id="Remove" />}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                )}
                <hr className="border-black/10 my-4 md:my-8" />
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      append({
                        category: "",
                        product: "",

                        unit_of_measurement: "",
                        quantity: "",
                        subtotal: "",
                        requested_price: "",
                        description: "",
                        other_brands_allowed: false,
                      });
                    }}
                    className="upperc
                        ase flex items-center gap-2 bg-primarycolor/10 text-primarycolor px-7 py-3 text-base font-bold rounded-xl"
                    disabled={buttonLoader}
                  >
                    <i className="icon-plus text-14px"></i>
                    {<FormattedMessage id="Add_Product" />}
                  </button>
                </div>

                <div className="flex gap-4 mt-8 mb-5 ">
                  <Button
                    text={<FormattedMessage id="Cancel" />}
                    type="button"
                    disable={buttonLoader}
                    className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                    onClick={() => {
                      navigate(`/purchase-request`);
                    }}
                  ></Button>
                  <Button
                    text={<FormattedMessage id="Save" />}
                    type="submit"
                    loader={buttonLoader}
                    className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                  ></Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default AddPurchaseRequest;
