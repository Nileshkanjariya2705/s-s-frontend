import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "components/button/Button"
import Input from "components/input/Input"
import { showToast } from "../../../helper/toast.helper"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { handleSetUserDetails } from "reducers/account.reducer"
import { setToken } from "reducers/token.reducer"
import { AppDispatch } from "store"
import BgAdmin from "../../../assets/images/admin.jpg"
import { loginAdmin } from "./services/authentication.service"
import { responseType, toastType } from "constant/common.constant"
import { loginValidationSchema } from "./schema/authentication.schema"
import { FormattedMessage, useIntl } from "react-intl"
import { setLanguage } from "reducers/language.reducer"
import { AdminLoginFormFields } from "./types/authentication.type"
import passwordHidden from "../../../assets/images/password-hidden.svg"
import passwordVisible from "../../../assets/images/password-vissibles.svg"
import useLocale from "hooks/useLocale"

const AdminLogin = () => {
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const [viewPassword, setViewPassword] = useState<boolean>(false)
    const { language } = useLocale();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminLoginFormFields>({
        resolver: yupResolver(loginValidationSchema),
    })

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLanguage({ language: e.target.value }))
    }


    const intl = useIntl()

    const handleLogin = async (values: AdminLoginFormFields) => {
        try {
            setButtonLoader(true)
            const getResponse = await loginAdmin(values)
            if (getResponse?.data.responseType === responseType.Failed) {
                showToast(getResponse.data.message, toastType.Error, intl)
            } else {
                showToast(getResponse?.data.message, toastType.Success, intl)
                const { user, token, role } = getResponse?.data.data
                dispatch(handleSetUserDetails({ ...user, role: role }))
                dispatch(setToken(token))
                localStorage.setItem("S&S_authtoken", token)
                navigate("/admin/admin-dashboard")
            }
            setButtonLoader(false)
        } catch (error) {
            setButtonLoader(false)
        }
    }
    return (
        <>
            <div
                className='relative py-10 bg-gray-900 sm:py-16 lg:py-24 h-screen flex items-center justify-center'
                // dir={`${language === "ar" ? "rtl" : "ltr"}`}
            >
                <div className='absolute inset-0'>
                    <img
                        className='object-cover w-full h-full'
                        src={BgAdmin}
                        alt='BgAdmin'
                    />
                </div>
                <div className='absolute inset-0 bg-gray-900/20'></div>

                <div className='relative w-550px px-4 mx-auto sm:px-0'>
                    <div className='overflow-hidden bg-white rounded-xl shadow-md'>
                        <div className='px-4 py-6 sm:px-8 sm:py-7'>
                            <div className='flex items-start justify-between '>
                                <div className='text-left w-full pr-24'>
                                    <h2 className='text-2xl xl:text-3xl font-bold text-gray-900'>
                                        {/* Sign In */}
                                        <FormattedMessage id='sign_in' />
                                    </h2>
                                    <p className='mt-2 text-black/50 text-sm xl:text-base font-normal '>
                                        <FormattedMessage id='account_details' />
                                    </p>
                                </div>
                                <div className='absolute top-7 right-7'>
                                    <select
                                        onChange={handleChangeLang}
                                        className='flex items-center focus:outline-0 justify-between w-full bg-white text-black font-semibold rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent '
                                        name='Lang'
                                        value={language}
                                        defaultValue={language}
                                        id='lang_id'
                                    >
                                        <svg
                                            className='w-3 h-3 ml-3 fill-black/25'
                                            viewBox='0 0 11 7'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                fill-rule='evenodd'
                                                clip-rule='evenodd'
                                                d='M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L5.5 4.08579L9.29289 0.292893C9.68342 -0.0976311 10.3166 -0.0976311 10.7071 0.292893C11.0976 0.683417 11.0976 1.31658 10.7071 1.70711L6.20711 6.20711C5.81658 6.59763 5.18342 6.59763 4.79289 6.20711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z'
                                            />
                                        </svg>
                                        <option value='en'>English</option>
                                        <option value='ar'>عربي</option>
                                        <option value='ur'>اردو</option>
                                    </select>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(handleLogin)}>
                                <div className='mt-7 space-y-3'>
                                    <div className='w-full relative'>
                                        <i className='icon-emails-alt text-lg absolute top-43px left-4 rtl:right-4 rtl:left-0 z-10'></i>

                                        <Input<AdminLoginFormFields>
                                            id='username'
                                            type='text'
                                            register={register}
                                            errors={errors}
                                            label={
                                                <FormattedMessage id='Email_address' />
                                            }
                                            required={true}
                                            placeholder='Enter your email/username'
                                            style={`block w-full px-5 pl-12 rtl:pr-12 rtl:pl-5 py-3 text-sm text-black placeholder-black/30 transition-all duration-200 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-primarycolor`}
                                        />
                                    </div>
                                    <div className='w-full relative'>
                                        <i className='icon-password text-lg absolute top-43px left-4 rtl:right-4 rtl:left-unset z-10 '></i>
                                        {viewPassword ? (
                                            <img
                                                onClick={() =>
                                                    viewPassword
                                                        ? setViewPassword(false)
                                                        : setViewPassword(true)
                                                }
                                                src={passwordHidden}
                                                className='hover:cursor-pointer text-lg absolute top-12 right-4 rtl:left-4 rtl:right-unset z-10'
                                                alt='sitelogo'
                                            />
                                        ) : (
                                            <img
                                                onClick={() =>
                                                    viewPassword
                                                        ? setViewPassword(false)
                                                        : setViewPassword(true)
                                                }
                                                src={passwordVisible}
                                                className='hover:cursor-pointer text-lg absolute top-12 right-4 rtl:left-4 rtl:right-unset z-10'
                                                alt='sitelogo'
                                            />
                                        )}

                                        <Input<AdminLoginFormFields>
                                            id='password'
                                            type={
                                                viewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            label={
                                                <FormattedMessage id='Password' />
                                            }
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder='*******'
                                            style={`block w-full px-5 pl-12 py-3 rtl:pr-12 rtl:pl-5 text-sm text-black placeholder-black/30 transition-all duration-200 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-primarycolor`}
                                        />
                                    </div>
                                    <div className='flex items-center !mt-6'>
                                        <div className='flex items-center w-3/6 gap-3'>
                                            <Input<AdminLoginFormFields>
                                                errors={errors}
                                                register={register}
                                                id='remember'
                                                type='checkbox'
                                                style={`accent-primarycolor w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:outline-0 focus:ring-0`}
                                                required={false}
                                            />
                                            <label className='text-sm font-medium text-black'>
                                                {
                                                    <FormattedMessage id='Remember_me' />
                                                }
                                            </label>
                                        </div>

                                        <Link
                                            to={"/admin/forgot-password"}
                                            className='w-3/6 sm:mt-0 text-right rtl:text-left text-sm font-medium text-primarycolor'
                                        >
                                            {
                                                <FormattedMessage id='Forgot_Password' />
                                            }
                                        </Link>
                                    </div>
                                    <div className='!mt-6'>
                                        <Button
                                            loader={buttonLoader}
                                            text={
                                                <FormattedMessage id='sign_in' />
                                            }
                                            type='submit'
                                            // onClick={handleLogin}
                                            className='inline-flex items-center justify-center w-full px-4 py-2.5 text-base font-semibold text-secondaryOrange transition-all duration-200 hover:bg-secondaryOrange hover:text-white  border border-secondaryOrange rounded-xl  uppercase'
                                        ></Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminLogin
