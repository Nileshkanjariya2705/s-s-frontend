import * as yup from "yup";
export const BankTransferFilterSchema = yup.object().shape({
  order_uuid: yup.string().optional(),
  order_date: yup.array().optional(),
  supplier_company: yup.string().optional(),
  store_company: yup.string().optional(),
  amount: yup
    .string()
    .test("is-number", "Price_Number", (value: any) => {
      return !isNaN(value);
    })
    .test("is-positive-number", "Price_Positive", (value: any) => {
      if (/^\d*[\.{1}\d*]\d*$/.test(value)) {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      }
      if (!value) {
        return true;
      }
    }).optional(),
});
