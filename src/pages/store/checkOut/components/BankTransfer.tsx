import { Button } from "components/button/Button";
import { Modal } from "components/model/Model";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PdfViewer from "./PdfViewer";
import {
  directBankTransfer,
  orderAddress,
  sendConfirmationMail,
  updateReceipt,
} from "../services/checkout.services";
import { useNavigate } from "react-router-dom";
import { ImageSize, responseType } from "constant/common.constant";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BankTransferSchema } from "../schema/bankTransfer.schema";
import { BankTransferType, address } from "../types/checkout.types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import QuotationPdfView from "pages/supplier/order/component/QuotationPdfView";

export const BankTransfer = ({
  purchaseReqId,
  orderData,
  showModal,
  supplier_info_uuid,
  setShowModal,
  storeId,
  buyNow,
  payableAmount,
  finalAmount,
  vatAmount,
  downloadQuotation,
  shipping_charges,
}: {
  amount?: number;
  purchaseReqId?: string;
  orderData?: any;
  showModal: boolean;
  supplier_info_uuid?: string;
  storeId?: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  buyNow?: string;
  payableAmount?: number;
  finalAmount?: number;
  vatAmount?: number;
  downloadQuotation?: boolean;
  shipping_charges?: number;
}) => {
  const [loader, setLoader] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const intl = useIntl();
  const [address, setAddress] = useState<address>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BankTransferType>({
    resolver: yupResolver(BankTransferSchema),
  });
  const getAddress = async () => {
    if (Array.isArray(orderData)) {
      if (orderData.length > 0) {
        const result: any = await orderAddress(orderData[0]?.order_id);
        const add = result?.data.data.address;
        setAddress(add);
      }
    } else {
      const result: any = await orderAddress(orderData);
      const add = result?.data.data.address;
      setAddress(add);
    }
  };
  const onSubmit = handleSubmit(async (values: BankTransferType) => {
    try {
      setLoader(true);

      if (purchaseReqId) {
        const valuesD = {
          purchaseReqId: purchaseReqId,
          amount: payableAmount,
          orderId: Array.isArray(orderData)
            ? orderData?.[0]?.order_id
            : orderData,
          supplier_info_uuid: supplier_info_uuid,
        };
        const formData: FormData = new FormData();
        formData.append("pdfFile", values?.bank_receipt?.[0] as string | Blob);
        formData.append("bank-transfer", JSON.stringify(valuesD));
        const response = await directBankTransfer(formData);
        if (response?.data?.responseType === responseType.Success) {
          setShowModal(false);
          if (buyNow === "BUY_NOW") {
            navigate(`/bank-transfer-order`);
            sendConfirmationMail(
              Array.isArray(orderData) ? orderData?.[0]?.order_id : orderData
            );
          } else {
            navigate(`/purchase-request/view/${purchaseReqId}`);
            sendConfirmationMail(
              Array.isArray(orderData) ? orderData?.[0]?.order_id : orderData
            );
          }
        }
      } else {
        const valuesD = {
          orderId: Array.isArray(orderData)
            ? orderData?.[0]?.order_id
            : orderData,
          store_info_uuid: storeId,
        };
        const formData: FormData = new FormData();

        formData.append("pdfFile", values?.bank_receipt?.[0] as string | Blob);
        formData.append("bank-transfer", JSON.stringify(valuesD));
        const response = await updateReceipt(formData);
        if (response?.data?.responseType === responseType.Success) {
          setShowModal(false);

          navigate(`/bank-transfer-order`);
        }
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  });

  const handleFileChange = (acceptedFiles: File[] | null | FileList) => {
    if (
      acceptedFiles &&
      acceptedFiles.length > 0 &&
      acceptedFiles[0].size <= ImageSize
    ) {
      setPdfFile(acceptedFiles[0]);
    } else {
      setPdfFile(null);
    }
  };

  useEffect(() => {
    if (showModal === false) {
      setPdfFile(null);
      reset();
    }
    getAddress();
  }, [showModal]);
  return (
    <Modal
      showModal={showModal}
      title={<FormattedMessage id="Bank_Transfer_Instruction" />}
      setShowModal={setShowModal}
      width="600px"
      height={true}
    >
      <div className="">
        <form onSubmit={onSubmit}>
          <ul className="text-base space-y-2">
            <li className="text-sm  text-black/80">
              <span className="mr-1">-</span>
              <FormattedMessage id="Transfer_Payment_Amount" />
            </li>
            <li className="text-sm text-black/80">
              <span className="mr-1">-</span>
              <FormattedMessage id="Order_Remain_Pending" />
            </li>
            <li className="text-sm  text-black/80">
              <span className="mr-1">-</span>
              <FormattedMessage id="Successful_Payment" />
            </li>
          </ul>
          <div className="mt-5 upload-transfer-receipt">
            <label className="text-sm font-medium text-black mb-3 inline-block">
              <>
                <FormattedMessage id="Upload_Transfer_Receipt" />
                <span className="text-red-600">*</span>
              </>
            </label>
            <div className="relative w-full">
              <input
                type="file"
                id="bank_receipt"
                accept=".pdf"
                className="bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-[11px] leading-6 px-4 pr-28 file-select"
                {...register("bank_receipt", {
                  required: true,
                  onChange: (e) => {
                    handleFileChange(e?.target?.files);
                  },
                })}
              />
            </div>
            <div>
              {Object.keys(errors).length > 0 ? (
                <small className="text-sm font-semibold text-red-500 block  mt-1">
                  {errors &&
                    errors["bank_receipt"] &&
                    intl.formatMessage({
                      id: errors?.bank_receipt?.message as string,
                    })}
                </small>
              ) : null}
            </div>
          </div>

          <div className="mt-5 lg:mt-8">
            <Button
              text={<FormattedMessage id="Save" />}
              type="submit"
              loader={loader}
              className="px-5 py-2.5 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0 mr-4"
            ></Button>
            {downloadQuotation && (
              <PDFDownloadLink
                document={
                  <QuotationPdfView
                    orderData={orderData}
                    total={
                      payableAmount && parseFloat(payableAmount?.toFixed(2))
                    }
                    subtotal={finalAmount}
                    vatAmount={vatAmount}
                    address={address}
                    shipping_charges={shipping_charges ? shipping_charges : 0}
                  />
                }
                fileName={`${
                  orderData[0]?.order_id && orderData[0]?.order_id.slice(0, 8)
                }-invoice`}
              >
                {({ loading }) => (
                  <Button
                    type="button"
                    className="relative px-2.5 py-1.5 border rounded-lg border-primarycolor text-primarycolor text-sm whitespace-nowrap"
                  >
                    {loading ? (
                      "Loading document..."
                    ) : (
                      <FormattedMessage id="Download_Quotation" />
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </form>
        <div className="mt-6 ">
          {pdfFile && <PdfViewer pdfFile={pdfFile} />}
        </div>
      </div>
    </Modal>
  );
};
