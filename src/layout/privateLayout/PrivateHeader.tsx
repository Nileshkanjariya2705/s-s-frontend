import SiteLogo from "../../assets/images/site-logo.svg";
import Notification from "../../assets/images/notification.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { setLanguage } from "reducers/language.reducer";
import { getNotificationCount } from "pages/notification/services/notification.service";
import useUserData from "hooks/getUserData";
import { FormattedMessage } from "react-intl";
import ProfilePic from "../../assets/images/profile.png";
import { REACT_APP_IMAGE_PATH } from "config";
import { setSidebarOpen } from "reducers/sidebar.reducer";
import useLocale from "hooks/useLocale";

const PrivateHeader = () => {
  const linksArray = [
    { text: <FormattedMessage id="Home" />, url: "/" },
    { text: <FormattedMessage id="About_Us" />, url: "/about-us" },
    { text: <FormattedMessage id="Blog" />, url: "/blog" },
    { text: <FormattedMessage id="Contact_Us" />, url: "/contact-us" },
  ];

  const location = useLocation();
  const { language } = useLocale();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.open);

  const [notificationCount, setNotificationCount] = useState<number>(0);

  const { socket } = useSelector((state: RootState) => ({
    socket: state.socket.socket,
  }));

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
    } catch (error) {}
  };

  useEffect(() => {
    getAllNotificationCount();
  }, []);

  const navigate = useNavigate();

  const url = new URL(window?.location.href);

  useEffect(() => {
    if (url.pathname === "/notification") {
      setTimeout(async () => {
        setNotificationCount(0);
      }, 2000);
    }
  }, [url.pathname, socket]);

  const handleNotificationClick = async () => {
    navigate("/notification");
    try {
      setTimeout(async () => {
        setNotificationCount(0);
      }, 2000);
    } catch (error) {
      return error;
    }
  };

  const dispatch = useDispatch<AppDispatch>();

  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage({ language: e.target.value }));
  };

  const toggleSidebar = () => {
    dispatch(setSidebarOpen(isSidebarOpen ? false : true));
  };
  return (
    <header className="bg-white z-[999] py-5 px-5 lg:px-12 fixed top-0 w-full shadow">
      <div className="container m-auto ">
        <nav>
          <div className="flex flex-wrap items-center  mx-auto">
            <div className="w-1/5 lg:w-1/5 xxl:w-1/3">
              <Link to={"/dashboard"} className="flex items-center">
                <img src={SiteLogo} className="" alt="sitelogo" />
              </Link>
            </div>
            <div className="w-4/5 lg:w-4/5 xxl:w-2/3 flex justify-end gap-x-0 xl:gap-x-8 items-center">
              <ul className="hidden xl:flex fixed shadow xl:shadow-none max-w-[320px] xl:max-w-none h-screen xl:h-full left-0  top-0 xl:top-0 z-[9999] space-y-4 xl:space-y-0 xl:relative  items-center flex-col p-5 xl:p-0 font-normal    md:flex-row xl:space-x-10 rtl:space-x-reverse md:mt-0  bg-white ">
                {linksArray &&
                  linksArray?.map((link) => {
                    return (
                      <>
                        <li>
                          <Link
                            to={`${link?.url}`}
                            className={`block text-black  rounded md:bg-transparent ${
                              location.pathname === `${link?.url}`
                                ? `md:text-primarycolor font-semibold`
                                : null
                            }`}
                            aria-current="page"
                          >
                            {link?.text}
                          </Link>
                        </li>
                      </>
                    );
                  })}
              </ul>
              <ul className="w-full xl:w-unset justify-end  z-[999] flex items-center  xl:p-0  font-normal   rounded-lg  gap-x-4 gap-y-0  xl:gap-x-10 ">
                <li>
                  <select
                    className="flex items-center focus:outline-0 justify-between w-full bg-white text-black font-semibold rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent "
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
                </li>
                <li
                  className="hover:cursor-pointer"
                  onClick={() => {
                    handleNotificationClick();
                  }}
                >
                  <div className="relative">
                    <img src={Notification} alt="notification" />
                    <div className="absolute bg-primarycolor border-2 border-white text-white font-semibold rounded-xl p-2 w-6 h-6 -top-3 -right-3 flex items-center justify-center text-xs cursor-pointer">
                      {notificationCount}
                    </div>
                  </div>
                </li>
                <li>
                  <div
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-primarycolor p-1 hover:cursor-pointer"
                    onClick={() => navigate("/manage-profile")}
                  >
                    {image ? (
                      <>
                        <img
                          src={`${REACT_APP_IMAGE_PATH}/${image}`}
                          alt="image"
                          className="rounded-full w-full h-full"
                          onClick={() => navigate("/manage-profile")}
                        />
                      </>
                    ) : (
                      <>
                        <img src={ProfilePic} alt="profileimage" />
                      </>
                    )}
                  </div>
                </li>
                <li className="xl:hidden" onClick={() => toggleSidebar()}>
                  <button
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-controls="navbar-multi-level"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 17 14"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 1h15M1 7h15M1 13h15"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default PrivateHeader;
