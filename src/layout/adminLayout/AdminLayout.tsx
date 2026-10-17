import GlobalLoader from "components/globalLoader/GlobalLoader";
import useUserData from "hooks/getUserData";
import AdminSideBar from "layout/sidebars/AdminSideBar";
import { getNotificationCount } from "pages/notification/services/notification.service";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "store";
import { setLanguage } from "reducers/language.reducer";
import { REACT_APP_IMAGE_PATH } from "config";
import ProfilePic from "../../assets/images/profile.png";

import { FormattedMessage } from "react-intl";
import { setToken } from "reducers/token.reducer";
import { useOutsideClick } from "hooks/clickOutside";
import { setSidebarOpen } from "reducers/sidebar.reducer";
import useLocale from "hooks/useLocale";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { language} =  useLocale()
  const dispatch = useDispatch<AppDispatch>();
  const [showProfileDropdown, setShowProfileDropdown] =
    useState<boolean>(false);
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.open);

  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage({ language: e.target.value }));
  };

  
  const { socket } = useSelector((state: RootState) => ({
    socket: state.socket.socket,
  }));

  const handleLogout = () => {
    navigate("/admin");
    dispatch(setToken(""));
    localStorage.removeItem("S&S_authtoken");
  };
  const handlePassword = () => {
    navigate("/admin/manage-password");
    setShowProfileDropdown(false);
  };
  const handleProfile = () => {
    navigate("/admin/manage-profile");
    setShowProfileDropdown(false);
  };

  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => {
    socket?.on("receive_notification", () => {
      setNotificationCount((prevState) => prevState + 1);
    });
  }, [socket]);

  const { uuid, image } = useUserData();

  const getAllNotificationCount = async () => {
    try {
      const resp = await getNotificationCount(uuid);
      if (resp?.data?.data) {
        setNotificationCount(resp?.data?.data);
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getAllNotificationCount();
  }, []);

  const url = location?.pathname.slice(7);

  const navigatationCrum = url.split("/").slice(0, 2);

  const navigate = useNavigate();

  const handleNotificationClick = async () => {
    navigate("/admin/notification");
    try {
      setTimeout(async () => {
        setNotificationCount(0);
      }, 2000);
    } catch (error) {
      return error;
    }
  };

  const newUrl = new URL(window?.location.href);

  useEffect(() => {
    if (newUrl.pathname === "/admin/notification") {
      setTimeout(async () => {
        setNotificationCount(0);
      }, 2000);
    }
  }, [newUrl.pathname, socket]);

  const ref = useOutsideClick(() => {
    if (showProfileDropdown) {
      setShowProfileDropdown(false);
    }
  });
  const toggleSidebar = () => {
    dispatch(setSidebarOpen(isSidebarOpen ? false : true));
  };
  return (
    <>
      <AdminSideBar />
      <Suspense fallback={<GlobalLoader />}>
        <div className="relative w-full min-w-0 flex-auto bg-white rounded-xl p-5 lg:p-8 overflow-y-auto">
          <div className="flex items-center border-b border-Primarycolors/20 pb-4 mb-5 flex-wrap gap-y-4 md:gap-y-0 relative">
            <button
              type="button"
              className="absolute left-0 top-2 md:top-2.5 xl:hidden"
              onClick={() => toggleSidebar()}
            >
              <svg
                className="w-5 h-5 fill-darkgrey"
                viewBox="0 0 57 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M57 4.93316C57 2.67033 55.1656 0.835938 52.9028 0.835938H4.09722C1.83439 0.835938 0 2.67033 0 4.93316C0 7.19599 1.83439 9.03038 4.09722 9.03038H52.9028C55.1656 9.03038 57 7.19599 57 4.93316ZM57 25.4175C57 23.1547 55.1656 21.3203 52.9028 21.3203H4.09722C1.83439 21.3203 0 23.1547 0 25.4175C0 27.6804 1.83439 29.5148 4.09722 29.5148H52.9028C55.1656 29.5148 57 27.6804 57 25.4175ZM25.1953 41.8047C27.4581 41.8047 29.2925 43.6391 29.2925 45.9019C29.2925 48.1647 27.4581 49.9991 25.1953 49.9991H4.09806C1.83523 49.9991 0.000839233 48.1647 0.000839233 45.9019C0.000839233 43.6391 1.83522 41.8047 4.09806 41.8047H25.1953Z"
                />
              </svg>
            </button>
            <div className="w-full md:w-1/2 mb-30 order-2 md:order-1 md:pl-10 xl:pl-0">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse ">
                  <li className="inline-flex items-center">
                    <Link
                      to={`/admin/admin-dashboard`}
                      className="inline-flex items-center gap-2 text-sm font-medium md:text-base text-Primarycolors"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                      </svg>
                      <span>Home</span>
                    </Link>
                  </li>
                  <li>
                    <svg
                      className="w-3 h-3 text-black/40 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  </li>

                  {navigatationCrum.length > 0 &&
                    navigatationCrum.map((item: string, count: number = 0) => {
                      let linkToRedirect: string = item;

                      if (item.includes("view") || item.includes("edit")) {
                        linkToRedirect = location?.pathname as string;
                      } else if (count === 0) {
                        linkToRedirect = `/admin/${item}`;
                      } else {
                        linkToRedirect = `/admin/${url}`;
                      }
                      count++;
                      return (
                        <>
                          <li className="inline-flex items-center">
                            <Link
                              to={linkToRedirect}
                              className="inline-flex items-center gap-2 text-sm font-medium md:text-base text-Primarycolors"
                            >
                              <span>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                              </span>
                            </Link>
                          </li>
                          {count === navigatationCrum.length - 1 && (
                            <>
                              <li>
                                <svg
                                  className="w-3 h-3 text-black/40 rtl:rotate-180"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 6 10"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 9 4-4-4-4"
                                  />
                                </svg>
                              </li>
                            </>
                          )}
                        </>
                      );
                    })}
                </ol>
              </nav>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 pl-10 md:pl-0">
              <div className="relative flex items-center justify-between md:justify-end gap-7">
                <select
                  className="flex items-center max-w-90px focus:outline-0 justify-between w-full bg-white text-black font-semibold rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent "
                  name="Lang"
                  id="lang_id"
                  value={language}
                  defaultValue={language}
                  onChange={handleChangeLang}
                >
                  <svg
                    className="w-3 h-3 ml-3 fill-black/25"
                    viewBox="0 0 11 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L5.5 4.08579L9.29289 0.292893C9.68342 -0.0976311 10.3166 -0.0976311 10.7071 0.292893C11.0976 0.683417 11.0976 1.31658 10.7071 1.70711L6.20711 6.20711C5.81658 6.59763 5.18342 6.59763 4.79289 6.20711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z"
                    />
                  </svg>
                  <option value="en">English</option>
                  <option value="ar">عربي</option>
                  <option value="ur">اردو</option>
                </select>
                <div className="flex items-center gap-5">
                  <div
                    className="relative hover:cursor-pointer"
                    onClick={() => {
                      handleNotificationClick();
                    }}
                  >
                    <svg
                      className="w-6 fill-Primarycolors"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.51416 16.0006L6.69416 14.8186C7.07216 14.4406 7.28016 13.9386 7.28016 13.4046V8.72756C7.28016 7.37056 7.87016 6.07356 8.90016 5.17156C9.93816 4.26156 11.2602 3.86156 12.6372 4.04256C14.9642 4.35156 16.7192 6.45556 16.7192 8.93756V13.4046C16.7192 13.9386 16.9272 14.4406 17.3042 14.8176L18.4852 16.0006H5.51416ZM13.9995 18.341C13.9995 19.24 13.0835 20 11.9995 20C10.9155 20 9.99951 19.24 9.99951 18.341V18H13.9995V18.341ZM20.5204 15.2088L18.7194 13.4048V8.93781C18.7194 5.45681 16.2174 2.49981 12.8994 2.06081C10.9774 1.80481 9.03736 2.39181 7.58236 3.66781C6.11836 4.94981 5.28036 6.79381 5.28036 8.72781L5.27936 13.4048L3.47836 15.2088C3.00936 15.6788 2.87036 16.3778 3.12436 16.9908C3.37936 17.6048 3.97236 18.0008 4.63636 18.0008H7.99936V18.3418C7.99936 20.3598 9.79336 22.0008 11.9994 22.0008C14.2054 22.0008 15.9994 20.3598 15.9994 18.3418V18.0008H19.3624C20.0264 18.0008 20.6184 17.6048 20.8724 16.9918C21.1274 16.3778 20.9894 15.6778 20.5204 15.2088V15.2088Z"
                      />
                    </svg>
                    <div className="absolute -top-3 -right-2 w-6 h-6 text-xs flex items-center justify-center p-1 text-white  bg-Primarycolors rounded-full border-2 border-white cursor-pointer">
                      <span>{notificationCount}</span>
                    </div>
                  </div>
                  <div
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-primarycolor p-1 hover:cursor-pointer"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
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
                        <img src={ProfilePic} alt="profileimage" />
                      </>
                    )}
                    {showProfileDropdown === true && (
                      <>
                        <div
                          ref={ref}
                          className="z-50 p-3 absolute ltr:right-0 rtl:left-0 border top-12 border-primarycolor rounded-xl bg-white shadow-lg text-primarycolor"
                        >
                          <ul className="cursor-pointer ">
                            <li
                              className="p-1.5 hover:text-secondaryOrange space-x-2 rtl:space-x-reverse flex items-center"
                              onClick={handleProfile}
                            >
                              <div className="w-5">
                                <i className="icon-manage-profile text-xl"></i>{" "}
                              </div>
                              <span className="text-base">
                                <FormattedMessage id="My_Profile" />
                              </span>
                            </li>
                            <li
                              className="p-1.5 hover:text-secondaryOrange space-x-2 rtl:space-x-reverse flex items-center"
                              onClick={handlePassword}
                            >
                              <div className="w-5">
                                <i className="icon-password text-xl"></i>{" "}
                              </div>
                              <span className="text-base">
                                <FormattedMessage id="Manage_Password" />
                              </span>
                            </li>
                            <li
                              className="p-1.5 hover:text-secondaryOrange space-x-2 rtl:space-x-reverse flex items-center"
                              onClick={handleLogout}
                            >
                              <div className="w-5">
                                <i className="icon-logout text-xl"></i>
                              </div>
                              <span className="text-base">
                                <FormattedMessage id="Logout" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {children}
          <Outlet />
        </div>
      </Suspense>
    </>
  );
};

export default AdminLayout;
