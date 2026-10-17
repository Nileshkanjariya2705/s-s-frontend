import { ImageSize, SUPPORTED_FORMATS_IMAGE } from "constant/common.constant";
import * as yup from "yup";

export const BankTransferSchema = yup.object().shape({
  bank_receipt: yup
    .mixed<File[]>()
    .test("Required", "Bank_Transfer_Error", (value: any) => {
      return !value || value.length > 0;
    })
    .test("FILE_SIZE", "Image_Size_Error", function (value: any) {
      return (
        !value ||
        typeof value === "string" ||
        (value[0] && value[0].size <= ImageSize)
      );
    })
    .test("PDF_TYPE", "", function (value: any) {
      return (
        !value ||
        typeof value === "string" ||
        (value[0] && !SUPPORTED_FORMATS_IMAGE.includes(value[0].type))
      );
    }),
});
