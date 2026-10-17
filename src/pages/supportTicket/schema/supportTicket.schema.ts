import { ImageSize, SUPPORTED_FORMATS } from "constant/common.constant";
import * as yup from "yup";

export const supportTicketValidation = yup.object().shape({
  attachment: yup
    .mixed<File[]>()
    .test("FILE_SIZE", "File_Size_Error", function (value: any) {
      if (value[0]) {
        return value && value[0].size <= ImageSize;
      }
      return true;
    })
    .test("FILE_FORMAT", "Image_Format_Error", (value: any) => {
      if (value[0]) {
        return (
          // !value ||
          // typeof value === "string" ||
          value && value.length > 0 && SUPPORTED_FORMATS.includes(value[0].type)
        );
      }
      return true;
    }),

  subject: yup.string().required("Support_Subject"),
  text: yup.string().required("Pur_Req_Description"),
});

export const supportTicketFilterSchema = yup.object().shape({
  ticket_uuid: yup.string().optional(),
  created_at: yup.array().optional(),
  status: yup.string().optional(),
});

export const supportTicketReplyValidation = yup.object().shape({
  text: yup.string().optional(),
  attachment: yup
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
});
