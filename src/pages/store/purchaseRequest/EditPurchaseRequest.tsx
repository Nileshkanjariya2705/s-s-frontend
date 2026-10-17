import { Button } from "components/button/Button";
import Input from "components/input/Input";
import TextArea from "components/textArea/Textarea";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { PurchaseReqType, productData } from "./types/purchaseRequest.types";
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
import {
  storePurchaseRequestData,
  updatePurchaseRequest,
} from "./services/purchaseRequest.services";
import { FormattedMessage, useIntl } from "react-intl";
import { showToast } from "helper/toast.helper";
import CustomSelect from "components/customSelect/CustomSelect";
import Loading from "components/globalLoader/Loading";
import { responseType, toastType } from "constant/common.constant";
import { PageNotFound } from "components/pageNotFound/PageNotFound";
import { BranchDropdown } from "../checkOut/types/checkout.types";
import { getallBranches } from "../checkOut/services/checkout.services";
import useLocale from "hooks/useLocale";

const EditPurchaseRequest = () => {
  const { uuid, user_entity_uuid } = useUserData();
  const { store_uuid } = useOwnerData();
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [product, setProduct] = useState<productData>({});
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [removAbleuuid, setRemovAbleuuid] = useState<string[]>([]);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [dropdownLoader, setDropdownLoader] = useState<boolean>(false);
  const [branch, setBranch] = useState<BranchDropdown[]>([]);
  const { language } = useLocale()
  const [defaultValues, setDefaultValues] = useState<PurchaseReqType>({
    offer_for_entire_request: false,
    expiry_date: "",
    address_uuid: "",
    product_details: [
      {
        category: "",
        product: "",
        unit_of_measurement: "",
        image: "",
        subtotal: "",
        quantity: "",
        requested_price: "",
        description: "",
        other_brands_allowed: false,
      },
    ],
  });
  const { purchaseReqId } = useParams();

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
    values: defaultValues,
  });

  const getPurchaseReq = async () => {
    const resp = await storePurchaseRequestData(
      purchaseReqId as string,
      store_uuid
    );
    if (resp?.data?.responseType === responseType.Success) {
      setDefaultValues(resp?.data?.data);
    }
  };
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
  useEffect(() => {
    getPurchaseReq();
    getAllBranches()
  }, []);

  const getAllCategories = async () => {
    try {
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
    setValue(`product_details[${index}].unit_of_measurement`, "");
    setValue(`product_details[${index}].product`, "");
    setValue(`product_details[${index}].image`, "");
    setDropdownLoader(false);
  };

  const handleProductSelect = async (
    event: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    setDropdownLoader(true);

    const res = await getProductWiseData(event.target.value);
    setValue(
      `product_details[${index}].unit_of_measurement`,

      res?.data?.data?.measurement
    );
    const image = JSON.parse(res?.data?.data?.images)?.[0];

    setValue(`product_details[${index}].image`, image);
    setDropdownLoader(false);
  };
  const navigate = useNavigate();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "product_details",
  });

  const finalValue: number[] = [];

  const formValues = watch();

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
        purchase_request: purchaseReqId,
        removAbleuuid: removAbleuuid,
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
        const response = await updatePurchaseRequest(data);
        if (response?.data?.responseType === "success") {
          showToast(response?.data.message, toastType.Success, intl);
          navigate("/purchase-request");
        }
      }
      setButtonLoader(false);
    } catch (error) {
      return error;
    }
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
          {defaultValues ? (
            <div className="w-full space-y-30px">
              <div className="border border-black/10 rounded-14px p-20px md:p-30px">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-semibold text-black">
                    {<FormattedMessage id="Edit_Purchase_Requests" />}
                  </h2>
                </div>
                <form className="mt-7" onSubmit={handleSubmit(submitRequest)}>
                  <div className="flex flex-wrap gap-y-5 -mx-3 pb-4">
                    <div className="relative w-full md:w-1/2 px-3">
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
                        disabled={defaultValues?.is_existing_req}
                      />
                    </div>
                    <div className="relative w-full md:w-1/2 px-3">
                      <div className="flex flex-row-reverse cs-checkout gap-3 items-center justify-end mt-0 md:mt-11">
                        {defaultValues?.is_existing_req !== undefined &&
                          defaultValues?.is_existing_req !== true && (
                            <Input
                              id="offer_for_entire_request"
                              type="checkbox"
                              label={
                                <FormattedMessage id="Receive_offers_for_the_entire_request" />
                              }
                              register={register}
                              errors={errors}
                            />
                          )}
                      </div>
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

                  {formValues.product_details &&
                    Array.isArray(formValues.product_details) &&
                    formValues.product_details?.length > 0 &&
                    formValues.product_details.map((field, index) => (
                      <>
                        <div
                          className="relative py-4 border-t border-black/10"
                          key={field?.uuid}
                        >
                          <div className="flex flex-wrap -mx-3 gap-y-4">
                            <div className="w-full md:w-1/2 px-3">
                              <CustomSelect
                                selectedOption={
                                  defaultValues &&
                                  defaultValues.product_details &&
                                  defaultValues.product_details[index]?.category
                                }
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
                                isDisabled={defaultValues?.is_existing_req}
                              />
                            </div>

                            <div className="w-full md:w-1/2 px-3">
                              <CustomSelect
                                selectedOption={
                                  defaultValues &&
                                  defaultValues.product_details &&
                                  defaultValues.product_details[index]?.product
                                }
                                label={<FormattedMessage id="Product_Name" />}
                                options={
                                  product[
                                    getValues(
                                      `product_details.${index}.category`
                                    )
                                  ] || []
                                }
                                control={control}
                                register={register}
                                error={errors}
                                required={true}
                                errorKey={`product_details.${index}.product`}
                                name={`product_details.${index}.product`}
                                handleSelectChange={(e) =>
                                  handleProductSelect(e, index)
                                }
                                isDisabled={defaultValues?.is_existing_req}
                              />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                              <div className="flex flex-row-reverse cs-checkout gap-3 items-center justify-end  md:mt-5">
                                {defaultValues?.is_existing_req !== undefined &&
                                  defaultValues?.is_existing_req !== true && (
                                    <Input
                                      id={`product_details.${index}.other_brands_allowed`}
                                      type="checkbox"
                                      label={
                                        <FormattedMessage id="another_brand" />
                                      }
                                      register={register}
                                      errors={errors}
                                    />
                                  )}
                              </div>

                              <div className="css-disable-border">
                                <div className="relative w-full mt-5 border border-black/10 rounded-xl p-2.5 text-center space-y-3">
                                  {field.image && field.image !== undefined ? (
                                    <>
                                      <Controller
                                        name={`product_details.${index}.image`}
                                        control={control}
                                        render={() => (
                                          <div className="bg-slate-100 p-2 rounded-lg w-full md:w-150px h-150px">
                                            <img
                                              src={`${REACT_APP_IMAGE_PATH}${field?.image}`}
                                              className={`w-full mx-auto h-full md:w-full md:h-full object-cover rounded-xl`}
                                            />
                                          </div>
                                        )}
                                      />
                                      <label className="text-base block font-medium text-black/80 w-full md:w-150px">
                                        {
                                          <FormattedMessage id="Product_Image" />
                                        }
                                      </label>
                                    </>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                              <div className="flex flex-wrap -mx-2 gap-y-4 ">
                                <div className="w-full md:w-1/2 px-3">
                                  <Input
                                    id={`product_details.${index}.unit_of_measurement`}
                                    type="text"
                                    label={
                                      <FormattedMessage id="Unit_of_measurement" />
                                    }
                                    register={register}
                                    errorKey={`product_details.${index}.unit_of_measurement`}
                                    name={`product_details.${index}.unit_of_measurement`}
                                    readonly={true}
                                    errors={errors}
                                    required={true}
                                  />
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                  <Input
                                    id={`product_details.${index}.quantity`}
                                    type="string"
                                    label={<FormattedMessage id="Quantity" />}
                                    register={register}
                                    errorKey={`product_details.${index}.quantity`}
                                    errors={errors}
                                    required={true}
                                    placeholder="500"
                                    HandleChange={getSubtotal}
                                  />
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                  <Input
                                    id={`product_details.${index}.requested_price`}
                                    type="text"
                                    label={
                                      <>
                                        <FormattedMessage id="Requested_Price" />
                                        <span className="text-gray-500">
                                          {" "}
                                          (per{" "}
                                          {
                                            defaultValues?.product_details?.[
                                              index
                                            ]?.unit_of_measurement as string
                                          }
                                          )
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
                                <div className="w-full md:w-1/2 px-3">
                                  <Input
                                    id={`product_details.${index}.subtotal`}
                                    type="text"
                                    label={<FormattedMessage id="Subtotal" />}
                                    register={register}
                                    errors={errors}
                                    required={false}
                                    readonly={true}
                                  />
                                </div>
                                <div className="w-full px-2">
                                  <TextArea
                                    id={`product_details.${index}.description`}
                                    label={
                                      <FormattedMessage id="Description" />
                                    }
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
                                onClick={() => {
                                  setRemovAbleuuid((prev) => [
                                    ...prev,
                                    field?.uuid,
                                  ]);

                                  remove(index);
                                }}
                              >
                                {<FormattedMessage id="Remove" />}
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    ))}
                  <hr className="border-black/10 my-8" />
                  {defaultValues?.is_existing_req !== undefined &&
                    defaultValues?.is_existing_req !== true && (
                      <div className="mt-4">
                        <button
                          disabled={buttonLoader}
                          type="button"
                          onClick={() => {
                            append({
                              category: "",
                              product: "",
                              image: "",
                              unit_of_measurement: "",
                              quantity: "",
                              subtotal: "",
                              requested_price: "",
                              description: "",
                              other_brands_allowed: false,
                            });
                          }}
                          className="uppercase flex items-center gap-2 bg-primarycolor/10 text-primarycolor px-7 py-3 text-base font-bold rounded-xl"
                        >
                          <i className="icon-plus text-14px"></i>{" "}
                          {<FormattedMessage id="Add_Product" />}
                        </button>
                      </div>
                    )}

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
                      text={<FormattedMessage id="Update" />}
                      type="submit"
                      loader={buttonLoader}
                      className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                    ></Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <PageNotFound />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default EditPurchaseRequest;
