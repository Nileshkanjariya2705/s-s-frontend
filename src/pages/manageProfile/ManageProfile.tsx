import { FieldValues, UseFormSetError, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ManageProfileSchema } from "./schema/authentication.schema"
import useUserData from "hooks/getUserData"
import useOwnerData from "hooks/getOwnerData"
import { useState } from "react"
import { REACT_APP_IMAGE_PATH } from "../../config/index"
import { useDispatch } from "react-redux"
import { showToast } from "helper/toast.helper"

import axios from "axios"
import { AppDispatch } from "store"
import {
    getOwnerShipDetils,
    setOwnershipDetails,
} from "reducers/ownership.reducer"
import {
    handleGetAccountData,
    handleSetUserDetails,
} from "reducers/account.reducer"
import { updateProfileData } from "./types/manageProfile.types"
import InputImage from "components/input/InputImage"
import Input from "components/input/Input"
import { Button } from "components/button/Button"
import { useNavigate } from "react-router-dom"
import { setToken } from "reducers/token.reducer"
import { FormattedMessage, useIntl } from "react-intl"
import SavedAddress from "./components/SavedAddress"
import { RoleConstant, responseType, toastType } from "constant/common.constant"
import { Modal } from "components/model/Model"
import passwordHidden from "../../assets/images/password-hidden.svg"
import passwordVisible from "../../assets/images/password-vissibles.svg"
import { managePassword } from "pages/admin/managePassword/types/managePassword.types"
import { UpdatePasswordSchema } from "pages/admin/managePassword/schema/managePassword.types"
import { UpdateManagePassword } from "pages/admin/managePassword/services/managePassword.services"

const ManageProfile = () => {
    const intl = useIntl()
    const dispatch = useDispatch<AppDispatch>()
    const [buttonLoader, setButtonLoader] = useState(false)
    const [passButtonLoader, setPassButtonLoader] = useState(false)
    const { email, phone, image, username, role } = useUserData()
    const { company_name, cr_number, iban_number, tax_number } = useOwnerData()
    const [passwordModal, setPasswordModal] = useState<boolean>(false)
    const [viewOldPassword, setOldPassword] = useState<boolean>(false)
    const [viewPassword, setPassword] = useState<boolean>(false)
    const [viewConfirmPassword, setViewConfirmPassword] =
        useState<boolean>(false)
    const is_Owner =
        role === RoleConstant.storeOwner || role === RoleConstant.supplierOwner
            ? true
            : false
    const InitialValues: updateProfileData = {
        company_name: company_name,
        cr_number: cr_number,
        email: email,
        iban_number: iban_number,
        phone: phone,
        photo: image || undefined,
        tax_number: tax_number,
        username: username,
    }
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        reset,
        formState: { errors },
    } = useForm<updateProfileData & FieldValues>({
        resolver: yupResolver(ManageProfileSchema),
        values: InitialValues,
    })
    const handleErrors = (
        error: Record<string, string>,
        setError: UseFormSetError<FieldValues>
    ) => {
        setError("server_error_messages", error)
    }
    const navigate = useNavigate()

    const handleInitialApiCalls = async () => {
        try {
            const data = await dispatch(getOwnerShipDetils() as any)
            dispatch(setOwnershipDetails({ ...data.payload }))
            const response = await dispatch(handleGetAccountData())
            if (response.payload.status !== 500) {
                dispatch(handleSetUserDetails({ ...response.payload }))
            } else {
                navigate("/login")
                dispatch(setToken(""))
                localStorage.removeItem("S&S_authtoken")
            }
        } catch (error) {
            return error
        }
    }

    const handleUpdateProfile = async (
        values: updateProfileData & FieldValues
    ) => {
        const formData: FormData = new FormData()
        if (values.photo?.length === 0) {
            delete values.photo
            formData.append("photo", "null")
        }
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                if (key === "photo" && values.photo && values.photo[0]) {
                    formData.append("photo", values.photo[0])
                } else {
                    formData.append(key, values[key])
                }
            }
        }
        setButtonLoader(true)
        const response = await axios.patch(
            `${process.env.REACT_APP_API_URL}/manage-profile/personal-details/update`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        if (response?.data.responseType === "success") {
            setButtonLoader(false)
            handleInitialApiCalls()
            reset()
            showToast(response?.data.message, "success", intl)
        } else {
            setButtonLoader(false)
            showToast(response?.data.message, "error", intl)
            const error = response?.data
            handleErrors(error, setError)
        }
    }

    const {
        handleSubmit: UpdatePassword,
        register: PasswordRegister,
        formState: { errors: passwordErrors },
    } = useForm<managePassword>({
        resolver: yupResolver(UpdatePasswordSchema),
    })

    const handleUpdatePassword = async (values: any) => {
        setPassButtonLoader(true)
        const response = await UpdateManagePassword(
            InitialValues.email,
            values.oldPassword,
            values?.password
        )
        if (response?.data?.responseType === responseType.Success) {
            showToast(response?.data.message, toastType.Success, intl)
            setPasswordModal(false)
            setPassButtonLoader(false)
        } else {
            showToast(response?.data.message, toastType.Error, intl)
            setPasswordModal(false)
            setPassButtonLoader(false)
        }
        reset()
    }
    return (
        <div className='w-full xl:w-3/4 space-y-30px'>
            <div className='border border-black/10 rounded-14px p-20px md:p-30px'>
                <h2 className='text-base md:text-2xl font-semibold text-black'>
                    <FormattedMessage id='personal_details' />
                </h2>
                <form
                    className='mt-7'
                    onSubmit={handleSubmit(handleUpdateProfile)}
                    encType='multipart/form-data'
                >
                    <div className='flex  flex-wrap -mx-3'>
                        <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                            <Input<updateProfileData>
                                label={<FormattedMessage id='Username' />}
                                errors={errors}
                                id='username'
                                register={register}
                                type='text'
                                placeholder={intl.formatMessage({
                                    id: "Username",
                                })}
                                required={true}
                                // value={username}
                                style='bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                            />
                        </div>
                        <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                            <Input<updateProfileData>
                                label={<FormattedMessage id='Email' />}
                                errors={errors}
                                id='email'
                                register={register}
                                type='email'
                                placeholder={intl.formatMessage({
                                    id: "Email",
                                })}
                                required={false}
                                disabled={true}
                                style='bg-slate-100 border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                            />
                        </div>
                        <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                            <Input<updateProfileData>
                                label={<FormattedMessage id='CR_Number' />}
                                errors={errors}
                                id='cr_number'
                                register={register}
                                type='text'
                                placeholder={intl.formatMessage({
                                    id: "CR_Number",
                                })}
                                required={true}
                                disabled={is_Owner ? false : true}
                                value={cr_number}
                                style={`  ${
                                    is_Owner ? "bg-white" : "bg-slate-100"
                                } border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 `}
                            />
                        </div>
                        <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                            <Input<updateProfileData>
                                label={<FormattedMessage id='Company_Name' />}
                                errors={errors}
                                id='company_name'
                                register={register}
                                type='text'
                                placeholder={intl.formatMessage({
                                    id: "Company_Name",
                                })}
                                required={true}
                                disabled={is_Owner ? false : true}
                                style={`  ${
                                    is_Owner ? "bg-white" : "bg-slate-100"
                                } border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 `}
                            />
                        </div>
                        <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                            <Input<updateProfileData>
                                label={<FormattedMessage id='Phone' />}
                                errors={errors}
                                id='phone'
                                register={register}
                                type='text'
                                placeholder={intl.formatMessage({
                                    id: "Phone",
                                })}
                                style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                                required={true}
                            />
                        </div>
                        <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                            <Input<updateProfileData>
                                label={<FormattedMessage id='Tax_Number' />}
                                errors={errors}
                                id='tax_number'
                                register={register}
                                type='text'
                                placeholder={intl.formatMessage({
                                    id: "Tax_Number",
                                })}
                                value={tax_number}
                                disabled={is_Owner ? false : true}
                                style={`  ${
                                    is_Owner ? "bg-white" : "bg-slate-100"
                                } border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 `}
                            />
                        </div>

                        <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5 '>
                            <InputImage<updateProfileData>
                                type='file'
                                errors={errors}
                                id='photo'
                                register={register}
                                setValue={setValue}
                                isMulitple={false}
                                height={72}
                                value={
                                    image
                                        ? `${REACT_APP_IMAGE_PATH}${image}`
                                        : null
                                }
                                label={<FormattedMessage id='Photo' />}
                                style='bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select'
                            />
                        </div>
                        <div className='relative w-full lg:w-1/2 px-3 mb-3 md:mb-5'>
                            <Input<updateProfileData>
                                label={<FormattedMessage id='IBAN_number' />}
                                errors={errors}
                                id='iban_number'
                                register={register}
                                type='text'
                                placeholder={intl.formatMessage({
                                    id: "IBAN_number",
                                })}
                                disabled={is_Owner ? false : true}
                                required={true}
                                style={`  ${
                                    is_Owner ? "bg-white" : "bg-slate-100"
                                } border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 `}
                            />
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='mt-5 xxl:mt-10 w-full '>
                            <Button
                                loader={passButtonLoader}
                                text={<FormattedMessage id='Manage_Password' />}
                                type='button'
                                onClick={() => setPasswordModal(true)}
                                className='px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:bg-secondaryOrange hover:text-white focus:ring-0 focus:outline-0 uppercase'
                            ></Button>
                        </div>{" "}
                        <div className='mt-5 xxl:mt-10 w-full text-right'>
                            <Button
                                loader={buttonLoader}
                                text={<FormattedMessage id='UPDATE_DETAILS' />}
                                type='submit'
                                className='px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:bg-secondaryOrange hover:text-white focus:ring-0 focus:outline-0 uppercase'
                            ></Button>
                        </div>
                    </div>
                </form>
                {passwordModal && (
                    <Modal
                        showModal={passwordModal}
                        title={<FormattedMessage id='Update_Password' />}
                        setShowModal={setPasswordModal}
                    >
                        <form
                            className='mt-7'
                            onSubmit={UpdatePassword(handleUpdatePassword)}
                        >
                            <div className='flex flex-wrap gap-y-4 pb-5'>
                                <div className='relative w-full'>
                                    {viewOldPassword ? (
                                        <img
                                            onClick={() =>
                                                viewOldPassword
                                                    ? setOldPassword(false)
                                                    : setOldPassword(true)
                                            }
                                            src={passwordHidden}
                                            className='hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10'
                                            alt='sitelogo'
                                        />
                                    ) : (
                                        <img
                                            onClick={() =>
                                                viewOldPassword
                                                    ? setOldPassword(false)
                                                    : setOldPassword(true)
                                            }
                                            src={passwordVisible}
                                            className='hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10'
                                            alt='sitelogo'
                                        />
                                    )}
                                    <Input
                                        errors={passwordErrors}
                                        id='oldPassword'
                                        register={PasswordRegister}
                                        type={
                                            viewOldPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder={intl.formatMessage({
                                            id: "Enter_Current_Password",
                                        })}
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                                        required={true}
                                        label={
                                            <FormattedMessage id='Enter_Current_Password' />
                                        }
                                    />
                                </div>
                                <div className='relative w-full'>
                                    {viewPassword ? (
                                        <img
                                            onClick={() =>
                                                viewPassword
                                                    ? setPassword(false)
                                                    : setPassword(true)
                                            }
                                            src={passwordHidden}
                                            className='hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10'
                                            alt='sitelogo'
                                        />
                                    ) : (
                                        <img
                                            onClick={() =>
                                                viewPassword
                                                    ? setPassword(false)
                                                    : setPassword(true)
                                            }
                                            src={passwordVisible}
                                            className='hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10'
                                            alt='sitelogo'
                                        />
                                    )}
                                    <Input
                                        errors={passwordErrors}
                                        id='password'
                                        register={PasswordRegister}
                                        type={
                                            viewPassword ? "text" : "password"
                                        }
                                        placeholder={intl.formatMessage({
                                            id: "Enter_New_Password",
                                        })}
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                                        required={true}
                                        label={
                                            <FormattedMessage id='Enter_New_Password' />
                                        }
                                    />
                                </div>
                                <div className='relative w-full'>
                                    {viewConfirmPassword ? (
                                        <img
                                            onClick={() =>
                                                viewConfirmPassword
                                                    ? setViewConfirmPassword(
                                                          false
                                                      )
                                                    : setViewConfirmPassword(
                                                          true
                                                      )
                                            }
                                            src={passwordHidden}
                                            className='hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10'
                                            alt='sitelogo'
                                        />
                                    ) : (
                                        <img
                                            onClick={() =>
                                                viewConfirmPassword
                                                    ? setViewConfirmPassword(
                                                          false
                                                      )
                                                    : setViewConfirmPassword(
                                                          true
                                                      )
                                            }
                                            src={passwordVisible}
                                            className='hover:cursor-pointer text-lg absolute top-12 right-6 rtl:right-[unset] rtl:left-6 z-10'
                                            alt='sitelogo'
                                        />
                                    )}
                                    <Input
                                        errors={passwordErrors}
                                        id='confirm_password'
                                        register={PasswordRegister}
                                        type={
                                            viewConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder={intl.formatMessage({
                                            id: "ReEnter_New_Password",
                                        })}
                                        style='bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 '
                                        required={true}
                                        label={
                                            <FormattedMessage id='ReEnter_New_Password' />
                                        }
                                    />
                                </div>
                            </div>
                            <div className='flex flex-row gap-2 p-3 pb-0 md:p-5 justify-center'>
                                <Button
                                    text={<FormattedMessage id='Cancel' />}
                                    type='button'
                                    onClick={() => setPasswordModal(false)}
                                    disable={passButtonLoader}
                                    className='w-48 px-2 md:px-5 py-3 text-sm font-bold text-center   text-secondaryOrange border-2 border-secondaryOrange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                ></Button>
                                <Button
                                    type='submit'
                                    loader={passButtonLoader}
                                    disable={passButtonLoader}
                                    text={<FormattedMessage id='Update' />}
                                    className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                ></Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
            <SavedAddress />
        </div>
    )
}

export default ManageProfile
