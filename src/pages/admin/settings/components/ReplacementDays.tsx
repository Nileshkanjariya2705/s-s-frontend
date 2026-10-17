import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button/Button";
import Input from "components/input/Input";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { FormattedMessage, useIntl } from "react-intl";
import { showToast } from "helper/toast.helper";
import { toastType } from "constant/common.constant";
import { updateReplacementDays } from "pages/admin/payment/services/adminPayment.services";
import { OrderReplacementTime } from "pages/admin/payment/types/paymentList.type";
import { OrderReplacementSchema } from "pages/admin/payment/schema/vatCharges.schema";

const ReplacementDays = (replacement_days: { replacement_days: number }) => {
  const intl = useIntl();
  const [updateButtonLoader, setUpdateButtonLoader] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] =
    useState<OrderReplacementTime>(replacement_days);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderReplacementTime>({
    resolver: yupResolver(OrderReplacementSchema),
    values: replacement_days,
  });

  const handleUpdateReplaceDays = async (values: OrderReplacementTime) => {
    setUpdateButtonLoader(true);
    const response = await updateReplacementDays(values);
    setDefaultValues({
      replacement_days: response?.data?.data?.replacement_days,
    });
    showToast(response?.data.message, toastType.Success, intl);
    setUpdateButtonLoader(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleUpdateReplaceDays)}>
        <div className="w-full mx-4">
          <p className="text-xl md:text-2xl text-Primarycolors font-semibold">
            <FormattedMessage id="Replacement_Accepted_Upto" />{" "}
            <span className="text-red-600">*</span>
          </p>
          <div className="flex relative gap-2 mt-6 flex-wrap gap-y-4">
            <div className="relative min-w-[calc(100%-56px)] max-w-[calc(100%-100px)] md:max-w-unset md:min-w-320px">
              <Input
                id="replacement_days"
                type="text"
                register={register}
                errors={errors}
                required={true}
                placeholder={intl.formatMessage({
                  id: "Enter_Replacement_Accepted_Upto",
                })}
                fixDecimal={true}
              />
            </div>
            <span className="text-secondaryGreen text-l md:text-xl flex items-center justify-center rounded-xl font-medium w-20 h-12 md:w-20 md:h-12 bg-black/5">
              <FormattedMessage id="Days" />
            </span>
          </div>

          <div className="relative w-full md:w-auto mt-3">
            {defaultValues && (
              <Button
                text={<FormattedMessage id="Update" />}
                type="submit"
                loader={updateButtonLoader}
                className="px-4 py-2.5  text-xs md:text-sm md:!leading-24px font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
              ></Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReplacementDays;
