import { getGeneralReport } from "./services/dashboard.services";
import { useEffect, useState } from "react";
import MonthlySell from "./components/MonthlySell";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { BankTransferDetails } from "./components/BankTransferTable";
import { OrderDetails } from "./components/OrderTable";
import { GeneralReportItems } from "constant/common.constant";
import GlobalLoader from "components/globalLoader/GlobalLoader";

const AdminDashboard = () => {
  const [generalReport, setGeneralReport] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const getGeneralReportData = async () => {
    try {
      setLoading(true);
      const response = await getGeneralReport();
      if (response) {
        setGeneralReport(response);
      }
      setLoading(false);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getGeneralReportData();
  }, []);

  return (
    <>
      {loading ? (
        <>
             <GlobalLoader />
        </>
      ) : (
        <>
          <div className="relative">
            <div className="flex items-center ">
              <h2 className="text-xl md:text-2xl text-Primarycolors font-semibold">
                <FormattedMessage id="General_Report" />
              </h2>
            </div>

            {generalReport &&
            Array.isArray(generalReport) &&
            generalReport?.length > 0 ? (
              <>
                <div className="flex mt-6 -mx-3 flex-wrap gap-y-8">
                  {generalReport?.map((item) => {
                    return (
                      <div className="w-full md:w-1/3 xxl:w-1/6 px-2 md:px-3 ">
                        <div className="before:w-[90%] before:shadow-primary-shadows before:-z-10 before:mx-auto before:inset-x-0 before:bg-Primarycolors/10 before:rounded-lg before:-bottom-3 before:absolute before:h-full   relative  scale-100 hover:scale-105  transition-all duration-200  z-0">
                          <div className="bg-white rounded-2xl shadow-primary-shadows p-5  md:min-h-100px">
                            <div className="flex items-center justify-between">
                              {
                                <i
                                  className={`${
                                    item?.name ===
                                    GeneralReportItems.Total_Suppliers
                                      ? "icon-supplier"
                                      : `${
                                          item?.name ===
                                          GeneralReportItems.Total_Store_Owners
                                            ? "icon-store"
                                            : `${
                                                item?.name ===
                                                GeneralReportItems.Total_Products
                                                  ? "icon-product-alt"
                                                  : `${
                                                      item?.name ===
                                                      GeneralReportItems.Total_Categories
                                                        ? "icon-category"
                                                        : `${
                                                            item?.name ===
                                                            GeneralReportItems.Total_Transactions
                                                              ? "icon-payment"
                                                              : "icon-bank_transfer"
                                                          }`
                                                    }`
                                              }`
                                        }`
                                  } text-4xl text-primarycolor group-hover/hs:text-primarycolor`}
                                ></i>
                              }
                            </div>
                            <div
                              className="space-y-2"
                              onClick={() => navigate(`${item.redirect}`)}
                            >
                              <h4 className="text-xl md:text-2xl text-black font-semibold ">
                                {item?.count}
                              </h4>
                              <p className="text-black/50 text-sm md:text-sm xl:text-base font-medium">
                                {item.name.includes(" ") ? (
                                  <FormattedMessage
                                    id={item?.name.replace(/ /g, "_")}
                                  />
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>
          <div className="relative mt-10">
            <div className="mt-6 -mx-3 flex-wrap gap-y-6">
              <div className="px-3">
                <div className=" items-center">
                  <h2 className="text-xl md:text-2xl text-Primarycolors font-semibold">
                    <FormattedMessage id="Sales_Report" />
                  </h2>
                </div>
                <div className="relative mt-4 flex items-start flex-wrap gap-y-5">
                  <div className="w-full xxl:w-1/2 xxl:px-2">
                    <MonthlySell />
                  </div>
                  <div className="w-full xxl:w-1/2 xxl:px-2">
                    <BankTransferDetails />
                  </div>
                  <div className="w-full xxl:px-2">
                    <OrderDetails />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminDashboard;
