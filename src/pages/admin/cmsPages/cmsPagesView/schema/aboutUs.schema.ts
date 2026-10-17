import { ImageSize, SUPPORTED_FORMATS } from "constant/common.constant";
import * as yup from "yup";

export const aboutUsValidationSchema = yup.object().shape({
  about_page_banner: yup.string().required("Page_Banner_Reuired_Error"),
  banner_section_heading: yup
    .string()
    .required("Banner_Heading_Required_Error"),
  banner_section_subheading: yup
    .string()
    .required("Banner_Sub_Heading_Required_Error"),
  banner_section_img: yup.array().of(
    yup.object().shape({
      image: yup
        .mixed<File[]>()
        .test("FILE_SIZE", "Image_Require_Error", (value: any) => {
          return (
            !value ||
            typeof value === "string" ||
            (value[0] && value[0].size <= ImageSize)
          );
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
        ),
    })
  ),
  banner_section_collections: yup.array().of(
    yup.object().shape({
      value: yup.string().required("Collection_Value_Required_Error"),
      text: yup.string().required("Collecion_Text_Required_Error"),
    })
  ),
  button_text: yup.string().required("Button_Text_Required_Error"),
  // button_link: yup.string().required("Button Link required"),

  choose_us_header: yup.string().required("Choose_Header_Required_Error"),
  choose_us_description: yup
    .string()
    .required("Choose_Description_Required_Error"),
  choose_us_card: yup.array().of(
    yup.object().shape({
      image: yup
        .mixed<File[]>()
        .test("FILE_SIZE", "Image_Require_Error", (value: any) => {
          return (
            !value ||
            typeof value === "string" ||
            (value[0] && value[0].size <= ImageSize)
          );
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
        ),

      header: yup.string().required("Choose_Header_Required_Error"),
      description: yup.string().required("Choose_Description_Required_Error"),
    })
  ),
  our_team: yup.array().of(
    yup.object().shape({
      image: yup
        .mixed<File[]>()
        .test("FILE_SIZE", "Image_Require_Error", (value: any) => {
          return (
            !value ||
            typeof value === "string" ||
            (value[0] && value[0].size <= ImageSize)
          );
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
        ),

      position: yup.string().required("Team_Position_Required_Error"),
      name: yup.string().required("Team_Name_Required_Error"),
    })
  ),
  our_team_header: yup.string().required("Team_Header_Required_Error"),
  our_team_description: yup
    .string()
    .required("Team_Description_Required_Error"),
});
