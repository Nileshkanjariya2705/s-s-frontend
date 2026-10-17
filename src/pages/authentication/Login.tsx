import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import VegitableBage from "../../assets/images/vegitable-bage.jpg";
import Input from "components/input/Input";
import { loginUser } from "./services/authentication.service";
import { AppDispatch, RootState } from "store";
import { setToken } from "reducers/token.reducer";
import { handleSetUserDetails } from "reducers/account.reducer";
import { Button } from "components/button/Button";
import { showToast } from "../../helper/toast.helper";
import { loginValidationSchema } from "pages/admin/authentication/schema/authentication.schema";
import { LoginInterFace } from "./types/authentication.type";
import { responseType, toastType } from "constant/common.constant";
import passwordHidden from "../../assets/images/password-hidden.svg";
import passwordVisible from "../../assets/images/password-vissibles.svg";
import { resetSocketDetails } from "reducers/socket.reducer";
import ReCAPTCHA from "react-google-recaptcha";
import { FormattedMessage, useIntl } from "react-intl";
import { REACT_APP_SITE_KEY } from "../../config/index";
import { Helmet } from "react-helmet";

const Login = () => {
  const hasRecaptcha = Boolean(REACT_APP_SITE_KEY);
  const navigate = useNavigate();
  const recaptchaRef = useRef<any>(null);

  const [loginSubmitButtonLoader, setLoginSubmitButtonLoader] = useState(false);
  const [viewLoginPassword, setViewLoginPassword] = useState<boolean>(false);
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'sign_in' });
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInterFace>({
    resolver: yupResolver(loginValidationSchema),
  });
  const socket = useSelector((state: RootState) => ({
    socket: state.socket.socket,
  }));

  const handleLogin = async (values: LoginInterFace) => {
    try {
      setLoginSubmitButtonLoader(true);
      const token: string | undefined = hasRecaptcha
        ? await recaptchaRef?.current?.props?.grecaptcha.getResponse()
        : undefined;
      if (hasRecaptcha && !token) {
        setLoginSubmitButtonLoader(false);
        return;
      }
      if (hasRecaptcha && token) {
        values.reCAPTCHAtoken = token;
      } else {
        delete values.reCAPTCHAtoken;
      }
      const loggingUserDetails = await loginUser(values);
      if (
        loggingUserDetails?.data?.responseType === responseType?.Success &&
        loggingUserDetails?.data?.data === null
      ) {
        showToast(loggingUserDetails?.data?.message, toastType.Success, intl);
      } else if (
        loggingUserDetails?.data?.responseType === responseType.Failed
      ) {
        showToast(loggingUserDetails?.data?.message, toastType.Error, intl);
        if (hasRecaptcha) {
          await recaptchaRef?.current?.props?.grecaptcha.reset();
        }
      } else {
        showToast(loggingUserDetails?.data?.message, toastType.Success, intl);
        const { user, token, role, account_user_entity_uuid } =
          loggingUserDetails?.data?.data;
        dispatch(
          handleSetUserDetails({
            ...user,
            role: role,
            user_entity_uuid: account_user_entity_uuid,
          })
        );
        dispatch(setToken(token));
        navigate("/dashboard");
        if (socket) {
          dispatch(resetSocketDetails());
        }
      }
      setLoginSubmitButtonLoader(false);
    } catch (error) {
      setLoginSubmitButtonLoader(false);
    }
  };

  return (
    <div className="relative before:content-[''] before:bg-bg-Gradient before:bg-no-repeat before:bg-cover before:bg-left-top before:w-full before:h-full before:top-0 before:left-0 before:absolute before:-z-10 w-full">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="container mx-auto flex py-20 lg:py-32 xl:py-32 p-5 mt-76px">
        <div className="w-full  sm:w-3/4 mx-auto bg-white rounded-20px flex shadow-primary-shadow">
          <div className="w-1/2 xl:p-5 xxl:p-30px hidden xl:block h-full">
            <img
              src={VegitableBage}
              alt="vegitablebage"
              className="w-full h-full object-cover rounded-20px"
            />
          </div>
          <div className="w-full xl:w-1/2 p-5 sm:p-8  xl:p-5 xl:pl-3 xxl:p-30px ">
            <div className="w-full min-h-400px sm:min-h-360px xl:h-full xl:pt-3  bg-white relative ">
              <h2 className="text-26px text-center font-bold text-darkgrey ">
                {<FormattedMessage id="sign_in" />}
              </h2>
              <form
                className="mt-5  lg:mt-8 space-y-4 md:space-y-5"
                onSubmit={handleSubmit(handleLogin)}
              >
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    label={<FormattedMessage id="Email_Username" />}
                    register={register}
                    errors={errors}
                    required={true}
                    placeholder={intl.formatMessage({
                      id: "Enter_Email_Username",
                    })}
                  />
                </div>
                <div className="relative">
                  {viewLoginPassword ? (
                    <img
                      onClick={() =>
                        viewLoginPassword
                          ? setViewLoginPassword(false)
                          : setViewLoginPassword(true)
                      }
                      src={passwordHidden}
                      className="hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10"
                      alt="sitelogo"
                    />
                  ) : (
                    <img
                      onClick={() =>
                        viewLoginPassword
                          ? setViewLoginPassword(false)
                          : setViewLoginPassword(true)
                      }
                      src={passwordVisible}
                      className="hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10"
                      alt="sitelogo"
                    />
                  )}
                  <Input
                    id="password"
                    type={viewLoginPassword ? "text" : "password"}
                    label={<FormattedMessage id="Password" />}
                    register={register}
                    errors={errors}
                    placeholder="*******"
                    required={true}
                  />
                </div>
                <div className="flex items-center flex-wrap !mt-5">
                  <div className="flex items-center h-5 w-3/6 gap-2 sm:gap-3">
                    <Input
                      errors={errors}
                      register={register}
                      id="remember"
                      type="checkbox"
                      // eslint-disable-next-line react/style-prop-object
                      style="accent-primarycolor w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
                      required={false}
                    />
                    <label className="text-sm font-medium text-black">
                      {<FormattedMessage id="Remember_me" />}
                    </label>
                  </div>
                  <Link
                    to={"/forgot-password"}
                    className=" w-3/6  sm:mt-0 text-right rtl:text-left text-sm font-medium text-primarycolor"
                  >
                    {<FormattedMessage id="Forgot_Password" />}?
                  </Link>
                </div>
                {hasRecaptcha ? (
                  <ReCAPTCHA
                    sitekey={REACT_APP_SITE_KEY as string}
                    ref={recaptchaRef}
                  />
                ) : null}
                <div className="!mt-5 xl:!mt-8 xxl:!mt-10 w-full">
                  <Button
                    loader={loginSubmitButtonLoader}
                    text={<FormattedMessage id="sign_in" />}
                    type="submit"
                    onClick={handleLogin}
                    className="g-recaptcha w-full px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryorange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange hover:border-secondaryOrange focus:ring-0 focus:outline-0"
                  ></Button>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-normal text-center text-black">
                    {<FormattedMessage id="Not_Have_Account" />}
                    <span
                      className="text-primarycolor font-semibold cursor-pointer ml-1 rtl:ml-1 rtl:mr-1"
                      onClick={() => navigate("/signup")}
                    >
                      {" "}
                      {<FormattedMessage id="Sign_Up" />}
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

export default Login;
