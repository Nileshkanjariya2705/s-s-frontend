import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button/Button";
import Loading from "components/globalLoader/Loading";
import Input from "components/input/Input";
import InputImage from "components/input/InputImage";
import { PageNotFound } from "components/pageNotFound/PageNotFound";
import SectionHeader from "components/sectionHeader/SectionHeader";
import { REACT_APP_IMAGE_PATH } from "config";
import { responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import ProfileAddress from "pages/manageProfile/components/ProfileAddress";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { storeInfoDataSchema } from "./schema/store.schema";
import { getSingleStoreInfo, updateStoreInfo } from "./services/store.service";
import { AddressInfo, StoreDataType } from "./types/store.type";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "components/customSelect/CustomSelect";
import {
  DropdownOptionType,
  EntityStatusDropdown,
} from "constant/dropdown.constant";
import useLocale from "hooks/useLocale";

const EditStoreInfo = () => {
  const { storeId, mode } = useParams();
  const [editData, setEditData] = useState<StoreDataType>();
  const [addressData, setAddressData] = useState<AddressInfo[]>([]);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const intl = useIntl();
  const { language } = useLocale();
  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<StoreDataType>({
    resolver: yupResolver<StoreDataType>(storeInfoDataSchema),
    values: editData && editData,
  });

  const navigate = useNavigate();
  const companyStatusDropdownOption = EntityStatusDropdown(language);

  useEffect(() => {
    getEditData();
  }, []);

  const getEditData = async () => {
    try {
      setLoading(true);
      const editData = await getSingleStoreInfo({
        uuid: storeId as string,
      });
      setEditData(editData?.data?.data);
      setAddressData(editData?.data?.data.addresses);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onSubmit = async (values: StoreDataType) => {
    try {
      setButtonLoader(true);
      const formData = new FormData();
      if (values?.image?.length === 0) {
        delete values.image;
        formData.append("image", "null");
      }
      if (values?.phone?.length === 0) {
        delete values.phone;
        formData.append("phone", "null");
      }
      Object.entries(values).forEach((item) => {
        if (item[1]) {
          if (item[0] === "image") {
            formData.append(item[0], item[1][0] as string | Blob);
          } else if (item[0] === "addresses") {
            return;
          } else {
            formData.append(item[0], item[1] as string);
          }
        }
      });
      formData.append("account_user_uuid", storeId as string);
      const response = await updateStoreInfo(formData);
      if (response?.data.responseType === responseType.Success) {
        setButtonLoader(false);
        showToast(response?.data.message, toastType.Success, intl);
        navigate(`/admin/store`);
      } else {
        setButtonLoader(false);
        showToast(response?.data.message, toastType.Error, intl);
      }
    } catch (error) {
        return error
    }
  };

  return (
    <>
      {!loading ? (
        <>
          {editData ? (
            <div className="relative">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border border-black/10 rounded-xl p-5">
                  <div className="relative pb-3">
                    <div className="mb-7">
                      <SectionHeader
                        text={
                          mode === "edit" ? (
                            <FormattedMessage id="Edit_Store_Info" />
                          ) : (
                            <FormattedMessage id="Store_Info" />
                          )
                        }
                        textClass="text-black"
                      />
                    </div>
                    <div className="flex flex-wrap gap-y-4 -mx-2">
                      <div className="relative w-full md:w-1/2 xl:w-1/3 px-2 ">
                        <InputImage<StoreDataType>
                          errors={errors}
                          id={`image`}
                          register={register}
                          type="file"
                          setValue={setValue}
                          name={`image`}
                          isMulitple={false}
                          label={<FormattedMessage id="Image" />}
                          value={
                            editData && editData["image"]
                              ? `${REACT_APP_IMAGE_PATH}` +
                                `${editData["image"]}`
                              : null
                          }
                          disabled={mode === "view" ? true : false}
                          style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select"
                        />
                      </div>
                      <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                        <Input<StoreDataType>
                          id={`username`}
                          type="text"
                          label={<FormattedMessage id="Username" />}
                          register={register}
                          errors={errors}
                          readonly={mode === "view" ? true : false}
                          required={true}
                          placeholder={intl.formatMessage({
                            id: "Enter_Username",
                          })}
                        />
                      </div>
                      <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                        <Input<StoreDataType>
                          id={`email`}
                          type="text"
                          label={<FormattedMessage id="Email" />}
                          register={register}
                          errors={errors}
                          readonly={mode === "view" ? true : false}
                          required={true}
                          placeholder={intl.formatMessage({
                            id: "Enter_Email",
                          })}
                        />
                      </div>
                      <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                        <Input<StoreDataType>
                          id={`company_name`}
                          type="text"
                          label={<FormattedMessage id="Company_Name" />}
                          register={register}
                          errors={errors}
                          readonly={mode === "view" ? true : false}
                          required={true}
                          placeholder={intl.formatMessage({
                            id: "Enter_CompanyName",
                          })}
                        />
                      </div>
                      <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                        <Input<StoreDataType>
                          id={`phone`}
                          type="text"
                          label={<FormattedMessage id="Phone_Number" />}
                          register={register}
                          readonly={mode === "view" ? true : false}
                          errors={errors}
                          placeholder={intl.formatMessage({
                            id: "Enter_Phone",
                          })}
                        />
                      </div>
                      <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                        <Input<StoreDataType>
                          id={`cr_number`}
                          type="text"
                          label={<FormattedMessage id="CR_Number" />}
                          readonly={mode === "view" ? true : false}
                          register={register}
                          errors={errors}
                          required={true}
                          placeholder={intl.formatMessage({
                            id: "Enter_CR_Number",
                          })}
                        />
                      </div>
                      <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                        <Input
                          id={`tax_number`}
                          type="text"
                          label={<FormattedMessage id="Tax_Number" />}
                          readonly={mode === "view" ? true : false}
                          register={register}
                          errors={errors}
                          required={true}
                          placeholder={intl.formatMessage({
                            id: "Enter_Tax_Number",
                          })}
                        />
                      </div>
                      <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                        <Input<StoreDataType>
                          id={`iban_number`}
                          type="text"
                          label={<FormattedMessage id="IBAN_number" />}
                          readonly={mode === "view" ? true : false}
                          register={register}
                          errors={errors}
                          required={true}
                          placeholder={intl.formatMessage({
                            id: "Enter_IBAN_number",
                          })}
                        />
                      </div>
                      <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                        <CustomSelect
                          label={<FormattedMessage id="Is_Active" />}
                          options={
                            companyStatusDropdownOption as DropdownOptionType
                          }
                          control={control}
                          register={register}
                          name="is_active"
                          error={errors}
                          required={true}
                          isDisabled={mode === "view" ? true : false}
                        />
                      </div>
                      <div className="relative w-full flex flex-wrap px-2">
                        {addressData &&
                          Array.isArray(addressData) &&
                          addressData?.length > 0 &&
                          addressData?.map(
                            (address: AddressInfo, index: number) => {
                              return (
                                <>
                                  <ProfileAddress
                                    address_uuid={address.uuid as string}
                                    address={address.address}
                                    key={index}
                                    country={address.country}
                                    city={address.city}
                                    state={address.state}
                                    postal_code={address.postal_code}
                                    is_Default={address.is_default}
                                    phone={address.phone.toString()}
                                    isEditable={false}
                                  />
                                </>
                              );
                            }
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 py-5 md:py-8 pb-0 border-black/10 border-t">
                    <Button
                      text={
                        mode === "edit" ? (
                          <FormattedMessage id="Cancel" />
                        ) : (
                          <FormattedMessage id="Go_to_store_list" />
                        )
                      }
                      disable={buttonLoader}
                      type="button"
                      className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                      onClick={() => {
                        // reset();
                        navigate(`/admin/store`);
                      }}
                    ></Button>
                    {mode === "edit" && (
                      <Button
                        text={<FormattedMessage id="Update" />}
                        type="submit"
                        loader={buttonLoader}
                        disable={buttonLoader}
                        className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                      ></Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <PageNotFound />
          )}
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default EditStoreInfo;
