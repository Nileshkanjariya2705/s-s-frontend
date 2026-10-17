import { SUPPORTED_FORMATS } from "constant/common.constant";
import * as yup from "yup";

export const ReviewSchema = yup.object().shape({
  uuid: yup.string().optional(),
  rating: yup.string().required("Rating_Required_Error"),
  profile_image: yup
    .mixed<File[]>()
    .test("FILE_SIZE", "Image_Require_Error", (value: any) => {
      return !value || value.length > 0;
    })
    .test(
      "FILE_FORMAT",
      "Image_Format_Error",
      (value: any) =>
        !value ||
        typeof value === "string" ||
        (value && value.length > 0 && SUPPORTED_FORMATS.includes(value[0].type))
    )
    .required(),
  customer_name_en: yup.string().required("Customer_Name_Required_Error"),
  customer_name_ar: yup.string().required("Customer_Name_Required_Error"),
  customer_name_ur: yup.string().required("Customer_Name_Required_Error"),
  customer_designation_en: yup
    .string()
    .required("Customer_Designation_Required_Error"),
  customer_designation_ar: yup
    .string()
    .required("Customer_Designation_Required_Error"),
  customer_designation_ur: yup
    .string()
    .required("Customer_Designation_Required_Error"),
  card_description_en: yup.string().required("Card_Descripton_Required_Error"),
  card_description_ar: yup.string().required("Card_Descripton_Required_Error"),
  card_description_ur: yup.string().required("Card_Descripton_Required_Error"),
});

export const reviewHeaderSchema = yup.object().shape({
  reviewHeaderSection: yup.array().of(
    yup.object().shape({
      page: yup.string().required(),
      heading: yup.string().required("Heading_Required_Error"),
      description: yup.string().required("Descripton_Required_Error"),
    })
  ),
});
