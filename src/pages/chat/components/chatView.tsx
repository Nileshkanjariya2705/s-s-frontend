import { Button } from "components/button/Button";
import Input from "components/input/Input";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getSpecificChatData,
  sendChatMessage,
  updateLastSeen,
} from "../services/chat.services";
import { ChatMessageType } from "../types/chat.types";
import moment from "moment";
import { REACT_APP_IMAGE_PATH } from "config";
import ProfilePic from "../../../assets/images/profile.png";
import { Socket } from "socket.io-client";
import ChatInputImage from "components/input/ChatInputImage";
import Loading from "components/globalLoader/Loading";
import { useNavigate } from "react-router-dom";
import { responseType } from "constant/common.constant";
import useUserData from "hooks/getUserData";

const ChatView = ({
  socket,
  room,
  setIsSidebarOpen,
  isSidebarOpen,
}: {
  room: string;
  socket: Socket;
  setIsSidebarOpen?: any;
  isSidebarOpen?: boolean;
}) => {
  const toggleSidebar = () => {
    setIsSidebarOpen(isSidebarOpen ? false : true);
  };
  const [messageList, setMessageList] = useState<ChatMessageType[]>([]);
  const [imgData, setImgData] = useState(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);
  const [chatStatus, setChatStatus] = useState<"OPEN" | "CLOSED">("OPEN");
  const chatListRef = useRef<HTMLUListElement | null>(null);
  // const [buttonLoader, setButtonLoader] = useState<boolean>(false);

  const { uuid } = useUserData();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm({});

  useEffect(() => {
    socket.on("receive_message", (data: ChatMessageType) => {
      lastSeenUpdate();
      setMessageList((list: ChatMessageType[]) => [...list, data]);
    });
    return () => {
      socket.emit("leave_room", room);
    };
  }, [socket]);

  useEffect(() => {
    setMessageList([]);
    // lastSeenUpdate();
  }, [room]);

  useEffect(() => {
    socket.emit("join_room", room);
  }, []);

  const lastSeenUpdate = async () => {
    await updateLastSeen(room, uuid);
  };

  const navigate = useNavigate();

  const fetchInitialMessages = async () => {
    try {
      setloading(true);
      const response = await getSpecificChatData(room, uuid);
      if (response?.data?.responseType === responseType.Success) {
        setMessageList(response?.data?.data?.getMessage?.rows);
        setChatStatus(response?.data?.data?.status);
      } else {
        navigate("/chat");
      }
      setloading(false);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    fetchInitialMessages();
  }, [room]);

  const onSubmit = handleSubmit(async (values) => {
    if (values?.message || values?.attachment?.[0]) {
      try {
        // setButtonLoader(true);
        const formData = new FormData();
        formData.append("attachment", values?.attachment?.[0]);
        formData.append("message", values?.message);
        formData.append("user_uuid", uuid);
        formData.append("order_uuid", room);
        reset();
        socket.emit('send_message',formData)
        await sendChatMessage(formData);
        // if (chatData?.data?.responseType === "success") {
        //    setButtonLoader(false);
        // }
        setImgData(null);
      } catch (error) {
        return error;
      }
    }
  });

  const download = (data: string) => {
    var element = document.createElement("a");
    var file = new Blob([data], { type: "image/*" });
    element.href = URL.createObjectURL(file);
    element.download = "image.jpg";
    element.click();
  };

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef?.current.scrollIntoView(false);
    }
  }, [messageList]);

  return (
    <>
      {!loading ? (
        <>
          <div className="flex gap-4 px-5 py-4 md:py-5 md:px-8 border-black/10 border-b">
            <button
              type="button"
              className="block xl:hidden p-1.5 rounded-md border border-primarycolor/20"
              onClick={() => toggleSidebar()}
            >
              <svg
                className="w-4 h-4 fill-darkgrey"
                viewBox="0 0 57 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M57 4.93316C57 2.67033 55.1656 0.835938 52.9028 0.835938H4.09722C1.83439 0.835938 0 2.67033 0 4.93316C0 7.19599 1.83439 9.03038 4.09722 9.03038H52.9028C55.1656 9.03038 57 7.19599 57 4.93316ZM57 25.4175C57 23.1547 55.1656 21.3203 52.9028 21.3203H4.09722C1.83439 21.3203 0 23.1547 0 25.4175C0 27.6804 1.83439 29.5148 4.09722 29.5148H52.9028C55.1656 29.5148 57 27.6804 57 25.4175ZM25.1953 41.8047C27.4581 41.8047 29.2925 43.6391 29.2925 45.9019C29.2925 48.1647 27.4581 49.9991 25.1953 49.9991H4.09806C1.83523 49.9991 0.000839233 48.1647 0.000839233 45.9019C0.000839233 43.6391 1.83522 41.8047 4.09806 41.8047H25.1953Z"
                />
              </svg>
            </button>
            <h2 className="text-base md:text-lg font-medium text-black">
              Chat no - #{room.slice(0, 8)}
            </h2>
          </div>
          <div className="p-8 h-480px md:h-510px lg:h-792px overflow-y-auto">
            <ul className="space-y-5" ref={chatListRef}>
              {messageList &&
              Array.isArray(messageList) &&
              messageList.length > 0 ? (
                messageList?.map((content: ChatMessageType) => {
                  return (
                    <li
                      key={content.uuid}
                      className={`${
                        content.user_uuid === uuid
                          ? "flex justify-end even"
                          : "flex justify-start odd"
                      }`}
                    >
                      <div className="max-w-md">
                        <div className="flex items-end gap-3 chat-wrap">
                          <div className="w-auto">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                              {content?.user?.image ? (
                                <>
                                  <img
                                    src={`${REACT_APP_IMAGE_PATH}/${content.user.image}`}
                                    alt="image"
                                    className="rounded-full w-8 h-8"
                                  />
                                </>
                              ) : (
                                <div>
                                  <img
                                    src={ProfilePic}
                                    alt=""
                                    className="rounded-full w-8 h-8"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 w-5/6 overflow-hidden rounded-xl">
                            {content.message ? (
                              <div className=" bg-primarycolor/20 p-4 rounded-lg relative chat-ui flex-1">
                                <p className="text-sm font-medium text-black/70 break-all">
                                  {content.message}
                                </p>
                              </div>
                            ) : null}
                            {content.attachment ? (
                              <>
                                {content.attachment.includes("base64") ? (
                                  <>
                                    <div className="w-32 h-32 md:w-52 md:h-52 rounded-lg overflow-hidden">
                                      <img
                                        src={`${content.attachment}`}
                                        alt="image"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {content.attachment.split(".").pop() ===
                                      "png" ||
                                    content.attachment.split(".").pop() ===
                                      "jpg" ||
                                    content.attachment.split(".").pop() ===
                                      "jpeg" ||
                                    content.attachment.split(".").pop() ===
                                      "svg" ? (
                                      <div className="w-32 h-32 md:w-52 md:h-52 rounded-lg overflow-hidden">
                                        <img
                                          src={`${REACT_APP_IMAGE_PATH}/${content.attachment}`}
                                          alt="image"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ) : content.attachment.split(".").pop() ===
                                      "mp4" ? (
                                      <video width="400" controls>
                                        <source
                                          src={`${REACT_APP_IMAGE_PATH}/${content.attachment}`}
                                        />
                                      </video>
                                    ) : content.attachment.split(".").pop() ===
                                        "pdf" ||
                                      content.attachment.split(".").pop() ===
                                        "msword" ? (
                                      <>
                                        <div className="bg-primarycolor/20 p-4 rounded-lg">
                                          <p className="text-darkgrey text-base break-all">
                                            {content?.attachment}
                                          </p>
                                          <div className="relative mt-3">
                                            <svg
                                              width="24"
                                              height="24"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H14C14.41 1.25 14.75 1.59 14.75 2C14.75 2.41 14.41 2.75 14 2.75H9C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V10C21.25 9.59 21.59 9.25 22 9.25C22.41 9.25 22.75 9.59 22.75 10V15C22.75 20.43 20.43 22.75 15 22.75Z"
                                                fill="#292D32"
                                              />
                                              <path
                                                d="M22 10.7485H18C14.58 10.7485 13.25 9.41852 13.25 5.99852V1.99852C13.25 1.69852 13.43 1.41852 13.71 1.30852C13.99 1.18852 14.31 1.25852 14.53 1.46852L22.53 9.46852C22.74 9.67852 22.81 10.0085 22.69 10.2885C22.57 10.5685 22.3 10.7485 22 10.7485ZM14.75 3.80852V5.99852C14.75 8.57852 15.42 9.24852 18 9.24852H20.19L14.75 3.80852Z"
                                                fill="#292D32"
                                              />
                                              <path
                                                d="M13 13.75H7C6.59 13.75 6.25 13.41 6.25 13C6.25 12.59 6.59 12.25 7 12.25H13C13.41 12.25 13.75 12.59 13.75 13C13.75 13.41 13.41 13.75 13 13.75Z"
                                                fill="#292D32"
                                              />
                                              <path
                                                d="M11 17.75H7C6.59 17.75 6.25 17.41 6.25 17C6.25 16.59 6.59 16.25 7 16.25H11C11.41 16.25 11.75 16.59 11.75 17C11.75 17.41 11.41 17.75 11 17.75Z"
                                                fill="#292D32"
                                              />
                                            </svg>
                                          </div>
                                          <hr className="border-black/10 my-1 mt-3" />
                                          <div className="mt-3 text-center">
                                            <a
                                              className="bg-primarycolor inline-block px-4 py-2 rounded-lg text-white text-sm"
                                              href={`${REACT_APP_IMAGE_PATH}${content.attachment}`}
                                              download
                                              target="_blank"
                                              onClick={() =>
                                                download(
                                                  `${REACT_APP_IMAGE_PATH}${content.attachment}`
                                                )
                                              }
                                            >
                                              Download
                                            </a>
                                          </div>
                                        </div>
                                      </>
                                    ) : null}
                                  </>
                                )}
                              </>
                            ) : null}
                          </div>
                        </div>
                        <p className="text-sm px-4 py-1 text-black/40 font-medium">
                          {content.created_at
                            ? moment(content?.created_at)
                                ?.format("HH:mm")
                                .toString()
                            : content?.time?.toString()}
                        </p>
                      </div>
                    </li>
                  );
                })
              ) : (
                <>
                  {chatStatus === "OPEN"
                    ? "Start a new Conversation.."
                    : "No Chat History Found.."}
                </>
              )}
            </ul>
          </div>
          {chatStatus === "OPEN" && (
            <form onSubmit={onSubmit}>
              <div className="flex justify-between outline items-end outline-black/10 rounded-br-lg outline-offset-0 outline-1 bg-chatbgrey absolute bottom-0 left-0 w-full p-2 lg:p-3">
                <div className="w-4/6 xxl:w-4/5">
                  {showModal && (
                    <div className="relative">
                      <ChatInputImage
                        type="file"
                        height={32}
                        setValue={setValue}
                        errors={errors}
                        id="attachment"
                        register={register}
                        isMulitple={false}
                        label="Upload File"
                        hidden="hidden"
                        imgData={imgData}
                        setImgData={setImgData}
                        style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select leading-[22px]"
                      />
                    </div>
                  )}
                  <Input
                    id="message"
                    type="text"
                    register={register}
                    errors={errors}
                    style={
                      "w-full bg-chatbgrey h-full text-sm lg:text-base p-3 md:px-6 md:py-3 focus:outline-0"
                    }
                    placeholder="Type Your Message..."
                    isChatInput={true}
                  />
                </div>
                <div className="w-1/3 xxl:w-1/5">
                  <div className="flex items-center justify-end gap-2 px-1 lg:px-2 -mt-42px">
                    <div className="">
                      <label htmlFor="attachment">
                        <i
                          className="icon-attachment text-xl text-black group-hover/hs:text-white px-2 md:px-3 mt-9 cursor-pointer"
                          onClick={() => setShowModal(true)}
                        ></i>
                      </label>
                    </div>
                    <Button
                      className="bg-primarycolor  w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg global-loader overflow-hidden relative"
                      type="submit"
                    >
                      <i className="icon-send-message text-sm md:text-xl xxl:text-2xl text-white"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </>
      ) : (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
    </>
  );
};

export default ChatView;
