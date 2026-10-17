import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button/Button";
import Input from "components/input/Input";
import InputImage from "components/input/InputImage";

import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { adminManageProfileValidation } from "./schema/adminManageProfile.schema";
import {
  CreateManageProfile,
  getAdminProfileDetails,
} from "./services/manageProfile.service";
import { responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import {
  AdminProfileDataType,
  UpdateProfileInterface,
} from "./types/adminManageprofile.type";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { REACT_APP_IMAGE_PATH } from "config";
import { setAccountImg } from "reducers/account.reducer";

const AdminManageProfile = () => {
  const intl = useIntl();
  const [buttonLoader, setButtonLoader] = useState(false);
  const [adminProfileData, setAdminProfileData] =
    useState<AdminProfileDataType>();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileInterface | any>({
    resolver: yupResolver(adminManageProfileValidation),
    values: adminProfileData,
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateProfile: SubmitHandler<FieldValues> = async (values) => {
    setButtonLoader(true);
    const formData: FormData = new FormData();
    if (values?.image?.length === 0) {
      delete values.image;
      formData.append("image", "null");
    } else if (values.image && values.image[0]?.size !== undefined) {
      formData.append("image", values.image[0]);
    } else {
      formData.append("image", values.image as string);
    }
    formData.append("email", values?.email);
    formData.append("phone", values?.phone as string);
    formData.append("username", values?.username);

    const response = await CreateManageProfile(formData);
    if (response?.data?.responseType === responseType.Success) {
      dispatch(setAccountImg(response?.data?.data?.image));
      showToast(response?.data.message, toastType.Success, intl);
    }
    setButtonLoader(false);
  };

  const AdminData = async () => {
    try {
      const response = await getAdminProfileDetails();
      setAdminProfileData(response?.data.data);
    } catch (err) {
      return err;
    }
  };
  useEffect(() => {
    AdminData();
  }, []);
  return (
    <div className="w-full space-y-7">
      <div className="border border-black/10 rounded-xl p-5 md:p-7">
        <h2 className="text-base md:text-2xl font-semibold text-black">
          <FormattedMessage id="personal_details" />
        </h2>
        <form
          className="mt-7"
          onSubmit={handleSubmit(handleUpdateProfile)}
          encType="multipart/form-data"
        >
          <div className="flex flex-wrap -mx-3 gap-y-4 pb-5">
            <div className="relative w-full lg:w-1/2 xl:w-1/3 px-3">
              <Input
                label={<FormattedMessage id="Username" />}
                errors={errors}
                id="username"
                register={register}
                type="text"
                placeholder={intl.formatMessage({
                  id: "Username",
                })}
                required={true}
                // value={username}
                style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
              />
            </div>
            <div className="relative w-full lg:w-1/2 xl:w-1/3 px-3">
              <Input
                label={<FormattedMessage id="Email" />}
                errors={errors}
                id="email"
                register={register}
                type="email"
                placeholder={intl.formatMessage({
                  id: "Email",
                })}
                required={false}
                disabled={true}
                style="bg-slate-100 border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
              />
            </div>

            <div className="relative w-full lg:w-1/2 xl:w-1/3 px-3">
              <Input
                label={<FormattedMessage id="Phone" />}
                errors={errors}
                id="phone"
                register={register}
                type="text"
                placeholder={intl.formatMessage({
                  id: "Phone",
                })}
                style="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
              />
            </div>

            <div className="relative w-full lg:w-1/2 xl:w-1/3 px-3">
              <InputImage
                type="file"
                errors={errors}
                id="image"
                register={register}
                setValue={setValue}
                isMulitple={false}
                height={72}
                value={
                  adminProfileData?.image
                    ? `${REACT_APP_IMAGE_PATH}${adminProfileData?.image}`
                    : null
                }
                label={<FormattedMessage id="Photo" />}
                style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 pr-28 file-select"
              />
            </div>
          </div>
          <div className="py-5 !pb-0 border-black/10 border-t w-full text-start rtl:text-end">
            <Button
              loader={buttonLoader}
              text={<FormattedMessage id="UPDATE_DETAILS" />}
              type="submit"
              onClick={handleUpdateProfile}
              className="px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:bg-secondaryOrange hover:text-white focus:ring-0 focus:outline-0 uppercase"
            ></Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminManageProfile;
