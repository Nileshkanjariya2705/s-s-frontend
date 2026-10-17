import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "components/button/Button"
import Loading from "components/globalLoader/Loading"
import InputImage from "components/input/InputImage"
import TextArea from "components/textArea/Textarea"
import { REACT_APP_IMAGE_PATH } from "config"
import { responseType, toastType } from "constant/common.constant"
import { showToast } from "helper/toast.helper"
import moment from "moment"
import { supportTicketReplyValidation } from "pages/supportTicket/schema/supportTicket.schema"
import {
    createSupportTicketReply,
    getSingleSuppTicketData,
} from "pages/supportTicket/services/supportTicket.services";
import {
    SingleSupportTicketType,
    SingleSuppTicketMsg,
    SupportTicketReplyFormType,
} from "pages/supportTicket/types/supportTicket";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "store";
import ProfilePic from "../../../../assets/images/profile.png";
import { closeSupportTicket } from "../services/supportTicket.services";
import { FormattedMessage, useIntl } from "react-intl";
import { PageNotFound } from "components/pageNotFound/PageNotFound";
import Tooltip from "components/tooltip/tooltip";

function SupportTicketView() {
    const navigate = useNavigate();
    const { ticketId } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [singleSuppTicketData, setSingleSuppTicketData] =
        useState<SingleSupportTicketType>();
    const [createButtonLoader, setCreateButtonLoader] = useState<boolean>(false);
    const [closeButtonLoader, setCloseButtonLoader] = useState<boolean>(false);
    const [showTicketDataLoader, setShowTicketDataLoader] =
        useState<boolean>(false);
    const [supportImage, setSupportImage] = useState<boolean>(true);

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
        setValue,
    } = useForm<SupportTicketReplyFormType>({
        resolver: yupResolver(supportTicketReplyValidation),
    });
    const { uuid, role } = useSelector((state: RootState) => ({
        uuid: state.account.uuid,
        role: state.account.role,
    }));
    const intl = useIntl();
    const onSubmit = async (values: SupportTicketReplyFormType) => {
        try {
            if (values?.text || values?.attachment?.[0]) {
                setCreateButtonLoader(true);
                setShowTicketDataLoader(true);
                const formData: FormData = new FormData();
                formData.append("attachment", values?.attachment?.[0] as string | Blob);
                formData.append("text", values?.text as string);
                formData.append("support_ticket_uuid", ticketId as string);
                formData.append("user_uuid", uuid);
                formData.append("entity_type", role);

                const response = await createSupportTicketReply(formData);
                if (response?.data.responseType === responseType.Success) {
                    showToast(response?.data.message, toastType.Success, intl);
                    reset();
                    setSupportImage(false);
                    getSingleTicketData();
                    setShowTicketDataLoader(false);
                } else {
                    showToast(response?.data.message, toastType.Error, intl);
                    setShowTicketDataLoader(false);
                }
                setCreateButtonLoader(false);
            }
        } catch (error) {
            setCreateButtonLoader(false);
        }
    };

    const getSingleTicketData = async () => {
        try {
            const resp = await getSingleSuppTicketData(ticketId as string, role);
            if (resp?.data?.data) {
                setSingleSuppTicketData(resp.data.data);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getSingleTicketData();
    }, [ticketId]);
    const handleTicketClose = async () => {
        setCloseButtonLoader(true);
        const response = await closeSupportTicket(ticketId as string);
        if (response?.data?.responseType === responseType.Success) {
            showToast(response?.data?.message, toastType.Success, intl);
            navigate("/admin/support-ticket");
        } else {
            showToast(response?.data?.message, toastType.Error, intl);
        }
        setCloseButtonLoader(false);
    };
    const download = (data: string) => {
        var element = document.createElement("a");
        var file = new Blob([data], { type: "image/*" });
        element.href = URL.createObjectURL(file);
        element.download = "image.jpg";
        element.click();
    };
    const refresh = () => {
        getSingleTicketData();
    };
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {showTicketDataLoader && (
                        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                    {singleSuppTicketData ? (
                        <div className="w-full border border-black/10 rounded-xl p-5 ">
                            <div className="flex items-center">
                                <div className="w-5/6 relative flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                                        <i
                                            className="icon-left_arrow text-24px text-primarycolor hover:cursor-pointer"
                                            onClick={() => navigate("/admin/support-ticket")}
                                        ></i>
                                    </div>
                                    <h2 className="font-semibold text-xl md:text-2xl">
                                        {<FormattedMessage id="Support_Ticket" />}
                                    </h2>
                                </div>
                                <div className="w-1/5 md:w-1/6 text-right rtl:text-left">
                                    <Tooltip
                                        tooltip={intl.formatMessage({
                                            id: "Tooltip_Refresh",
                                        })}
                                    >
                                        <i
                                            className="icon-refersh text-lg cursor-pointer"
                                            onClick={() => refresh()}
                                        ></i>
                                    </Tooltip>
                                </div>
                            </div>
                            <hr className="border-black/10 my-1 mt-5" />

                            <div>
                                <div className="flex justify-between text-center my-4">
                                    <div className="flex relative items-center gap-3">
                                        <h2 className="font-semibold text-l font-poppins text-primarycolor">
                                            # {singleSuppTicketData?.ticket_number}
                                        </h2>
                                        <span className="text-xs  text-darkgrey/30 font-medium">
                                            {
                                                singleSuppTicketData?.supportTicketMessages[
                                                    singleSuppTicketData?.supportTicketMessages?.length -
                                                    1
                                                ]?.user?.username
                                            }
                                        </span>
                                        <span className="text-xs text-darkgrey/30 font-medium">
                                            {moment(singleSuppTicketData?.created_at).format(
                                                "DD-MM-YYYY,HH:mm"
                                            )}
                                        </span>
                                    </div>
                                    <div className="">
                                        {singleSuppTicketData?.status &&
                                            singleSuppTicketData?.status === "CLOSED" ? (
                                            <div className="text-primaryRed bg-primaryRed/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center">
                                                CLOSED
                                            </div>
                                        ) : singleSuppTicketData?.status === "NEW" ? (
                                            <p className="text-secondaryBlue bg-secondaryBlue/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center ">
                                                NEW
                                            </p>
                                        ) : singleSuppTicketData?.status === "OPEN" ? (
                                            <p className="text-secondaryOrange bg-secondaryOrange/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center whitespace-nowrap ">
                                                {" "}
                                                OPEN
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <h3 className="text-lg text-black font-normal">
                                    {singleSuppTicketData?.subject}
                                </h3>
                                {singleSuppTicketData?.status === "CLOSED" ? (
                                    ""
                                ) : (
                                    <div>
                                        <div>
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div className="relative">
                                                    <TextArea
                                                        id="text"
                                                        type="text"
                                                        name="text"
                                                        register={register}
                                                        required={false}
                                                        errors={errors}
                                                        placeholder={intl.formatMessage({
                                                            id: "Type_your_reply",
                                                        })}
                                                    />
                                                </div>
                                                <div className="relative mt-5">
                                                    <InputImage
                                                        type="file"
                                                        errors={errors}
                                                        id="attachment"
                                                        register={register}
                                                        setValue={setValue}
                                                        isMulitple={false}
                                                        label={<FormattedMessage id="Upload_File" />}
                                                        supportImage={supportImage}
                                                        setSupportImage={setSupportImage}
                                                        style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-xs rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select"
                                                    />
                                                </div>
                                                <div className="mt-5 justify-end flex gap-3">
                                                   
                                                    <Button
                                                        text={<FormattedMessage id="Close_Ticket" />}
                                                        loader={closeButtonLoader}
                                                        disable={createButtonLoader}
                                                        type="button"
                                                        onClick={handleTicketClose}
                                                        className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold transition-all duration-200 hover:bg-primaryRed hover:text-white  border border-primaryRed rounded-xl text-primaryRed"
                                                            ></Button>
                                                            <Button
                                                                text={<FormattedMessage id="Send_Reply" />}
                                                                loader={createButtonLoader}
                                                                disable={closeButtonLoader}
                                                                type="submit"
                                                                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold transition-all duration-200 hover:bg-secondaryOrange hover:text-white  border border-secondaryOrange rounded-xl text-secondaryOrange"
                                                            ></Button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <hr className="border-black/10 mb-5 mt-8" />
                                <div
                                    className={`overflow-y-auto ${singleSuppTicketData?.status === "CLOSED"
                                            ? "max-h-[650px]"
                                            : "max-h-[450px]"
                                        }`}
                                >
                                    {singleSuppTicketData?.supportTicketMessages.map(
                                        (data: SingleSuppTicketMsg) => {
                                            return (
                                                <>
                                                    <div>
                                                        <div className="flex mt-5">
                                                            <div className="w-50px h-50px  rounded-full">
                                                                {data?.user?.image ? (
                                                                    <>
                                                                        <img
                                                                            src={`${REACT_APP_IMAGE_PATH}/${data.user.image}`}
                                                                            alt="image"
                                                                            className="rounded-full object-cover w-full h-full"
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <img src={ProfilePic} alt="" />
                                                                    </>
                                                                )}
                                                            </div>
                                                            <div className="ml-3 flex-1">
                                                                <h2 className="text-xs font-medium">
                                                                    {data?.user?.username}
                                                                </h2>
                                                                <p className="text-xs">
                                                                    {moment(data?.created_at).format(
                                                                        "DD-MM-YYYY,HH:mm"
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="my-8">
                                                            <p className="text-base text-black/60">
                                                                {data?.text}
                                                            </p>
                                                        </div>
                                                        {data?.attachment ? (
                                                            <div className="mt-5">
                                                                <a
                                                                    href={`${REACT_APP_IMAGE_PATH}/${data.attachment}`}
                                                                    download
                                                                    onClick={() =>
                                                                        download(
                                                                            `${REACT_APP_IMAGE_PATH}/${data.attachment}`
                                                                        )
                                                                    }
                                                                    className="bg-primarycolor/20 items-start p-2 border border-primarycolor/20 rounded-xl inline-flex md:items-center gap-2"
                                                                >
                                                                    <i className="icon-download text-base" />
                                                                    <span className="text-base">{data?.attachment}</span>
                                                                </a>
                                                            </div>
                                                        ) : null}
                                                        <hr className="border-black/10 my-1 mt-5" />
                                                    </div>
                                                </>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <PageNotFound />
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default SupportTicketView
