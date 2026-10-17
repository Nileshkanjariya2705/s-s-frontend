import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "store";
import ProfilePic from "../../assets/images/profile.png";
import { storeSidebarDetails } from "utility/storeSidebar";
import { SidebarType } from "types/generalTypes";
import Logout from "components/logout/Logout";

import useUserData from "hooks/getUserData";
import {
  getOwnerShipDetils,
  setOwnershipDetails,
} from "reducers/ownership.reducer";
import { useEffect, useRef, useState } from "react";
import { REACT_APP_IMAGE_PATH } from "../../config";
import { setSidebarOpen } from "reducers/sidebar.reducer";
import { FormattedMessage } from "react-intl";
import { useOutsideAlterer } from "hooks/useOutsideAlter";
import { getStoreOrders } from "pages/store/purchaseHistory/services/purchaseHistory.service";
import useLocale from "hooks/useLocale";

const StoreOwnerSideBar = () => {
  const { language } = useLocale();
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [click, setClick] = useState<boolean>(false);
  const [showSubItems, setShowSubItems] = useState<Record<string, boolean>>({});
  const { token, role, phone, image, username, role_ar, role_ur } =
    useUserData();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.open);
  const { user_entity_uuid } = useUserData();
  const [acceptedOrders, setAcceptedOrders] = useState<number>();

  const wrapperRef = useRef(null);
  useOutsideAlterer("sidebar", wrapperRef);
  const handleInitialApiCalls = async () => {
    try {
      const data = await dispatch(getOwnerShipDetils() as any);
      dispatch(setOwnershipDetails({ ...data.payload }));
    } catch (error) {
      return error;
    }
  };
  const acceptedstoreOrders = async () => {
    const res: any = await getStoreOrders(user_entity_uuid);
    setAcceptedOrders(res?.data?.data);
  };
  useEffect(() => {
    if (token) {
      handleInitialApiCalls();
      acceptedstoreOrders();
    }
  }, [token]);
  const isActiveURI = (path: string) => pathname.includes(path);
  const toggleSubMenu = (name: string) => {
    setShowSubItems((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

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
                  className="rounded-xl w-full h-full"
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
            {role && language === "en" && <span>{role.replace("_", " ")}</span>}
            {role && language === "ar" && (
              <span>
                {" "}
                <p>
                  <FormattedMessage id={role_ar} />
                </p>
              </span>
            )}
            {role && language === "ur" && (
              <span>
                <p>
                  <FormattedMessage id={role_ur} />
                </p>
              </span>
            )}
          </p>
          <hr className="border-black/10 mt-5" />
        </div>
        <div className="px-4 py-10px pb-2 ">
          <ul className="block space-y-1">
            {storeSidebarDetails.map((sidebar: SidebarType, index: number) => {
              const name = sidebar.name.includes(" ")
                ? sidebar.name.replace(/ /g, "_")
                : sidebar.name;
              return (
                <>
                  {" "}
                  {sidebar?.subitems ? (
                    <li key={index}>
                      <div
                        className="py-3.5 px-6 relative  hover:bg-Primarycolors rounded-xl group/hs cursor-pointer  hover:text-white font-medium flex items-center  "
                        onClick={() => {
                          toggleSubMenu(sidebar.name);
                          setClick(!click);
                        }}
                      >
                        <span className="flex items-center gap-x-3 text-base">
                          {" "}
                          <i
                            className={`${
                              isActiveURI(sidebar.path)
                                ? "text-primarycolor"
                                : ""
                            } ${
                              sidebar.icon
                            } text-24px text-primarycolor group-hover/hs:text-white w-6`}
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
                            ? "bg-Darkcolor/80 rounded-lg w-full p-2 space-y-1 block"
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
                                      ? "py-3.5 px-6 bg-white text-primarycolor rounded-xl font-medium flex items-center gap-x-3"
                                      : "py-3.5 px-6 hover:bg-white  group/hs text-white  hover:text-Primarycolors font-medium rounded-xl gap-x-3  flex items-center"
                                  }`}
                                >
                                  <i
                                    className={`${subItem?.icon} text-xl  group-hover/hs:text-primarycolor w-6`}
                                  ></i>{" "}
                                  <span>
                                    <FormattedMessage id={name} />
                                  </span>
                                  {name === "Orders" ? (
                                    <div className="w-8 h-8 md:w-7 md:h-7 border group-hover/hss:border-white rounded-full text-sm border-primarycolor p-1 flex items-center justify-center">
                                      {acceptedOrders}
                                    </div>
                                  ) : (
                                    ""
                                  )}
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
                        } before:absolute flex items-center px-6 py-4 gap-x-3  hover:text-white hover:bg-primarycolor rounded-xl text-16px leading-5 group/hss transition-all ease-in-out duration-200`}
                      >
                        <i
                          className={`${
                            isActiveURI(sidebar.path) ? "text-white " : " "
                          } ${
                            sidebar.icon
                          } text-24px text-primarycolor group-hover/hss:text-white w-6`}
                        ></i>

                        <span>{<FormattedMessage id={`${name}`} />}</span>
                      </Link>
                    </li>
                  )}
                </>
              );
            })}
            <Logout />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerSideBar;
