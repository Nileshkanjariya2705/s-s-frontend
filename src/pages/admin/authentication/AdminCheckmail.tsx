import { Button } from "components/button/Button"
import { useEffect, useState } from "react"

import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { showToast } from "helper/toast.helper"
import { responseType, toastType } from "constant/common.constant"
import { setUsername } from "reducers/account.reducer"
import { forgotPassword } from "pages/authentication/services/forgotPassword.service"
import BgAdmin from "../../../assets/images/admin.jpg"
import { setLanguage } from "reducers/language.reducer"
import { FormattedMessage, useIntl } from "react-intl"
import useLocale from "hooks/useLocale"

const AdminCheckYourEmail = () => {
    const [buttonLoader, setButtonLoader] = useState(false)
    const { language } = useLocale();
    const email = localStorage.getItem("userEmail")
    const dispatch = useDispatch()
    const username = { username: email }

    useEffect(() => {
        return () => {
            localStorage.removeItem("userEmail")
        }
    }, [])

    const intl = useIntl()
    const handleForgotPassword = async () => {
        try {
            setButtonLoader(true)
            const getResponse = await forgotPassword(
                username ? username : (email as any)
            )

            if (getResponse?.data.responseType === responseType.Failed) {
                showToast(getResponse?.data?.message, toastType.Error,intl)
            } else {
                showToast(getResponse?.data?.message, toastType.Success,intl)
                dispatch(setUsername({ email: username }))
            }
            setButtonLoader(false)
        } catch (error) {
            setButtonLoader(false)
        }
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
            <div className='relative w-550px px-4 mx-auto sm:px-0'>
                <div className='overflow-hidden bg-white rounded-3xl shadow-md'>
                    <div className='px-4 py-6 sm:px-8 sm:py-7'>
                        <div className='flex items-start justify-between '>
                            <div className='w-full bg-white relative '>
                                <h2 className='text-2xl font-bold text-gray-900 flex items-center justify-center'>
                                    <FormattedMessage id='Check_email' />
                                </h2>
                                <div className='w-20 rounded-full h-20 bg-primarycolor/10 flex items-center justify-center mx-auto mt-5'>
                                    <svg
                                        className='w-7 fill-primarycolor '
                                        viewBox='0 0 30 30'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path
                                            fill-rule='evenodd'
                                            clip-rule='evenodd'
                                            d='M26.0621 3.54226C25.754 3.60968 25.3318 3.73808 24.6538 3.94669L5.51763 9.83474C4.64854 10.1021 4.08628 10.2767 3.69853 10.4325C4.05545 10.6498 4.58133 10.9144 5.3945 11.3209L12.5728 14.9101L18.8947 8.58819C19.4805 8.0024 20.4302 8.0024 21.016 8.58819C21.6018 9.17397 21.6018 10.1237 21.016 10.7095L14.6944 17.0311L18.2835 24.2094C18.6899 25.0222 18.9546 25.5482 19.172 25.9052C19.3276 25.5174 19.502 24.9554 19.7692 24.0868L25.6577 4.94969C25.6577 4.94969 25.6577 4.9497 25.6577 4.94969C25.8661 4.27249 25.9945 3.85041 26.0621 3.54226ZM11.7497 17.8544C11.7326 17.8453 11.7104 17.8337 11.6806 17.8185C11.6391 17.7973 11.5912 17.7734 11.5289 17.7422L3.99508 13.9753C3.24308 13.5994 2.59049 13.2731 2.10593 12.975C1.65597 12.6982 1.02501 12.2618 0.724393 11.5373C0.359903 10.6589 0.443264 9.65943 0.946691 8.8537C1.36227 8.18858 2.05623 7.86181 2.54564 7.66267C3.07307 7.44805 3.7711 7.2333 4.57556 6.9858L23.8307 1.06114C24.4531 0.869581 25.0157 0.696434 25.4786 0.599204C25.9401 0.502274 26.5704 0.415665 27.2084 0.649859C28.0181 0.947137 28.6571 1.58519 28.9548 2.396C29.1891 3.03432 29.102 3.66527 29.0051 4.12612C28.9079 4.58792 28.7352 5.14906 28.5443 5.76933L28.5251 5.83194L22.6168 25.0335C22.37 25.8356 22.1558 26.5318 21.9418 27.0581C21.7429 27.5472 21.4162 28.2415 20.7509 28.6572C19.9464 29.1599 18.9475 29.2451 18.0678 28.8801C17.3433 28.5795 16.9068 27.9484 16.6298 27.4984C16.3311 27.0129 16.0041 26.3589 15.6273 25.6053L11.8708 18.0923C11.8078 17.9662 11.7745 17.9002 11.7497 17.8544Z'
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className='absolute top-7 right-7'>
                                <select
                                    className='flex items-center focus:outline-0 justify-between w-full bg-white text-black font-semibold rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent '
                                    name='Lang'
                                    id='lang_id'
                                    value={language}
                                    defaultValue={language}
                                    onChange={handleChangeLang}
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

                        <div className='space-y-5'>
                            <div className='w-full'>
                                <div className='mt-2.5 relative'>
                                    <p className='mt-5 text-black/50 text-base font-normal text-center'>
                                        <FormattedMessage id='Please_Check_Email' />{" "}
                                        <span className='text-primarycolor font-semibold'>
                                            {email}
                                        </span>{" "}
                                        <FormattedMessage id='Reset_Link' />
                                    </p>
                                    <p className='mt-6 text-black/50 text-base font-normal text-center'>
                                        <FormattedMessage id='Dont_receive_Email' />
                                    </p>
                                </div>
                            </div>

                            <div className='mt-20'>
                                <Button
                                    loader={buttonLoader}
                                    text={
                                        <FormattedMessage id='Resend_Email' />
                                    }
                                    type='button'
                                    onClick={handleForgotPassword}
                                    className='w-full px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryorange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange hover:border-secondaryOrange focus:ring-0 focus:outline-0'
                                ></Button>
                            </div>
                            <div className='mt-20'>
                                <Link
                                    to='/admin'
                                    className='inline-flex gap-2 items-center justify-center w-full text-base font-semibold text-primarycolor transition-all duration-200  hover:text-secondaryOrange  '
                                >
                                    <i className='icon-left_arrow text-2xl mr-2'></i>{" "}
                                    <FormattedMessage id='back_to_sign_in' />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminCheckYourEmail
