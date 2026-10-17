import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "store";
import ProfilePic from "../../assets/images/profile.png";
import { supplierSidebarDetails } from "utility/supplierSidebar";
import { SidebarType } from "types/generalTypes";
import { getOwnerShipDetils } from "reducers/ownership.reducer";
import useUserData from "hooks/getUserData";
import Logout from "components/logout/Logout";
import { REACT_APP_IMAGE_PATH } from "../../config";
import { setSidebarOpen } from "reducers/sidebar.reducer";
import { FormattedMessage } from "react-intl";
import { useOutsideAlterer } from "hooks/useOutsideAlter";
import { getOrders } from "pages/supplier/order/services/order.services";
import { perPage } from "constant/common.constant";
import { ApiParamsType } from "components/table/types";
import useLocale from "hooks/useLocale";

const SupplierSideBar = () => {
  const { language } = useLocale()
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [click, setClick] = useState<boolean>(false);
  const { token, role, phone, image, username , role_ar, role_ur} = useUserData();
  const [acceptedOrders, setAcceptedOrders] = useState<number>();
  const [showSubItems, setShowSubItems] = useState<Record<string, boolean>>({});
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.open);
  const { user_entity_uuid } = useUserData();
  const wrapperRef = useRef(null);
  useOutsideAlterer("sidebar", wrapperRef);
  const handleInitialApiCalls = async () => {
    try {
      await dispatch(getOwnerShipDetils());
    } catch (error) {
      return error;
    }
  };
  const toggleSubMenu = (name: string) => {
    setShowSubItems((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };
  const [apiParams, _setApiParams] = useState<ApiParamsType>({
    limit: perPage,
    count: 0,
    page: 1,
    isAsc: true,
    sort: `uuid`,
    searchText: "",
    searchField: "company_name",
    extraParams: {},
  });
  const acceptedsuppOrders = async () => {
    const res = await getOrders(user_entity_uuid, apiParams);
    setAcceptedOrders(res?.data?.data?.orderCount);
  };
  useEffect(() => {
    if (token) {
      handleInitialApiCalls();
      acceptedsuppOrders();
    }
  }, [token]);
  const isActiveURI = (path: string) => pathname.includes(path);
  return (
    <div
      ref={wrapperRef}
      className={`xl:w-376px w-300px shrink-0   xl:relative left-0 xl:h-[unset] xl:z-10   transition-all duration-300 ease-in-out fixed z-[999] bg-white h-full  top-0 ${
        isSidebarOpen ? "-translate-x-0 shadow-md " : "-translate-x-full"
      } xl:translate-x-unset  `}
    >
      <div className="sticky top-0 overflow-y-auto z-[1000] bg-white xl:top-28 border border-black/10 rounded-none xl:rounded-14px h-full xl:h-[unset]">
        <div className="px-5 py-8 pb-0 text-center">
          <div
            className="flex justify-end xl:hidden"
            onClick={() => dispatch(setSidebarOpen(false))}
          >
            <i className="icon-close text-xs"></i>
          </div>
          <div className="w-70px h-70px mx-auto flex justify-center items-center rounded-full border-2 overflow-hidden border-primarycolor outline-4 outline-primarycolor outline-offset-4 outline">
            {image ? (
              <>
                <img
                  src={`${REACT_APP_IMAGE_PATH}/${image}`}
                  alt="image"
                  className="rounded-full w-full h-full"
                />
              </>
            ) : (
              <>
                <img src={ProfilePic} alt="" />
              </>
            )}
          </div>
          <h4 className="text-black text-xl font-medium mt-14px mb-2">
            {username && <span>{username}</span>}
          </h4>
          <a
            href="tel:+9649786543210"
            className="text-sm font-normal block text-black/40"
          >
            {phone && <span>{phone}</span>}
          </a>
          <p className="py-1 px-3 bg-primarycolor/10 text-primarycolor text-xs font-medium inline-block rounded-2xl mt-10px">
          {role && language === "en" && <span>{role.replace("_"," ")}</span>}
            {role && language === "ar" && <span>{role_ar}</span>}
            {role && language === "ur" && <span>{role_ur}</span>}
          </p>
          <hr className="border-black/10 mt-5" />
        </div>
        <div className="px-4 py-10px pb-2 ">
          <ul className={"block  space-y-1"}>
            {supplierSidebarDetails.map(
              (sidebar: SidebarType, index: number) => {
                const name = sidebar.name.includes(" ")
                  ? sidebar.name.replace(/ /g, "_")
                  : sidebar.name;
                return (
                  <>
                    {sidebar?.subitems ? (
                      <li>
                        <div
                          className="py-3.5 pl-6 rtl:pr-6 relative hover:bg-white hover:rounded-l-xl group/hs cursor-pointer  hover:text-Primarycolors font-medium flex items-center gap-3 hover-effects  "
                          onClick={() => {
                            toggleSubMenu(sidebar.name);
                            setClick(!click);
                          }}
                        >
                          <span className="flex items-center gap-x-3.5 text-base">
                            <i
                              className={`${
                                isActiveURI(sidebar.path)
                                  ? "text-primarycolor"
                                  : ""
                              } ${
                                sidebar.icon
                              } text-24px text-primarycolor group-hover/hss:text-white`}
                            ></i>
                            <span className="font-normal">
                              {<FormattedMessage id={`${name}`} />}
                            </span>
                            <i
                              className={`icon-down-arrow text-base absolute top-4 right-8 rtl:right-[unset] rtl:left-8 ${
                                showSubItems[sidebar.name] === true
                                  ? "rotate-180"
                                  : "rotate-0"
                              }`}
                            ></i>
                          </span>
                        </div>
                        <ul
                          className={`${
                            showSubItems[sidebar.name] === true
                              ? "bg-Darkcolor/80 rounded-lg w-[calc(100%-30px)] p-2 space-y-1 block"
                              : "hidden"
                          }`}
                        >
                          {showSubItems[sidebar.name] &&
                            sidebar.subitems &&
                            sidebar.subitems.map((subItem, key) => {
                              const name = subItem.name.includes(" ")
                                ? subItem.name.replace(/ /g, "_")
                                : subItem.name;
                              return (
                                <li key={key}>
                                  <Link
                                    to={subItem?.path}
                                    className={`${
                                      isActiveURI(subItem.path)
                                        ? "py-3.5 pl-6 bg-white text-primarycolor rounded-xl font-medium flex items-center gap-3 121"
                                        : "py-3.5 pl-6 hover:bg-white  group/hs  hover:text-Primarycolors font-medium rounded-xl text-white flex items-center gap-3"
                                    }`}
                                  >
                                    <i
                                      className={`${subItem?.icon} text-xl  group-hover/hs:text-primarycolor`}
                                    ></i>
                                    {<FormattedMessage id={name} />}
                                  </Link>
                                </li>
                              );
                            })}
                        </ul>
                      </li>
                    ) : (
                      <li key={index}>
                        <Link
                          key={index}
                          to={sidebar.path}
                          onClick={() => dispatch(setSidebarOpen(false))}
                          className={`${
                            isActiveURI(sidebar.path)
                              ? "text-white bg-primarycolor"
                              : "before:hover:opacity-100 before:opacity-0 "
                          } before:absolute flex items-center px-6 py-4 gap-3 hover:text-white hover:bg-primarycolor rounded-xl text-16px leading-5 group/hss transition-all ease-in-out duration-200`}
                        >
                          <i
                            className={`${
                              isActiveURI(sidebar.path) ? "text-white " : " "
                            } ${
                              sidebar.icon
                            } text-24px text-primarycolor group-hover/hss:text-white`}
                          ></i>
                          <span>{<FormattedMessage id={`${name}`} />}</span>
                          {name === "Orders" ? (
                            <div className="w-8 h-8 md:w-7 md:h-7 border group-hover/hss:border-white rounded-full text-sm border-primarycolor p-1 flex items-center justify-center">
                              {acceptedOrders}
                            </div>
                          ) : (
                            ""
                          )}
                        </Link>
                      </li>
                    )}
                  </>
                );
              }
            )}
            <Logout />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupplierSideBar;
