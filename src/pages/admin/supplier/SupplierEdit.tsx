import { Button } from "components/button/Button";
import SectionHeader from "components/sectionHeader/SectionHeader";
import { useForm } from "react-hook-form";
import InputImage from "components/input/InputImage";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { REACT_APP_IMAGE_PATH } from "config";
import { showToast } from "helper/toast.helper";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "components/input/Input";
import { responseType, toastType } from "constant/common.constant";
import { getSingleSupplier, supplierUpdate } from "./services/supplier.service";
import { supplierAddressType, supplierEditType } from "./types/supplier.type";
import { supplierEditSchema } from "./schema/supplierEdit.schema";
import Loading from "components/globalLoader/Loading";
import { PageNotFound } from "components/pageNotFound/PageNotFound";
import ProfileAddress from "pages/manageProfile/components/ProfileAddress";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "components/customSelect/CustomSelect";
import {
  DropdownOptionType,
  EntityStatusDropdown,
} from "constant/dropdown.constant";
import useLocale from "hooks/useLocale";

const SupplierEdit = () => {
  const [supplierData, setSupplierData] = useState<supplierEditType>();
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const intl = useIntl();
  const { language } = useLocale();
  const { supplierId, mode } = useParams();
  const [supplierAddress, setSupplierAddress] = useState<supplierAddressType[]>(
    []
  );
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<supplierEditType>({
    resolver: yupResolver<supplierEditType>(supplierEditSchema),
    values: supplierData ? supplierData : undefined,
  });
  const companyStatusDropdownOption = EntityStatusDropdown(language);

  useEffect(() => {
    if (supplierId) {
      getEditableData(supplierId);
    }
  }, [supplierId]);

  const getEditableData = async (supplierId: string) => {
    try {
      setLoading(true);
      const response = await getSingleSupplier(supplierId);
      setSupplierData(response?.data.data[0]);
      setSupplierAddress(response?.data.data[0].address);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const supplierSubmit = async (values: supplierEditType) => {
    setBtnLoader(true);
    try {
      const formData: FormData = new FormData();
      if (values?.profile_image?.length === 0) {
        delete values.profile_image;
        formData.append("profile_image", "null");
      }
      if (values?.phone?.length === 0) {
        delete values.phone;
        formData.append("phone", "null");
      }
      Object.entries(values).forEach((item: any) => {
        if (item[1]) {
          if (item[0] === "profile_image") {
            formData.append(item[0], item[1][0]);
          } else if (item[0] === "address") {
            return;
          } else {
            formData.append(item[0], item[1] as string);
          }
        }
      });
      formData.append("account_user_uuid", supplierId as string);
      const response = await supplierUpdate(formData);
      if (response?.data.responseType === responseType.Success) {
        setBtnLoader(false);
        showToast(response?.data.message, toastType.Success, intl);
        navigate(`/admin/supplier`);
      } else {
        setBtnLoader(false);
        showToast(response?.data.message, toastType.Error, intl);
      }
    } catch (error) {}
  };

  return (
    <>
      {!loading ? (
        <>
          {supplierData ? (
            <div className="relative">
              <form onSubmit={handleSubmit(supplierSubmit)}>
                <div className="border border-black/10 rounded-xl p-5">
                  <div className="relative">
                    <div className="mb-7">
                      <SectionHeader
                        text={
                          supplierId ? (
                            mode === "view" ? (
                              <FormattedMessage id="View_Supplier_Info" />
                            ) : (
                              <FormattedMessage id="Edit_Supplier_Info" />
                            )
                          ) : (
                            <FormattedMessage id="Add_Supplier_Info" />
                          )
                        }
                        textClass="text-black"
                      />
                    </div>
                    <div className="relative w-full mt-8 ">
                      <div className="flex flex-wrap gap-y-7 mb-8">
                        <div className="relative w-full md:w-1/2 xl:w-1/3 px-2  ">
                          <InputImage
                            errors={errors}
                            id="profile_image"
                            register={register}
                            type="file"
                            setValue={setValue}
                            name="profile_image"
                            isMulitple={false}
                            label={<FormattedMessage id="Profile_Image" />}
                            value={
                              supplierData && supplierData["profile_image"]
                                ? `${REACT_APP_IMAGE_PATH}${supplierData["profile_image"]}`
                                : null
                            }
                            disabled={mode === "view" ? true : false}
                            style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select"
                          />
                        </div>
                        <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                          <Input
                            id="username"
                            type="text"
                            label={<FormattedMessage id="Username" />}
                            register={register}
                            errors={errors}
                            required={true}
                            readonly={mode === "view" ? true : false}
                            placeholder={intl.formatMessage({
                              id: "Enter_Username",
                            })}
                          />
                        </div>
                        <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                          <Input
                            id="email"
                            type="text"
                            label={<FormattedMessage id="Email" />}
                            register={register}
                            errors={errors}
                            required={true}
                            readonly={mode === "view" ? true : false}
                            placeholder={intl.formatMessage({
                              id: "Enter_Email",
                            })}
                          />
                        </div>
                        <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                          <Input
                            id="company_name"
                            type="text"
                            label={<FormattedMessage id="Company_Name" />}
                            register={register}
                            errors={errors}
                            required={true}
                            readonly={mode === "view" ? true : false}
                            placeholder={intl.formatMessage({
                              id: "Enter_CompanyName",
                            })}
                          />
                        </div>
                        <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                          <Input
                            id="phone"
                            type="text"
                            label={<FormattedMessage id="Phone" />}
                            register={register}
                            errors={errors}
                            readonly={mode === "view" ? true : false}
                            placeholder={intl.formatMessage({
                              id: "Enter_Phone",
                            })}
                          />
                        </div>
                        <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                          <Input
                            id="cr_number"
                            type="text"
                            label={<FormattedMessage id="CR_Number" />}
                            register={register}
                            errors={errors}
                            required={true}
                            readonly={mode === "view" ? true : false}
                            placeholder={intl.formatMessage({
                              id: "Enter_CR_Number",
                            })}
                          />
                        </div>
                        <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                          <Input
                            id="tax_number"
                            type="text"
                            label={<FormattedMessage id="Tax_Number" />}
                            register={register}
                            errors={errors}
                            required={true}
                            readonly={mode === "view" ? true : false}
                            placeholder={intl.formatMessage({
                              id: "Enter_Tax_Number",
                            })}
                          />
                        </div>
                        <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                          <Input
                            id="iban_number"
                            type="text"
                            label={<FormattedMessage id="IBAN_number" />}
                            register={register}
                            errors={errors}
                            required={true}
                            readonly={mode === "view" ? true : false}
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
                        <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                          <Input
                            id="ord_commission"
                            type="text"
                            label={<FormattedMessage id="ord_commission" />}
                            register={register}
                            errors={errors}
                            required={true}
                            readonly={mode === "view" ? true : false}
                            placeholder={intl.formatMessage({
                              id: "Enter_Ord_Commission",
                            })}
                            fixDecimal={true}
                          />
                        </div>
                        <div className="relative w-full md:w-1/2 xl:w-1/3 px-2">
                          <Input
                            id="bank_commission"
                            type="text"
                            label={<FormattedMessage id="bank_commission" />}
                            register={register}
                            errors={errors}
                            required={true}
                            readonly={mode === "view" ? true : false}
                            placeholder={intl.formatMessage({
                              id: "Enter_Bank_Commission",
                            })}
                            fixDecimal={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {supplierAddress &&
                    Array.isArray(supplierAddress) &&
                    supplierAddress?.length > 0 &&
                    supplierAddress.map(
                      (address: supplierAddressType, index: number) => {
                        return (
                          <ProfileAddress
                            key={index}
                            address={address.address}
                            address_uuid={address.uuid}
                            country={address.country}
                            city={address.city}
                            state={address.state}
                            postal_code={address.postal_code}
                            is_Default={address.is_default}
                            phone={""}
                            isEditable={false}
                          ></ProfileAddress>
                        );
                      }
                    )}

                  {mode === "edit" ? (
                    <>
                      <div className="flex gap-4 py-5 md:py-8 !pb-0 border-black/10 border-t ">
                        <Button
                          text={<FormattedMessage id="Cancel" />}
                          disable={btnLoader}
                          type="button"
                          className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                          onClick={() => {
                            // reset();
                            navigate(`/admin/supplier`);
                          }}
                        ></Button>
                        <Button
                          text={<FormattedMessage id="Update" />}
                          type="submit"
                          loader={btnLoader}
                          className="w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                        ></Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-4 py-5 md:py-8 !pb-0 border-black/10 border-t ">
                        <Button
                          text={<FormattedMessage id="Go_to_supplier_list" />}
                          loader={btnLoader}
                          type="button"
                          className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                          onClick={() => {
                            // reset();
                            navigate(`/admin/supplier`);
                          }}
                        ></Button>
                      </div>
                    </>
                  )}
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

export default SupplierEdit;
