import { ApiParamsType } from "components/table/types";
import { perPage, responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import useUserData from "hooks/getUserData";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import {
  deleteNotification,
  getAllNotification,
  updateNotification,
} from "./services/notification.service";
import { notificationListType } from "./types/notification.type";
import {
  HandlePermissionWiseDisplayNotification,
  NotificationEntity,
  notificationLinks,
} from "utility/notificationLinks";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { FormattedMessage, useIntl } from "react-intl";
import Loading from "components/globalLoader/Loading";
import { NoData } from "components/noDataFound/NoDataFound";
import { Modal } from "components/model/Model";
import { Button } from "components/button/Button";
import Tooltip from "components/tooltip/tooltip";
import useLocale from "hooks/useLocale";

const Notification = () => {
  const { socket } = useSelector((state: RootState) => ({
    socket: state.socket.socket,
  }));

  const { uuid, entity_type, given_permissions } = useUserData();
  const { language } = useLocale()

 

  const [notificationList, setNotificationList] = useState<
    notificationListType[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
  });

  const checkNotifications = (e: any) => {
    if (e.target.checked) {
      setDeleteIds?.([...deleteIds, e.target.value]);
    } else {
      const data = deleteIds.filter((item: string) => {
        return item !== e.target.value;
      });
      setDeleteIds?.(data);
    }
  };

  const selectAll = async (e: any) => {
    if (e.target.checked) {
      setDeleteIds(
        notificationList.map((data) => {
          return data.uuid;
        })
      );
    } else {
      setDeleteIds([]);
    }
  };

  const getAllNotifications = async () => {
    try {
      setIsLoading(true);
      const resp = await getAllNotification(uuid, apiParams);

      if (resp?.data?.data) {
        if (entity_type === null) {
          setNotificationList(resp?.data?.data?.rows);
        } else {
          const result = HandlePermissionWiseDisplayNotification(
            resp.data.data.rows,
            given_permissions,
            entity_type
          );
          setNotificationList(result);
        }
        setIsLoading(false);
        setApiParams((params) => {
          return {
            ...params,
            count: resp?.data?.data?.count,
          };
        });
      }

      setTimeout(async () => {
        await updateNotification(uuid);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllNotifications();
  }, [apiParams.page]);

  const intl = useIntl();

  useEffect(() => {
    socket?.on("receive_notification", (data) => {
      setNotificationList((list: notificationListType[]) => [data, ...list]);
      showToast(data?.notification[`content_${language}`], "success", intl);
      setApiParams((params) => {
        return {
          ...params,
          count: params.count + 1,
        };
      });
    });
  }, [socket]);

  const handlePageClick = (event: { selected: number }) => {
    setApiParams((params) => {
      return {
        ...params,
        page: event.selected + 1,
      };
    });
  };

  const paginationCount = Math.ceil(apiParams.count / perPage);

  const deleteNotifications = async () => {
    try {
      if (deleteIds.length > 0) {
        setDeleteLoader(true);
        const response = await deleteNotification(deleteIds);
        if (response?.data.responseType === responseType.Success) {
          showToast(response?.data.message, toastType.Success, intl);
          getAllNotifications();
          setDeleteIds([]);
          setApiParams((params) => {
            return {
              ...params,
              page: 1,
            };
          });
        } else {
          showToast(response?.data.message, toastType.Error, intl);
        }
        setDeleteLoader(false);
      } else {
        setShowAlertModal(true);
      }
    } catch (error) {
      setShowAlertModal(false);
    }
  };

  return (
    <>
      {isLoading ? (
        // <div className="w-full xl:w-3/4 border border-black/10 rounded-14px p-20px md:p-30px relative">
        <Loading />
      ) : (
        <>
          <div className="w-full space-y-30px">
            <div className="border border-black/10 rounded-14px p-20px md:p-30px">
              <div className="flex justify-between">
                <h2 className="text-xl md:text-2xl font-semibold text-black">
                  <FormattedMessage id="Notification" />
                </h2>
                {notificationList.length > 0 && (
                  <Tooltip
                    tooltip={intl.formatMessage({
                      id: "See_All_Notification",
                    })}

                  >
                    <div className="flex justify-end">
                      <input
                        id={"selectAll"}
                        name={"selectAll"}
                        type="checkbox"
                        onClick={selectAll}
                        className="w-4 h-4 accent-primarycolor text-blue-600 bg-gray-100 border-gray-300  focus:ring-0"
                      />
                    </div>
                  </Tooltip>
                )}
              </div>
              <hr className="my-5" />
              {notificationList && notificationList.length > 0 ? (
                notificationList.map((data: notificationListType) => {
                  const { notification } = data;
                  const { link_to_entity } = notification;

                  const [relatedEntityType, redirect_id]: [
                    NotificationEntity,
                    string
                  ] = link_to_entity.split(":") as [NotificationEntity, string];    
                  console.log("🚀 ~ notificationList.map ~ [relatedEntityType, redirect_id]:", [relatedEntityType, redirect_id])
                  return (
                    <>
                      <div className="flex justify-between">
                        <Link
                          to={notificationLinks[relatedEntityType][
                            entity_type === null ? "ADMIN" : entity_type
                          ]({ id: redirect_id })}
                          className={
                            data.is_read
                              ? "p-2 rounded-lg"
                              : "bg-slate-200 p-3 mr-3 rounded-lg font-bold w-full"
                          }
                        >
                          <div className="space-y-1">
                            <p className="text-base font-medium">
                              {data.notification[`content_${language}`]}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {moment(data.created_at).format(
                                "MMMM DD, hh.mm A"
                              )}
                            </p>
                          </div>
                        </Link>

                        <div className="mt-2 flex justify-between">
                          <input
                            id={data.uuid}
                            name={data.uuid}
                            type="checkbox"
                            value={data.uuid}
                            onClick={checkNotifications}
                            checked={deleteIds.includes(data.uuid)}
                            className="w-4 h-4 accent-primarycolor text-blue-600 bg-gray-100 border-gray-300  focus:ring-0"
                          />
                        </div>
                      </div>
                      <hr className="my-5" />
                    </>
                  );
                })
              ) : (
                <NoData text={<FormattedMessage id="No_Data_Found" />} />
              )}

              {notificationList.length > 0 && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    className="relative px-4 py-2 border rounded-xl mt-5 group-del border-red-600 text-white bg-red-600 text-base hover:text-red-600 hover:bg-white"
                    loader={deleteLoader}
                    disable={deleteLoader}
                    onClick={() => deleteNotifications()}
                  >
                    <FormattedMessage id="Delete" />
                    <i className="icon-trash-alt text-base  "></i>
                  </Button>
                </div>
              )}

              <div className="flex justify-center">
                <ReactPaginate
                  breakLabel={<span className="text-black">...</span>}
                  nextLabel={
                    <div className="w-12 h-12 rounded-full border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange">
                      <i className="icon-right_arrow text-24px text-black group-hover/hs:text-white"></i>
                    </div>
                  }
                  onPageChange={handlePageClick}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  pageCount={paginationCount}
                  previousLabel={
                    <div className="w-12 h-12 rounded-full border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange">
                      <i className="icon-left_arrow text-24px  text-black group-hover/hs:text-white"></i>
                    </div>
                  }
                  renderOnZeroPageCount={null}
                  className="mb-5 inline-flex items-center justify-center mt-5 md:mt-10 rounded-full shadow-card py-2 px-3 bg-white mx-auto font-medium"
                  pageClassName="text-black px-2 "
                  previousClassName={`font-bold text-black pr-2 ${
                    apiParams.page === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                  nextClassName={`font-bold text-black pl-2 ${
                    apiParams.page === paginationCount
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                  forcePage={apiParams.page - 1}
                  activeLinkClassName={`font-bold text-18px text-primarycolor `}
                />
              </div>

              {notificationList.length > 0 && (
                <div className="w-full mt-7">
                  <p className="text-base leading-[21px] h-fit font-semibold text-black -mt-10 w-full text-right pr-3 flex gap-1 rtl:justify-start justify-end">
                    <span>
                      {<FormattedMessage id="Showing" />}
                      {(apiParams.page - 1) * perPage + 1}
                    </span>
                    <span>{<FormattedMessage id="to" />}</span>
                    <span>
                      {Math.min(
                        apiParams.page * perPage - 1 + 1,
                        apiParams.count
                      )}
                    </span>
                    <span>
                      {<FormattedMessage id="of" />} {apiParams.count}
                    </span>
                    <span> {<FormattedMessage id="entries" />}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {showAlertModal && (
            <>
              <Modal
                title={<FormattedMessage id="Alert" />}
                setShowModal={setShowAlertModal}
                showModal={showAlertModal}
                width="400px"
              >
                <div>
                  <p>
                    <FormattedMessage id="Delete_Notification_Alert" />
                  </p>
                  <div className="text-center">
                    <Button
                      type="button"
                      text={<FormattedMessage id="Close" />}
                      onClick={() => setShowAlertModal(false)}
                      className="px-6 py-2 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl mr-5 hover:bg-primarycolor hover:text-white focus:ring-0 focus:outline-0 uppercase mt-5"
                    />
                  </div>
                </div>
              </Modal>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Notification;
