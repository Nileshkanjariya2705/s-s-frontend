import { ImageSize, SUPPORTED_FORMATS } from "constant/common.constant";
import * as yup from "yup";

export const adminManageProfileValidation = yup.object().shape({
  image: yup
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

  username: yup.string().required("Username_Error"),
  email: yup.string().email("Valid_Email").required("Email_Error"),
  phone: yup
    .mixed<string>()
    .required("Phone_Error")
    .test("is-required", "Phone_Error", (value) => {
      return value !== undefined && value !== null && value !== "";
    })
    .test("is-number", "Phone_Number_Error", (value: any) => {
      return !isNaN(value);
    })
    .test("is-positive", "Phone_Positive", (value: any) => {
      return isNaN(value) || value > 0;
    })
    .test("number-length", "Phone_Length", (value: any) => {
      return !(value.length < 6 || value.length > 14);
    }),
});
