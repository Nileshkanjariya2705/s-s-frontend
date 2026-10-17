import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "components/button/Button"
import Input from "components/input/Input"
import { responseType, toastType } from "constant/common.constant"
import { showToast } from "helper/toast.helper"
import { passwordValidationSchema } from "pages/authentication/schema/authentication.schema"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import BgAdmin from "../../../assets/images/admin.jpg"
import {
    adminUpdatePassword,
    validateToken,
} from "./services/authentication.service"
import { AdminResetPasswordField } from "./types/authentication.type"
import { FormattedMessage, useIntl } from "react-intl"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { setLanguage } from "reducers/language.reducer"
import useLocale from "hooks/useLocale"
const AdminResetPassword = () => {
    const [buttonLoader, setButtonLoader] = useState(false)
    const [viewPassword, setViewPassword] = useState<boolean>(false)
    const [viewConfirmPassword, setViewConfirmPassword] =
        useState<boolean>(false)
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminResetPasswordField>({
        resolver: yupResolver(passwordValidationSchema),
    })

    const token = useParams()
     const { language } = useLocale();


    const dispatch = useDispatch<AppDispatch>()

    localStorage.setItem("reset_token", token.token as string)
    useEffect(() => {
        validateToken()
    }, [])

    const intl = useIntl()

    const handlePasswordUpdate = async (values: AdminResetPasswordField) => {
        try {
            setButtonLoader(true)
            const getResponse = await adminUpdatePassword(values)
            if (getResponse?.data.responseType === responseType.Success) {
                showToast(getResponse?.data.message, toastType.Success, intl)
                localStorage.removeItem("reset_token")
                navigate("/admin")
            }
            setButtonLoader(false)
        } catch (error) {}
    }

    const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
       
        dispatch(setLanguage({ language: e.target.value }))
    }
    return (
        <div className='relative py-10 bg-gray-900 sm:py-16 lg:py-24 h-screen flex items-center justify-center'>
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
                                    <FormattedMessage id='Set_New_Password' />
                                </h2>
                                <p className='mt-2 text-black/50 text-sm xl:text-base font-normal '>
                                    <FormattedMessage id='Your_New_Password' />
                                </p>
                            </div>
                            <div className='absolute top-7 right-7'>
                                <select
                                    onChange={handleChangeLang}
                                    value={language}
                                    defaultValue={language}
                                    className='flex items-center focus:outline-0 justify-between w-full bg-white text-black font-semibold rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent '
                                    name='Lang'
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

                        <form
                            onSubmit={handleSubmit(handlePasswordUpdate)}
                            className='mt-8'
                        >
                            <div className='space-y-5'>
                                <div className='w-full'>
                                    <label className='text-base font-medium text-black'>
                                        <FormattedMessage id='Password' />
                                        <span className='text-red-500'>
                                            *
                                        </span>{" "}
                                    </label>
                                    <div className='mt-2.5 relative'>
                                        <i className='icon-password text-lg absolute top-2 left-5'></i>
                                        <i
                                            className='icon-eye text-lg absolute top-2 right-5'
                                            onClick={() =>
                                                setViewPassword(!viewPassword)
                                            }
                                        ></i>

                                        <Input
                                            id='password'
                                            type={
                                                viewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            // label="Email or Username"
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder='******'
                                            style={`block w-full px-5 pl-12 py-3 text-sm text-black placeholder-black/30 transition-all duration-200 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-primarycolor`}
                                        />
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <label className='text-base font-medium text-black'>
                                        <FormattedMessage id='Confirm_Password' />
                                        <span className='text-red-500'>*</span>{" "}
                                    </label>
                                    <div className='mt-2.5 relative'>
                                        <i className='icon-password text-lg absolute top-2 left-5 '></i>
                                        <i
                                            className='icon-eye text-lg absolute top-2 right-5'
                                            onClick={() =>
                                                setViewConfirmPassword(
                                                    !viewConfirmPassword
                                                )
                                            }
                                        ></i>

                                        <Input
                                            id='confirm_password'
                                            type={
                                                viewConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            // label="Email or Username"
                                            register={register}
                                            errors={errors}
                                            required={true}
                                            placeholder='******'
                                            style={`block w-full px-5 pl-12 rtl:pr-12 rtl:pl-5 py-3 text-sm text-black placeholder-black/30 transition-all duration-200 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-primarycolor`}
                                        />
                                    </div>
                                </div>

                                <div className='mt-20'>
                                    <Button
                                        loader={buttonLoader}
                                        text={
                                            <FormattedMessage id='Reset_Password' />
                                        }
                                        type='submit'
                                        className='inline-flex items-center justify-center w-full px-4 py-2.5 text-base font-semibold text-secondaryOrange transition-all duration-200 hover:bg-secondaryOrange hover:text-white  border border-secondaryOrange rounded-xl  uppercase'
                                    ></Button>
                                </div>
                                <div className='mt-20'>
                                    <Link
                                        to='/admin'
                                        className='inline-flex gap-2 items-center justify-center w-full text-base font-semibold text-primarycolor transition-all duration-200  hover:text-secondaryOrange  uppercase'
                                    >
                                        <i className='icon-left_arrow text-2xl'></i>{" "}
                                        <FormattedMessage id='Back' />
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminResetPassword
