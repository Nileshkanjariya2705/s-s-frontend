import * as yup from "yup";

export const CardSchema = yup.object().shape({
  cards: yup.string().required("Please Select any card"),
});
