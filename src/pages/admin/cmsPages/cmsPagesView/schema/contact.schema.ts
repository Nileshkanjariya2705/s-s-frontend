import { ImageSize, SUPPORTED_FORMATS } from "constant/common.constant";
import * as yup from "yup";

export const ContactSchema = yup.object().shape({
  pageTitle: yup.string().required("Page_Title_Required_Error"),
  heading: yup.string().required("Heading_Required_Error"),
  subHeding: yup.string().required("Sub_Heading_Required_Error"),
  subTitle1: yup.string().required("Sub_Title_Required_Error"),
  subTitle2: yup.string().required("Sub_Title_Required_Error"),
  subTitle3: yup.string().required("Sub_Title_Required_Error"),
  title1: yup.string().required("Title_Required_Error"),
  title2: yup.string().required("Title_Required_Error"),
  supportTitle: yup.string().required("Title_Required_Error"),
  title3: yup.string().required("Title_Required_Error"),
  contact: yup.array().of(
    yup.object().shape({
      image: yup
        .mixed<File[]>()
        .test("REQUIRED", "Image_Require_Error", (value: any) => {
          return !value || value.length > 0;
        })
        .test(
          "FILE_FORMAT",
          "Image_Format_Error",
          (value: any) =>
            !value ||
            typeof value === "string" ||
            (value &&
              value.length > 0 &&
              SUPPORTED_FORMATS.includes(value[0].type))
        )
        .test("FILE_SIZE", "Image_Size_Error", function (value: any) {
          return (
            !value ||
            typeof value === "string" ||
            (value[0] && value[0].size <= ImageSize)
          );
        }),
    })
  ),
});
