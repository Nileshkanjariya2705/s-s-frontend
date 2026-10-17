import * as yup from "yup";
function isValidEmail(value: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value);
}
export const UserContactSchema = yup.object().shape({
  firstname: yup.string().required("Firstname_Required_Error"),
  lastname: yup.string().required("Lastname_Required_Error"),
  email: yup
    .string()
    .required("Email_Error")
    .test("email", "Valid_Email", (value) => {
      if (typeof value === "string") {
        return isValidEmail(value);
      }
    }),
  phone: yup
    .mixed<string>()
    .optional()
    .nullable()
    .test("is-number", "Phone_Number_Error", (value: any) => {
      return !isNaN(value);
    })
    .test("is-positive", "Phone_Positive", (value: any) => {
      if (value == null || value.length === 0) {
        return true;
      }
      return value > 0;
    })
    .test("number-length", "Phone_Length", (value: any) => {
      if (value == null || value.length === 0) {
        return true;
      }
      return !(value?.length < 6 || value?.length > 14);
    })
    .transform((value) => {
      if (value === null || value.length === 0) {
        return "";
      } else {
        return value.replace(/\s/g, "");
      }
    }),

  message: yup.string().required("Message_Required_Error"),
});
