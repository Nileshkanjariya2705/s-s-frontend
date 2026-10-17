import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "components/model/Model";
import { ModeType } from "pages/admin/cmsPages/cmsPagesView/types/cms.types";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Input from "components/input/Input";
import { Button } from "components/button/Button";
import useUserData from "hooks/getUserData";

import {
  createBranch,
  getAllStoreUser,
  getSingleBranch,
  updateBranch,
} from "../services/branch.service";
import { BranchInfoSchema } from "../schema/branches.schema";
import TextArea from "components/textArea/Textarea";
import {
  CityInfo,
  CountryInfo,
  StateInfo,
} from "pages/manageProfile/types/manageProfile.types";
import { City, Country, State } from "country-state-city";
import CustomSelect from "components/customSelect/CustomSelect";
import { BranchUser, SingleBranchDataInfo } from "../types/branches.type";
import { DropdownOptionType, statusDropdown } from "constant/dropdown.constant";
import Loading from "components/globalLoader/Loading";
import { responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import { FormattedMessage, useIntl } from "react-intl";
import useLocale from "hooks/useLocale";
interface AddEditStaffDetailsProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  branch_uuid?: string;
}

const AddEditBranchDetails: React.FC<AddEditStaffDetailsProps> = ({
  setShowAddModal,
  showAddModal,
  branch_uuid,
}) => {
  const intl = useIntl();
  const [varient, setVarient] = useState<ModeType>("Edit");
  const [singleBranchDetails, setSingleBranchDetails] =
    useState<SingleBranchDataInfo>();

  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [states, setStates] = useState<StateInfo[]>([]);
  const [cities, setCities] = useState<CityInfo[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [allUsers, setAllUsers] = useState<BranchUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<BranchUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const CountryToshowInDropdown = countries.map((country) => {
    return { value: country.name, label: country.name };
  });
  const StateToshowInDropdown = states.map((country) => {
    return { value: country.name, label: country.name };
  });
  const CityToshowInDropdown = cities.map((country) => {
    return { value: country.name, label: country.name };
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SingleBranchDataInfo>({
    values: singleBranchDetails ? singleBranchDetails : undefined,
    resolver: yupResolver(BranchInfoSchema),
  });
  const { uuid, user_entity_uuid, entity_type } = useUserData();
  const { language } = useLocale();
  const branchStatus = statusDropdown(language);

  const getEditableData = async (branch_uuid: string) => {
    try {
      setIsLoading(true);
      const response = await getSingleBranch({ branch_uuid });
      setSingleBranchDetails(response?.data?.data?.data?.branch);
      setSelectedUsers(response?.data?.data?.data?.users);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };
  const getDropdownContent = async () => {
    try {
      setIsLoading(true);
      const getAllUser = await getAllStoreUser({ user_entity_uuid });
      setAllUsers(getAllUser?.data?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };

  useEffect(() => {
    if (branch_uuid) {
      setVarient("Edit");
      getEditableData(branch_uuid);
    } else {
      setVarient("Create");
    }
    getDropdownContent();
  }, [branch_uuid]);

  useEffect(() => {
    const countryData = Country.getAllCountries();
    setCountries(countryData as CountryInfo[]);
    if (singleBranchDetails?.country && varient === "Edit") {
      const selectedCountry = countries.find(
        (country) => singleBranchDetails?.country === country.name
      );
      const stateData = State.getStatesOfCountry(selectedCountry?.isoCode);
      setStates(stateData as StateInfo[]);
      if (stateData.length) {
        const userSelectedState = stateData.find((state) => {
          return state.name === singleBranchDetails.state;
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
  }, [singleBranchDetails, varient]);

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

  const handleCreateEditBranch = async (values: FieldValues) => {
    try {
      setButtonLoader(true);
      let response;
      if (varient === "Edit" && branch_uuid) {
        response = await updateBranch({
          values,
          user_entity_uuid,
          entity_type,
          branch_uuid,
          branch_owner_uuid: uuid,
        });
      } else {
        response = await createBranch({
          values,
          user_entity_uuid,
          entity_type,
          branch_owner_uuid: uuid,
        });
      }
      if (response?.data.responseType === responseType.Success) {
        setButtonLoader(false);
        showToast(response?.data.message, toastType.Success, intl);
        setShowAddModal(false);
      } else {
        setButtonLoader(false);
        showToast(response?.data.message, toastType.Error, intl);
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <>
          {varient === "Edit" && allUsers.length > 0 && selectedUsers.length ? (
            <>
              <Modal
                showModal={showAddModal}
                title={
                  branch_uuid ? (
                    <FormattedMessage id="Edit_Branch" />
                  ) : (
                    <FormattedMessage id="Create_Branch" />
                  )
                }
                setShowModal={setShowAddModal}
              >
                <form
                  className="mt-12px"
                  onSubmit={handleSubmit(handleCreateEditBranch)}
                >
                  <div className="overflow-y-auto md:overflow-y-visible max-h-550px md:max-h-unset gap-y-3 flex flex-wrap -mx-3">
                    <div className="relative w-full md:w-1/2 space-y-4">
                      <div className="w-full relative px-3">
                        <Input
                          errors={errors}
                          id="name"
                          register={register}
                          type="text"
                          label={<FormattedMessage id="Branch_Name" />}
                          placeholder={intl.formatMessage({
                            id: "Enter_Branch",
                          })}
                          required={true}
                        />
                      </div>

                      <div className="w-full relative px-3">
                        <CustomSelect
                          label={<FormattedMessage id="Country" />}
                          register={register}
                          options={CountryToshowInDropdown}
                          name="country"
                          error={errors}
                          required={true}
                          control={control}
                          isSearchable={true}
                          selectedOption={singleBranchDetails?.country}
                          handleSelectChange={(e) => handleCountryChange(e)}
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 relative px-3">
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

                    <div className="w-full md:w-1/2 relative px-3">
                      <CustomSelect
                        label={<FormattedMessage id="State_Province" />}
                        register={register}
                        options={StateToshowInDropdown}
                        name="state"
                        error={errors}
                        required={true}
                        control={control}
                        isSearchable={true}
                        selectedOption={singleBranchDetails?.state}
                        handleSelectChange={(e) => handleStateChange(e)}
                      />
                    </div>
                    <div className="w-full md:w-1/2 relative px-3">
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
                    <div className="w-full md:w-1/2 relative px-3">
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
                    <div className="w-full md:w-1/2 relative px-3">
                      <CustomSelect
                        label={<FormattedMessage id="City" />}
                        register={register}
                        options={CityToshowInDropdown}
                        name="city"
                        error={errors}
                        required={true}
                        control={control}
                        isSearchable={true}
                        selectedOption={singleBranchDetails?.city}
                      />
                    </div>
                    <div className="w-full md:w-1/2 relative px-3">
                      <CustomSelect
                        control={control}
                        register={register}
                        options={branchStatus as DropdownOptionType}
                        name="status"
                        error={errors}
                        required={true}
                        label={<FormattedMessage id="Status" />}
                      />
                    </div>
                    <div className="w-full md:w-1/2 relative px-3">
                      <CustomSelect
                        control={control}
                        register={register}
                        error={errors}
                        name="users"
                        isMulti={true}
                        options={allUsers}
                        label={<FormattedMessage id="Assign_users" />}
                        selectedOption={
                          selectedUsers
                        }
                        required={false}
                        placeholder={intl.formatMessage({
                          id: "Assign_users",
                        })}
                      />
                    </div>
                    <div className="flex justify-center gap-4 mt-4 md:!mt-8 w-full px-3 ">
                      <Button
                        text={<FormattedMessage id="Cancel" />}
                        type="button"
                        onClick={() => {
                          setShowAddModal(false);
                        }}
                        disable={buttonLoader}
                        className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                      ></Button>
                      <Button
                        text={<FormattedMessage id="update" />}
                        type="submit"
                        onClick={handleCreateEditBranch}
                        loader={buttonLoader}
                        className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                      ></Button>
                    </div>
                  </div>
                </form>
              </Modal>
            </>
          ) : (
            allUsers &&
            varient === "Create" && (
              <>
                <Modal
                  showModal={showAddModal}
                  title={
                    branch_uuid ? (
                      <FormattedMessage id="Edit_Branch" />
                    ) : (
                      <FormattedMessage id="Create_Branch" />
                    )
                  }
                  setShowModal={setShowAddModal}
                >
                  <form
                    className="mt-12px"
                    onSubmit={handleSubmit(handleCreateEditBranch)}
                  >
                    <div className="overflow-y-auto md:overflow-y-visible max-h-550px md:max-h-unset gap-y-3 flex flex-wrap -mx-3">
                      <div className="relative w-full md:w-1/2 space-y-4">
                        <div className="relative w-full px-4">
                          <Input
                            errors={errors}
                            id="name"
                            register={register}
                            type="text"
                            label={<FormattedMessage id="Branch_Name" />}
                            placeholder={intl.formatMessage({
                              id: "Enter_Branch",
                            })}
                            required={true}
                          />
                        </div>
                        <div className=" w-full relative px-3">
                          <CustomSelect
                            label={<FormattedMessage id="Country" />}
                            register={register}
                            options={CountryToshowInDropdown}
                            name="country"
                            error={errors}
                            required={true}
                            control={control}
                            isSearchable={true}
                            handleSelectChange={(e) => handleCountryChange(e)}
                          />
                        </div>
                      </div>

                      <div className="w-full md:w-1/2 relative px-3">
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

                      <div className="w-full md:w-1/2 relative px-3">
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
                      <div className="w-full md:w-1/2 relative px-3">
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
                      <div className="w-full md:w-1/2 relative px-3">
                        <CustomSelect
                          label={<FormattedMessage id="State_Province" />}
                          register={register}
                          options={StateToshowInDropdown}
                          name="state"
                          error={errors}
                          required={true}
                          control={control}
                          isSearchable={true}
                          handleSelectChange={(e) => handleStateChange(e)}
                        />
                      </div>
                      <div className="w-full md:w-1/2 relative px-3">
                        <CustomSelect
                          label={<FormattedMessage id="City" />}
                          register={register}
                          options={CityToshowInDropdown}
                          name="city"
                          error={errors}
                          required={true}
                          control={control}
                          isSearchable={true}
                          selectedOption={singleBranchDetails?.city}
                        />
                      </div>
                      <div className="w-full md:w-1/2 relative px-3">
                        <CustomSelect
                          control={control}
                          register={register}
                          options={branchStatus as DropdownOptionType}
                          name="status"
                          error={errors}
                          required={true}
                          label={<FormattedMessage id="Status" />}
                        />
                      </div>
                      <div className="w-full md:w-1/2 relative px-3">
                        <CustomSelect<SingleBranchDataInfo>
                          control={control}
                          register={register}
                          error={errors}
                          name="users"
                          isMulti={true}
                          options={allUsers}
                          placeholder={intl.formatMessage({
                            id: "Assign_users",
                          })}
                          label={<FormattedMessage id="Assign_users" />}
                          required={false}
                        />
                      </div>

                      <div className="flex justify-center gap-4 mt-4 md:!mt-8 w-full px-3 ">
                        <Button
                          text={<FormattedMessage id="Cancel" />}
                          type="button"
                          onClick={() => {
                            setShowAddModal(false);
                          }}
                          disable={buttonLoader}
                          className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                        ></Button>
                        <Button
                          text={<FormattedMessage id="Save" />}
                          type="submit"
                          onClick={handleCreateEditBranch}
                          loader={buttonLoader}
                          className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                        ></Button>
                      </div>
                    </div>
                  </form>
                </Modal>
              </>
            )
          )}
        </>
      )}
    </>
  );
};

export default AddEditBranchDetails;
