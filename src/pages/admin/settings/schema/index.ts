import * as yup from "yup";
export const OrdComissionSchema = yup.object().shape({
    default_ord_commission: yup
    .number()
    .required("Please enter ord commission")
    .test({
      name: "ord-commission-validation",
      exclusive: true,
      test: (value: any) => {
        if (!value || isNaN(parseFloat(value))) {
          return false;
        }
        const floatValue = parseFloat(value);
        return floatValue >= 0 && floatValue <= 100; 
      },
      message: "ORD commission must be a percentage between 0 and 100",
    }) .required("ORD commission is required"),
});
export const BankComissionSchema = yup.object().shape({
    default_bank_commission: yup
    .number()
    .test({
      name: "bank-commission-validation",
      exclusive: true,
      test: (value: any) => {
        if (!value || isNaN(parseFloat(value))) {
          return false;
        }
        const floatValue = parseFloat(value);
        return floatValue >= 0 && floatValue <= 100; 
      },
      message: "Bank commission must be a percentage between 0 and 100",
    })
    .required("Bank commission is required"),
});
export const VatPercentSchema = yup.object().shape({
    vat_percentage: yup
    .number()
    .test({
      name: "vat-validation",
      exclusive: true,
      test: (value: any) => {
        if (!value || isNaN(parseFloat(value))) {
          return false;
        }
        const floatValue = parseFloat(value);
        return floatValue >= 0 && floatValue <= 100; 
      },
      message: "VAT must be a percentage between 0 and 100",
    })
    .required("VAT is required"),
});
