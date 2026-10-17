import { yupResolver } from "@hookform/resolvers/yup";
import Input from "components/input/Input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { showToast } from "helper/toast.helper";
import { toastType } from "constant/common.constant";
import { VatPercentType } from "../types";
import { VatPercentSchema } from "../schema";
import { updateVatCharges } from "pages/admin/payment/services/adminPayment.services";
import { Button } from "components/button/Button";

const VatPercentage = (vat_percentage: { vat_percentage: number }) => {
  const [defaultValues, setDefaultValues] =
    useState<VatPercentType>(vat_percentage);
  const [updateButtonLoader, setUpdateButtonLoader] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VatPercentType>({
    resolver: yupResolver(VatPercentSchema),
    values: vat_percentage,
  });

  const intl = useIntl();

  const handleUpdateCharge = async (values: VatPercentType) => {
    setUpdateButtonLoader(true);
    const response = await updateVatCharges(values);
    setDefaultValues({ vat_percentage: response?.data?.data?.vat_percentage });
    showToast(response?.data.message, toastType.Success, intl);
    setUpdateButtonLoader(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleUpdateCharge)}>
        <div className="w-full">
          <p className="text-base md:text-2xl font-medium text-gray-900">
            <FormattedMessage id="Vat_Percentage" />{" "}
            <span className="text-red-600">*</span>
          </p>
          <div className="flex relative gap-2 mt-6 flex-wrap gap-y-4">
            <div className="relative min-w-[calc(100%-56px)] max-w-[calc(100%-100px)] md:max-w-unset md:min-w-320px">
              <Input
                id="vat_percentage"
                type="text"
                register={register}
                errors={errors}
                required={true}
                placeholder={intl.formatMessage({
                  id: "Enter_Vat_Charges_Error",
                })}
                fixDecimal={true}
              />
              <div className="relative w-full md:w-auto mt-2">
                {defaultValues && (
                  <Button
                    text={<FormattedMessage id="Update" />}
                    type="submit"
                    onClick={handleUpdateCharge}
                    loader={updateButtonLoader}
                    className="px-5 py-2.5 text-xs md:text-sm md:!leading-24px font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                  ></Button>
                )}
              </div>
            </div>
            <span className="text-secondaryGreen text-xl md:text-2xl flex items-center justify-center rounded-xl font-medium w-12 h-12 md:w-12 md:h-12 bg-black/5">
              %
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VatPercentage;
