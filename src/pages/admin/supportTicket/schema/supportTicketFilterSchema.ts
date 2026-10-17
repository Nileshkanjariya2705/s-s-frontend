import * as yup from "yup";

export const supportTicketFilterSchema = yup.object().shape({
  ticket_uuid: yup.string().optional(),
  created_at: yup.array().optional(),
  status: yup.string().optional(),
  company_name: yup.string().optional(),
});
