import * as yup from "yup";

export const measurementSchema = yup.object().shape({
  status: yup.string().required("Staff_Status"),
  unit_name: yup.string().required("Unit_Name_Required_Error"),
  unit_short_name: yup.string().required("Unit_Name_Required_Error"),
  unit_name_ar: yup.string().required("Unit_Name_Required_Error"),
  unit_short_name_ar: yup.string().required("Unit_Name_Required_Error"),
  unit_name_ur: yup.string().required("Unit_Name_Required_Error"),
  unit_short_name_ur: yup.string().required("Unit_Name_Required_Error"),
});
