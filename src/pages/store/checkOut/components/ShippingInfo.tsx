import { Button } from "components/button/Button";
import { moveDefaultObjectToStart } from "helper/jsonParser.helper";
import useOwnerData from "hooks/getOwnerData";
import useUserData from "hooks/getUserData";
import AddEditAddressModel from "pages/manageProfile/components/AddEditAddressModel";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getOwnerShipDetils,
  setOwnershipDetails,
} from "reducers/ownership.reducer";
import { AddressType } from "types/generalTypes";
import { updateAddressQuantity } from "../services/checkout.services";
import { AddressResponse, SelectedProductProps } from "../types/checkout.types";
import Loading from "components/globalLoader/Loading";
import { FormattedMessage } from "react-intl";
import { RoleConstant } from "constant/common.constant";
import ChooseBranchModel from "./ChooseBranchModel";
import { getSingleAddress } from "pages/manageProfile/services/manageProfile.service";

const ShippingInfo: React.FC<SelectedProductProps> = ({
  setTab,
  setDisableTab,
  orderDetail,
}) => {
  const dispatch = useDispatch();
  const { mergeId } = useParams();
  const [addressId, setAddressId] = useState<string | undefined>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBranchModal, setBranchShowModal] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [selectAddress, setSelectedAddress] = useState<string | null>(
    orderDetail.address_uuid
  );
  const { address } = useOwnerData();
  const [loader, setLoader] = useState(false);
  const AddressList = moveDefaultObjectToStart(address);
  const [branchAddress, setBranchAddress] = useState<AddressResponse[]>([]);
  const [error, setError] = useState<string | null>("");
  const { role, entity_type } = useUserData();

  const handleAddAddress = () => {
    setShowModal(true);
  };
  const handleChooseBranch = () => {
    setBranchShowModal(true);
  };
  const handleContinuePayment = async () => {
    let getError = null;
    if (!selectAddress) {
      getError =
        AddressList &&
        Array.isArray(AddressList) &&
        AddressList.length > 0 &&
        AddressList.find((item) => item?.is_default === true)
          ? null
          : "Please select the address";
    }
    const [encodedId1, encodedId2] = mergeId?.split("|") as [string, string];
    const purchaseReqId = atob(encodedId1);
    const supplier_info_uuid = atob(encodedId2);
    if (getError === null) {
      setButtonLoader(true);
      const response = await updateAddressQuantity(
        purchaseReqId as string,
        addressId as string,
        supplier_info_uuid
      );
      if (response) {
        setButtonLoader(false);
        setDisableTab((params) => {
          return {
            ...params,
            paymentFlag: 1,
          };
        });
        setTab(2);
      }
    } else {
      setError(getError);
    }
  };
  const fetchAddress = async () => {
    try {
      setLoader(true);
      const AddressResponse = await getSingleAddress(selectAddress as string);
      setBranchAddress([AddressResponse?.data.data]);
      setAddressId(AddressResponse?.data?.data?.uuid);
      setLoader(false);
    } catch (error) {
      return error;
    }
  };

  const handleInitialApiCalls = async () => {
    try {
      setLoader(true);
      const data = await dispatch(getOwnerShipDetils() as any);
      dispatch(setOwnershipDetails({ ...data.payload }));
      setLoader(false);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    if (selectAddress !== null) {
      fetchAddress();
    }
  }, [selectAddress]);

  useEffect(() => {
    if (orderDetail.address_uuid === null) {
      handleInitialApiCalls();
    }
  }, [orderDetail.address_uuid]);

  const setDefaultAddress = async () => {
    const id = AddressList.find((obj: AddressType) => obj.is_default === true);
    setAddressId(id && id.address_uuid);
    setError(null);
  };

  useEffect(() => {
    if (address.length > 0 && orderDetail.address_uuid === null) {
      setDefaultAddress();
    }
  }, [address]);
  const handleSelectShippingAddress = (address_uuid: string) => {
    setAddressId(address_uuid);
    setError(null);
  };
  return (
    <>
      {loader ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <div className="mt-7">
            <div className=" w-full flex justify-between">
              {(role === RoleConstant.storeOwner ||
                role === RoleConstant.supplierOwner) &&
                branchAddress.length < 1 && (
                  <Button
                    onClick={handleAddAddress}
                    type="button"
                    className="flex items-center gap-x-2 text-primarycolor text-base font-medium"
                  >
                    <i className="icon-circle-plus text-primarycolor text-22px"></i>
                    <span>{<FormattedMessage id="Add_New_Address" />}</span>
                  </Button>
                )}
              {branchAddress.length < 1 && (
                <Button
                  onClick={handleChooseBranch}
                  type="button"
                  className="flex items-center gap-x-2 text-primarycolor text-base font-medium"
                >
                  <i className="icon-circle-plus text-primarycolor text-22px"></i>
                  <span>{<FormattedMessage id="Purchase_for_branch" />}</span>
                </Button>
              )}
            </div>

            {role !== RoleConstant.storeOwner &&
              role !== RoleConstant.supplierOwner &&
              AddressList.length === 0 && (
                <p className="text-center mt-24 text-primaryRed bg-primaryRed/20 font-medium  rounded-xl px-2 py-1.5 ">
                  Please Contact {entity_type.toLocaleLowerCase()} owner to Add
                  address{" "}
                </p>
              )}
            <div className="flex flex-wrap mt-5 -mx-3 gap-y-5">
              {branchAddress.length > 0
                ? branchAddress.map((address) => {
                    return (
                      <>
                        <div className="w-full md:w-1/2 px-3 ">
                          <div
                            className="border p-4 rounded-lg"
                            onClick={() =>
                              handleSelectShippingAddress(
                                address.uuid as string
                              )
                            }
                          >
                            <div className="flex flex-wrap" key={address.uuid}>
                              <div
                                className="flex w-full gap-3"
                                key={address.uuid}
                              >
                                <input
                                  type="radio"
                                  checked={address.uuid === addressId}
                                  className="w-4 h-4 mt-1 bg-gray-100 border-spacing-1 border-primarycolor/10 accent-primarycolor focus:ring-0"
                                />
                                <ul className="space-y-3 w-full md:w-11/12">
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="Address" />}{" "}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.address}
                                    </span>
                                  </li>
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="Postal_Code" />}{" "}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.postal_code}
                                    </span>
                                  </li>
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="City" />}{" "}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.city}
                                    </span>
                                  </li>
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="State" />}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.state}
                                    </span>
                                  </li>
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="Country" />}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.country}
                                    </span>
                                  </li>
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="Phone" />}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.phone}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })
                : AddressList.map((address: AddressType) => {
                    return (
                      <>
                        <div className="w-full md:w-1/2 px-3 ">
                          <div
                            className="border p-4 rounded-lg"
                            onClick={() =>
                              handleSelectShippingAddress(
                                address.address_uuid as string
                              )
                            }
                          >
                            <div
                              className="flex flex-wrap"
                              key={address.address_uuid}
                            >
                              <div
                                className="flex w-full gap-3"
                                key={address.address_uuid}
                              >
                                <input
                                  type="radio"
                                  checked={address.address_uuid === addressId}
                                  className="w-4 h-4 mt-1 bg-gray-100 border-spacing-1 border-primarycolor/10 accent-primarycolor focus:ring-0"
                                />
                                <ul className="space-y-3 w-full md:w-11/12">
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="Address" />}{" "}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.address}
                                    </span>
                                  </li>
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="Postal_Code" />}{" "}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.postal_code}
                                    </span>
                                  </li>
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="City" />}{" "}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.city}
                                    </span>
                                  </li>
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="State" />}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.state}
                                    </span>
                                  </li>
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="Country" />}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.Country}
                                    </span>
                                  </li>
                                  <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
                                    <span className="text-sm text-secodarycolor font-medium w-full lg:w-2/6  flex justify-between">
                                      {<FormattedMessage id="Phone" />}
                                      <span className="hidden lg:inline-block">
                                        :
                                      </span>
                                    </span>
                                    <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-2/3 lg:px-2 md:pr-5">
                                      {address.Phone}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              <>
                <small className="text-sm w-full font-semibold text-red-500 block  mt-1">
                  {error ? error : null}
                </small>
              </>
            </div>
          </div>

          <div className="mt-7  flex justify-between flex-wrap items-center space-y-4 rtl:space-y-0 md:space-y-0">
            <a
              className="text-primarycolor font-medium cursor-pointer"
              onClick={() => setTab(0)}
            >
              {<FormattedMessage id="Return_To_Shop" />}
            </a>
            {orderDetail.order_status === "PENDING" && (
              <Button
                type="button"
                onClick={handleContinuePayment}
                loader={buttonLoader}
                className="py-3 px-6  text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
              >
                <span>{<FormattedMessage id="Continue_To_Payment" />}</span>
              </Button>
            )}
          </div>

          {showModal && (
            <AddEditAddressModel
              showModal={showModal}
              setShowModal={setShowModal}
            />
          )}
          {showBranchModal && (
            <ChooseBranchModel
              showModal={showBranchModal}
              setShowModal={setBranchShowModal}
              selectAddress={selectAddress as string}
              setSelectedAddress={setSelectedAddress}
            />
          )}
        </>
      )}
    </>
  );
};

export default ShippingInfo;
