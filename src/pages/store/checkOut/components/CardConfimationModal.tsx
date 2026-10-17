import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button/Button";
import CustomSelect from "components/customSelect/CustomSelect";
import { Modal } from "components/model/Model";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { CardSchema } from "../schema/card.schema";
import { useEffect, useState } from "react";
import useUserData from "hooks/getUserData";
import { getCardDropDownValues } from "../services/checkout.services";
import Loading from "components/globalLoader/Loading";

interface SaveCardModalProps {
  cardConfimation: boolean;
  setCardConfimation: React.Dispatch<React.SetStateAction<boolean>>;
  handlePaymentMent: VoidFunction | any;
  buttonLoader: boolean;
  saveCardButtonLoader: boolean;
}

const CardConfimationModal: React.FC<SaveCardModalProps> = ({
  cardConfimation,
  setCardConfimation,
  handlePaymentMent,
  buttonLoader,
  saveCardButtonLoader,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CardSchema),
  });

  const { user_entity_uuid } = useUserData();

  const [dropdownLoader, setDropdownLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [saveCards, setSaveCards] = useState([]);
  // const [selectedTokenId, setSelectedTokenId] = useState<null | string>();

  const retriveCardInfo = async () => {
    const response = await getCardDropDownValues(user_entity_uuid);
    const cards =
      Array.isArray(response?.data.data) && response?.data.data.length > 0
        ? response?.data?.data.map(
            (card: { card_name: string; token_id: string }) => {
              return { value: card.card_name, label: card.card_name };
            }
          )
        : [];
    setSaveCards(cards);
    setLoading(false);
  };

  useEffect(() => {
    retriveCardInfo();
  }, [cardConfimation]);

  const onSubmit = async (value: any) => {
    setDropdownLoader(true);
    handlePaymentMent(value?.cards);
    setDropdownLoader(false);
  };

  return (
    <div>
      {" "}
      <Modal
        showModal={cardConfimation}
        title={<FormattedMessage id="Add_Card_Details" />}
        setShowModal={setCardConfimation}
        width="600px"
        height={true}
        // fullScreen={true}
      >
        {loading ? (
          <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        ) : (
          <div className="">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full">
                <CustomSelect
                  label={<FormattedMessage id="Select_Card" />}
                  control={control}
                  register={register}
                  name="cards"
                  error={errors}
                  required={true}
                  isDisabled={dropdownLoader}
                  placeholder="Select Card"
                  options={saveCards}
                />
              </div>
              <div className="mt-8 md:mt-10 flex md:space-x-3 rtl:space-x-reverse flex-wrap space-y-3 md:space-y-0 rtl:space-y-0 rtl:space-x-4 justify-center">
                <Button
                  type="submit"
                  loader={saveCardButtonLoader}
                  disable={saveCardButtonLoader}
                  className="w-full md:w-unset py-3 px-6 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                >
                  <span>
                    {<FormattedMessage id="Payment_with_saved_card" />}
                  </span>
                </Button>
                <Button
                  type="button"
                  loader={buttonLoader}
                  disable={buttonLoader || saveCardButtonLoader}
                  onClick={() => handlePaymentMent()}
                  className="w-full md:w-unset py-3 px-6 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                >
                  <span>{<FormattedMessage id="Go_with_new_card" />}</span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CardConfimationModal;
