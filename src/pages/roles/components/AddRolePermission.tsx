import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button/Button";
import Input from "components/input/Input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import useUserData from "hooks/getUserData";
import {
  createRolePermission,
  getPermission,
  getSingleRolePermission,
  updateRolePermission,
} from "../services/staffRoles.service";
import {
  EditPermissions,
  FormData,
  Permission,
  PermissionsData,
} from "../types/staffRoles.types";
import { responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import { DropdownOptionType, statusDropdown } from "constant/dropdown.constant";
import { rolePermissionSchema } from "../schema/rolePermission.schema";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "components/customSelect/CustomSelect";
import Loading from "components/globalLoader/Loading";
import useLocale from "hooks/useLocale";

const AddRolePermission = () => {
  const intl = useIntl();
  const { roleId } = useParams();
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(rolePermissionSchema),
  });
  const { entity_type, user_entity_uuid } = useUserData();
  const [all, setAll] = useState<Permission[]>();
  const [permissions, setPermissions] = useState<PermissionsData | undefined>();
  const [editPermission, setEditPermission] = useState<EditPermissions>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [keyValue, setKeyValue] = useState<EditPermissions>({});
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const navigate = useNavigate();
  const { language } = useLocale();
  const statusDropdownOption = statusDropdown(language);

  const getAllPermissions = async () => {
    try {
      setLoading(true);
      const response = await getPermission(entity_type);
      setAll(response?.data?.data);
      let orders: Permission[] = [];
      let manageProfile: Permission[] = [];
      let manageBranch: Permission[] = [];
      let requestPurchase: Permission[] = [];
      let supportTicket: Permission[] = [];
      let products: Permission[] = [];
      let purchaseRequest: Permission[] = [];
      response?.data?.data.map((item: Permission) => {
        if (item.permission_type === "Orders") {
          orders.push(item);
        } else if (item.permission_type === "Manage Staff") {
          manageProfile.push(item);
        } else if (item.permission_type === "Manage Branches") {
          manageBranch.push(item);
        } else if (item.permission_type === "Request Purchase") {
          requestPurchase.push(item);
        } else if (item.permission_type === "Support Ticket") {
          supportTicket.push(item);
        } else if (item.permission_type === "Products") {
          products.push(item);
        } else if (item.permission_type === "Purchase Request") {
          purchaseRequest.push(item);
        }
      });

      let finalPermissions = {
        orders: orders,
        manageProfile: manageProfile,
        manageBranch: manageBranch,
        requestPurchase: requestPurchase,
        supportTicket: supportTicket,
        products: products,
        purchaseRequest: purchaseRequest,
      };
      setPermissions(finalPermissions);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };
  useEffect(() => {
    getAllPermissions();
  }, []);

  const getSingleRolesPermissions = async () => {
    try {
      setLoading(true);
      const response = await getSingleRolePermission(roleId, entity_type);
      if (response?.data?.responseType === responseType.Success) {
        setValue("rolename", response?.data?.data[0]?.role.name);
        setValue("rolename_ar", response?.data?.data[0]?.role.name_ar);
        setValue("rolename_ur", response?.data?.data[0]?.role.name_ur);
        setValue("status", response?.data?.data[0]?.role.status);
        setSelectedStatus(response?.data?.data[0]?.role.status);
        setEditPermission(response?.data?.data?.[0]?.permission);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  useEffect(() => {
    if (roleId) {
      getSingleRolesPermissions();
    }
  }, [roleId]);

  const addRolePermission = async (data: FormData) => {
    try {
      let finalData = {};
      let response;
      if (roleId) {
        let filteredData = Object.keys(keyValue).filter(
          (key) => keyValue[key] === true
        );
        let removedData = Object.keys(keyValue).filter(
          (key) => keyValue[key] === false
        );

        let editedData;
        if (editPermission) {
          const filteredObject = Object.keys(editPermission)
            .filter((key) => !removedData.includes(key))
            .reduce((acc: { [key: string]: boolean }, key) => {
              acc[key] = editPermission[key];
              return acc;
            }, {});
          editedData = Object.keys(filteredObject).filter(
            (key) => editPermission[key] === true
          );
        }

        let mergeData = editedData?.concat(filteredData);
        finalData = {
          RoleName: data.rolename,
          RoleName_ar: data.rolename_ar,
          RoleName_ur: data.rolename_ur,
          status: data.status,
          Permissions: mergeData,
          roleId: roleId,
          entity_type,
          user_entity_uuid,
        };
        setButtonLoader(true);

        response = await updateRolePermission(finalData);
      } else {
        let filteredData = Object.keys(keyValue).filter(
          (key) => keyValue[key] === true
        );
        finalData = {
          RoleName: data.rolename,
          RoleName_ar: data.rolename_ar,
          RoleName_ur: data.rolename_ur,
          status: data.status,
          Permissions: filteredData,
          entity_type,
          user_entity_uuid,
        };
        setButtonLoader(true);
        response = await createRolePermission(finalData);
      }

      if (response?.data?.responseType === responseType.Success) {
        setButtonLoader(false);
        showToast(response?.data?.message, toastType.Success, intl);
        navigate("/roles");
      } else {
        showToast(response?.data?.message, toastType.Error, intl);
        setButtonLoader(false);
      }
    } catch (error) {
      setButtonLoader(false);
      return error;
    }
  };

  const handleChange = (e: any) => {
    keyValue[e.target.name] = e.target.checked;
    const selectedPermission = all && all.find((p) => p.uuid === e.target.name);

    if (e.target.checked === true) {
      if (
        selectedPermission &&
        ["Cancel Orders"].includes(selectedPermission.name)
      ) {
        const add = permissions?.orders.find(
          (item) => item.name === "create Orders"
        );

        if (add?.uuid) {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[add?.uuid] = true;
          const tempEdit = { ...editPermission };
          tempEdit[add?.uuid] = true;
          tempEdit[e.target.name] = true;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        }
      } else if (
        selectedPermission &&
        ["Delete Roles", "Add Roles", "Edit Roles"].includes(
          selectedPermission.name
        )
      ) {
        const add = permissions?.manageProfile.find(
          (item) => item.name === "View Roles"
        );
        if (add?.uuid) {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[add?.uuid] = true;
          const tempEdit = { ...editPermission };
          tempEdit[add?.uuid] = true;
          tempEdit[e.target.name] = true;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        }
      } else if (
        selectedPermission &&
        ["Delete staff", "Add staff", "Edit staff"].includes(
          selectedPermission.name
        )
      ) {
        const add = permissions?.manageProfile.find(
          (item) => item.name === "View All staff"
        );
        if (add?.uuid) {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[add?.uuid] = true;
          const tempEdit = { ...editPermission };
          tempEdit[add?.uuid] = true;
          tempEdit[e.target.name] = true;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        }
      } else if (
        selectedPermission &&
        ["Delete Branches", "Add Branches", "Edit Branches"].includes(
          selectedPermission.name
        )
      ) {
        const add = permissions?.manageBranch.find(
          (item) => item.name === "View All Branches"
        );

        if (add?.uuid) {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[add?.uuid] = true;
          const tempEdit = { ...editPermission };
          tempEdit[add?.uuid] = true;
          tempEdit[e.target.name] = true;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        }
      } else if (
        selectedPermission &&
        ["Create Purchase Request"].includes(selectedPermission.name)
      ) {
        const add = permissions?.requestPurchase.find(
          (item) => item.name === "Track Purchase Request"
        );
        if (add?.uuid) {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[add?.uuid] = true;
          const tempEdit = { ...editPermission };
          tempEdit[add?.uuid] = true;
          tempEdit[e.target.name] = true;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        }
      } else if (
        selectedPermission &&
        ["Add Ticket"].includes(selectedPermission.name)
      ) {
        const add = permissions?.supportTicket.find(
          (item) => item.name === "View All support tickets"
        );
        if (add?.uuid) {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[add?.uuid] = true;
          const tempEdit = { ...editPermission };
          tempEdit[add?.uuid] = true;
          tempEdit[e.target.name] = true;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        }
      } else if (
        selectedPermission &&
        ["Delete Products", "Add Products", "Edit Products"].includes(
          selectedPermission.name
        )
      ) {
        const add = permissions?.products.find(
          (item) => item.name === "View All Products"
        );
        if (add?.uuid) {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[add?.uuid] = true;
          const tempEdit = { ...editPermission };
          tempEdit[add?.uuid] = true;
          tempEdit[e.target.name] = true;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        }
      } else if (
        selectedPermission &&
        ["Send Quotes"].includes(selectedPermission.name)
      ) {
        const add = permissions?.purchaseRequest.find(
          (item) => item.name === "Manage Products Req."
        );
        if (add?.uuid) {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[add?.uuid] = true;
          const tempEdit = { ...editPermission };
          tempEdit[add?.uuid] = true;
          tempEdit[e.target.name] = true;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        }
      } else {
        const tempEdit = { ...editPermission };
        tempEdit[e.target.name] = true;
        setEditPermission(tempEdit);
      }
    } else if (e.target.checked === false) {
      if (selectedPermission && selectedPermission.name === "create Orders") {
        const rolesToFind = ["Cancel Orders"];
        const add = permissions?.orders.filter((item) =>
          rolesToFind.includes(item.name)
        );

        const result = add?.find((item) => editPermission[item.uuid]);
        if (result?.uuid) {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[result?.uuid] = false;
          const tempEdit = { ...editPermission };
          tempEdit[result?.uuid] = false;
          tempEdit[e.target.name] = false;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        } else {
          const tempEdit = { ...editPermission };
          tempEdit[e.target.name] = false;
          setEditPermission(tempEdit);
        }
      } else if (
        selectedPermission &&
        selectedPermission.name === "View Roles"
      ) {
        const rolesToFind = ["Delete Roles", "Add Roles", "Edit Roles"];
        const add = permissions?.manageProfile.filter((item) =>
          rolesToFind.includes(item.name)
        );

        let matchingRecords = [];
        if (add) {
          for (const item of add) {
            const uuid = item.uuid;
            if (editPermission[uuid]) {
              matchingRecords.push(item);
            }
          }
        }

        let tempEdit = { ...editPermission };
        matchingRecords.length > 0
          ? matchingRecords.forEach((result) => {
              const updatedKeyValue = { ...keyValue };
              updatedKeyValue[result?.uuid] = false;
              tempEdit[result?.uuid] = false;
              tempEdit[e.target.name] = false;

              setEditPermission(tempEdit);
              setKeyValue(updatedKeyValue);
            })
          : (tempEdit[e.target.name] = false);
        setEditPermission(tempEdit);
      } else if (
        selectedPermission &&
        selectedPermission.name === "View All staff"
      ) {
        const rolesToFind = ["Delete staff", "Add staff", "Edit staff"];
        const add = permissions?.manageProfile.filter((item) =>
          rolesToFind.includes(item.name)
        );
        let matchingRecords = [];
        if (add) {
          for (const item of add) {
            const uuid = item.uuid;
            if (editPermission[uuid]) {
              matchingRecords.push(item);
            }
          }
        }
        let tempEdit = { ...editPermission };
        matchingRecords.length > 0
          ? matchingRecords.forEach((result) => {
              const updatedKeyValue = { ...keyValue };
              updatedKeyValue[result?.uuid] = false;
              tempEdit[result?.uuid] = false;
              tempEdit[e.target.name] = false;

              setEditPermission(tempEdit);
              setKeyValue(updatedKeyValue);
            })
          : (tempEdit[e.target.name] = false);
        setEditPermission(tempEdit);
      } else if (
        selectedPermission &&
        selectedPermission.name === "View All Branches"
      ) {
        const rolesToFind = [
          "Delete Branches",
          "Add Branches",
          "Edit Branches",
        ];

        const add = permissions?.manageBranch.filter((item) =>
          rolesToFind.includes(item.name)
        );
        let matchingRecords = [];
        if (add) {
          for (const item of add) {
            const uuid = item.uuid;
            if (editPermission[uuid]) {
              matchingRecords.push(item);
            }
          }
        }

        let tempEdit = { ...editPermission };
        matchingRecords.length > 0
          ? matchingRecords.forEach((result) => {
              const updatedKeyValue = { ...keyValue };
              updatedKeyValue[result?.uuid] = false;
              tempEdit[result?.uuid] = false;
              tempEdit[e.target.name] = false;

              setEditPermission(tempEdit);
              setKeyValue(updatedKeyValue);
            })
          : (tempEdit[e.target.name] = false);
        setEditPermission(tempEdit);
      } else if (
        selectedPermission &&
        selectedPermission.name === "Track Purchase Request"
      ) {
        const rolesToFind = ["Create Purchase Request"];
        const add = permissions?.requestPurchase.filter((item) =>
          rolesToFind.includes(item.name)
        );
        const result = add?.find((item) => editPermission[item.uuid]);

        if (result?.uuid) {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[result?.uuid] = false;
          const tempEdit = { ...editPermission };
          tempEdit[result?.uuid] = false;
          tempEdit[e.target.name] = false;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        } else {
          const tempEdit = { ...editPermission };
          tempEdit[e.target.name] = false;
          setEditPermission(tempEdit);
        }
      } else if (
        selectedPermission &&
        selectedPermission.name === "View All support tickets"
      ) {
        const rolesToFind = ["Add Ticket"];
        const add = permissions?.supportTicket.filter((item) =>
          rolesToFind.includes(item.name)
        );

        add?.map((item) => {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[item?.uuid] = false;
          const tempEdit = { ...editPermission };
          tempEdit[item?.uuid] = false;
          tempEdit[e.target.name] = false;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        });
      } else if (
        selectedPermission &&
        selectedPermission.name === "View All Products"
      ) {
        const rolesToFind = [
          "Delete Products",
          "Add Products",
          "Edit Products",
        ];
        const add = permissions?.products.filter((item) =>
          rolesToFind.includes(item.name)
        );

        let matchingRecords = [];
        if (add) {
          for (const item of add) {
            const uuid = item.uuid;
            if (editPermission[uuid]) {
              matchingRecords.push(item);
            }
          }
        }

        let tempEdit = { ...editPermission };
        matchingRecords.length > 0
          ? matchingRecords.forEach((result) => {
              const updatedKeyValue = { ...keyValue };
              updatedKeyValue[result?.uuid] = false;
              tempEdit[result?.uuid] = false;
              tempEdit[e.target.name] = false;

              setEditPermission(tempEdit);
              setKeyValue(updatedKeyValue);
            })
          : (tempEdit[e.target.name] = false);
        setEditPermission(tempEdit);
      } else if (
        selectedPermission &&
        selectedPermission.name === "Manage Products Req."
      ) {
        const add = permissions?.purchaseRequest.filter((item) =>
          ["Send Quotes"].includes(item.name)
        );
        const result = add?.find((item) => editPermission[item.uuid]);

        if (result?.uuid) {
          const updatedKeyValue = { ...keyValue };
          updatedKeyValue[result?.uuid] = false;
          const tempEdit = { ...editPermission };
          tempEdit[result?.uuid] = false;
          tempEdit[e.target.name] = false;
          setEditPermission(tempEdit);
          setKeyValue(updatedKeyValue);
        } else {
          const tempEdit = { ...editPermission };
          tempEdit[e.target.name] = false;
          setEditPermission(tempEdit);
        }
      } else {
        const tempEdit = { ...editPermission };
        tempEdit[e.target.name] = false;
        setEditPermission(tempEdit);
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-full xl:w-3/4 border border-black/10 rounded-14px p-20px md:p-30px relative">
          <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      ) : (
        <>
          <div className="w-full xl:w-3/4 space-y-30px">
            <div className="border border-black/10 rounded-14px p-20px md:p-30px">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                    <i
                      className="icon-left_arrow text-24px text-primarycolor cursor-pointer"
                      onClick={() => navigate("/roles")}
                    ></i>
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-black">
                    {<FormattedMessage id="Permissions" />}
                  </h2>
                </div>
              </div>
              <hr className="mt-5" />
              <form onSubmit={handleSubmit(addRolePermission)}>
                <>
                  <div className="flex -mx-3 mt-7 flex-wrap">
                    <div className="relative w-full lg:w-1/2 px-3 mb-4 md:mb-5">
                      <Input
                        label={<FormattedMessage id="Role_Name" />}
                        errors={errors}
                        id="rolename"
                        register={register}
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "Enter_Rolename",
                        })}
                        required={true}
                        style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                      />
                    </div>
                    <div className="relative w-full lg:w-1/2 px-3 mb-4 md:mb-5">
                      <CustomSelect
                        control={control}
                        register={register}
                        options={statusDropdownOption as DropdownOptionType}
                        name="status"
                        error={errors}
                        required={true}
                        placeholder={intl.formatMessage({
                          id: "Choose_Status",
                        })}
                        selectedOption={selectedStatus}
                        label={<FormattedMessage id="Status" />}
                      />
                    </div>
                    <div className="relative w-full lg:w-1/2 px-3 mb-4 md:mb-5">
                      <Input
                        label={<FormattedMessage id="Role_Name_Arabic" />}
                        errors={errors}
                        id="rolename_ar"
                        register={register}
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "Enter_Rolename",
                        })}
                        required={true}
                        style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                      />
                    </div>
                    <div className="relative w-full lg:w-1/2 px-3 mb-4 md:mb-5">
                      <Input
                        label={<FormattedMessage id="Role_Name_Urdu" />}
                        errors={errors}
                        id="rolename_ur"
                        register={register}
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "Enter_Rolename",
                        })}
                        required={true}
                        style="bg-white border border-black/10 focus:ring-0  focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4 "
                      />
                    </div>
                    <div className="space-y-5 w-full px-3">
                      <div className="relative border border-black/10 rounded-xl overflow-hidden">
                        <div className="bg-primarygrey px-5 py-3 ">
                          {entity_type === "STORE" ? (
                            <h4 className="text-base text-black font-semibold">
                              {<FormattedMessage id="Orders" />}
                            </h4>
                          ) : (
                            <h4 className="text-base text-black font-semibold">
                              {<FormattedMessage id="Products" />}
                            </h4>
                          )}
                        </div>
                        <div className="p-5 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-3">
                          {entity_type === "STORE"
                            ? permissions &&
                              Object.keys(permissions?.orders).length > 0 &&
                              permissions?.orders?.map(
                                (item: { uuid: string; name: string }) => {
                                  const name = item.name.includes(" ")
                                    ? item.name.replace(/ /g, "_")
                                    : item.name;
                                  return (
                                    <div
                                      className="px-4 py-2 border border-black/10 bg-primarygrey space-y-2 rounded-xl"
                                      key={item?.uuid}
                                    >
                                      <h6 className="text-black text-base font-normal capitalize">
                                        <FormattedMessage id={name} />
                                      </h6>

                                      <div className="relative">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          {((editPermission &&
                                            Object.keys(editPermission)
                                              ?.length > 0) ||
                                            !roleId) && (
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={
                                                editPermission &&
                                                editPermission[item.uuid]
                                              }
                                              name={item.uuid}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          )}

                                          <div className="w-10 h-6 bg-togglegray peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-togglebg"></div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )
                            : permissions &&
                              Object.keys(permissions?.products).length > 0 &&
                              permissions?.products?.map(
                                (
                                  item: {
                                    uuid: string;
                                    name: string;
                                  },
                                  index: number
                                ) => {
                                  const name = item.name.includes(" ")
                                    ? item.name.replace(/ /g, "_")
                                    : item.name;
                                  return (
                                    <div
                                      className="px-4 py-2 border border-black/10 bg-primarygrey space-y-2 rounded-xl"
                                      key={index}
                                    >
                                      <h6 className="text-black text-base font-normal capitalize">
                                        <FormattedMessage id={name} />
                                      </h6>
                                      <div className="relative">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          {((editPermission &&
                                            Object.keys(editPermission)
                                              ?.length > 0) ||
                                            !roleId) && (
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={
                                                editPermission &&
                                                editPermission[item.uuid]
                                              }
                                              name={item.uuid}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          )}
                                          <div className="w-10 h-6 bg-togglegray peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-togglebg"></div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                        </div>
                      </div>
                      <div className="relative border border-black/10 rounded-xl overflow-hidden">
                        <div className="bg-primarygrey px-5 py-3 ">
                          {entity_type === "STORE" ? (
                            <h4 className="text-base text-black font-semibold">
                              <FormattedMessage id="Manage_Staff" />
                            </h4>
                          ) : (
                            <h4 className="text-base text-black font-semibold">
                              <FormattedMessage id="Purchase_Request" />
                            </h4>
                          )}
                        </div>
                        <div className="p-5 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-3">
                          {entity_type === "STORE"
                            ? permissions &&
                              Object.keys(permissions?.manageProfile).length >
                                0 &&
                              permissions?.manageProfile?.map(
                                (
                                  item: {
                                    uuid: string;
                                    name: string;
                                  },
                                  index: number
                                ) => {
                                  const name = item.name.includes(" ")
                                    ? item.name.replace(/ /g, "_")
                                    : item.name;
                                  return (
                                    <div
                                      className="px-4 py-2 border border-black/10 bg-primarygrey space-y-2 rounded-xl"
                                      key={index}
                                    >
                                      <h6 className="text-black text-base font-normal capitalize">
                                        <FormattedMessage id={name} />
                                      </h6>

                                      <div className="relative">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          {((editPermission &&
                                            Object.keys(editPermission)
                                              ?.length > 0) ||
                                            !roleId) && (
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={
                                                editPermission &&
                                                editPermission[item.uuid]
                                              }
                                              name={item.uuid}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          )}
                                          <div className="w-10 h-6 bg-togglegray peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-togglebg"></div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )
                            : permissions &&
                              Object.keys(permissions?.purchaseRequest).length >
                                0 &&
                              permissions?.purchaseRequest?.map(
                                (
                                  item: {
                                    uuid: string;
                                    name: string;
                                  },
                                  index: number
                                ) => {
                                  const name =
                                    item.name === "Manage Products Req."
                                      ? "Manage_Products_Req"
                                      : item.name.includes(" ")
                                      ? item.name.replace(/ /g, "_")
                                      : item.name;

                                  return (
                                    <div
                                      className="px-4 py-2 border border-black/10 bg-primarygrey space-y-2 rounded-xl"
                                      key={index}
                                    >
                                      <h6 className="text-black text-base font-normal capitalize">
                                        <FormattedMessage id={name} />
                                      </h6>
                                      <div className="relative">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          {((editPermission &&
                                            Object.keys(editPermission)
                                              ?.length > 0) ||
                                            !roleId) && (
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={
                                                editPermission &&
                                                editPermission[item.uuid]
                                              }
                                              name={item.uuid}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          )}
                                          <div className="w-10 h-6 bg-togglegray peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-togglebg"></div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                        </div>
                      </div>
                      <div className="relative border border-black/10 rounded-xl overflow-hidden">
                        <div className="bg-primarygrey px-5 py-3 ">
                          {entity_type === "STORE" ? (
                            <h4 className="text-base text-black font-semibold">
                              <FormattedMessage id="Manage_Branches" />
                            </h4>
                          ) : (
                            <h4 className="text-base text-black font-semibold">
                              <FormattedMessage id="Orders" />
                            </h4>
                          )}
                        </div>
                        <div className="p-5 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-3">
                          {entity_type === "STORE"
                            ? permissions &&
                              Object.keys(permissions?.manageBranch).length >
                                0 &&
                              permissions?.manageBranch?.map(
                                (
                                  item: {
                                    uuid: string;
                                    name: string;
                                  },
                                  index: number
                                ) => {
                                  const name = item.name.includes(" ")
                                    ? item.name.replace(/ /g, "_")
                                    : item.name;
                                  return (
                                    <div
                                      className="px-4 py-2 border border-black/10 bg-primarygrey space-y-2 rounded-xl"
                                      key={index}
                                    >
                                      <h6 className="text-black text-base font-normal capitalize">
                                        <FormattedMessage id={name} />
                                      </h6>
                                      <div className="relative">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          {((editPermission &&
                                            Object.keys(editPermission)
                                              ?.length > 0) ||
                                            !roleId) && (
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={
                                                editPermission &&
                                                editPermission[item.uuid]
                                              }
                                              name={item.uuid}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          )}
                                          <div className="w-10 h-6 bg-togglegray peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-togglebg"></div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )
                            : permissions &&
                              Object.keys(permissions?.orders).length > 0 &&
                              permissions?.orders?.map(
                                (
                                  item: {
                                    uuid: string;
                                    name: string;
                                  },
                                  index: number
                                ) => {
                                  const name = item.name.includes(" ")
                                    ? item.name.replace(/ /g, "_")
                                    : item.name;
                                  return (
                                    <div
                                      className="px-4 py-2 border border-black/10 bg-primarygrey space-y-2 rounded-xl"
                                      key={index}
                                    >
                                      <h6 className="text-black text-base font-normal capitalize">
                                        <FormattedMessage id={name} />
                                      </h6>
                                      <div className="relative">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          {((editPermission &&
                                            Object.keys(editPermission)
                                              ?.length > 0) ||
                                            !roleId) && (
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={
                                                editPermission &&
                                                editPermission[item.uuid]
                                              }
                                              name={item.uuid}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          )}
                                          <div className="w-10 h-6 bg-togglegray peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-togglebg"></div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                        </div>
                      </div>
                      <div className="relative border border-black/10 rounded-xl overflow-hidden">
                        <div className="bg-primarygrey px-5 py-3 ">
                          {entity_type === "STORE" ? (
                            <h4 className="text-base text-black font-semibold">
                              <FormattedMessage id="Request_Purchase" />
                            </h4>
                          ) : (
                            <h4 className="text-base text-black font-semibold">
                              <FormattedMessage id="Manage_Staff" />
                            </h4>
                          )}
                        </div>
                        <div className="p-5 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-3">
                          {entity_type === "STORE"
                            ? permissions &&
                              Object.keys(permissions?.requestPurchase).length >
                                0 &&
                              permissions?.requestPurchase?.map(
                                (
                                  item: {
                                    uuid: string;
                                    name: string;
                                  },
                                  index: number
                                ) => {
                                  const name = item.name.includes(" ")
                                    ? item.name.replace(/ /g, "_")
                                    : item.name === "Manage Products Req."
                                    ? "Manage_Products_Req"
                                    : item.name;
                                  return (
                                    <div
                                      className="px-4 py-2 border border-black/10 bg-primarygrey space-y-2 rounded-xl"
                                      key={index}
                                    >
                                      <h6 className="text-black text-base font-normal capitalize">
                                        <FormattedMessage id={name} />
                                      </h6>
                                      <div className="relative">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          {((editPermission &&
                                            Object.keys(editPermission)
                                              ?.length > 0) ||
                                            !roleId) && (
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={
                                                editPermission &&
                                                editPermission[item.uuid]
                                              }
                                              name={item.uuid}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          )}
                                          <div className="w-10 h-6 bg-togglegray peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-togglebg"></div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )
                            : permissions &&
                              Object.keys(permissions?.manageProfile).length >
                                0 &&
                              permissions?.manageProfile?.map(
                                (
                                  item: {
                                    uuid: string;
                                    name: string;
                                  },
                                  index: number
                                ) => {
                                  const name = item.name.includes(" ")
                                    ? item.name.replace(/ /g, "_")
                                    : item.name;
                                  return (
                                    <div
                                      className="px-4 py-2 border border-black/10 bg-primarygrey space-y-2 rounded-xl"
                                      key={index}
                                    >
                                      <h6 className="text-black text-base font-normal capitalize">
                                        <FormattedMessage id={name} />
                                      </h6>
                                      <div className="relative">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          {((editPermission &&
                                            Object.keys(editPermission)
                                              ?.length > 0) ||
                                            !roleId) && (
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={
                                                editPermission[item?.uuid]
                                              }
                                              name={item?.uuid}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          )}
                                          <div className="w-10 h-6 bg-togglegray peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-togglebg"></div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                        </div>
                      </div>
                      <div className="relative border border-black/10 rounded-xl overflow-hidden">
                        <div className="bg-primarygrey px-5 py-3 ">
                          {entity_type === "STORE" ? (
                            <h4 className="text-base text-black font-semibold">
                              <FormattedMessage id="Support_Ticket" />
                            </h4>
                          ) : (
                            <h4 className="text-base text-black font-semibold">
                              <FormattedMessage id="Manage_Branches" />
                            </h4>
                          )}
                        </div>
                        <div className="p-5 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-3">
                          {entity_type === "STORE"
                            ? permissions &&
                              Object.keys(permissions?.supportTicket).length >
                                0 &&
                              permissions?.supportTicket?.map(
                                (
                                  item: {
                                    uuid: string;
                                    name: string;
                                  },
                                  index: number
                                ) => {
                                  const name = item.name.includes(" ")
                                    ? item.name.replace(/ /g, "_")
                                    : item.name;
                                  return (
                                    <div
                                      className="px-4 py-2 border border-black/10 bg-primarygrey space-y-2 rounded-xl"
                                      key={index}
                                    >
                                      <h6 className="text-black text-base font-normal capitalize">
                                        <FormattedMessage id={name} />
                                      </h6>
                                      <div className="relative">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          {((editPermission &&
                                            Object.keys(editPermission)
                                              ?.length > 0) ||
                                            !roleId) && (
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={
                                                editPermission &&
                                                editPermission[item.uuid]
                                              }
                                              name={item.uuid}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          )}
                                          <div className="w-10 h-6 bg-togglegray peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-togglebg"></div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )
                            : permissions &&
                              Object.keys(permissions?.manageBranch).length >
                                0 &&
                              permissions?.manageBranch?.map(
                                (
                                  item: {
                                    uuid: string;
                                    name: string;
                                  },
                                  index: number
                                ) => {
                                  const name = item.name.includes(" ")
                                    ? item.name.replace(/ /g, "_")
                                    : item.name;
                                  return (
                                    <div
                                      className="px-4 py-2 border border-black/10 bg-primarygrey space-y-2 rounded-xl"
                                      key={index}
                                    >
                                      <h6 className="text-black text-base font-normal capitalize">
                                        <FormattedMessage id={name} />
                                      </h6>
                                      <div className="relative">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          {((editPermission &&
                                            Object.keys(editPermission)
                                              ?.length > 0) ||
                                            !roleId) && (
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={
                                                editPermission &&
                                                editPermission[item.uuid]
                                              }
                                              name={item.uuid}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          )}

                                          <div className="w-10 h-6 bg-togglegray peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-togglebg"></div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                        </div>
                      </div>
                      {entity_type === "SUPPLIER" && (
                        <div className="relative border border-black/10 rounded-xl overflow-hidden">
                          <div className="bg-primarygrey px-5 py-3 ">
                            <h4 className="text-base text-black font-semibold">
                              <FormattedMessage id="Support_Ticket" />
                            </h4>
                          </div>
                          <div className="p-5 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-3">
                            {permissions &&
                              Object.keys(permissions?.supportTicket).length >
                                0 &&
                              permissions?.supportTicket?.map(
                                (
                                  item: {
                                    uuid: string;
                                    name: string;
                                  },
                                  index: number
                                ) => {
                                  const name = item.name.includes(" ")
                                    ? item.name.replace(/ /g, "_")
                                    : item.name;
                                  return (
                                    <div
                                      className="px-4 py-2 border border-black/10 bg-primarygrey space-y-2 rounded-xl"
                                      key={index}
                                    >
                                      <h6 className="text-black text-base font-normal capitalize">
                                        <FormattedMessage id={name} />
                                      </h6>
                                      <div className="relative">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          {((editPermission &&
                                            Object.keys(editPermission)
                                              ?.length > 0) ||
                                            !roleId) && (
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={
                                                editPermission &&
                                                editPermission[item.uuid]
                                              }
                                              name={item.uuid}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          )}
                                          <div className="w-10 h-6 bg-togglegray peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-togglebg"></div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 max-w-md mt-8">
                    <Button
                      text={<FormattedMessage id="Cancel" />}
                      type="button"
                      disable={buttonLoader}
                      className="w-full px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                      onClick={() => {
                        reset();
                        navigate("/roles");
                      }}
                    ></Button>
                    <Button
                      text={
                        roleId ? (
                          <FormattedMessage id="Update_Role" />
                        ) : (
                          <FormattedMessage id="Create_Role" />
                        )
                      }
                      type="submit"
                      loader={buttonLoader}
                      className="w-full px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                    ></Button>
                  </div>
                </>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default AddRolePermission;
