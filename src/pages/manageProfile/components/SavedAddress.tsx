import { RoleConstant } from "constant/common.constant";
import { moveDefaultObjectToStart } from "helper/jsonParser.helper";
import useOwnerData from "hooks/getOwnerData";
import { FormattedMessage } from "react-intl";
import ProfileAddress from "./ProfileAddress";
import { AddressType } from "types/generalTypes";
import { Button } from "components/button/Button";
import useUserData from "hooks/getUserData";
import { useState } from "react";
import AddEditAddressModel from "./AddEditAddressModel";

const SavedAddress = () => {
  const { address } = useOwnerData();
  const { role } = useUserData();
  const AddressList = moveDefaultObjectToStart(address);
  const [showModal, setShowModal] = useState(false);
  const handleAddAddress = () => {
    setShowModal(true);
  };
  return (
    <>
      <div className="border flr border-black/10 rounded-14px p-20px md:p-30px">
        <h2 className="text-lg font-semibold text-black">
          {<FormattedMessage id="Saved_Address" />}
        </h2>
        {AddressList.length > 0 && (
          <div className="flex flex-wrap">
            <div className="flex w-full mt-4">
              <div className="w-full flex  flex-wrap gap-y-5 md:space-y-1 px-1 sm:px-0 md:-mx-3 ">
                {AddressList.map((address: AddressType, index: number) => {
                  return (
                    <>
                      <ProfileAddress
                        address_uuid={address.address_uuid as string}
                        address={address.address}
                        key={index}
                        country={address.Country}
                        city={address.city}
                        state={address.state}
                        postal_code={address.postal_code}
                        is_Default={address.is_default as boolean}
                        isEditable={true}
                        phone={address.Phone}
                      />
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {(role === RoleConstant.storeOwner ||
          role === RoleConstant.supplierOwner) && (
          <>
            <Button
              onClick={handleAddAddress}
              type="button"
              className="flex items-center gap-x-2 mt-8 text-primarycolor text-base font-medium"
            >
              <i className="icon-circle-plus text-primarycolor text-22px"></i>
              <span>{<FormattedMessage id="Add_New_Address" />}</span>
            </Button>
          </>
        )}
      </div>
      {showModal && (
        <AddEditAddressModel
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};
export default SavedAddress;
