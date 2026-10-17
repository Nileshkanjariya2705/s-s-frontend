import * as yup from "yup";
import { ImageSize, SUPPORTED_FORMATS } from "constant/common.constant";

export const supplierEditSchema = yup.object().shape({
  uuid: yup.string().optional(),
  username: yup.string().required("Username_Error"),
  email: yup.string().email("Valid_Email").required("Email_Error"),
  company_name: yup.string().required("Comapny_Name_Error"),
  phone: yup
    .mixed<string>()
    .optional()
    .nullable()
    .test("is-number", "Phone_Number_Error", (value: any) => {
      return !isNaN(value);
    })
    .test("is-positive", "Phone_Positive", (value: any) => {
      if (value == null || value.length === 0) {
        return true;
      }
      return value > 0;
    })
    .test("number-length", "Phone_Length", (value: any) => {
      if (value == null || value.length === 0) {
        return true;
      }
      return !(value?.length < 6 || value?.length > 14);
    })
    .transform((value) => {
      if (typeof value === "string" || value instanceof String) {
        if (value === null || value.length === 0) {
          return "";
        } else {
          return value.replace(/\s/g, "");
        }
      } else {
        return value;
      }
    }),
  cr_number: yup
    .string()
    .required("Cr_Number_Error")
    .matches(/^[a-zA-Z0-9]*$/, "Cr_Alphanumeric")
    .test("is-positive", "Cr_Positive", (value: any) => {
      return isNaN(value) || value > 0;
    })
    .test("LENGTH", "Cr_Length", (value: any) => {
      return value.length === 10;
    }),
  tax_number: yup
    .string()
    .optional()
    .nullable()
    .test("is-number", "Tax_Number_Error", (value: any) => {
      return !isNaN(value);
    })
    .test("is-positive", "Tax_Positive", (value: any) => {
      if (value == null || value.length === 0) {
        return true;
      }
      return value > 0;
    })
    .test("number-length", "Tax_Length", (value: any) => {
      if (value == null || value.length === 0) {
        return true;
      }
      return !(value.length !== 9);
    }),
  iban_number: yup
    .string()
    .matches(/^[a-zA-Z0-9]*$/, "Iban_Alphanumeric")
    .required("Iban_Number_Error")
    .test("is-positive", "Iban_Positive", (value: any) => {
      return isNaN(value) || value > 0;
    })
    .test("LENGTH", "Iban_Length", (value: any) => {
      return value.length === 22;
    }),
  profile_image: yup
    .mixed<File[] | string>()
    .optional()
    .nullable()
    .test("FILE_SIZE", "Image_Size_Error", (value: any) => {
      if (value == null || value.length === 0) {
        return true;
      } else {
        return (
          typeof value === "string" || (value[0] && value[0].size <= ImageSize)
        );
      }
    })
    .test("FILE_FORMAT", "Image_Format_Error", (value: any) => {
      if (value == null || value.length === 0) {
        return true;
      }
      return (
        typeof value === "string" ||
        (value.length > 0 && SUPPORTED_FORMATS.includes(value[0].type))
      );
    }),
  is_active: yup.string().required("Company_Status"),
  ord_commission: yup
  .string()
  .required("Please enter ord commission")
  .test({
    name: "ord-commission-validation",
    exclusive: true,
    test: (value: any) => {
      if (!value || isNaN(parseFloat(value))) {
        return false;
      }
      const floatValue = parseFloat(value);
      return floatValue >= 0 && floatValue <= 100; 
    },
    message: "ORD commission must be a percentage between 0 and 100",
  }) .required("ORD commission is required"),
  bank_commission: yup
  .string()
  .test({
    name: "bank-commission-validation",
    exclusive: true,
    test: (value: any) => {
      if (!value || isNaN(parseFloat(value))) {
        return false;
      }
      const floatValue = parseFloat(value);
      return floatValue >= 0 && floatValue <= 100; 
    },
    message: "Bank commission must be a percentage between 0 and 100",
  })
  .required("Bank commission is required"),
});
