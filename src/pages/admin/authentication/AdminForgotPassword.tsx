import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button/Button";
import Input from "components/input/Input";
import { responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import { emailValidationSchema } from "pages/authentication/schema/authentication.schema";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUsername } from "reducers/account.reducer";
import { AppDispatch } from "store";
import BgAdmin from "../../../assets/images/admin.jpg";
import { adminForgotPassword } from "./services/authentication.service";
import { FormattedMessage, useIntl } from "react-intl";
import { setLanguage } from "reducers/language.reducer";
import useLocale from "hooks/useLocale";
const AdminForgotPassword = () => {
  const { language } = useLocale();
  const [buttonLoader, setButtonLoader] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FieldValues>({
    resolver: yupResolver(emailValidationSchema) as any,
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const intl = useIntl();
  const handleForgotPassword = async (values: any) => {
    try {
      setButtonLoader(true);
      const getResponse = await adminForgotPassword(values);
      if (getResponse?.data.responseType === responseType.Failed) {
        showToast(getResponse.data.message, toastType.Error,intl);
        setError("username", {
          type: "manual",
          message: getResponse.data.message,
        });
      } else {
        showToast(getResponse?.data.message, toastType.Success,intl);
        dispatch(setUsername({ email: values.username }));
        localStorage.setItem("userEmail", values.username);
        navigate("/admin/check-email");
      }
      setButtonLoader(false);
    } catch (error) {
      setButtonLoader(false);
    }
  };


  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage({ language: e.target.value }));
  };
  return (
    <div className="relative py-10 bg-gray-900 sm:py-16 lg:py-24 h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          className="object-cover w-full h-full"
          src={BgAdmin}
          alt="BgAdmin"
        />
      </div>

      <div className="relative w-550px px-4 mx-auto sm:px-0">
        <div className="overflow-hidden bg-white rounded-3xl shadow-md">
          <div className="px-4 py-6 sm:px-8 sm:py-7">
            <div className="flex items-start justify-between ">
              <div className="text-left w-full pr-24">
                <h2 className="text-2xl xl:text-3xl font-bold text-gray-900">
                  {<FormattedMessage id="Password_Recovery" />}
                </h2>
                <p className="mt-2 text-black/50 text-sm xl:text-base font-normal ">
                  {<FormattedMessage id="admin_notice" />}
                </p>
              </div>
              <div className="absolute top-7 right-7">
                <select
                  className="flex items-center focus:outline-0 justify-between w-full bg-white text-black font-semibold rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent "
                  name="Lang"
                  id="lang_id"
                  value={language}
                  defaultValue={language}
                  onChange={handleChangeLang}
                >
                  <svg
                    className="w-3 h-3 ml-3 fill-black/25"
                    viewBox="0 0 11 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L5.5 4.08579L9.29289 0.292893C9.68342 -0.0976311 10.3166 -0.0976311 10.7071 0.292893C11.0976 0.683417 11.0976 1.31658 10.7071 1.70711L6.20711 6.20711C5.81658 6.59763 5.18342 6.59763 4.79289 6.20711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z"
                    />
                  </svg>
                  <option value="en">English</option>
                  <option value="ar">عربي</option>
                  <option value="ur">اردو</option>
                </select>
              </div>
            </div>

            <form
             
              onSubmit={handleSubmit(handleForgotPassword)}
            >
              <div className="space-y-5 mt-7">
                <div className="w-full">
                  <label className="text-base font-medium text-black">
                    {" "}
                    {<FormattedMessage id="Email_address" />}
                    <span className="text-red-500">*</span>{" "}
                  </label>
                  <div className="mt-2.5 relative">
                    <i className="icon-emails-alt text-lg absolute top-2 left-4 rtl:right-4 rtl:left-unset z-50"></i>

                    <Input
                      id="username"
                      type="text"
                      // label="Email or Username"
                      register={register}
                      errors={errors}
                      required={true}
                      placeholder={intl.formatMessage({
                        id: "Enter_Email",
                      })}
                      style={`block w-full px-5 pl-12 rtl:pr-12 rtl:pl-5 py-3 text-sm text-black placeholder-black/30 transition-all duration-200 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-primarycolor`}
                    />
                  </div>
                </div>

                <div className="mt-20">
                  <Button
                    loader={buttonLoader}
                    text={<FormattedMessage id="Submit" />}
                    type="submit"
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 text-base font-semibold text-secondaryOrange transition-all duration-200 hover:bg-secondaryOrange hover:text-white  border border-secondaryOrange rounded-xl  uppercase"
                  ></Button>
                </div>
                <div className="mt-20">
                  <Link
                    to="/admin"
                    className="inline-flex gap-2 items-center justify-center w-full text-base font-semibold text-primarycolor transition-all duration-200  hover:text-secondaryOrange  uppercase"
                  >
                    <i className="icon-left_arrow text-2xl"></i>{" "}
                    {<FormattedMessage id="Back" />}
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
