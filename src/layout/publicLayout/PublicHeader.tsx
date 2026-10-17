import SiteLogo from "../../assets/images/site-logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { setLanguage } from "reducers/language.reducer";
import { RoleConstant } from "constant/common.constant";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import useLocale from "hooks/useLocale";

const PublicHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLocale();
  const dispatch = useDispatch<AppDispatch>();
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage({ language: e.target.value }));
  };

  const { token, role } = useSelector((state: RootState) => ({
    token: state.token.token,
    role: state.account.role,
  }));

  const linksArray = [
    { text: <FormattedMessage id="Home" />, url: "/" },
    { text: <FormattedMessage id="About_Us" />, url: "/about-us" },
    { text: <FormattedMessage id="Blog" />, url: "/blog" },
    { text: <FormattedMessage id="Contact_Us" />, url: "/contact-us" },
  ];
  const toggleSidebar = () => {
    setIsSideBarOpen(isSideBarOpen ? false : true);
  };
  return (
    <>
      <header className="bg-white z-[999] py-5 px-5 lg:px-12 fixed top-0 w-full shadow">
        <div className="container m-auto ">
          <nav>
            <div className="flex flex-wrap items-center  mx-auto">
              <div className="w-1/5 lg:w-1/5 xxl:w-1/3">
                <Link to={"/"} className="flex items-center">
                  <img src={SiteLogo} alt="sitelogo" />
                </Link>
              </div>
              <div className="w-4/5 lg:w-4/5 xxl:w-2/3 flex justify-end space-x-0 xl:space-x-8 items-center rtl:space-x-reverse">
                <ul
                  className={`block ${
                    isSideBarOpen
                      ? " translate-x-0 shadow-2xl full"
                      : "-translate-x-full"
                  }  xl:translate-x-0 transition-all ease-in-out duration-500 fixed shadow xl:shadow-none rtl:space-x-reverse w-72 md:w-80 xl:w-unset xl:max-w-none h-screen xl:h-full left-0  top-0 xl:top-0 z-[9999] space-y-3 xl:space-y-0 xl:relative xl:flex items-center flex-col pt-8 p-5 xl:p-0 font-normal    md:flex-row xl:space-x-10 md:mt-0  bg-white `}
                >
                  {linksArray &&
                    linksArray?.map((link) => {
                      return (
                        <>
                          <li
                            className="first:mt-7 xl:first:mt-0"
                            onClick={toggleSidebar}
                          >
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
                  {location.pathname !== "/admin" ? (
                    <>
                      {!token ? (
                        <>
                          <li
                            className="rtl:!ml-4 "
                            onClick={() => {
                              toggleSidebar();
                              navigate("/login");
                            }}
                          >
                            <button className="uppercase px-3 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white">
                              <FormattedMessage id="sign_in" />
                            </button>
                          </li>
                          <li
                            className="xl:!ml-4 rtl:!mr-0"
                            onClick={() => {
                              toggleSidebar();
                              navigate("/signup");
                            }}
                          >
                            <button className="uppercase px-3 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold text-primarycolor border-2 border-primarycolor rounded-xl hover:bg-primarycolor hover:text-white">
                              <FormattedMessage id="Sign_Up" />
                            </button>
                          </li>
                          <button
                            type="button"
                            className="absolute top-2 right-2 block xl:hidden"
                            onClick={() => toggleSidebar()}
                          >
                            <i className="icon-close font-medium text-xs text-black/75"></i>
                          </button>
                        </>
                      ) : (
                        <>
                          <li
                            onClick={() =>
                              role === RoleConstant.superAdmin
                                ? navigate("/admin/admin-dashboard")
                                : navigate("/dashboard")
                            }
                          >
                            <button className="px-3 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold text-primarycolor border-2 border-primarycolor rounded-xl hover:bg-primarycolor hover:text-white">
                              <FormattedMessage id="Dashboard" />
                            </button>
                          </li>
                        </>
                      )}
                    </>
                  ) : null}
                </ul>

                <ul className="w-full xl:w-unset justify-end  z-[999] flex items-center  xl:p-0  font-normal   rounded-lg  space-x-2 space-y-0  xl:space-x-4 rtl:space-x-reverse">
                  <li>
                    <select
                      className="flex items-center focus:outline-0 text-xs md:text-sm justify-between w-full bg-white text-black font-semibold rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent "
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
                  <li className="xl:hidden" onClick={() => toggleSidebar()}>
                    <button
                      type="button"
                      className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      aria-controls="navbar-multi-level"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Open main menu</span>
                      <svg
                        className="w-5 h-5 fill-darkgrey"
                        viewBox="0 0 59 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0 4.93316C0 2.67033 1.83439 0.835938 4.09722 0.835938H54.9028C57.1656 0.835938 59 2.67033 59 4.93316C59 7.19599 57.1656 9.03038 54.9028 9.03038H4.09722C1.83439 9.03038 0 7.19599 0 4.93316ZM0 25.4193C0 23.1564 1.83439 21.322 4.09722 21.322H54.9028C57.1656 21.322 59 23.1564 59 25.4193C59 27.6821 57.1656 29.5165 54.9028 29.5165H4.09722C1.83439 29.5165 0 27.6821 0 25.4193ZM32.7778 41.8082C30.5149 41.8082 28.6806 43.6426 28.6806 45.9054C28.6806 48.1682 30.5149 50.0026 32.7778 50.0026H54.9028C57.1656 50.0026 59 48.1682 59 45.9054C59 43.6426 57.1656 41.8082 54.9028 41.8082H32.7778Z"
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
    </>
  );
};

export default PublicHeader;
