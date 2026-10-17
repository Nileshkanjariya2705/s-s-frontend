import React, { useEffect, useState } from "react";
import DateTimeDisplay from "./DateTimeDisplay";
import { TimerStateNumeric } from "pages/store/storeProduct/types/storeListing.types";
import { remainingDaysTime } from "helper/timezone.helper";
import { Button } from "components/button/Button";
import useUserData from "hooks/getUserData";
import { getPurchaseProductNow } from "pages/store/storeProduct/services/storeProductDetails.service";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

interface CountdownTimerProps {
  endDate: string;
  setShowPurchaseRequest?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowReviewModal?: React.Dispatch<React.SetStateAction<boolean>>;
  supplier_uuid?: string;
  price?: string;
  product_uuid?: string;
  quantity?: number;
  dashboard?: boolean;
  is_purchaseable?: boolean;
  supplier_product_uuid?: string;
}

const ExpiredNotice = () => {
  return (
    <div className="expired-notice">
      <div className="text-primaryRed bg-primaryRed/20 text-xs md:text-sm font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center ">
        {<FormattedMessage id="expired_req" />}
      </div>
    </div>
  );
};

const ShowCounter = ({
  days,
  hours,
  minutes,
  seconds,
  endDate,
  setShowPurchaseRequest,
  setShowReviewModal,
  supplier_uuid,
  price,
  product_uuid,
  quantity,
  dashboard,
  is_purchaseable,
  supplier_product_uuid,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  endDate: string;
  setShowPurchaseRequest?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowReviewModal?: React.Dispatch<React.SetStateAction<boolean>>;
  supplier_uuid?: string;
  price?: string;
  product_uuid?: string;
  quantity?: number;
  dashboard?: boolean;
  is_purchaseable?: boolean;
  supplier_product_uuid?: string;
}) => {
  const { uuid, user_entity_uuid, given_permissions } = useUserData();
  const navigate = useNavigate();
  const [buttonLoader, setButtonLoader] = useState(false);
  const [showQuanError, setShowQuanError] = useState(false);
  const filterViewPermission =
    given_permissions &&
    given_permissions.filter((data) => data?.granted === true);
  let QuotePemission: boolean | undefined;
  let buyPemission: boolean | undefined;
  if (QuotePemission === undefined || buyPemission === undefined) {
    buyPemission = filterViewPermission.find(
      (data) => data?.granted === true && data?.name === "Checkout Quote"
    )?.granted as boolean | undefined;
    QuotePemission = filterViewPermission.find(
      (data) =>
        data?.granted === true && data?.name === "Create Purchase Request"
    )?.granted as boolean | undefined;
  }

  useEffect(() => {
    if (quantity && quantity > 0) {
      setShowQuanError(false);
    }
  }, [quantity]);
  const getProductBuy = async () => {
    try {
      if (quantity === 0) {
        setShowQuanError(true);
      } else {
        setShowQuanError(false);
        setButtonLoader(true);

        const reponse = await getPurchaseProductNow({
          uuid,
          user_entity_uuid,
          supplier_uuid,
          price,
          endDate,
          product_uuid,
          quantity,
        });

        const purchaseReqId = reponse?.data?.data?.uuid;
        const supplier_info_uuid = reponse?.data?.data?.supplier_info_uuid;
        const encodedId1 = btoa(purchaseReqId);
        const encodedId2 = btoa(supplier_info_uuid);
        let encodedId3: string | undefined;
        if (supplier_product_uuid !== undefined) {
          encodedId3 = btoa(supplier_product_uuid);
        }

        const mergeId = `${encodedId1}|${encodedId2}|${encodedId3}`;
        if (
          reponse?.data?.responseType === "success" &&
          showQuanError === false
        ) {
          setButtonLoader(false);
          navigate(`/checkout-process/${mergeId}`);
        }
      }
    } catch (error) {
      setButtonLoader(false);
      return error;
    }
  };
  if (endDate) {
    return (
      <>
        <ul className="flex gap-8">
          <li
            className={`w-12 md:w-14 text-center space-y-2 relative rtl:first:before:content-[unset] before:content-[':']  before:absolute before:text-3xl before:top-2 before:-right-5 before:font-bold before:text-black `}
          >
            <div
              className={`h-12 md:h-14 rounded-lg ${
                dashboard ? "bg-white" : "bg-Lightgrey"
              }  flex items-center justify-center`}
            >
              <span className="text-base md:text-2xl font-semibold text-secodarycolor">
                <DateTimeDisplay
                  value={days}
                  type={"Days"}
                  isDanger={days <= 3}
                />
              </span>
            </div>
          </li>
          <li
            className={`w-12 md:w-14 text-center space-y-2 relative before:content-[':'] before:absolute before:text-3xl before:top-2 before:-right-5 before:font-bold before:text-black `}
          >
            <div
              className={`h-12 md:h-14 rounded-lg ${
                dashboard ? "bg-white" : "bg-Lightgrey"
              }  flex items-center justify-center`}
            >
              <span className="text-base md:text-2xl font-semibold text-secodarycolor">
                <DateTimeDisplay
                  value={hours}
                  type={"Hours"}
                  isDanger={false}
                />
              </span>
            </div>
          </li>
          <li
            className={`w-12 md:w-14 text-center space-y-2 relative before:content-[':'] before:absolute before:text-3xl before:top-2 before:-right-5 before:font-bold before:text-black `}
          >
            <div
              className={`h-12 md:h-14 rounded-lg ${
                dashboard ? "bg-white" : "bg-Lightgrey"
              }  flex items-center justify-center`}
            >
              <span className="text-base md:text-2xl font-semibold text-secodarycolor">
                <DateTimeDisplay
                  value={minutes}
                  type={"Mins"}
                  isDanger={false}
                />
              </span>
            </div>
          </li>
          <li
            className={`w-12 md:w-14 text-center space-y-2 relative rtl:last:before:content-[':'] last:before:content-none before:content-[':'] before:absolute before:text-3xl before:top-2 before:-right-5 before:font-bold before:text-black `}
          >
            <div
              className={`h-12 md:h-14 rounded-lg ${
                dashboard ? "bg-white" : "bg-Lightgrey"
              }  flex items-center justify-center`}
            >
              <span className="text-base md:text-2xl font-semibold text-secodarycolor">
                <DateTimeDisplay
                  value={seconds}
                  type={"Seconds"}
                  isDanger={false}
                />
              </span>
            </div>
          </li>
        </ul>
        <ul className="flex gap-8 mt-2">
          {["Days", "Hours", "Minutes", "Seconds"].map((item: string) => {
            return (
              <li
                key={item}
                className={`w-12 md:w-14 text-center space-y-2 relative before:absolute before:text-3xl before:top-2 before:-right-5 before:font-bold before:text-black `}
              >
                <p className="text-xs md:text-sm font-medium text-black/60">
                  {<FormattedMessage id={item} />}
                </p>
              </li>
            );
          })}
        </ul>

        {setShowPurchaseRequest && setShowReviewModal && (
          <div className="flex flex-row gap-2 mt-10">
            {QuotePemission === true && is_purchaseable && (
              <Button
                text={<FormattedMessage id="Purchase_Request" />}
                type="button"
                onClick={() => setShowPurchaseRequest(true)}
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm leading-5 font-medium transition-all duration-200 hover:bg-primarycolor hover:text-white  border border-primarycolor rounded-lg text-primarycolor"
              ></Button>
            )}
            {buyPemission === true && (
              <Button
                text={<FormattedMessage id="Buy_Now" />}
                type="button"
                loader={buttonLoader}
                onClick={getProductBuy}
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm leading-5 font-medium transition-all duration-200 hover:bg-secondaryOrange hover:text-white  border border-secondaryOrange rounded-lg text-secondaryOrange"
              ></Button>
            )}
          </div>
        )}
        <div>
          {showQuanError === true && (
            <div className="text-primaryRed mt-4">
              <FormattedMessage id="Quantity_Error_Message" />
            </div>
          )}
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  setShowPurchaseRequest,
  setShowReviewModal,
  supplier_uuid,
  price,
  product_uuid,
  quantity,
  dashboard,
  is_purchaseable,
  supplier_product_uuid,
}) => {
  const newRemainingTime: TimerStateNumeric | null | undefined =
    remainingDaysTime(endDate);
  const [remainingTimeForProduct, setRemainingTimeForProduct] = useState<
    TimerStateNumeric | undefined | null
  >(newRemainingTime);

  useEffect(() => {
    const timer = setInterval(() => {
      const newRemainingTime: TimerStateNumeric | null | undefined =
        remainingDaysTime(endDate);
      setRemainingTimeForProduct(newRemainingTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!remainingTimeForProduct) {
    return <ExpiredNotice />;
  }
  const { days, hours, minutes, seconds } = remainingTimeForProduct;
  return (
    <ShowCounter
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
      endDate={endDate}
      setShowPurchaseRequest={setShowPurchaseRequest}
      setShowReviewModal={setShowReviewModal}
      supplier_uuid={supplier_uuid}
      price={price}
      product_uuid={product_uuid}
      quantity={quantity}
      dashboard={dashboard}
      is_purchaseable={is_purchaseable}
      supplier_product_uuid={supplier_product_uuid}
    />
  );
};

export default CountdownTimer;
