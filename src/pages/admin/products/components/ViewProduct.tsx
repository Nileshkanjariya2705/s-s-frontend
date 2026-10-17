import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button/Button";
import Input from "components/input/Input";
import InputImage from "components/input/InputImage";
import SectionHeader from "components/sectionHeader/SectionHeader";
import TextArea from "components/textArea/Textarea";
import { REACT_APP_IMAGE_PATH } from "config";
import { DropdownOptionType, statusDropdown } from "constant/dropdown.constant";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { addProductSchema } from "../schema/product.schema";
import {
  getAllCategory,
  getAllMeasurements,
  getSingleProduct,
} from "../services/product.service";
import {
  CategoryDataType,
  MeasurementDataType,
  ProductDataType,
} from "../types/product.type";
import Loading from "components/globalLoader/Loading";
import { PageNotFound } from "components/pageNotFound/PageNotFound";
import CustomSelect from "components/customSelect/CustomSelect";
import { FormattedMessage, useIntl } from "react-intl";
import useLocale from "hooks/useLocale";

const ViewProduct = () => {
  const { productId } = useParams();

  const [productData, setProductData] = useState<ProductDataType>();
  const [categoryData, setCategoryData] = useState<CategoryDataType[]>([]);
  const [measurementData, setMeasurementData] = useState<MeasurementDataType[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { language } = useLocale();
  const productStatus = statusDropdown(language);

  const getProductData = async () => {
    try {
      const singleProductData = await getSingleProduct(productId as string);

      setProductData(singleProductData?.data?.data);
    } catch (error) {}
  };

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
  useEffect(() => {
    getCategories();
    getMeasurements();
  }, []);

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

  const {
    formState: { errors },
    register,
    control,
    setValue,
  } = useForm<ProductDataType>({
    values: productData && productData,
    defaultValues: {
      product_image: productData?.product_image,
    },
    resolver: yupResolver(addProductSchema),
  });

  const featured_index: number | undefined =
    productData?.product_image &&
    productData?.product_image.findIndex(
      (item: {
        featured_image?: string | undefined;
        image?: File[] | undefined;
      }) => {
        if (typeof item.image === "string") {
          return item?.image === productData.featured_image;
        } else {
          return 0;
        }
      }
    );

  const { fields } = useFieldArray({
    control,
    name: "product_image",
  });

  const intl = useIntl();

  const navigate = useNavigate();

  useEffect(() => {
    getProductData();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {productData ? (
            <div className="border border-black/10 rounded-xl p-5">
              <div className="relative pb-3">
                <SectionHeader text={<FormattedMessage id="View_Product" />} />
                <div className="flex flex-wrap gap-y-4 mt-8 -mx-2">
                  <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                    <CustomSelect
                      label={<FormattedMessage id="Category" />}
                      options={categoryData}
                      control={control}
                      register={register}
                      name="category_uuid"
                      error={errors}
                      required={true}
                      placeholder={intl.formatMessage({
                        id: "Choose_Category",
                      })}
                      selectedOption={
                        categoryData.find((item: CategoryDataType) => {
                          return item.value === productData.category_uuid;
                        })?.value as string
                      }
                      isDisabled={true}
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                    <CustomSelect
                      control={control}
                      register={register}
                      options={productStatus as DropdownOptionType}
                      name="status"
                      error={errors}
                      required={true}
                      placeholder={intl.formatMessage({
                        id: "Choose_Status",
                      })}
                      label={<FormattedMessage id="Status" />}
                      isDisabled={true}
                    />
                  </div>
                  <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                    <CustomSelect
                      label={<FormattedMessage id="Measurement" />}
                      register={register}
                      options={measurementData}
                      name="measurement_uuid"
                      error={errors}
                      control={control}
                      required={true}
                      selectedOption={
                        measurementData.find((item: MeasurementDataType) => {
                          return item.value === productData.measurement_uuid;
                        })?.value as string
                      }
                      isDisabled={true}
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <p className="text-lg font-medium text-gray-900">
                    {<FormattedMessage id="English" />}
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
                        disabled={true}
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
                        fieldLimit={100}
                        placeholder={intl.formatMessage({
                          id: "Product_over",
                        })}
                        errors={errors}
                        required={true}
                        disabled={true}
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
                        fieldLimit={100}
                        placeholder={intl.formatMessage({
                          id: "Product_desc",
                        })}
                        errors={errors}
                        required={true}
                        disabled={true}
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
                        fieldLimit={100}
                        placeholder={intl.formatMessage({
                          id: "Product_spec",
                        })}
                        errors={errors}
                        required={true}
                        disabled={true}
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
                        disabled={true}
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
                        fieldLimit={100}
                        placeholder={intl.formatMessage({
                          id: "Product_over",
                        })}
                        errors={errors}
                        required={true}
                        disabled={true}
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
                        fieldLimit={100}
                        placeholder={intl.formatMessage({
                          id: "Product_desc",
                        })}
                        errors={errors}
                        required={true}
                        disabled={true}
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
                        fieldLimit={100}
                        placeholder={intl.formatMessage({
                          id: "Product_spec",
                        })}
                        errors={errors}
                        required={true}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <p className="text-lg font-medium text-gray-900">
                    {<FormattedMessage id="Urdu" />}
                  </p>
                  <div className="flex flex-wrap gap-y-4 border py-5 rounded-lg border-dashed border-primarycolor p-2">
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
                        disabled={true}
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
                        fieldLimit={100}
                        placeholder={intl.formatMessage({
                          id: "Product_over",
                        })}
                        errors={errors}
                        required={true}
                        disabled={true}
                      />
                    </div>
                    <div className="relative w-full md:w-1/2 px-2">
                      <TextArea
                        id={`description_ur`}
                        label={<FormattedMessage id="Product_Overview" />}
                        name={`description_ur`}
                        register={register}
                        type="textarea"
                        parentClass="mb-30px last:mb-0 !min-h-250px"
                        fieldLimit={100}
                        placeholder={intl.formatMessage({
                          id: "Product_over",
                        })}
                        errors={errors}
                        required={true}
                        disabled={true}
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
                        fieldLimit={100}
                        placeholder={intl.formatMessage({
                          id: "Product_spec",
                        })}
                        errors={errors}
                        required={true}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-lg font-medium text-gray-900 mt-5 ">
                  {<FormattedMessage id="Product_Images" />}:
                </div>
                <div className="flex flex-wrap gap-y-4 -mx-2 mt-3 items-start pb-5">
                  {fields.map(
                    (
                      item: {
                        featured_image?: string | undefined;
                        image?: File[] | undefined;
                      },
                      index: number
                    ) => (
                      <div
                        className="relative flex flex-wrap w-full md:w-1/2 xl:w-1/4 px-2"
                        key={index}
                      >
                        <div className="relative w-full p-5 flex flex-wrap border border-dashed rounded-lg border-primarycolor">
                          <InputImage
                            errors={errors}
                            id={`product_image.${index}.image`}
                            errorKey={`product_image.${index}.image`}
                            register={register}
                            type="file"
                            value={
                              item.image
                                ? `${REACT_APP_IMAGE_PATH}${item.image}`
                                : null
                            }
                            setValue={setValue}
                            disabled={true}
                            style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]"
                          />
                          <div className="relative flex w-full flex-row-reverse justify-end mt-2 items-center radio-label-mb  flex-wrap h-50px  gap-2">
                            <Input
                              id={`product_image.${index}.featured_image`}
                              type="radio"
                              register={register}
                              errors={errors}
                              required={true}
                              label={<FormattedMessage id="Featured_image" />}
                              name="featured_image"
                              disabled={true}
                              value={index.toString()}
                              checked={index === featured_index ? true : false}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="flex gap-4 py-5 md:py-8 !pb-0 border-black/10 border-t ">
                <Button
                  text={<FormattedMessage id="Go_to_Product_List" />}
                  type="button"
                  className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                  onClick={() => {
                    // reset();
                    navigate(`/admin/products`);
                  }}
                ></Button>
              </div>
            </div>
          ) : (
            <PageNotFound />
          )}
        </>
      )}
    </>
  );
};

export default ViewProduct;
