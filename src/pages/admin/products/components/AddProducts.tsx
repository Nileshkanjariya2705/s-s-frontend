import { Button } from "components/button/Button";
import Input from "components/input/Input";
import InputImage from "components/input/InputImage";
import SectionHeader from "components/sectionHeader/SectionHeader";
import TextArea from "components/textArea/Textarea";
import { DropdownOptionType, statusDropdown } from "constant/dropdown.constant";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  addProducts,
  getAllCategory,
  getAllMeasurements,
} from "../services/product.service";
import {
  CategoryDataType,
  MeasurementDataType,
  ProductDataType,
} from "../types/product.type";
import { responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import { useNavigate } from "react-router-dom";
import { addProductSchema } from "../schema/product.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "components/globalLoader/Loading";
import { REACT_APP_IMAGE_PATH } from "config";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "components/customSelect/CustomSelect";
import useLocale from "hooks/useLocale";

const AddProduct = () => {
  const navigate = useNavigate();
  const { language } = useLocale();
  const [categoryData, setCategoryData] = useState<CategoryDataType[]>([]);
  const [measurementData, setMeasurementData] = useState<MeasurementDataType[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const {
    formState: { errors },
    register,
    control,
    setValue,
    handleSubmit,
  } = useForm<ProductDataType>({
    defaultValues: {
      product_image: [{ image: undefined, featured_image: "" }],
    },
    resolver: yupResolver(addProductSchema),
  });
  const productStatus = statusDropdown(language);

  const getCategories = async () => {
    try {
      const response = await getAllCategory(language);
      if (response?.data?.data) {
        setCategoryData(response?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getMeasurements = async () => {
    try {
      const response = await getAllMeasurements(language);
      if (response?.data?.data) {
        setMeasurementData(response?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const { append, fields, remove } = useFieldArray({
    control,
    name: "product_image",
  });

  useEffect(() => {
    getCategories();
    getMeasurements();
  }, [language]);

  const intl = useIntl();

  const onSubmit = async (values: ProductDataType) => {
    try {
      setButtonLoader(true);
      const formData: FormData = new FormData();
      Object.entries(values).forEach((item) => {
        if (item[1]) {
          if (item[0] === "product_image") {
            if (Array.isArray(item[1])) {
              item[1].map(
                (item: {
                  featured_image?: string | undefined;
                  image?: File[] | undefined;
                }) => {
                  if (item) {
                    formData.append(
                      "product_image",
                      item.image ? item.image[0] : ""
                    );
                  }
                }
              );
            }
          } else {
            formData.append(item[0], item[1] as string | Blob);
          }
        }
      });

      const response = await addProducts(formData);
      if (response?.data.responseType === responseType.Success) {
        setLoading(false);
        setButtonLoader(false);
        showToast(response?.data.message, toastType.Success, intl);
        navigate("/admin/products");
      } else {
        setLoading(false);
        setButtonLoader(false);
        showToast(response?.data.message, toastType.Error, intl);
      }
    } catch (error) {
      return error;
    }
  };


  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border border-black/10 rounded-xl p-5">
            <div className="relative pb-7">
              <SectionHeader text={<FormattedMessage id="Add_new_Product" />} />
              <div className="flex flex-wrap gap-y-4 mt-8 -mx-2">
                <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                  <CustomSelect
                    label={<FormattedMessage id="Category" />}
                    options={categoryData}
                    control={control}
                    register={register}
                    name="category_uuid"
                    errorKey="category_uuid"
                    error={errors}
                    required={true}
                    placeholder={intl.formatMessage({
                      id: "Choose_Category",
                    })}
                  />
                </div>
                <div className="relative w-1/3 px-2">
                  <CustomSelect
                    control={control}
                    register={register}
                    options={productStatus as DropdownOptionType}
                    name="status"
                    errorKey="status"
                    error={errors}
                    required={true}
                    placeholder={intl.formatMessage({
                      id: "Choose_Status",
                    })}
                    label={<FormattedMessage id="Status" />}
                  />
                </div>
                <div className="relative w-1/3 px-2">
                  <CustomSelect
                    label={<FormattedMessage id="Measurement" />}
                    register={register}
                    options={measurementData}
                    name="measurement_uuid"
                    errorKey="measurement_uuid"
                    error={errors}
                    control={control}
                    required={true}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-lg font-medium text-gray-900">
                  <FormattedMessage id="English" />
                </p>
                <div className="flex flex-wrap gap-y-4 border py-5 rounded-lg border-dashed border-primarycolor p-2">
                  <div className="relative w-full md:w-1/2 px-2">
                    <Input
                      id={`name_en`}
                      type="text"
                      label={<FormattedMessage id="Product_Name" />}
                      register={register}
                      errors={errors}
                      required={true}
                      placeholder={intl.formatMessage({
                        id: "Enter_product_name",
                      })}
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 px-2">
                    <TextArea
                      id={`overview_en`}
                      label={<FormattedMessage id="Product_Overview" />}
                      name={`overview_en`}
                      register={register}
                      type="textarea"
                      parentClass="mb-30px last:mb-0 !min-h-250px"
                      errors={errors}
                      required={true}
                      placeholder={intl.formatMessage({
                        id: "Product_over",
                      })}
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 px-2">
                    <TextArea
                      id={`description_en`}
                      label={<FormattedMessage id="Product_Description" />}
                      name={`description_en`}
                      register={register}
                      type="textarea"
                      parentClass="mb-30px last:mb-0 !min-h-250px"
                      placeholder={intl.formatMessage({
                        id: "Product_desc",
                      })}
                      errors={errors}
                      required={true}
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 px-2">
                    <TextArea
                      id={`specification_en`}
                      label={<FormattedMessage id="Product_Specification" />}
                      name={`specification_en`}
                      register={register}
                      type="textarea"
                      parentClass="mb-30px last:mb-0 !min-h-250px"
                      placeholder={intl.formatMessage({
                        id: "Product_spec",
                      })}
                      errors={errors}
                      required={true}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-lg font-medium text-gray-900">
                  {<FormattedMessage id="Arabic" />}
                </p>
                <div className="flex flex-wrap gap-y-4 border py-5 rounded-lg border-dashed border-primarycolor p-2">
                  <div className="relative w-full md:w-1/2 px-2">
                    <Input
                      id={`name_ar`}
                      type="text"
                      label={<FormattedMessage id="Product_Name" />}
                      register={register}
                      errors={errors}
                      required={true}
                      placeholder={intl.formatMessage({
                        id: "Enter_product_name",
                      })}
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 px-2">
                    <TextArea
                      id={`overview_ar`}
                      label={<FormattedMessage id="Product_Overview" />}
                      name={`overview_ar`}
                      register={register}
                      type="textarea"
                      parentClass="mb-30px last:mb-0 !min-h-250px"
                      placeholder={intl.formatMessage({
                        id: "Product_over",
                      })}
                      errors={errors}
                      required={true}
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 px-2">
                    <TextArea
                      id={`description_ar`}
                      label={<FormattedMessage id="Product_Description" />}
                      name={`description_ar`}
                      register={register}
                      type="textarea"
                      parentClass="mb-30px last:mb-0 !min-h-250px"
                      placeholder={intl.formatMessage({
                        id: "Product_desc",
                      })}
                      errors={errors}
                      required={true}
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 px-2">
                    <TextArea
                      id={`specification_ar`}
                      label={<FormattedMessage id="Product_Specification" />}
                      name={`specification_ar`}
                      register={register}
                      type="textarea"
                      parentClass="mb-30px last:mb-0 !min-h-250px"
                      placeholder={intl.formatMessage({
                        id: "Product_spec",
                      })}
                      errors={errors}
                      required={true}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-lg font-medium text-gray-900">
                  {<FormattedMessage id="Urdu" />}
                </p>
                <div className="flex flex-wrap gap-y-5 border py-5 rounded-lg border-dashed border-primarycolor p-2">
                  <div className="relative w-full md:w-1/2 px-2">
                    <Input
                      id={`name_ur`}
                      type="text"
                      label={<FormattedMessage id="Product_Name" />}
                      register={register}
                      errors={errors}
                      required={true}
                      placeholder={intl.formatMessage({
                        id: "Enter_product_name",
                      })}
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 px-2">
                    <TextArea
                      id={`overview_ur`}
                      label={<FormattedMessage id="Product_Overview" />}
                      name={`overview_ur`}
                      register={register}
                      type="textarea"
                      parentClass="mb-30px last:mb-0 !min-h-250px"
                      placeholder={intl.formatMessage({
                        id: "Product_over",
                      })}
                      errors={errors}
                      required={true}
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 px-2">
                    <TextArea
                      id={`description_ur`}
                      label={<FormattedMessage id="Product_Description" />}
                      name={`description_ur`}
                      register={register}
                      type="textarea"
                      parentClass="mb-30px last:mb-0 !min-h-250px"
                      placeholder={intl.formatMessage({
                        id: "Product_desc",
                      })}
                      errors={errors}
                      required={true}
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 px-2">
                    <TextArea
                      id={`specification_ur`}
                      label={<FormattedMessage id="Product_Specification" />}
                      name={`specification_ur`}
                      register={register}
                      type="textarea"
                      parentClass="mb-30px last:mb-0 !min-h-250px"
                      placeholder={intl.formatMessage({
                        id: "Product_spec",
                      })}
                      errors={errors}
                      required={true}
                    />
                  </div>
                </div>
              </div>

              <div className="text-lg font-medium text-gray-900 mt-5">
                {<FormattedMessage id="Product_Images" />}:
              </div>
              <div className="flex flex-wrap gap-y-4 -mx-2 mt-3 items-start pb-5">
                {fields.map(
                  (
                    _item: {
                      featured_image?: string | undefined;
                      image?: File[] | undefined;
                      id: string;
                    },
                    index: number
                  ) => (
                    <div
                      className="relative flex flex-wrap w-full md:w-1/2 xl:w-1/4 px-2"
                      key={_item?.id}
                    >
                      <div className="relative w-full p-5 flex flex-wrap border border-dashed rounded-lg border-primarycolor">
                        <InputImage
                          errors={errors}
                          id={`product_image.${index}.image`}
                          errorKey={`product_image.${index}.image`}
                          register={register}
                          type="file"
                          label={<FormattedMessage id="Product_Image" />}
                          required={true}
                          value={
                            _item.image && typeof _item.image === "string"
                              ? `${REACT_APP_IMAGE_PATH}${_item.image}`
                              : null
                          }
                          setValue={setValue}
                          style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]"
                        />
                        <div className="relative flex w-full flex-row-reverse justify-end mt-2 items-center radio-label-mb  flex-wrap h-50px  gap-2">
                          <Input
                            id={`product_image.${index}.featured_image`}
                            type="radio"
                            register={register}
                            errors={errors}
                            required={true}
                            errorKey={`featured_image`}
                            name="featured_image"
                            label={<FormattedMessage id="Featured_image" />}
                            value={index.toString()}
                          />
                        </div>
                        <div className="relative w-full mt-2 text-right">
                          {fields.length > 1 && (
                            <Button
                              className="text-sm font-medium text-secondaryOrange border border-secondaryOrange py-2 px-4 rounded-lg transition-all duration-300 hover:bg-secondaryOrange hover:text-white"
                              type="button"
                              onClick={() => remove(index)}
                            >
                              {<FormattedMessage id="Remove" />}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              {fields.length < 5 && (
                <div className="border-black/10 border-t py-5 pb-0">
                  <Button
                    className="text-sm font-medium text-secondaryOrange border border-secondaryOrange py-2 px-5 rounded-lg transition-all duration-300 hover:bg-secondaryOrange hover:text-white"
                    type="button"
                    disable={buttonLoader}
                    onClick={() =>
                      append({
                        image: undefined,
                        featured_image: "",
                      })
                    }
                    text={<FormattedMessage id="Add_Product_Image" />}
                  />
                </div>
              )}
            </div>
            <div className="flex gap-4 py-5 md:py-8 pb-0 border-black/10 border-t ">
              <Button
                text={<FormattedMessage id="Cancel" />}
                type="button"
                disable={buttonLoader}
                className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                onClick={() => {
                  navigate(`/admin/products`);
                }}
              />
              <Button
                text={<FormattedMessage id="Save" />}
                type="submit"
                loader={buttonLoader}
                className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
              />{" "}
            </div>
          </div>
        </form>
      )}
    </>
  );
};
export default AddProduct;
