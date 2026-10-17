import { ImageSize, SUPPORTED_FORMATS } from "constant/common.constant";
import * as yup from "yup";

export const newCategoryValidation = yup.object().shape({
  icon: yup
    .mixed<File[]>()
    .test("Required", "Image_Require_Error", (value: any) => {
      return !value || value.length > 0;
    })
    .test("FILE_SIZE", "Image_Size_Error", function (value: any) {
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
        (value && value.length > 0 && SUPPORTED_FORMATS.includes(value[0].type))
    ),

  status: yup.string().required("Staff_Status"),
  name: yup.string().required("English_Name_Required"),
  name_ar: yup.string().required("Arabic_Name_Required"),
  name_ur: yup.string().required("Urdu_Name_Required"),
});
