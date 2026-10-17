import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "components/button/Button"
import Input from "components/input/Input"
import { responseType, RoleConstant, toastType } from "constant/common.constant"
import { showToast } from "helper/toast.helper"
import { useEffect, useState } from "react"
import { useForm, FieldValues } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import VegitableBage from "../../../assets/images/vegitable-bage.jpg"
import { passwordValidationSchema } from "../schema/authentication.schema"
import {
    UpdatePassword,
    validateToken,
} from "../services/forgotPassword.service"
import passwordHidden from "../../../assets/images/password-hidden.svg"
import passwordVisible from "../../../assets/images/password-vissibles.svg"
import { useIntl } from "react-intl"
const ResetPassword = () => {
    const [buttonLoader, setButtonLoader] = useState(false)

    const token: any = useParams()
    localStorage.setItem("reset_token", token.token)
    useEffect(() => {
        validateToken()
    }, [])
    const navigate = useNavigate()

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<FieldValues>({
        resolver: yupResolver(passwordValidationSchema) as any,
    })
    const [viewPassword, setViewPassword] = useState<boolean>(false)
    const [viewConfirmPassword, setViewConfirmPassword] =
        useState<boolean>(false)

    const intl = useIntl()

    const handlePasswordUpdate = async (value: any) => {
        try {
            setButtonLoader(true)
            const getResponse = await UpdatePassword(value)
            if (getResponse?.data.responseType === responseType.Success) {
                showToast(getResponse?.data.message, toastType.Success,intl)
                localStorage.removeItem("reset_token")
                if (getResponse?.data.data === RoleConstant.superAdmin) {
                    navigate("/admin")
                } else {
                    navigate("/login")
                }
            }
            setButtonLoader(false)
        } catch (error) {
            setButtonLoader(false)
        }
    }

    return (
        <div className="relative before:content-[''] before:bg-bg-Gradient before:bg-no-repeat before:bg-cover before:bg-left-top before:w-full before:h-full before:top-0 before:left-0 before:absolute before:-z-10 w-full">
            <div className='container mx-auto flex py-16 md:py-24 lg:py-36 mt-82px md:mt-85px xl:py-32 p-5'>
                <div className='w-full  sm:w-3/4 mx-auto bg-white rounded-20px flex shadow-primary-shadow'>
                    <div className='w-1/2 xl:p-5 xxl:p-30px hidden xl:block h-full'>
                        <img
                            src={VegitableBage}
                            alt='vegitablebage'
                            className='w-full h-full object-cover rounded-20px'
                        />
                    </div>
                    <div className='w-full xl:w-1/2 p-5 sm:p-8  xl:p-5 xl:pl-3 xxl:p-30px '>
                        <div className='w-full min-h-400px sm:min-h-360px xl:h-full  bg-white relative '>
                            <h2 className='text-26px text-center font-bold text-darkgrey '>
                                Reset Password
                            </h2>
                            <p className='mt-3 text-black/50 text-base font-normal text-center'>
                                Your Identity has been verified to set your new
                                password
                            </p>
                            <form
                                className='mt-32px'
                                onSubmit={handleSubmit(handlePasswordUpdate)}
                            >
                                <div className='relative'>
                                    {viewPassword ? (
                                        <img
                                            onClick={() =>
                                                viewPassword
                                                    ? setViewPassword(false)
                                                    : setViewPassword(true)
                                            }
                                            src={passwordHidden}
                                            className='hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10'
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
                                            className='hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10'
                                            alt='sitelogo'
                                        />
                                    )}
                                    <Input
                                        id='password'
                                        type={
                                            viewPassword ? "text" : "password"
                                        }
                                        label='Password'
                                        register={register}
                                        errors={errors}
                                        placeholder='Enter Password'
                                    />
                                </div>
                                <div className='relative mt-8'>
                                    <i
                                        className='icon-eye hover:cursor-pointer text-lg absolute top-11 right-5 z-10'
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
                                        label='confirm Password'
                                        register={register}
                                        errors={errors}
                                        placeholder='Enter Password'
                                    />
                                </div>
                                <div className='mt-5 xl:mt-8 xxl:mt-12 w-full'>
                                    <Button
                                        loader={buttonLoader}
                                        text='Update'
                                        type='submit'
                                        onClick={handlePasswordUpdate}
                                        className='w-full px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryorange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange hover:border-secondaryOrange focus:ring-0 focus:outline-0'
                                    ></Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
