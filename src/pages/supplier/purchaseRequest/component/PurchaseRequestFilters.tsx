import { SetStateAction } from "react";
import { selectedTabType } from "../types/purchaseRequest.type";
import { FormattedMessage } from "react-intl";

const PurchaseRequestFilters = ({
  tab,
  setTab,
  setSelectedTab,
}: {
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
  setSelectedTab: React.Dispatch<SetStateAction<selectedTabType>>;
}) => {
  const handleTabChange = (tab: number) => {
    if (tab === 0) {
      setTab(tab);
      setSelectedTab("OPEN");
    } else {
      setTab(tab);
      setSelectedTab("QUOTED");
    }
  };
  return (
    <ul className="flex items-center bg-primarycolor/10 p-1.5 rounded-xl">
      <li className="mx-1 cursor-pointer" onClick={() => handleTabChange(0)}>
        <span
          className={`text-sm font-normal px-3 md:px-7  ${
            tab === 0 ? "text-white bg-primarycolor" : "text-black"
          }  py-2 rounded-xl inline-block `}
        >
          <FormattedMessage id="Open" />
        </span>
      </li>
      <li className="mx-1 cursor-pointer" onClick={() => handleTabChange(1)}>
        <span
          className={`text-sm font-normal px-3 md:px-7  ${
            tab === 1 ? "text-white bg-primarycolor" : "text-black"
          }  py-2 rounded-xl inline-block`}
        >
          <FormattedMessage id="Quoted" />
        </span>
      </li>
    </ul>
  );
};

export default PurchaseRequestFilters;
