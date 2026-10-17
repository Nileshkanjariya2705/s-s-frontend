import { getAdminSettingData } from "../payment/services/adminPayment.services";
import { adminDataType } from "../dashboard/types/dashboard.type";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import ReplacementDays from "./components/ReplacementDays";
import RefundDays from "./components/RefundableDays";
import GlobalLoader from "components/globalLoader/GlobalLoader";
import OrdCommission from "./components/OrdCommission";
import BankCommission from "./components/BankCommission";
import VatPercentage from "./components/VatPercentage";

const AdminSettings = () => {
  const [adminData, setAdminData] = useState<adminDataType | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const adminSettingData = async () => {
    try {
      setLoading(true);
      const response = await getAdminSettingData();
      setAdminData(response?.data?.data);
      setLoading(false);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    adminSettingData();
  }, []);
  return (
    <>
      {loading ? (
        <GlobalLoader />
      ) : (
        <div>
          <div className="flex justify-between">
            <h2 className="text-xl md:text-2xl text-Primarycolors font-semibold">
              <FormattedMessage id="General_Settings" />
            </h2>
            {/* <div>
                <span className="text-sm md:text-xs font-semibold ">

              last updated at :{" "}
                </span>
              <span className="text-sm md:text-xs text-Primarycolors font-semibold">
                {moment(adminData?.created_at).format("DD-MM-YYYY, HH:mm")}
              </span>
            </div> */}
          </div>
          <div className="items-center">
            <div className="flex flex-wrap gap-y-3 my-5 border p-5 rounded-lg border-dashed border-primarycolor justify-between">
              <VatPercentage  vat_percentage= {adminData?.vat_percentage as number} />
              <ReplacementDays
                replacement_days={adminData?.replacement_days as number}
              />
              <RefundDays
                refundable_days={adminData?.refundable_days as number}
              />
            </div>
            <div className="flex flex-wrap gap-y-3 my-5 border p-5 rounded-lg border-dashed border-primarycolor">
              <OrdCommission
                default_ord_commission={
                  adminData?.default_ord_commission as number
                }
              />
              <div className="ml-14">
              <BankCommission
                default_bank_commission={
                  adminData?.default_bank_commission as number
                }
              />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSettings;
