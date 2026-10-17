import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button/Button";
import Input from "components/input/Input";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { FormattedMessage, useIntl } from "react-intl";
import { showToast } from "helper/toast.helper";
import { toastType } from "constant/common.constant";
import { BankComissionSchema } from "../schema";
import { createDefaultBankCommission } from "../services";
import { BankCommissionType } from "../types";
import Tooltip from "components/tooltip/tooltip";

const BankCommission = (default_bank_commission: BankCommissionType) => {
  const [saveButtonLoader, setSaveButtonLoader] = useState(false);
  const [defaultValues, setDefaultValues] = useState<BankCommissionType>(
    default_bank_commission
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankCommissionType>({
    resolver: yupResolver(BankComissionSchema),
    values: default_bank_commission,
  });

  const intl = useIntl();

  const handleSaveBankCommission = async (values: BankCommissionType) => {
    try {
      setSaveButtonLoader(true);
      const response = await createDefaultBankCommission(values);
      if (response?.data?.responseType === "success") {
        showToast(response?.data.message, toastType.Success, intl);
        setDefaultValues({
          default_bank_commission: values.default_bank_commission,
        });
        setSaveButtonLoader(false);
      }
    } catch (error) {
      setSaveButtonLoader(false);
      return error;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleSaveBankCommission)}>
        <div className="w-full mx-4">
          <p className="text-xl md:text-2xl text-Primarycolors font-semibold">
            <FormattedMessage id="bank_commission" />{" "}
            <span className="text-red-600">*</span>
            <Tooltip tooltip="Default Bank commission for all suppliers">
              <div className="relative ml-2">
                <svg
                  className="w-5 fill-black"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10 2C5.58173 2 2 5.58167 2 10C2 14.4183 5.58173 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58167 14.4183 2 10 2ZM0 10C0 4.47717 4.47717 0 10 0C15.5228 0 20 4.47717 20 10C20 15.5228 15.5228 20 10 20C4.47717 20 0 15.5228 0 10ZM9 6C9 5.44775 9.44769 5 10 5H10.01C10.5623 5 11.01 5.44775 11.01 6C11.01 6.55225 10.5623 7 10.01 7H10C9.44769 7 9 6.55225 9 6ZM9 9C8.44769 9 8 9.44775 8 10C8 10.5522 8.44769 11 9 11V14C9 14.5522 9.44769 15 10 15H11C11.5523 15 12 14.5522 12 14C12 13.4478 11.5523 13 11 13V10C11 9.44775 10.5523 9 10 9H9Z"
                  />
                </svg>
              </div>
            </Tooltip>
          </p>
          <div className="flex relative gap-2 mt-6 flex-wrap gap-y-4">
            <div className="relative min-w-[calc(100%-56px)] max-w-[calc(100%-100px)] md:max-w-unset md:min-w-320px">
              <Input
                id="default_bank_commission"
                type="text"
                register={register}
                errors={errors}
                required={true}
                placeholder={intl.formatMessage({
                  id: "Enter_Bank_Commission",
                })}
                fixDecimal={true}
              />
            </div>
            <span className="text-secondaryGreen text-xl md:text-2xl flex items-center justify-center rounded-xl font-medium w-12 h-12 md:w-12 md:h-12 bg-black/5">
              %
            </span>
          </div>

          <div className="relative w-full md:w-auto mt-3">
            {defaultValues && (
              <Button
                text={<FormattedMessage id="Update" />}
                type="submit"
                loader={saveButtonLoader}
                className="px-4 py-2.5  text-xs md:text-sm md:!leading-24px font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
              ></Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default BankCommission;
