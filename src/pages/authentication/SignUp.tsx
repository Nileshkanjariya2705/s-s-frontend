import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { signupValidationSchema } from "./schema/authentication.schema";
import Input from "components/input/Input";
import { createAccount } from "./services/authentication.service";
import { SignUpInterface, varientType } from "./types/authentication.type";
import { Button } from "components/button/Button";
import SecondImage from "../../assets/images/veg_v1.jpg";
import { showToast } from "../../helper/toast.helper";
import { responseType, toastType } from "constant/common.constant";
import passwordHidden from "../../assets/images/password-hidden.svg";
import passwordVisible from "../../assets/images/password-vissibles.svg";
import { FormattedMessage, useIntl } from "react-intl";
import { REACT_APP_SITE_KEY } from "../../config/index";
import ReCAPTCHA from "react-google-recaptcha";
import { Helmet } from "react-helmet";

const SignUp = () => {
  const hasRecaptcha = Boolean(REACT_APP_SITE_KEY);
  const recaptchaRef = useRef<any>(null);
  const navigate = useNavigate();
  const [buttonLoader, setButtonLoader] = useState(false);
  const [varient, setVarient] = useState<varientType>("STORE");
  const [viewConfirmPassword, setViewConfirmPassword] =
    useState<boolean>(false);
  const [viewPassword, setPassword] = useState<boolean>(false);
  const intl = useIntl();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpInterface & FieldValues>({
    defaultValues: {},
    resolver: yupResolver<SignUpInterface>(signupValidationSchema),
  });
  const title = intl.formatMessage({ id: 'Sign_Up' });

  const handleSignUp: SubmitHandler<FieldValues> = async (values) => {
    try {
      setButtonLoader(true);
      const token: string | undefined = hasRecaptcha
        ? await recaptchaRef?.current?.props?.grecaptcha.getResponse()
        : undefined;
      if (hasRecaptcha && !token) {
        setButtonLoader(false);
        return;
      }
      if (hasRecaptcha && token) {
        values.reCAPTCHAtoken = token;
      } else {
        delete values.reCAPTCHAtoken;
      }
      let response;
      if (varient === "STORE") {
        response = await createAccount({
          ...values,
          varient: varient,
        } as SignUpInterface);
      } else if (varient === "SUPPLIER") {
        response = await createAccount({
          ...values,
          varient: varient,
        } as SignUpInterface);
      }
      if (response?.data.responseType === responseType.Failed) {
        showToast(response.data.message, toastType.Error, intl);
        if (hasRecaptcha) {
          await recaptchaRef?.current?.props?.grecaptcha.reset();
        }
      } else {
        showToast(response?.data.message, toastType.Success, intl);
        navigate("/login");
      }
      setButtonLoader(false);
    } catch (error) {
      setButtonLoader(false);
    }
  };

  const toggleSignUp = () => {
    if (varient === "SUPPLIER") {
      reset();
      setVarient("STORE");
    } else {
      reset();
      setVarient("SUPPLIER");
    }
  };

  return (
    <div className="relative before:content-[''] before:bg-bg-Gradient before:bg-no-repeat before:bg-cover before:bg-left-top before:w-full before:h-full before:top-0 before:left-0 before:absolute before:-z-10 w-full">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="container mx-auto flex py-16 md:py-24 lg:py-36 mt-76px md:mt-85px xl:py-32 p-5">
        <div className="w-full  sm:w-3/4 mx-auto bg-white rounded-20px flex shadow-primary-shadow">
          <div className="w-1/2 xl:p-5 xxl:p-30px hidden xl:block h-full">
            <img
              src={SecondImage}
              alt="vegitablebage"
              className="w-full h-full object-cover rounded-20px"
            />
          </div>
          <div className="w-full xl:w-1/2 p-5 sm:p-8  xl:p-5 xl:pl-3 xxl:p-30px ">
            <div className="w-full min-h-400px sm:min-h-360px xl:h-full bg-white relative ">
              <h2 className="text-26px text-center font-bold text-darkgrey ">
                {<FormattedMessage id="Sign_Up" />}
              </h2>
              <div className="flex items-center bg-primarygrey p-1.5 rounded-xl gap-2 mt-8">
                <button
                  type="button"
                  className={
                    varient === "STORE"
                      ? "w-full text-white bg-primarycolor  focus:ring-0 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 focus:outline-none"
                      : "w-full text-blackfocus:ring-0 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 focus:outline-none "
                  }
                  onClick={() => toggleSignUp()}
                >
                  {<FormattedMessage id="Store" />}
                </button>
                <button
                  type="button"
                  className={
                    varient === "SUPPLIER"
                      ? "w-full text-white bg-primarycolor  focus:ring-0 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 focus:outline-none"
                      : "w-full text-blackfocus:ring-0 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 focus:outline-none "
                  }
                  onClick={() => toggleSignUp()}
                >
                  {<FormattedMessage id="Supplier" />}
                </button>
              </div>
              <form
                className="mt-5 lg:mt-8 space-y-4 md:space-y-6"
                onSubmit={handleSubmit(handleSignUp)}
              >
                <div className="relative">
                  <Input
                    errors={errors}
                    id="username"
                    register={register}
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "Enter_Username",
                    })}
                    style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                    required={true}
                    label={<FormattedMessage id="Username" />}
                  />
                </div>

                <div className="relative">
                  <Input
                    errors={errors}
                    id="email"
                    register={register}
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "Enter_Email",
                    })}
                    style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4"
                    required={true}
                    label={<FormattedMessage id="Email_address" />}
                  />
                </div>
                <div className="relative">
                  <Input
                    errors={errors}
                    id="company_name"
                    register={register}
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "Enter_CompanyName",
                    })}
                    style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                    required={true}
                    label={<FormattedMessage id="Company_Name" />}
                  />
                </div>
                <div className="flex space-y-6 sm:space-y-0 sm:space-x-3 rtl:space-x-0 flex-wrap sm:flex-nowrap">
                  <div className="relative w-full sm:w-1/2 sm:rtl:ml-3">
                    <Input
                      errors={errors}
                      id="cr_number"
                      register={register}
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "Enter_CR_Number",
                      })}
                      style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                      required={true}
                      label={<FormattedMessage id="CR_Number" />}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/2">
                    <Input
                      errors={errors}
                      id="tax_number"
                      register={register}
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "Enter_Tax_Number",
                      })}
                      style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                      label={<FormattedMessage id="Tax_Number" />}
                    />
                  </div>
                </div>

                <div className="relative">
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
                    placeholder="••••••••"
                    style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                    required={true}
                    label={<FormattedMessage id="Password" />}
                  />
                </div>
                <div className="relative">
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
                    placeholder="••••••••"
                    style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                    required={true}
                    label={<FormattedMessage id="Confirm_Password" />}
                  />
                </div>
                {hasRecaptcha ? (
                  <ReCAPTCHA
                    sitekey={REACT_APP_SITE_KEY as string}
                    ref={recaptchaRef}
                  />
                ) : null}
                <div className="!mt-8 xl:!mt-8 w-full">
                  <Button
                    loader={buttonLoader}
                    text={<FormattedMessage id="Sign_Up" />}
                    type="submit"
                    onClick={handleSignUp}
                    className="w-full px-5 py-2 md:py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:bg-secondaryOrange hover:text-white focus:ring-0 focus:outline-0"
                  ></Button>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-black">
                    {<FormattedMessage id="Have_Account" />}
                    <span
                      className="text-primarycolor font-semibold cursor-pointer ml-1 rtl:ml-1 rtl:mr-1"
                      onClick={() => navigate("/login")}
                    >
                      {" "}
                      {<FormattedMessage id="sign_in" />}
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
