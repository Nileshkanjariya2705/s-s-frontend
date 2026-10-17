import { Modal } from "components/model/Model";
import { responseType } from "constant/common.constant";
import useUserData from "hooks/getUserData";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { getallBranches } from "../services/checkout.services";
import Loading from "components/globalLoader/Loading";
import CustomSelect from "components/customSelect/CustomSelect";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "components/button/Button";
import { BranchDropdown } from "../types/checkout.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChooseBranchSchema } from "../schema/chooseBranch.schema";

interface ChooseBrancModelStats {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  selectAddress:string
  setSelectedAddress: React.Dispatch<React.SetStateAction<string | null>>
}


const ChooseBranchModel: React.FC<ChooseBrancModelStats> = ({
  setShowModal,
  showModal,
  setSelectedAddress
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [branch, setBranch] = useState<BranchDropdown[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver:yupResolver(ChooseBranchSchema)
  });
  const intl = useIntl();
  const { user_entity_uuid, entity_type } = useUserData();
  const getAllBranches = async () => {
    try {
      setIsLoading(true);
      const response = await getallBranches({
        user_entity_uuid,
      });
      if (response?.data?.responseType === responseType.Success) {
        setBranch(response?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    getAllBranches();
  }, [user_entity_uuid]);

  const handleContinue: SubmitHandler<FieldValues> = (values) => {
    setButtonLoader(true);
    setSelectedAddress(values.branch)
    setButtonLoader(false)
    setShowModal(false)
  };

  return (
    <>
      {isLoading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <>
          <Modal
            showModal={showModal}
            title={`${intl.formatMessage({
              id: `Select_Branch_for_Shipping`,
            })}`}
            setShowModal={setShowModal}
          >
            {branch.length > 0 ? (
              <>
                <form
                  className="mt-12px"
                  onSubmit={handleSubmit(handleContinue)}
                >
                  <CustomSelect
                    label={<FormattedMessage id="Choose_Branch" />}
                    register={register}
                    options={branch}
                    name="branch"
                    error={errors}
                    required={true}
                    placeholder={intl.formatMessage({
                      id: "Choose_Branch",
                    })}
                    control={control}
                    isSearchable={false}
                  />
                  <div className="flex justify-center">
                    <Button
                      loader={buttonLoader}
                      text={<FormattedMessage id="Continue" />}
                      type="submit"
                      onClick={handleContinue}
                      className="mt-9 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:bg-secondaryOrange hover:text-white focus:ring-0 focus:outline-0 uppercase"
                    ></Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <b>
                  <p>No Branch Found for {entity_type.toLowerCase()} </p>
                </b>
              </>
            )}
          </Modal>
        </>
      )}
    </>
  );
};

export default ChooseBranchModel;
