import * as yup from "yup";

export const purchaseRequestSchema = yup.object().shape({
  quantity: yup
    .mixed<string>()
    .test("is-required", "Quantity_Required_Error", (value) => {
      return value !== undefined && value !== null && value !== "";
    })
    .test("is-number", "Quantity_Number_Error", (value: any) => {
      return !isNaN(value);
    })
    .test("is-positive", "Quantity_Positive_Error", (value: any) => {
      return isNaN(value) || value > 0;
    }),
  requested_price: yup
    .mixed<string>()
    .test("is-required", "Requested_Price_Required_Error", (value) => {
      return value !== undefined && value !== null && value !== "";
    })
    .test("is-number", "Requested_Price_Number_Error", (value: any) => {
      return !isNaN(value);
    })
    .test("is-positive", "Requested_Price_Positive_Error", (value: any) => {
      return isNaN(value) || value > 0;
    }),
  sub_total: yup.mixed<string>(),
  request_expiry: yup
    .string()
    .required("Quotes_Accepted_Required_Eror")
    .test("passedDate", "Passed_Date", (value) => new Date() < new Date(value)),
  description: yup.string().required("Descripton_Error"),
});
