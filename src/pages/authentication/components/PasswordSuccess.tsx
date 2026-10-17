import { FormattedMessage } from "react-intl";
import VegitableBage from "../../../assets/images/vegitable-bage.jpg";

const PasswordSucess = () => {
  return (
    <div className="relative before:content-[''] before:bg-bg-Gradient before:bg-no-repeat before:bg-cover before:bg-left-top before:w-full before:h-full before:top-0 before:left-0 before:absolute before:-z-10 w-full">
      <div className="container mx-auto flex py-16 md:py-24 lg:py-36 mt-82px md:mt-85px xl:py-32 p-5">
        <div className="w-full  sm:w-3/4 mx-auto bg-white rounded-20px flex shadow-primary-shadow">
          <div className="w-1/2 xl:p-5 xxl:p-30px hidden xl:block h-full">
            <img
              src={VegitableBage}
              alt="vegitablebage"
              className="w-full h-full object-cover rounded-20px"
            />
          </div>
          <div className="w-full xl:w-1/2 p-5 sm:p-8  xl:p-5 xl:pl-3 xxl:p-30px ">
            <div className="w-full min-h-400px sm:min-h-360px xl:h-full  bg-white relative ">
              <h2 className="text-26px text-center font-bold text-darkgrey ">
                Well Done!
              </h2>
              <div className="w-20 rounded-full h-20 bg-primarycolor/10 flex items-center justify-center mx-auto mt-5">
                <svg
                  className="w-7 fill-primarycolor"
                  viewBox="0 0 26 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M24.7984 0.939338C25.3842 1.52512 25.3842 2.47487 24.7984 3.06066L10.3226 17.5365C10.0413 17.8178 9.65976 17.9759 9.26193 17.9759C8.8641 17.9759 8.48256 17.8178 8.20126 17.5365L0.939309 10.2741C0.353539 9.68831 0.353567 8.73856 0.939371 8.15279C1.52517 7.56702 2.47492 7.56705 3.06069 8.15285L9.26198 14.3545L22.6771 0.939342C23.2629 0.353554 24.2126 0.353553 24.7984 0.939338Z"
                  />
                </svg>
              </div>
              <p className="mt-5 text-black/50 text-base font-normal text-center">
                Please check the email address associated with Your Password has
                been successfully changed, please use your new password to log
                in
              </p>
              <div className="mt-5 xl:mt-8 xxl:mt-12 w-full">
                <button
                  type="submit"
                  className="w-full px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:bg-secondaryOrange hover:text-white focus:ring-0 focus:outline-0 uppercase"
                >
                  <FormattedMessage id="sign_in" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSucess;
