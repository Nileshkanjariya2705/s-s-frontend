import { yupResolver } from "@hookform/resolvers/yup";
import Input from "components/input/Input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import passwordHidden from "../../../assets/images/password-hidden.svg";
import passwordVisible from "../../../assets/images/password-vissibles.svg";
import { managePasswordTypes } from "./types/managePassword.types";
import { ManagePasswordSchema } from "./schema/managePassword.types";
import { Button } from "components/button/Button";
import { UpdatePassword } from "./services/managePassword.services";
import { responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";

const ManagePassword = () => {
  const intl = useIntl();
  const [viewConfirmPassword, setViewConfirmPassword] =
    useState<boolean>(false);
  const [viewPassword, setPassword] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<managePasswordTypes>({
    resolver: yupResolver(ManagePasswordSchema),
  });

  const handleUpdatePassword = async (values: managePasswordTypes) => {
    setButtonLoader(true);
    const response = await UpdatePassword(values?.password);
    if (response?.data?.responseType === responseType.Success) {
      showToast(response?.data.message, toastType.Success, intl);
    }
    reset();
    setButtonLoader(false);
  };
  return (
    <div className="border border-black/10 rounded-xl p-5 md:p-7 max-w-xl mx-auto">
     
      <h2 className="text-base md:text-2xl font-semibold text-black">
        <FormattedMessage id="Update_Password" />
      </h2>
      <form
        className="mt-7"
        onSubmit={handleSubmit(handleUpdatePassword)}
        encType="multipart/form-data"
      >
        <div className="flex flex-wrap gap-y-4 pb-5">
          <div className="relative w-full">
            {viewPassword ? (
              <img
                onClick={() =>
                  viewPassword ? setPassword(false) : setPassword(true)
                }
                src={passwordHidden}
                className="hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10"
                alt="sitelogo"
              />
            ) : (
              <img
                onClick={() =>
                  viewPassword ? setPassword(false) : setPassword(true)
                }
                src={passwordVisible}
                className="hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10"
                alt="sitelogo"
              />
            )}
            <Input
              errors={errors}
              id="password"
              register={register}
              type={viewPassword ? "text" : "password"}
              placeholder={intl.formatMessage({
                id: "Enter_New_Password",
              })}
              style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
              required={true}
              label={<FormattedMessage id="Enter_New_Password" />}
            />
          </div>
          <div className="relative w-full">
            {viewConfirmPassword ? (
              <img
                onClick={() =>
                  viewConfirmPassword
                    ? setViewConfirmPassword(false)
                    : setViewConfirmPassword(true)
                }
                src={passwordHidden}
                className="hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10"
                alt="sitelogo"
              />
            ) : (
              <img
                onClick={() =>
                  viewConfirmPassword
                    ? setViewConfirmPassword(false)
                    : setViewConfirmPassword(true)
                }
                src={passwordVisible}
                className="hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10"
                alt="sitelogo"
              />
            )}
            <Input
              errors={errors}
              id="confirm_password"
              register={register}
              type={viewConfirmPassword ? "text" : "password"}
              placeholder={intl.formatMessage({
                id: "ReEnter_New_Password",
              })}
              style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
              required={true}
              label={<FormattedMessage id="ReEnter_New_Password" />}
            />
          </div>
        </div>
        

        <div className="py-5 !pb-0 border-black/10 border-t w-full text-start rtl:text-end">
          <Button
            loader={buttonLoader}
            text={<FormattedMessage id="Save" />}
            type="submit"
            onClick={handleUpdatePassword}
            className="w-1/3 px-5 py-2 md:py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:bg-secondaryOrange hover:text-white focus:ring-0 focus:outline-0"
          ></Button>
        </div>
      </form>
    </div>
  );
};

export default ManagePassword;
