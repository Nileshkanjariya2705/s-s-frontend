import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button/Button";
import Input from "components/input/Input";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { FormattedMessage, useIntl } from "react-intl";
import { showToast } from "helper/toast.helper";
import { toastType } from "constant/common.constant";
import { OrderRefundTime } from "pages/admin/payment/types/paymentList.type";
import { OrderRefundSchema } from "pages/admin/payment/schema/vatCharges.schema";
import { createRefundDays } from "pages/admin/payment/services/adminPayment.services";

const RefundDays = (refundable_days: { refundable_days: number }) => {
  const [updateButtonLoader, setUpdateButtonLoader] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] =
    useState<OrderRefundTime>(refundable_days);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderRefundTime>({
    resolver: yupResolver(OrderRefundSchema),
    values: refundable_days,
  });

  const intl = useIntl();

  const handleSaveRefundDays = async (values: OrderRefundTime) => {
    try {
      setUpdateButtonLoader(true);
      const response = await createRefundDays(values);
      if (response?.data?.responseType === "success") {
        showToast(response?.data.message, toastType.Success, intl);
        setDefaultValues({ refundable_days: values.refundable_days });
      }
      setUpdateButtonLoader(false);
    } catch (error) {
      setUpdateButtonLoader(false);
      return error;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleSaveRefundDays)}>
        <div className="w-full mx-4">
          <p className="text-xl md:text-2xl text-Primarycolors font-semibold">
            <FormattedMessage id="Refund_Accepted_Upto" />{" "}
            <span className="text-red-600">*</span>
          </p>
          <div className="flex relative gap-2 mt-6 flex-wrap gap-y-4">
            <div className="relative min-w-[calc(100%-56px)] max-w-[calc(100%-100px)] md:max-w-unset md:min-w-320px">
              <Input
                id="refundable_days"
                type="text"
                register={register}
                errors={errors}
                required={true}
                placeholder={intl.formatMessage({
                  id: "Enter_Refund_Accepted_Upto",
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
                className="px-5 py-2.5 text-xs md:text-sm md:!leading-24px font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
              ></Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RefundDays;
