import { yupResolver } from "@hookform/resolvers/yup"
import { Modal } from "components/model/Model"
import { ModeType } from "pages/admin/cmsPages/cmsPagesView/types/cms.types"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Role, StaffMemberInfo, UserRole } from "../types/staff.type"
import {
    createMemeberUser,
    getRoles,
    getSingleStaffMember,
    updateMemeberUser,
} from "../services/staff.service"
import { StaffMemberSchema } from "../schema/staffMemberAddEdit.schema"
import Input from "components/input/Input"
import { Button } from "components/button/Button"
import useUserData from "hooks/getUserData"
import { responseType, toastType } from "constant/common.constant"
import { showToast } from "helper/toast.helper"
import Loading from "components/globalLoader/Loading"
import { FormattedMessage, useIntl } from "react-intl"
import CustomSelect from "components/customSelect/CustomSelect"
import {
    DropdownOptionType,
    EntityStatusDropdown,
} from "constant/dropdown.constant"
import passwordHidden from "../../../assets/images/password-hidden.svg"
import passwordVisible from "../../../assets/images/password-vissibles.svg"
import useLocale from "hooks/useLocale"

interface AddEditStaffDetailsProps {
    showAddModal: boolean
    setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>
    user_uuid?: string
    getAllStaffMembers?: any
}

const AddEditStaffDetails: React.FC<AddEditStaffDetailsProps> = ({
    setShowAddModal,
    showAddModal,
    user_uuid,
    getAllStaffMembers,
}) => {
    const intl = useIntl()
    const { language } = useLocale();
    const [varient, setVarient] = useState<ModeType>("Edit")
    const [singleStaffMember, setSingleStaffMember] =
        useState<StaffMemberInfo>()
    const [roles, setRoles] = useState<Role[]>([])
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [viewPassword, setViewPassword] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<StaffMemberInfo>({
        values: singleStaffMember ? singleStaffMember : undefined,
        resolver: yupResolver(StaffMemberSchema),
    })
    const { user_entity_uuid, entity_type, role } = useUserData()
    const staffMemberStatusDropdown = EntityStatusDropdown(language)
    const getEditableData = async (address_uuid: string) => {
        try {
            setIsLoading(true)
            const response = await getSingleStaffMember(address_uuid)
            setSingleStaffMember(response?.data.data)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            return error
        }
    }
    const fetchRoles = async (user_entity_uuid: string, role: string) => {
        try {
            setIsLoading(true)
            const response = await getRoles(user_entity_uuid, role)
            if (
                Array.isArray(response?.data?.data.rows) &&
                response?.data?.data.rows.length > 0
            ) {
                const roleDropdownContent = response?.data?.data.rows.map(
                    (item: UserRole) => ({
                        label: item.role_id.name,
                        value: item.role_uuid,
                    })
                )
                setRoles(roleDropdownContent)
            } else {
                setRoles([])
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            return error
        }
    }
    useEffect(() => {
        if (user_uuid) {
            setVarient("Edit")
            fetchRoles(user_entity_uuid, role)
            getEditableData(user_uuid)
        } else {
            fetchRoles(user_entity_uuid, role)
            setVarient("Create")
        }
    }, [user_uuid])

    const handleCreateEditStaff = async (values: StaffMemberInfo) => {
        try {
            let response
            setButtonLoader(true)
            if (varient === "Edit") {
                response = await updateMemeberUser(
                    values,
                    user_entity_uuid,
                    entity_type
                )
            } else {
                response = await createMemeberUser(
                    values,
                    user_entity_uuid,
                    entity_type
                )
            }
            if (response?.data.responseType === responseType.Success) {
                setButtonLoader(false)
                setShowAddModal(false)
                getAllStaffMembers()
                showToast(response?.data.message, toastType.Success, intl)
            } else {
                setButtonLoader(false)
                showToast(response?.data.message, toastType.Error, intl)
            }
        } catch (error) {
            return error
        }
    }

    

    return (
        <>
            {isLoading ? (
                <Loading className='!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            ) : (
                <Modal
                    showModal={showAddModal}
                    title={
                        user_uuid ? (
                            <FormattedMessage id='Edit_Staff' />
                        ) : (
                            <FormattedMessage id='Create_Staff' />
                        )
                    }
                    setShowModal={setShowAddModal}
                >
                    {varient === "Edit" ? (
                        <>
                            <form
                                className='mt-12px'
                                onSubmit={handleSubmit(handleCreateEditStaff)}
                            >
                                <div className='flex flex-wrap -mx-3'>
                                    <div className='w-full md:w-1/2 relative px-3 mb-3'>
                                        <Input
                                            errors={errors}
                                            id='username'
                                            register={register}
                                            type='text'
                                            label={
                                                <FormattedMessage id='Username' />
                                            }
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Username",
                                            })}
                                            required={true}
                                        />
                                    </div>
                                    <div className='w-full md:w-1/2 relative px-3 mb-3'>
                                        <Input
                                            errors={errors}
                                            id='email'
                                            register={register}
                                            type='text'
                                            label={
                                                <FormattedMessage id='email' />
                                            }
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Email",
                                            })}
                                            required={true}
                                        />
                                    </div>
                                    <div className=' w-full md:w-1/2 relative px-3 mb-3'>
                                        <Input
                                            errors={errors}
                                            id='phone'
                                            register={register}
                                            type='text'
                                            label={
                                                <FormattedMessage id='Phone' />
                                            }
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Phone",
                                            })}
                                            required={true}
                                        />
                                    </div>

                                    <div className='w-full md:w-1/2  relative px-3 mb-3'>
                                        <Input
                                            errors={errors}
                                            id='password'
                                            register={register}
                                            type={
                                                viewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            label={
                                                <FormattedMessage id='Password' />
                                            }
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Password",
                                            })}
                                            required={true}
                                        />
                                        {viewPassword ? (
                                            <img
                                                onClick={() =>
                                                    viewPassword
                                                        ? setViewPassword(false)
                                                        : setViewPassword(true)
                                                }
                                                src={passwordHidden}
                                                className='hover:cursor-pointer text-lg absolute top-12 right-7 rtl:left-7 rtl:right-unset z-10'
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
                                                className='hover:cursor-pointer text-lg absolute top-12 right-7 rtl:left-7 rtl:right-unset z-10'
                                                alt='sitelogo'
                                            />
                                        )}
                                    </div>

                                    <div className=' w-full md:w-1/2 relative px-3 mb-3'>
                                        <CustomSelect
                                            label={
                                                <FormattedMessage id='Role' />
                                            }
                                            register={register}
                                            options={roles}
                                            name='role'
                                            error={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Choose_Role",
                                            })}
                                            selectedOption={
                                                singleStaffMember?.role_uuid as string
                                            }
                                            control={control}
                                            isSearchable={false}
                                        />
                                    </div>
                                    <div className='w-full md:w-1/2  relative px-3 mb-3'>
                                        <CustomSelect
                                            label={
                                                <FormattedMessage id='Status' />
                                            }
                                            register={register}
                                            name='is_active'
                                            error={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Choose_Status",
                                            })}
                                            control={control}
                                            isSearchable={true}
                                            options={
                                                staffMemberStatusDropdown as DropdownOptionType
                                            }
                                        />
                                    </div>
                                    <div className='flex justify-center gap-4 mt-4 md:!mt-8 w-full px-3 '>
                                        <Button
                                            text={
                                                <FormattedMessage id='Cancel' />
                                            }
                                            type='button'
                                            disable={buttonLoader}
                                            onClick={() => {
                                                setShowAddModal(false)
                                            }}
                                            className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                        ></Button>
                                        <Button
                                            text={
                                                <FormattedMessage id='Update' />
                                            }
                                            type='submit'
                                            loader={buttonLoader}
                                            onClick={handleCreateEditStaff}
                                            className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                        ></Button>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <form
                                className='mt-12px'
                                onSubmit={handleSubmit(handleCreateEditStaff)}
                            >
                                <div className='flex flex-wrap -mx-3'>
                                    <div className='w-full md:w-1/2 relative px-3 mb-3'>
                                        <Input
                                            errors={errors}
                                            id='username'
                                            register={register}
                                            type='text'
                                            label={
                                                <FormattedMessage id='Username' />
                                            }
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Username",
                                            })}
                                            required={true}
                                        />
                                    </div>

                                    <div className='w-full md:w-1/2 relative px-3 mb-3'>
                                        <Input
                                            errors={errors}
                                            id='email'
                                            register={register}
                                            type='text'
                                            label={
                                                <FormattedMessage id='email' />
                                            }
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Email",
                                            })}
                                            required={true}
                                        />
                                    </div>
                                    <div className='w-full md:w-1/2 relative px-3 mb-3'>
                                        <Input
                                            errors={errors}
                                            id='phone'
                                            register={register}
                                            type='text'
                                            label={
                                                <FormattedMessage id='Phone' />
                                            }
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Phone",
                                            })}
                                            required={true}
                                        />
                                    </div>

                                    <div className='w-full md:w-1/2 relative px-3 mb-3'>
                                        <Input
                                            errors={errors}
                                            id='password'
                                            register={register}
                                            type={
                                                viewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            label={
                                                <FormattedMessage id='Password' />
                                            }
                                            placeholder={intl.formatMessage({
                                                id: "Enter_Password",
                                            })}
                                            required={true}
                                        />

                                        {viewPassword ? (
                                            <img
                                                onClick={() =>
                                                    viewPassword
                                                        ? setViewPassword(false)
                                                        : setViewPassword(true)
                                                }
                                                src={passwordHidden}
                                                className='hover:cursor-pointer text-lg absolute top-12 right-7 rtl:left-7 rtl:right-unset z-10'
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
                                                className='hover:cursor-pointer text-lg absolute top-12 right-7 rtl:left-7 rtl:right-unset z-10'
                                                alt='sitelogo'
                                            />
                                        )}
                                    </div>
                                    <div className='w-full md:w-1/2  relative px-3 mb-3'>
                                        <>
                                            <CustomSelect
                                                label={
                                                    <FormattedMessage id='Role' />
                                                }
                                                register={register}
                                                options={roles}
                                                name='role'
                                                error={errors}
                                                required={true}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id: "Choose_Role",
                                                    }
                                                )}
                                                control={control}
                                                isSearchable={false}
                                            />
                                        </>
                                    </div>
                                    <div className='w-full md:w-1/2  relative px-3 mb-3'>
                                        <CustomSelect
                                            label={
                                                <FormattedMessage id='Status' />
                                            }
                                            register={register}
                                            name='is_active'
                                            error={errors}
                                            required={true}
                                            placeholder={intl.formatMessage({
                                                id: "Choose_Status",
                                            })}
                                            control={control}
                                            isSearchable={true}
                                            options={
                                                staffMemberStatusDropdown as DropdownOptionType
                                            }
                                        />
                                    </div>
                                    <div className='flex justify-center gap-4 mt-4 md:!mt-8 w-full px-3 '>
                                        <Button
                                            text={
                                                <FormattedMessage id='Cancel' />
                                            }
                                            type='button'
                                            onClick={() => {
                                                setShowAddModal(false)
                                            }}
                                            disable={buttonLoader}
                                            className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                        ></Button>
                                        <Button
                                            text={
                                                <FormattedMessage id='Save' />
                                            }
                                            type='submit'
                                            onClick={handleCreateEditStaff}
                                            loader={buttonLoader}
                                            className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                        ></Button>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </Modal>
            )}
        </>
    )
}

export default AddEditStaffDetails
