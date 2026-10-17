import React, { useState } from "react";
import {
  deleteAddress,
  makeAddressDefault,
} from "../services/manageProfile.service";
import { useDispatch } from "react-redux";
import useUserData from "hooks/getUserData";
import {
  getOwnerShipDetils,
  setOwnershipDetails,
} from "reducers/ownership.reducer";
import { AppDispatch } from "store";
import { showToast } from "helper/toast.helper";
import AddEditAddressModel from "./AddEditAddressModel";
import { RoleConstant } from "constant/common.constant";
import { FormattedMessage, useIntl } from "react-intl";
import Loading from "components/globalLoader/Loading";
import { useOutsideClick } from "hooks/clickOutside";

interface ProfileAddress {
  address: string;
  address_uuid: string;
  country: string;
  city: string;
  state: string;
  postal_code: number;
  is_Default: boolean;
  phone: string;
  isEditable?: boolean;
}

const ProfileAddress: React.FC<ProfileAddress> = ({
  address,
  address_uuid,
  city,
  country,
  is_Default,
  postal_code,
  state,
  phone,
  isEditable,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showModal, setShowModal] = useState(false);
  const { token, role } = useUserData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const intl = useIntl()

  const ref = useOutsideClick(() => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  });
  const handleInitialApiCalls = async () => {
    try {
      setLoading(true);
      const data = await dispatch(getOwnerShipDetils() as any);
      dispatch(setOwnershipDetails({ ...data.payload }));
      setLoading(false);
    } catch (error) {
      return error;
    }
  };

  const handleSetDefault = async () => {
    if (token) {
      setLoading(true);
      const response = await makeAddressDefault({
        address_uuid: address_uuid,
      });
      if (response?.data.responseType === "success") {
        await handleInitialApiCalls();
        showToast(response.data.message, "success",intl);
        setIsDropdownOpen(false);
      } else {
        showToast(response?.data.message, "error",intl);
        setIsDropdownOpen(false);
      }
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (token) {
      const response = await deleteAddress(address_uuid);
      if (response?.data.responseType === "success") {
        await handleInitialApiCalls();
        showToast(response.data.message, "success",intl);
        setIsDropdownOpen(false);
      } else {
        showToast(response?.data.message, "error",intl);
        setIsDropdownOpen(false);
      }
    }
  };
  const handleEditAddressModel = async () => {
    if (token) {
      setShowModal(true);
      setIsDropdownOpen(false);
    }
  };
  return (
    <>
      <>
        {loading && (
          <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}

        <div className="w-full md:w-1/2 px-3 relative flex gap-2 items-start border-black/10 pt-1 pb-5 border-b md:border-b-0 rtl:md:odd:border-l md:odd:border-r md:even:border-r-0">
          {is_Default === true ? (
            <span className="mt-0.5">
              <span className="flex w-3 h-3 bg-primarycolor rounded-full mt-0.5  flex-shrink-0"></span>
            </span>
          ) : (
            <div className="w-4 h-4 mt-1 border-spacing-1 border-primarycolor/10 accent-primarycolor focus:ring-0"></div>
          )}
          <ul className="space-y-4 px-3 w-full md:w-11/12">
            <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
              <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/4 flex justify-between ">
                {<FormattedMessage id="Address" />}{" "}
                <span className="hidden lg:inline-block">:</span>
              </span>
              <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-3/4 lg:px-2 md:pr-5">
                {address}
              </span>
            </li>
            <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
              <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/4 flex justify-between">
                {<FormattedMessage id="Postal_Code" />}{" "}
                <span className="hidden lg:inline-block">:</span>
              </span>
              <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-3/4 lg:px-2 md:pr-5">
                {postal_code}
              </span>
            </li>
            <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
              <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/4 flex justify-between">
                {<FormattedMessage id="City" />}{" "}
                <span className="hidden lg:inline-block">:</span>
              </span>
              <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-3/4 lg:px-2 md:pr-5">
                {city}
              </span>
            </li>
            <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
              <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/4 flex justify-between">
                {<FormattedMessage id="State" />}{" "}
                <span className="hidden lg:inline-block">:</span>
              </span>
              <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-3/4 lg:px-2 md:pr-5">
                {state}
              </span>
            </li>
            <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
              <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/4 flex justify-between">
                {<FormattedMessage id="Country" />}{" "}
                <span className="hidden lg:inline-block">:</span>
              </span>
              <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-3/4 lg:px-2 md:pr-5">
                {country}
              </span>
            </li>
            <li className="w-full flex flex-wrap space-y-2 lg:space-y-0">
              <span className="text-sm text-secodarycolor font-medium w-full lg:w-1/4 flex justify-between">
                {<FormattedMessage id="Phone" />}{" "}
                <span className="hidden lg:inline-block">:</span>
              </span>
              <span className="text-sm text-secodarycolor/60 font-normal w-full lg:w-3/4 lg:px-2 md:pr-5">
                {phone}
              </span>
            </li>
          </ul>
          <div
            className="absolute top-0 -right-2 rtl:left-0 rtl:right-unset md:right-0 inline-block  rtl:text-right"
            ref={ref}
          >
            {(role === RoleConstant.storeOwner ||
              role === RoleConstant.supplierOwner) &&
              isEditable && (
                <button
                  id="dropdownMenuIconButton"
                  data-dropdown-toggle="dropdownDots"
                  className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none  focus:ring-gray-50 "
                  type="button"
                  onClick={toggleDropdown}
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 4 15"
                  >
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  </svg>
                </button>
              )}

            {(role === RoleConstant.storeOwner ||
              role === RoleConstant.supplierOwner) &&
              isDropdownOpen &&
              isEditable && (
                <div
                  id="dropdownDots"
                  className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-xl right-3 w-44 rtl:left-3 rtl:right-unset "
                >
                  <ul
                    className="py-2 text-sm text-gray-700 "
                    aria-labelledby="dropdownMenuIconButton"
                  >
                    <li onClick={handleSetDefault} className="cursor-pointer">
                      <p className="block px-4 py-2 hover:bg-gray-100  ">
                        {<FormattedMessage id="Set_as_Default" />}
                      </p>
                    </li>
                    <li
                      onClick={handleEditAddressModel}
                      className="cursor-pointer"
                    >
                      <p className="block px-4 py-2 hover:bg-gray-100 ">
                        {<FormattedMessage id="Edit_Address" />}
                      </p>
                    </li>
                    <li onClick={handleDelete} className="cursor-pointer">
                      <p className="block px-4 py-2 hover:bg-gray-100 hover:text-red-700  ">
                        {<FormattedMessage id="Delete" />}
                      </p>
                    </li>
                  </ul>
                </div>
              )}
          </div>
        </div>
      </>

      {showModal && (
        <>
          <AddEditAddressModel
            setShowModal={setShowModal}
            showModal={showModal}
            address_uuid={address_uuid}
          />
        </>
      )}
    </>
  );
};

export default ProfileAddress;
