import { Button } from "components/button/Button";
import Input from "components/input/Input";
import { Modal } from "components/model/Model";
import { responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import useUserData from "hooks/getUserData";
import {
  editCardName,
  saveCard,
} from "pages/store/savedCard/services/savedCard.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
interface SaveCardModalProps {
  showCardModal: boolean;
  setShowCardModal: React.Dispatch<React.SetStateAction<boolean>>;
  customerId: string | undefined;
  card_id: string | undefined;
  edit_card: boolean;
  card_name?: string | null | undefined;
}

const SaveCard: React.FC<SaveCardModalProps> = ({
  showCardModal,
  setShowCardModal,
  customerId,
  card_id,
  edit_card,
  card_name,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    values: edit_card ? { card_name: card_name } : null,
  });

  const [buttonLoader, setButtonLoader] = useState<boolean>(false);

  const intl = useIntl();

  const { user_entity_uuid } = useUserData();

  const onSubmit = async (values: any) => {
    if (edit_card) {
      setButtonLoader(true);
      const finalValues = {
        ...values,
        store_info_uuid: user_entity_uuid,
        customer_id: customerId,
        card_id: card_id,
      };
      const response = await editCardName(finalValues);

      if (response?.data?.responseType === responseType.Success) {
        setButtonLoader(false);
        showToast(response?.data.message, toastType.Success, intl);
        setShowCardModal(false);
      } else {
        showToast(response?.data.message, toastType.Error, intl);
        setButtonLoader(false);
      }
      setButtonLoader(false);
    } else {
      setButtonLoader(true);
      const finalValues = {
        ...values,
        store_info_uuid: user_entity_uuid,
        customer_id: customerId,
        card_id: card_id,
      };
      const response = await saveCard(finalValues);

      if (response?.data?.responseType === responseType.Success) {
        setButtonLoader(false);
        showToast(response?.data.message, toastType.Success, intl);
        setShowCardModal(false);
        localStorage.setItem("save_card", "false");
      } else {
        showToast(response?.data.message, toastType.Error, intl);
        setButtonLoader(false);
      }
    }
  };

  return (
    <>
      {edit_card && (
        <Modal
          showModal={showCardModal}
          setShowModal={setShowCardModal}
          title="Edit Saved Card"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" mt-4">
              <Input
                required={true}
                errors={errors}
                register={register}
                type="text"
                id={`card_name`}
                label={<FormattedMessage id="Card_Name" />}
                placeholder={intl.formatMessage({
                  id: "Card_Name",
                })}
              />
            </div>
            <div className="flex justify-center gap-4 mt-4 md:!mt-8 w-full px-3 ">
              <Button
                text={<FormattedMessage id="Cancel" />}
                type="button"
                onClick={() => {
                  setShowCardModal(false);
                }}
                disable={buttonLoader}
                className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
              ></Button>
              <Button
                text={<FormattedMessage id="Edit" />}
                type="submit"
                loader={buttonLoader}
                className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
              ></Button>
            </div>
          </form>
        </Modal>
      )}
      {!edit_card && (
        <Modal
          showModal={showCardModal}
          setShowModal={setShowCardModal}
          title="Save Card"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" mt-4">
              <Input
                required={true}
                errors={errors}
                register={register}
                type="text"
                id={`card_name`}
                label={<FormattedMessage id="Card_Name" />}
                placeholder={intl.formatMessage({
                  id: "Card_Name",
                })}
              />
            </div>
            <div className="flex justify-center gap-4 mt-4 md:!mt-8 w-full px-3 ">
              <Button
                text={<FormattedMessage id="Cancel" />}
                type="button"
                onClick={() => {
                  setShowCardModal(false);
                }}
                disable={buttonLoader}
                className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
              ></Button>
              <Button
                text={<FormattedMessage id="Update" />}
                type="submit"
                loader={buttonLoader}
                className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
              ></Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default SaveCard;
