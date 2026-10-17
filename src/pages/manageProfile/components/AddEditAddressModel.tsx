import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getSingleAddress,
  handleCreateAddress,
  handleUpdateAddress,
} from "../services/manageProfile.service";
import { Country, State, City } from "country-state-city";
import {
  AddressInfo,
  CityInfo,
  CountryInfo,
  StateInfo,
} from "../types/manageProfile.types";
import { Modal } from "components/model/Model";
import TextArea from "components/textArea/Textarea";
import Input from "components/input/Input";
import { Button } from "components/button/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import addressSchema from "../schema/address.schema";
import { responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import {
  getOwnerShipDetils,
  setOwnershipDetails,
} from "reducers/ownership.reducer";
import { useDispatch } from "react-redux";
import useUserData from "hooks/getUserData";
import { FormattedMessage, useIntl } from "react-intl";
import { ModeType } from "pages/admin/cmsPages/cmsPagesView/types/cms.types";
import CustomSelect from "components/customSelect/CustomSelect";
interface AddAddressModelStats {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  address_uuid?: string;
  makeDefault?: boolean;
}

const AddEditAddressModel: React.FC<AddAddressModelStats> = ({
  showModal,
  setShowModal,
  address_uuid,
  makeDefault,
}) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const { user_entity_uuid, entity_type } = useUserData();

  const [varient, setVarient] = useState<ModeType>("Edit");
  const [singleAddress, setSingleAddress] = useState<AddressInfo>();
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [states, setStates] = useState<StateInfo[]>([]);
  const [cities, setCities] = useState<CityInfo[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AddressInfo>({
    values: singleAddress ? singleAddress : undefined,
    resolver: yupResolver(addressSchema),
  });
  const CountryToshowInDropdown = countries.map((country) => {
    return { value: country.name, label: country.name };
  });
  const StateToshowInDropdown = states.map((country) => {
    return { value: country.name, label: country.name };
  });
  const CityToshowInDropdown = cities.map((country) => {
    return { value: country.name, label: country.name };
  });
  const getEditableData = async (address_uuid: string) => {
    try {
      const response = await getSingleAddress(address_uuid);
      setSingleAddress(response?.data.data);
    } catch (error) {
      return error;
    }
  };
  const { uuid } = useUserData();
  useEffect(() => {
    if (address_uuid) {
      setVarient("Edit");
      getEditableData(address_uuid);
    } else {
      setVarient(
        intl.formatMessage({
          id: "Create",
        }) as ModeType
      );
    }
  }, [address_uuid]);

  useEffect(() => {
    const countryData = Country.getAllCountries();
    setCountries(countryData as CountryInfo[]);
    if (singleAddress?.country && varient === "Edit") {
      const selectedCountry = countries.find(
        (country) => singleAddress?.country === country.name
      );
      const stateData = State.getStatesOfCountry(selectedCountry?.isoCode);
      setStates(stateData as StateInfo[]);
      if (stateData.length) {
        const userSelectedState = stateData.find((state) => {
          return state.name === singleAddress.state;
        });
        const userSelectedStateName = userSelectedState?.isoCode;
        if (userSelectedStateName) {
          const cityData = City.getCitiesOfState(
            selectedCountry?.isoCode as string,
            userSelectedStateName
          );
          setCities(cityData as CityInfo[]);
        }
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [singleAddress, varient]);

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const countryCode = event.target.value;

    const selectedCountry = countries.find(
      (country) => countryCode === country.name
    );
    if (selectedCountry) {
      setSelectedCountry(selectedCountry?.isoCode);
      const stateData = State.getStatesOfCountry(selectedCountry?.isoCode);
      setStates(stateData as StateInfo[]);
      setCities([]);
    }
  };

  const handleStateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const stateCode = event.target.value;
    const selectedState = states.find((state) => {
      return stateCode === state.name;
    });

    if (selectedCountry && stateCode && selectedState) {
      const cityData = City.getCitiesOfState(
        selectedCountry,
        selectedState?.isoCode
      );
      setCities(cityData as CityInfo[]);
    }
  };

  const handleCloseModel = () => {
    setShowModal(false);
  };
  const handleRefreshedProfile = async () => {
    try {
      const data = await dispatch(getOwnerShipDetils() as any);
      dispatch(setOwnershipDetails({ ...data.payload }));
    } catch (error) {
      return error;
    }
  };
  const handleCreateEditAddress = async (values: AddressInfo) => {
    setButtonLoader(true);
    if (varient === "Edit") {
      const response = await handleUpdateAddress(values, {
        user_entity_uuid,
        entity_type,
      });
      if (response?.data.responseType === responseType.Failed) {
        showToast(response.data.message, toastType.Error, intl);
      } else {
        showToast(response?.data.message, "success", intl);
        handleRefreshedProfile();
        setShowModal(false);
      }
    } else {
      values["user_uuid"] = uuid;
      const response = await handleCreateAddress(values, {
        user_entity_uuid,
        entity_type,
      });
      if (response?.data.responseType === responseType.Failed) {
        showToast(response.data.message, toastType.Error, intl);
      } else {
        showToast(response?.data.message, "success", intl);
        handleRefreshedProfile();
        setShowModal(false);
      }
    }
    setButtonLoader(false);
  };
  return (
    <Modal
      showModal={showModal}
      title={`${intl.formatMessage({
        id: `${varient}`,
      })} ${intl.formatMessage({
        id: "Address",
      })}`}
      setShowModal={setShowModal}
    >
      {varient === "Edit" ? (
        <form className="mt-0" onSubmit={handleSubmit(handleCreateEditAddress)}>
          <div className="flex flex-wrap gap-y-4 max-h-572px md:max-h-unset overflow-y-auto -mx-3">
            <div className="relative w-full md:w-1/2 px-3">
              <TextArea
                id="address"
                name="address"
                errors={errors}
                register={register}
                placeholder={intl.formatMessage({
                  id: "Enter_Address",
                })}
                required={true}
                label={<FormattedMessage id="Address" />}
              />
            </div>
            <div className="relative w-full md:w-1/2  space-y-4">
              <div className="relative w-full px-3">
                <CustomSelect
                  label={<FormattedMessage id="Country" />}
                  register={register}
                  options={CountryToshowInDropdown}
                  name="country"
                  error={errors}
                  required={true}
                  placeholder={intl.formatMessage({
                    id: "Choose_Country",
                  })}
                  control={control}
                  isSearchable={true}
                  selectedOption={singleAddress?.country}
                  handleSelectChange={(e) => handleCountryChange(e)}
                />
              </div>
              <div className="w-full px-3">
                <CustomSelect
                  label={<FormattedMessage id="State" />}
                  register={register}
                  options={StateToshowInDropdown}
                  name="state"
                  error={errors}
                  required={true}
                  placeholder={intl.formatMessage({
                    id: "Choose_State",
                  })}
                  control={control}
                  isSearchable={true}
                  selectedOption={singleAddress?.state}
                  handleSelectChange={(e) => handleStateChange(e)}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 px-3">
              <CustomSelect
                label={<FormattedMessage id="City" />}
                register={register}
                options={CityToshowInDropdown}
                name="city"
                error={errors}
                required={true}
                placeholder={intl.formatMessage({
                  id: "Choose_City",
                })}
                control={control}
                isSearchable={true}
                selectedOption={singleAddress?.city}
              />
            </div>
            <div className="relative w-full md:w-1/2 px-3">
              <Input
                errors={errors}
                id="postal_code"
                register={register}
                type="text"
                label={<FormattedMessage id="Postal_Code" />}
                placeholder={intl.formatMessage({
                  id: "Enter_Postal_Code",
                })}
                required={true}
              />
            </div>
            <div className="relative w-full md:w-1/2 px-3">
              <Input
                errors={errors}
                id="phone"
                register={register}
                type="text"
                label={<FormattedMessage id="Phone" />}
                placeholder={intl.formatMessage({
                  id: "Enter_Phone_Number",
                })}
                required={true}
              />
            </div>
            <div className="flex justify-center gap-4 mt-4 md:!mt-8 w-full px-3">
              <Button
                text={<FormattedMessage id="Cancel" />}
                type="button"
                onClick={handleCloseModel}
                className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
              ></Button>
              <Button
                text={<FormattedMessage id="Update" />}
                type="submit"
                onClick={handleCreateEditAddress}
                className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
              ></Button>{" "}
            </div>
          </div>
        </form>
      ) : (
        <>
          <form
            className="mt-0"
            onSubmit={handleSubmit(handleCreateEditAddress)}
          >
            <div className="flex flex-wrap gap-y-4 max-h-572px md:max-h-unset overflow-y-auto -mx-3">
              <div className="relative w-full md:w-1/2 px-3">
                <TextArea
                  id="address"
                  name="address"
                  errors={errors}
                  register={register}
                  placeholder={intl.formatMessage({
                    id: "Enter_Address",
                  })}
                  required={true}
                  label={<FormattedMessage id="Address" />}
                />
              </div>
              <div className="relative w-full md:w-1/2  space-y-4">
                <div className="relative w-full  px-3">
                  <CustomSelect
                    label={<FormattedMessage id="Country" />}
                    register={register}
                    options={CountryToshowInDropdown}
                    name="country"
                    error={errors}
                    required={true}
                    placeholder={intl.formatMessage({
                      id: "Choose_Country",
                    })}
                    control={control}
                    isSearchable={true}
                    handleSelectChange={(e) => handleCountryChange(e)}
                  />
                </div>
                <div className="w-full  px-3">
                  <CustomSelect
                    label={<FormattedMessage id="State" />}
                    register={register}
                    options={StateToshowInDropdown}
                    name="state"
                    error={errors}
                    required={true}
                    placeholder={intl.formatMessage({
                      id: "Choose_State",
                    })}
                    control={control}
                    isSearchable={true}
                    handleSelectChange={(e) => handleStateChange(e)}
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2 px-3">
                <CustomSelect
                  label={<FormattedMessage id="City" />}
                  register={register}
                  options={CityToshowInDropdown}
                  name="city"
                  error={errors}
                  required={true}
                  placeholder={intl.formatMessage({
                    id: "Choose_City",
                  })}
                  control={control}
                  isSearchable={true}
                />
              </div>
              <div className="relative w-full md:w-1/2 px-3">
                <Input
                  errors={errors}
                  id="postal_code"
                  register={register}
                  type="text"
                  label={<FormattedMessage id="Postal_Code" />}
                  placeholder={intl.formatMessage({
                    id: "Enter_Postal_Code",
                  })}
                  required={true}
                />
              </div>
              <div className=" relative w-full md:w-1/2 px-3">
                <Input
                  errors={errors}
                  id="phone"
                  register={register}
                  type="text"
                  label={<FormattedMessage id="Phone" />}
                  placeholder={intl.formatMessage({
                    id: "Enter_Phone_Number",
                  })}
                  required={true}
                />
              </div>
              <div className="flex flex-row-reverse cs-checkout gap-3 items-center justify-end mt-0 md:mt-8 mx-3">
                <>
                  {makeDefault ? (
                    <Input
                      id="default"
                      type="checkbox"
                      label={<FormattedMessage id="Make_Address_Default" />}
                      register={register}
                      errors={errors}
                      required={false}
                      checked={true}
                    />
                  ) : (
                    <Input
                      id="default"
                      type="checkbox"
                      label={<FormattedMessage id="Make_Address_Default" />}
                      register={register}
                      errors={errors}
                      required={false}
                    />
                  )}
                </>
              </div>
              <div className="flex justify-center gap-4 mt-4 md:!mt-8 w-full px-3 ">
                <Button
                  text={<FormattedMessage id="Cancel" />}
                  type="button"
                  onClick={handleCloseModel}
                  disable={buttonLoader}
                  className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                ></Button>
                <Button
                  text={<FormattedMessage id="Save" />}
                  type="submit"
                  onClick={handleCreateEditAddress}
                  loader={buttonLoader}
                  className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                ></Button>
              </div>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};
export default AddEditAddressModel;
