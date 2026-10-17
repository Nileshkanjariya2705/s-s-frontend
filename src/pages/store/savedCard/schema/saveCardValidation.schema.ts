import * as yup from "yup";

export const saveCardValidationSchema = yup.object().shape({
  card_name: yup.string().required("Card_Name_Error"),
});
