import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "store";
import { adminSidebarDetails } from "utility/adminSidebar";
import { SidebarType } from "types/generalTypes";
import SiteLogo from "../../assets/images/site-logo.svg";
import { setSidebarOpen } from "reducers/sidebar.reducer";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { adminBankTransfer } from "pages/admin/bankTransfer/services/bankTransfer.service";
import { ApiParamsType } from "components/table/types";
import { perPage } from "constant/common.constant";
import { getOrderInfo } from "pages/admin/orders/services/order.service";

const AdminSideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [click, setClick] = useState<boolean>(false);
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.open);
  const { pathname } = useLocation();
  const [showSubItems, setShowSubItems] = useState<Record<string, boolean>>({
    Dashboard: true,
  });
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
  });
  const [pendingRequest, setPendingRequest] = useState();
  const [orderCount, setOrderCount] = useState<number>();
  const isActiveURI = (path: string) => pathname.includes(path);

  const toggleSidebar = () => {
    dispatch(setSidebarOpen(isSidebarOpen ? false : true));
  };
  const pendingBankTransfer = async () => {
    const res = await adminBankTransfer(apiParams);
    setPendingRequest(res?.data.data.count);
  };
  const getOrderCount = async () => {
    const response = await getOrderInfo(apiParams);
    setOrderCount(response?.data?.data?.orderCount);
  };
  useEffect(() => {
    pendingBankTransfer();
    getOrderCount();
  }, []);
  return (
    <div
      className={`${
        isSidebarOpen ? "" : "-translate-x-150% xl:translate-x-0"
      } fixed z-[999] bg-Primarycolors pt-5  xl:pt-0 xl:sticky top-0 xl:z-0 h-screen flex-auto shrink-0 transition-all duration-500 ease-in-out w-72 md:w-80  overflow-hidden overflow-y-auto scrollbar-none`}
    >
      <div className="text-center">
        <div className="pr-5  relative xl:sticky top-0 left-0 z-10 bg-Primarycolors">
          <a
            href="#"
            className="router-link-active router-link-exact-active flex items-center pl-5 intro-x "
          >
            <img src={SiteLogo} alt="site-logo" />
          </a>
          <a
            href="#"
            className="absolute top-0 right-5 xl:hidden"
            onClick={() => toggleSidebar()}
          >
            <i className="icon-close text-sm text-white"></i>
          </a>
          <hr className="my-4 border-slate-50/20" />
        </div>
        <ul className="text-base text-white font-normal  space-y-1 pb-12 pt-5 overflow-hidden">
          {adminSidebarDetails.map((sidebar: SidebarType, index: number) => {
            const name = sidebar.name.includes(" ")
              ? sidebar.name.replace(/ /g, "_")
              : sidebar.name;
            return (
              <>
                {" "}
                {sidebar?.subitems ? (
                  <li>
                    <div
                      className="py-3 pl-6 rtl:pr-6 rtl:pl-0 relative hover:bg-white hover:cursor-pointer
                                                hover:text-primarycolor
                                                hover:rounded-l-xl rtl:hover:rounded-r-xl rtl:hover:rounded-l-none group/hs
                                                font-medium flex items-center
                                                gap-3 hover-effects  "
                      onClick={() => {
                        toggleSubMenu(sidebar.name);
                        setClick(!click);
                      }}
                    >
                      <span className="flex items-center gap-x-3.5 text-base">
                        {" "}
                        <i
                          className={`${
                            isActiveURI(sidebar.path)
                              ? "text-white "
                              : "text-white "
                          } ${
                            sidebar.icon
                          } text-xl text-primarycolor group-hover/hs:text-primarycolor`}
                        ></i>
                        <span>
                          {<FormattedMessage id={`${name}`} />}
                          {name === "Bank Transfer" ? pendingRequest : ""}
                        </span>
                        {/* {click && ( */}
                        <i
                          className={`icon-down-arrow text-base absolute top-4  right-8 rtl:right-[unset] rtl:left-8 ${
                            showSubItems[sidebar.name] === true
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                        ></i>
                        {/* )} */}
                      </span>
                    </div>
                    <ul
                      className={`${
                        showSubItems[sidebar.name] === true
                          ? "bg-Darkcolor/100  mt-2  rounded-lg w-[calc(100%-30px)] p-2 space-y-1 block"
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
                            <li key={key} className="w-full">
                              <Link
                                to={subItem?.path}
                                className={`${
                                  isActiveURI(subItem.path)
                                    ? "py-3 pl-6 rtl:pr-6 rtl:pl-0  bg-white text-primarycolor rounded-xl  group/hs  font-medium flex items-center gap-3 "
                                    : "py-3 pl-6 rtl:pr-6 rtl:pl-0 hover:bg-white  hover:rounded-xl  group/hs  hover:text-Primarycolors font-medium flex items-center gap-3"
                                }`}
                              >
                                <i
                                  className={`${subItem?.icon} text-xl  group-hover/hs:text-primarycolor`}
                                ></i>{" "}
                                {<FormattedMessage id={`${name}`} />}
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                  </li>
                ) : (
                  <li>
                    <Link
                      key={index}
                      to={`${sidebar?.path}`}
                      onClick={() => dispatch(setSidebarOpen(false))}
                      className={`${
                        isActiveURI(sidebar.path)
                          ? "py-3 pl-6 rtl:pr-6 rtl:pl-0 bg-white  text-primarycolor rounded-l-xl rtl:rounded-r-xl rtl:rounded-l-none group/hs  font-medium flex items-center gap-3 "
                          : "py-3 pl-6 rtl:pr-6 rtl:pl-0 hover:bg-white hover-effects hover:rounded-l-xl rtl:hover:rounded-r-xl rtl:hover:rounded-l-none group/hs  hover:text-Primarycolors font-medium flex items-center gap-3"
                      }`}
                    >
                      <i
                        className={`${
                          isActiveURI(sidebar.path)
                            ? "text-primarycolor"
                            : "text-white"
                        } ${
                          sidebar.icon
                        } text-xl text-primarycolor group-hover/hs:text-primarycolor`}
                      ></i>
                      {<FormattedMessage id={`${name}`} />}
                      {name === "Orders" ? (
                        <div className="w-8 h-8 md:w-7 md:h-7 border group-hover/hs:border-primarycolor rounded-full text-sm border-white p-1 flex items-center justify-center">
                          {orderCount}
                        </div>
                      ) : (
                        ""
                      )}
                      {name === "Bank_Transfer" ? (
                        <div className="w-8 h-8 md:w-7 md:h-7 border group-hover/hs:border-primarycolor rounded-full text-sm border-white p-1 flex items-center justify-center">
                          {pendingRequest}
                        </div>
                      ) : (
                        ""
                      )}
                    </Link>
                  </li>
                )}
              </>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AdminSideBar;
