import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "components/button/Button"
import Input from "components/input/Input"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import VegitableBadge from "../../../assets/images/vegitable-bage.jpg"
import { emailValidationSchema } from "../schema/authentication.schema"
import { forgotPassword } from "../services/forgotPassword.service"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { setUsername } from "reducers/account.reducer"
import { showToast } from "helper/toast.helper"
import { responseType, toastType } from "constant/common.constant"
import { ForgotPasswordField } from "../types/authentication.type"
import { FormattedMessage, useIntl } from "react-intl"
const ForgotPassword = () => {
    const [submitButtonLoader, setSubmitButtonLoader] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<ForgotPasswordField>({
        resolver: yupResolver(emailValidationSchema),
    })
    const intl = useIntl()
    const handleForgotPassword = async (values: ForgotPasswordField) => {
        try {
            setSubmitButtonLoader(true)
            const passwordData = await forgotPassword(values)
            if (passwordData?.data.responseType === responseType.Failed) {
                // showToast(passwordData.data.message, toastType.Error);
                setError("username", {
                    type: "manual",
                    message: passwordData.data.message,
                })
            } else {
                showToast(passwordData?.data.message, toastType.Success, intl)
                dispatch(setUsername({ email: values.username }))
                navigate("/check-email")
            }
            setSubmitButtonLoader(false)
        } catch (error) {
            setSubmitButtonLoader(false)
        }
    }

    return (
        <div className="relative before:content-[''] before:bg-bg-Gradient before:bg-no-repeat before:bg-cover before:bg-left-top before:w-full before:h-full before:top-0 before:left-0 before:absolute before:-z-10 w-full">
            <div className='container mx-auto flex py-16 md:py-24 lg:py-36 mt-82px md:mt-85px xl:py-32 p-5'>
                <div className='w-full  sm:w-3/4 mx-auto bg-white rounded-20px flex shadow-primary-shadow'>
                    <div className='w-1/2 xl:p-5 xxl:p-30px hidden xl:block h-full'>
                        <img
                            src={VegitableBadge}
                            alt='vegitableBadge'
                            className='w-full h-full object-cover rounded-20px'
                        />
                    </div>
                    <div className='w-full xl:w-1/2 p-5 sm:p-8  xl:p-5 xl:pl-3 xxl:p-30px '>
                        <div className='w-full min-h-400px sm:min-h-360px xl:h-full  bg-white relative '>
                            <div className='flex items-start justify-between '>
                                <div className='text-left w-full'>
                                    <h2 className='text-2xl xl:text-3xl font-bold text-gray-900 text-center'>
                                        {
                                            <FormattedMessage id='Password_Recovery' />
                                        }
                                    </h2>
                                    <p className='mt-2 text-black/50 text-sm xl:text-base font-normal text-center'>
                                        {<FormattedMessage id='notice' />}
                                    </p>
                                </div>
                            </div>

                            <form
                                className='mt-5 md:mt-8'
                                onSubmit={handleSubmit(handleForgotPassword)}
                            >
                                <div className='relative'>
                                    <Input
                                        id='username'
                                        type='text'
                                        label={
                                            <FormattedMessage id='Email_address' />
                                        }
                                        register={register}
                                        errors={errors}
                                        required={true}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Email",
                                        })}
                                    />
                                </div>
                                <div className='mt-5 xl:mt-8  w-full'>
                                    <Button
                                        loader={submitButtonLoader}
                                        text={<FormattedMessage id='Submit' />}
                                        type='submit'
                                        onClick={handleForgotPassword}
                                        className='w-full px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryorange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange hover:border-secondaryOrange focus:ring-0 focus:outline-0'
                                    ></Button>
                                </div>
                                <Link to={`/login`}>
                                    <div className='absolute left-1/2 -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-0 xl:bottom-20 flex items-center w-full justify-center'>
                                        <svg
                                            className='fill-primarycolor w-4'
                                            viewBox='0 0 16 13'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                fill-rule='evenodd'
                                                clip-rule='evenodd'
                                                d='M6.95711 0.292893C7.34763 0.683417 7.34763 1.31658 6.95711 1.70711L3.41421 5.25L14.5 5.25C15.0523 5.25 15.5 5.69771 15.5 6.25C15.5 6.80228 15.0523 7.25 14.5 7.25L3.41421 7.25L6.95711 10.7929C7.34763 11.1834 7.34763 11.8166 6.95711 12.2071C6.56658 12.5976 5.93342 12.5976 5.54289 12.2071L0.292893 6.95711C-0.0976311 6.56658 -0.0976311 5.93342 0.292893 5.54289L5.54289 0.292893C5.93342 -0.0976311 6.56658 -0.0976311 6.95711 0.292893Z'
                                            />
                                        </svg>
                                        <span className='text-primarycolor text-sm font-semibold '>
                                            {<FormattedMessage id='Back' />}
                                        </span>
                                    </div>
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
