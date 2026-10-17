import * as yup from "yup";

export const purchaseRequestSchema = yup.object({
  product_details: yup
    .array()
    .of(
      yup.object().shape({
        offered_price: yup
          .string()
          .optional()
          .test("is-number", "Offered_Price_Positive_Error", (value: any) => {
            return !isNaN(value);
          })
          .test("is-positive", "Offered_Price_Positive_Error", (value: any) => {
            if (value == null || value.length === 0) {
              return true;
            }
            return value > 0;
          }),
        quantity: yup
          .string()
          .test("is-positive-number", "Quantity_Positive", (value: any) => {
            if (/^\d+$/.test(value)) {
              const parsedValue = parseFloat(value);
              return !isNaN(parsedValue) && parsedValue > 0;
            }
            return false;
          })
          .required("Pur_Req_Quantity"),
      })
    )
    .required(),
  charges: yup
    .string()
    .optional()
    .test("is-number", "Charges_Number_Error", (value: any) => {
      return !isNaN(value);
    })
    .test("is-positive", "Charges_Positive_Error", (value: any) => {
      if (value == null || value.length === 0) {
        return true;
      }
      return value >= 0;
    }),
  subtotal: yup.number().required("Subtotal_Error"),
  grandtotal: yup.number().optional(),
});
export default purchaseRequestSchema;

export const searchFilterSchema = yup.object().shape({
  purchaseReqId: yup.string().optional(),
  date: yup.array().optional(),
  quantity: yup.string().optional(),
  price: yup.string().optional(),
});
