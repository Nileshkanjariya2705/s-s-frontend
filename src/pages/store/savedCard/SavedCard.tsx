import { Table } from "components/table/Table";
import { ApiParamsType, ColumnProps } from "components/table/types";
import { perPage, responseType, toastType } from "constant/common.constant";
import useUserData from "hooks/getUserData";
import { StaffMember } from "pages/staff/types/staff.type";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { deleteCard, getCardListing } from "./services/savedCard.service";
import { CardsColumns } from "components/table/columns/cards.columns";
import useDebounce from "hooks/useDebounce";
import { CardIdentityType } from "./types/saveCard.types";
import { DeleteModal } from "components/model/DeleteModal";
import { showToast } from "helper/toast.helper";

const SavedCard = () => {
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    searchField: "card_name",
  });

  const [cardIdentity, setCardIdentity] = useState<CardIdentityType>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const { user_entity_uuid } = useUserData();

  const columns: ColumnProps[] = CardsColumns(
    ({ uuid, card_name }: { uuid: string; card_name: string }) => {
      setCardIdentity(() => {
        return {
          name: card_name,
          uuid: uuid,
        };
      });
      setShowDeleteModal(true);
    }
  );
  const [cardListingData, setCardListingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const debouncedHtmlContent = useDebounce(
    apiParams.searchText as string | number,
    500
  );
  const getAllCards = async () => {
    try {
      setLoading(true);

      const response = await getCardListing(user_entity_uuid, apiParams);
      if (
        response?.data?.data?.rows &&
        response?.data?.responseType === responseType.Success
      ) {
        setApiParams((params: ApiParamsType) => {
          return {
            ...params,
            count: response?.data.data.count,
          };
        });
      }
      setCardListingData(response?.data?.data?.rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCards();
  }, [apiParams.page, apiParams.sort, apiParams.isAsc, debouncedHtmlContent]);

  const intl = useIntl();

  const handleDeleteApi = async (id: string) => {
    setDeleteLoader(true);
    const response = await deleteCard(id, cardIdentity?.name as string);
    setShowDeleteModal(false);
    if (response?.data.responseType === responseType.Success) {
      showToast(response?.data.message, toastType.Success, intl);
      getAllCards();
    } else {
      showToast(response?.data.message, toastType.Error, intl);
    }
    setDeleteLoader(false);
  };

  return (
    <>
      <div className="w-full xl:w-3/4 space-y-30px relative">
        <Table<StaffMember>
          apiParams={apiParams}
          columns={columns}
          data={cardListingData}
          pagination={true}
          header={<FormattedMessage id="Cards" />}
          search={true}
          setApiParams={setApiParams}
          loading={loading}
        />

        {showDeleteModal ? (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            showModal={showDeleteModal}
            deleteId={cardIdentity?.uuid}
            onDeleteClick={handleDeleteApi}
            deleteLoader={deleteLoader}
          />
        ) : null}
      </div>
    </>
  );
};

export default SavedCard;
