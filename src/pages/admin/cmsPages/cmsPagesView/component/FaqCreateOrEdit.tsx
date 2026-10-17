import { Button } from "components/button/Button"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { showToast } from "helper/toast.helper"
import SectionHeader from "components/sectionHeader/SectionHeader"

import TextArea from "components/textArea/Textarea"
import { yupResolver } from "@hookform/resolvers/yup"
import { FaqDetailSchema } from "../schema/faq.schema"
import {
    addFaqQuestionAnswer,
    getFaqBlog,
    updateFaq,
} from "../services/cmsPageView.services"
import { FaqDetailUpdate } from "../types/cms.types"
import { responseType, toastType } from "constant/common.constant"
import { PageNotFound } from "components/pageNotFound/PageNotFound"
import Loading from "components/globalLoader/Loading"
import { FormattedMessage, useIntl } from "react-intl"

const FaqCreateOrEdit = () => {
    const intl = useIntl()

    const navigate = useNavigate()
    const params = useParams()
    const [updatedFaqId, setUpdatedFaqId] = useState<string>()
    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [singleFaq, setSingleFaq] = useState<FaqDetailUpdate>()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FaqDetailUpdate>({
        resolver: yupResolver(FaqDetailSchema),
        values: singleFaq ? singleFaq : undefined,
    })
    const getEditableData = async (faqId: string) => {
        try {
            const response = await getFaqBlog(faqId)
            setSingleFaq(response.data.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            return error
        }
    }
    useEffect(() => {
        if (params.faqId) {
            setUpdatedFaqId(params.faqId)
            getEditableData(params.faqId)
        }
    }, [params.faqId])
    const onSubmit = handleSubmit(async (values: FaqDetailUpdate) => {
        setButtonLoader(true)
        if (!updatedFaqId) {
            const response = await addFaqQuestionAnswer(values)
            if (response?.data.responseType === responseType.Success) {
                setButtonLoader(false)
                showToast(response?.data.message, toastType.Success, intl)
                navigate(`/admin/cms-pages/faq-list`)
            } else {
                setButtonLoader(false)
                showToast(response?.data.message, toastType.Error, intl)
            }
        } else {
            const response = await updateFaq(updatedFaqId, values)
            if (response?.data.responseType === responseType.Success) {
                setButtonLoader(false)
                showToast(response?.data.message, toastType.Success, intl)
                navigate(`/admin/cms-pages/faq-list`)
            } else {
                setButtonLoader(false)
                showToast(response?.data.message, toastType.Error, intl)
            }
        }
    })
    return (
        <>
            {updatedFaqId ? (
                <>
                    {!loading ? (
                        <>
                            {singleFaq ? (
                                <div className='relative w-full min-w-0 flex-auto p-8'>
                                    <SectionHeader
                                        text={
                                            updatedFaqId ? (
                                                <FormattedMessage id='Edit_Question' />
                                            ) : (
                                                <FormattedMessage id='Add_Question' />
                                            )
                                        }
                                        textClass='text-black'
                                    />
                                    <>
                                        <form onSubmit={onSubmit}>
                                            <div className='mt-10'>
                                                <div className='shadow-2xl w-full px-6 py-9 rounded-30px border-2 border-gray mt-5 md:mt-10'>
                                                    <p className='text-lg font-medium text-gray-900'>
                                                        {
                                                            <FormattedMessage id='English' />
                                                        }
                                                    </p>
                                                    <div className='flex mt-5'>
                                                        <div className='relative w-full md:w-1/2 px-2'>
                                                            <TextArea
                                                                id={`question_en`}
                                                                errors={errors}
                                                                label={
                                                                    <FormattedMessage id='Question' />
                                                                }
                                                                required={true}
                                                                name={`question_en`}
                                                                register={
                                                                    register
                                                                }
                                                                type='textarea'
                                                                parentClass='mb-30px last:mb-0 !min-h-250px'
                                                                fieldLimit={200}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_question",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                        <div className='relative w-full md:w-1/2 px-2'>
                                                            <TextArea
                                                                id={`answer_en`}
                                                                label={
                                                                    <FormattedMessage id='Answer' />
                                                                }
                                                                required={true}
                                                                errors={errors}
                                                                name={`answer_en`}
                                                                register={
                                                                    register
                                                                }
                                                                type='textarea'
                                                                parentClass='mb-30px last:mb-0 !min-h-250px'
                                                                fieldLimit={500}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_answer",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='shadow-2xl w-full px-6 py-9 rounded-30px border-2 border-gray mt-5 md:mt-10'>
                                                    <p className='text-lg font-medium text-gray-900'>
                                                        {
                                                            <FormattedMessage id='Urdu' />
                                                        }
                                                    </p>
                                                    <div className='flex mt-5'>
                                                        <div className='relative w-full md:w-1/2 px-2'>
                                                            <TextArea
                                                                id={`question_ur`}
                                                                errors={errors}
                                                                label={
                                                                    <FormattedMessage id='Question' />
                                                                }
                                                                required={true}
                                                                name={`question_ur`}
                                                                register={
                                                                    register
                                                                }
                                                                type='textarea'
                                                                parentClass='mb-30px last:mb-0 !min-h-250px'
                                                                fieldLimit={200}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_question",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                        <div className='relative w-full md:w-1/2 px-2'>
                                                            <TextArea
                                                                id={`answer_ur`}
                                                                label={
                                                                    <FormattedMessage id='Answer' />
                                                                }
                                                                required={true}
                                                                errors={errors}
                                                                name={`answer_ur`}
                                                                register={
                                                                    register
                                                                }
                                                                type='textarea'
                                                                parentClass='mb-30px last:mb-0 !min-h-250px'
                                                                fieldLimit={500}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_answer",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='shadow-2xl w-full px-6 py-9 rounded-30px border-2 border-gray mt-5 md:mt-10'>
                                                    <p className='text-lg font-medium text-gray-900'>
                                                        {
                                                            <FormattedMessage id='Arabic' />
                                                        }
                                                    </p>
                                                    <div className='flex mt-5'>
                                                        <div className='relative w-full md:w-1/2 px-2'>
                                                            <TextArea
                                                                id={`question_ar`}
                                                                errors={errors}
                                                                label={
                                                                    <FormattedMessage id='Question' />
                                                                }
                                                                required={true}
                                                                name={`question_ar`}
                                                                register={
                                                                    register
                                                                }
                                                                type='textarea'
                                                                parentClass='mb-30px last:mb-0 !min-h-250px'
                                                                fieldLimit={200}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_question",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                        <div className='relative w-full md:w-1/2 px-2'>
                                                            <TextArea
                                                                id={`answer_ar`}
                                                                label={
                                                                    <FormattedMessage id='Answer' />
                                                                }
                                                                required={true}
                                                                errors={errors}
                                                                name={`answer_ar`}
                                                                register={
                                                                    register
                                                                }
                                                                type='textarea'
                                                                parentClass='mb-30px last:mb-0 !min-h-250px'
                                                                fieldLimit={500}
                                                                placeholder={intl.formatMessage(
                                                                    {
                                                                        id: "Enter_answer",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='mt-5 xl:mt-8 xxl:mt-8 w-full flex gap-5'>
                                                    <Button
                                                        disable={buttonLoader}
                                                        text={
                                                            <FormattedMessage id='Cancel' />
                                                        }
                                                        type='button'
                                                        onClick={() => {
                                                            navigate(
                                                                "/admin/cms-pages/faq-list"
                                                            )
                                                        }}
                                                        className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                                    ></Button>
                                                    <Button
                                                        loader={buttonLoader}
                                                        text={
                                                            <FormattedMessage id='Update' />
                                                        }
                                                        type='submit'
                                                        onClick={onSubmit}
                                                        className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                                    ></Button>
                                                </div>
                                            </div>
                                        </form>
                                    </>
                                </div>
                            ) : (
                                <PageNotFound />
                            )}
                        </>
                    ) : (
                        <Loading />
                    )}
                </>
            ) : (
                <form onSubmit={onSubmit}>
                    <div className='mt-10'>
                        <div className='shadow-2xl w-full px-6 py-9 rounded-30px border-2 border-gray mt-5 md:mt-10'>
                            <p className='text-lg font-medium text-gray-900'>
                                {<FormattedMessage id='English' />}
                            </p>
                            <div className='flex mt-5'>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <TextArea
                                        id={`question_en`}
                                        errors={errors}
                                        label={
                                            <FormattedMessage id='Question' />
                                        }
                                        required={true}
                                        name={`question_en`}
                                        register={register}
                                        type='textarea'
                                        parentClass='mb-30px last:mb-0 !min-h-250px'
                                        fieldLimit={200}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_question",
                                        })}
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <TextArea
                                        id={`answer_en`}
                                        label={<FormattedMessage id='Answer' />}
                                        required={true}
                                        errors={errors}
                                        name={`answer_en`}
                                        register={register}
                                        type='textarea'
                                        parentClass='mb-30px last:mb-0 !min-h-250px'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_answer",
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='shadow-2xl w-full px-6 py-9 rounded-30px border-2 border-gray mt-5 md:mt-10'>
                            <p className='text-lg font-medium text-gray-900'>
                                {<FormattedMessage id='Urdu' />}
                            </p>
                            <div className='flex mt-5'>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <TextArea
                                        id={`question_ur`}
                                        errors={errors}
                                        label={
                                            <FormattedMessage id='Question' />
                                        }
                                        required={true}
                                        name={`question_ur`}
                                        register={register}
                                        type='textarea'
                                        parentClass='mb-30px last:mb-0 !min-h-250px'
                                        fieldLimit={200}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_question",
                                        })}
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <TextArea
                                        id={`answer_ur`}
                                        label={<FormattedMessage id='Answer' />}
                                        required={true}
                                        errors={errors}
                                        name={`answer_ur`}
                                        register={register}
                                        type='textarea'
                                        parentClass='mb-30px last:mb-0 !min-h-250px'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_answer",
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='shadow-2xl w-full px-6 py-9 rounded-30px border-2 border-gray mt-5 md:mt-10'>
                            <p className='text-lg font-medium text-gray-900'>
                                {<FormattedMessage id='Arabic' />}
                            </p>
                            <div className='flex mt-5'>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <TextArea
                                        id={`question_ar`}
                                        errors={errors}
                                        label={
                                            <FormattedMessage id='Question' />
                                        }
                                        required={true}
                                        name={`question_ar`}
                                        register={register}
                                        type='textarea'
                                        parentClass='mb-30px last:mb-0 !min-h-250px'
                                        fieldLimit={200}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_question",
                                        })}
                                    />
                                </div>
                                <div className='relative w-full md:w-1/2 px-2'>
                                    <TextArea
                                        id={`answer_ar`}
                                        label={<FormattedMessage id='Answer' />}
                                        required={true}
                                        errors={errors}
                                        name={`answer_ar`}
                                        register={register}
                                        type='textarea'
                                        parentClass='mb-30px last:mb-0 !min-h-250px'
                                        fieldLimit={500}
                                        placeholder={intl.formatMessage({
                                            id: "Enter_answer",
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 xl:mt-8 xxl:mt-8 w-full flex gap-5'>
                            <Button
                                disable={buttonLoader}
                                text={<FormattedMessage id='Cancel' />}
                                type='button'
                                onClick={() => {
                                    navigate("/admin/cms-pages/faq-list")
                                }}
                                className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                            ></Button>
                            <Button
                                loader={buttonLoader}
                                text={<FormattedMessage id='Save' />}
                                type='submit'
                                onClick={onSubmit}
                                className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                            ></Button>
                        </div>
                    </div>
                </form>
            )}
        </>
    )
}

export default FaqCreateOrEdit
