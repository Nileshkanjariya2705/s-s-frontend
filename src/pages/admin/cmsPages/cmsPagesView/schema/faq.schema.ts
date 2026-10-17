import { ImageSize, SUPPORTED_FORMATS } from "constant/common.constant";
import * as yup from "yup";

export const FaqSchema = yup.object().shape({
  faqHeading: yup.string().required("Heading_Required_Error"),
  faqSubHeading: yup.string().required("Sub_Heading_Required_Error"),
  faqImage: yup.array().of(
    yup.object().shape({
      image: yup
        .mixed<File[]>()
        .test("required", "Image_Require_Error", function (value: any) {
          return value && value.length > 0;
        })
        .test("FILE_SIZE", "Image_Size_Error", function (value: any) {
          return (
            !value ||
            typeof value === "string" ||
            (value[0] && value[0].size <= ImageSize)
          );
        })
        .test("FILE_FORMAT", "Image_Format_Error", function (value: any) {
          return (
            typeof value === "string" ||
            (value &&
              value.length > 0 &&
              SUPPORTED_FORMATS.includes(value[0].type))
          );
        }),
    })
  ),
});

export const FaqDetailSchema = yup.object().shape({
  question_en: yup.string().required("Question_Error"),
  answer_en: yup.string().required("Answer_Error"),
  question_ar: yup.string().required("Question_Error"),
  answer_ar: yup.string().required("Answer_Error"),
  question_ur: yup.string().required("Question_Error"),
  answer_ur: yup.string().required("Answer_Error"),
});
