import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { getChatOrderList } from "./services/chat.services";
import ChatView from "./components/chatView";
import {
  ChatOrderListType,
  UnReadMessageType,
  unReadMessageType,
} from "./types/chat.types";
import { useNavigate, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import Loading from "components/globalLoader/Loading";

const Chat = () => {
  const { chatId } = useParams();
  const { socket } = useSelector((state: RootState) => ({
    socket: state.socket.socket,
  }));
  const [unReadMessageCountObj, setUnReadMessageCountObj] =
    useState<unReadMessageType>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [chatOrderList, setChatOrderList] = useState<ChatOrderListType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [room, setRoom] = useState<null | string>(
    chatId !== undefined ? chatId : null
  );
  const { uuid } = useSelector((state: RootState) => ({
    uuid: state.account.uuid,
  }));
  const [chatUnreadMessage, setChatUnreadMessage] = useState<
    UnReadMessageType[]
  >([]);
  const intl = useIntl();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const getOrderList = async () => {
    try {
      const resp = await getChatOrderList(uuid, searchText);

      if (
        resp?.data?.data &&
        Array.isArray(resp?.data?.data) &&
        resp?.data?.data.length > 0
      ) {
        const chatOrderListData = resp.data.data.map(
          (item: ChatOrderListType) => ({
            uuid: item.uuid,
            status: item.chat !== null,
          })
        );
        setChatUnreadMessage(chatOrderListData);
        const sortedChats = [...resp.data.data].sort((a, b) => {
          const aMessageLength = a.chat?.message?.length || 0;
          const bMessageLength = b.chat?.message?.length || 0;

          return bMessageLength - aMessageLength;
        });
        setChatOrderList(sortedChats);
      } else {
        setChatOrderList([]);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderList();
  }, [searchText]);

  const handleChange = (e: { target: HTMLInputElement }) => {
    setSearchText(e.target.value);
  };

  const navigate = useNavigate();

  const JoinRoom = (order_uuid: string) => {
    if (room !== "") {
      const index = chatUnreadMessage.findIndex(
        (item: UnReadMessageType) => item.uuid === order_uuid
      );
      if (index !== -1) {
        const updatedChatOrderList: UnReadMessageType[] = [
          ...chatUnreadMessage,
        ];
        updatedChatOrderList[index].status = false;
        setChatUnreadMessage(updatedChatOrderList);
      }
      socket?.emit("leave_room", room);
      setRoom(order_uuid);
      socket?.emit("join_room", order_uuid);
      navigate(`/chat/${order_uuid}`);
      // toggleSidebar();
      setUnReadMessageCountObj((prev) => ({
        ...prev,
        [uuid]: {
          ...prev[order_uuid],
          [order_uuid]: 0,
        },
      }));
    }
  };
  useEffect(() => {
    socket?.on("unreadCount", (UnreadData: unReadMessageType) => {
      setUnReadMessageCountObj(UnreadData);
    });
  }, []);
  const toggleSidebar = () => {
    setIsSidebarOpen(isSidebarOpen ? false : true);
  };
  return (
    <>
      {loading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <>
          <div className=" flex outline outline-black/10 outline-offset-0 outline-1 rounded-xl  w-full overflow-hidden flex-auto relative">
            <div
              className={`absolute ${
                isSidebarOpen ? "-translate-x-0" : "-translate-x-full"
              } z-50 xl:sticky top-0 left-0 w-72 md:w-366px h-full bg-primaryGreens xl:!-translate-x-0 flex-auto shrink-0 transition-all ease-in-out duration-300 !pt-8 p-3 md:p-5`}
            >
              <div className="w-full">
                <input
                  name="search"
                  type="search"
                  className="block w-full py-2 px-3.5 text-sm text-gray-900 border border-gray-300 rounded-xl bg-white focus:customBorder focus:border-customBorder"
                  placeholder={intl.formatMessage({
                    id: "search",
                  })}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <button
                type="button"
                className="absolute top-2 right-2 block xl:hidden"
                onClick={() => toggleSidebar()}
              >
                <i className="icon-close font-medium text-xs text-black/75"></i>
              </button>
              <div>
                <hr className="border-black/10 my-4 md:mt-8 md:mb-1" />
                {chatOrderList.length === 0 ? (
                  <div className="mt-5 text-center">No result found</div>
                ) : (
                      <div className="h-480px md:h-620px lg:h-792px overflow-y-auto">
                    {Array.isArray(chatOrderList) &&
                      chatOrderList.length > 0 &&
                      unReadMessageCountObj !== undefined &&
                      chatOrderList.map((data: ChatOrderListType) => {
                        let countShown =
                          unReadMessageCountObj?.[uuid]?.[data.uuid];

                        return (
                          <>
                            <div className="flex" key={data.uuid}>
                              <div
                                className="w-full cursor-pointer"
                                onClick={() => JoinRoom(data.uuid)}
                                // onClick={() => toggleSidebar()}
                              >
                                <div
                                  className={`flex mt-2 md:mt-3 xl:mt-4 justify-between items-center p-2 rounded-lg ${
                                    data.uuid === chatId && "bg-white "
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 md:space-x-3 rtl:space-x-reverse">
                                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer  bg-PrimaryDark/20 ">
                                      <i className="icon-shopping-bage text-base md:text-xl text-primarycolor  "></i>
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="text-xs md:text-base font-medium">
                                        Order Id - {data?.uuid.slice(0, 8)}
                                      </h4>
                                      <div className="flex flex-wrap mt-2">
                                        <div>
                                          <p className="text-xs md:text-sm  ">
                                            {moment(data?.created_at).format(
                                              "DD/MM/YYYY"
                                            )}
                                          </p>
                                        </div>
                                        <div className="ml-2 -mt-1 md:mt-0 md:ml-3 rtl:mr-2">
                                          {/* {data.chat === null ? (
                                          ""
                                        ) : chatUnreadMessage.some(
                                            (item: UnReadMessageType) =>
                                              item.uuid === data.uuid &&
                                              item.status
                                          ) && data.chat.message.length > 0 ? (
                                        ) : null} */}

                                          {countShown > 0 && (
                                            <span className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-primarycolor/30 inline-flex items-center justify-center p-0.5">
                                              <p className="text-primarycolor font-semibold text-xs ">
                                                {countShown}
                                              </p>
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="">
                                    {data?.status &&
                                    (data?.status === "PENDING" ||
                                      data?.status === "DELIVERED") ? (
                                      <p className="text-primaryRed bg-primaryRed/20 cursor-pointer text-xs font-medium rounded-full px-2 py-1 md:px-3 md:py-1.5 inline-flex items-center justify-center">
                                        CLOSED
                                      </p>
                                    ) : (
                                      <p className="text-primarycolor bg-primarycolor/20 cursor-pointer text-xs font-medium rounded-full px-2 py-1 md:px-3 md:py-1.5 inline-flex items-center justify-center">
                                        ACTIVE
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <hr className="border-black/10 mt-3" />
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full min-w-0 flex-auto relative h-580px md:h-636px lg:h-918px ">
              {room &&
              chatId !== undefined &&
              socket &&
              chatOrderList.length > 0 ? (
                <ChatView
                  socket={socket}
                  room={room}
                  setIsSidebarOpen={setIsSidebarOpen}
                  isSidebarOpen={isSidebarOpen}
                />
              ) : (
                <div className="text-center mt-80">
                  <div className="x-5 py-4 md:py-5 md:px-8 border-black/10 border-b absolute top-0 left-0 w-full bg-white">
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
                  </div>
                  {<FormattedMessage id="chatMsg" />}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Chat;
