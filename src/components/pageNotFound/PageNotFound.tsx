import GlobalLoader from "components/globalLoader/GlobalLoader";
import { RoleConstant } from "constant/common.constant";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "store";
import Tomatos from "../../assets/images/tomotatos.png";
import { FormattedMessage } from "react-intl";
export const PageNotFound = () => {
  const [loading] = useState(true);
  const [goToHome, setGoToHome] = useState(false);

  const { token, role } = useSelector((state: RootState) => ({
    token: state.token.token,
    role: state.account.role,
  }));

  if (!loading) {
    return <GlobalLoader />;
  }
  return (
    <div className="mt-10px">
      <div className="bg-page-not-found bg-no-repeat bg-cover bg-left-top py-36 px-5">
        <div className="container mx-auto">
          <h1 className="flex items-center justify-center text-120px md:text-200px leading-[1.2] font-bold gap-5 text-black">
            4
            <span className="animate-spin-slow">
              <img src={Tomatos} className="w-24 md:w-full" alt="Tomatos" />
            </span>
            4
          </h1>
          <h4 className="font-semibold text-3xl md:text-60px text-secodarycolor leading-[1.2] capitalize text-center">
            {<FormattedMessage id="Page_Not_Found" />}
          </h4>
          <p className="text-secodarycolor text-lg md:text-xl font-normal text-center mt-4 md:mt-7">
            {<FormattedMessage id="Not_Found" />}
          </p>
          <div className="flex gap-4 mt-8 md:mt-20 flex-wrap justify-center">
            <Link
              to={
                role === RoleConstant.superAdmin && token
                  ? `/admin/admin-dashboard`
                  : `/`
              }
              onClick={() => !goToHome && setGoToHome(true)}
              className="uppercase px-7 py-3 text-base font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
            >
              {<FormattedMessage id="BACK_TO_HOMEPAGE" />}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
