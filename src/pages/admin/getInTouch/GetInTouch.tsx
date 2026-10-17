import { DeleteModal } from "components/model/DeleteModal";
import { Modal } from "components/model/Model";
import { getInTouchColumns } from "components/table/columns/getInTouch.columns";
import { Table } from "components/table/Table";
import { ApiParamsType } from "components/table/types";
import { perPage } from "constant/common.constant";
import useDebounce from "hooks/useDebounce";
import { responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  deleteProduct,
  fetchSingleUserDetails,
  fetchUserDetails,
} from "./services/getInTouch.service";
import { UserContactDetailTypes } from "./types/getInTouch.types";

const GetInTouch = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [userData, setUserData] = useState<UserContactDetailTypes[]>([]);
  const [userSingleData, setUserSingleData] =
    useState<UserContactDetailTypes>();

  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    searchField: "firstname",
  });
  const columns = getInTouchColumns(
    ({ uuid }: { uuid: string }) => {
      onRowView(uuid);
    },
    ({ uuid }: { uuid: string }) => {
      setUserId(uuid);
      setShowDeleteModal(true);
    }
  );

  const intl = useIntl();

  const onDeleteClick = async () => {
    try {
      setDeleteLoader(true);
      const response = await deleteProduct(userId);
      if (response?.data.responseType === responseType.Success) {
        showToast(response?.data.message, toastType.Success, intl);
        getUserDetails();
        setApiParams((params) => {
          return {
            ...params,
            page: 1,
          };
        });
      } else {
        showToast(response?.data.message, toastType.Error, intl);
      }
      setShowDeleteModal(false);
      setDeleteLoader(false);
    } catch (error) {
      setDeleteLoader(false);
      return error;
    }
  };
  const onRowView = async (uuid: string) => {
    setUserId(uuid);
    setShowViewModal(true);
    const getSingleUserInfo = await fetchSingleUserDetails(uuid);
    if (getSingleUserInfo?.data?.data) {
      setUserSingleData(getSingleUserInfo?.data?.data);
    }
  };
  const getUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchUserDetails(apiParams);
      if (response) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: response?.data?.data?.count,
          };
        });
        setUserData(response?.data?.data?.rows);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const debouncedHtmlContent = useDebounce(
    apiParams?.searchText as string,
    500
  );

  useEffect(() => {
    getUserDetails();
  }, [apiParams.page, apiParams.sort, apiParams.isAsc, debouncedHtmlContent]);
  return (
    <>
      <div className="relative w-full min-w-0 flex-auto ">
        <Table
          header={<FormattedMessage id="Get_In_Touch" />}
          data={userData}
          columns={columns}
          apiParams={apiParams}
          setApiParams={setApiParams}
          pagination={true}
          search={true}
          loading={loading}
        />
        {showDeleteModal && userId && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            showModal={showDeleteModal}
            deleteId={userId}
            onDeleteClick={onDeleteClick}
            deleteLoader={deleteLoader}
          />
        )}
        {showViewModal && (
          <>
            <Modal
              title={<FormattedMessage id="Get_In_Touch_Details" />}
              setShowModal={setShowViewModal}
              showModal={showViewModal}
            >
              <>
                <div className="">
                  <div className="w-full bg-primarycolor/5 p-5 rounded-lg ">
                    <div className="space-y-5">
                      <div className="flex flex-wrap gap-y-4 -mx-3">
                        <div className="block space-y-1 w-full md:w-1/2 px-3">
                          <p className="text-lg font-medium text-black">
                            <FormattedMessage id="Firstname" />
                          </p>
                          <p className="text-base font-normal text-black/80">
                            {userSingleData?.firstname}
                          </p>
                        </div>
                        <div className="block space-y-1 w-full md:w-1/2 px-3">
                          <p className="text-lg font-medium text-black">
                            <FormattedMessage id="Lastname" />
                          </p>
                          <p className="text-base font-normal text-black/80">
                            {userSingleData?.lastname}
                          </p>
                        </div>
                        <div className="block space-y-1 w-full md:w-1/2 px-3">
                          <p className="text-lg font-medium text-black">
                            <FormattedMessage id="Email" />
                          </p>
                          <p className="text-base font-normal text-black/80">
                            {userSingleData?.email}
                          </p>
                        </div>
                        <div className="block space-y-1 w-full md:w-1/2 px-3">
                          <p className="text-lg font-medium text-black">
                            <FormattedMessage id="Phone" />
                          </p>
                          <p className="text-base font-normal text-black/80">
                            {userSingleData?.phone}
                          </p>
                        </div>
                        <div className=" block space-y-1 w-full  px-3">
                          <p className="text-lg font-medium text-black">
                            <FormattedMessage id="Message" />
                          </p>
                          <div className="max-h-72 overflow-y-auto">
                            <p className="text-base font-normal text-black/80 break-all">
                              {userSingleData?.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </Modal>
          </>
        )}
      </div>
    </>
  );
};

export default GetInTouch;
