import { Button } from "components/button/Button";
import React, { useEffect } from "react";
import ReactDom from "react-dom";
import { FormattedMessage } from "react-intl";

interface PropsInterface {
  title?: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  shouldBgScroll?: boolean;
  isProcessing?: boolean;
  fullScreen?: boolean;
  dynamicContent?: React.ReactNode;
  onDeleteClick?: any;
  deleteId?: string;
  text?: React.ReactNode;
  btnText?: React.ReactNode;
  deleteLoader?: boolean;
}

export const DeleteModal = ({
  showModal,
  setShowModal,
  shouldBgScroll = false,
  isProcessing = false,
  fullScreen = false,
  dynamicContent = <></>,
  onDeleteClick,
  deleteId,
  text,
  btnText,
  deleteLoader,
}: PropsInterface) => {
  const rootElement = document.getElementById("root") as HTMLElement;
  const closeModal = () => {
    rootElement.style.overflow = "visible";
    setShowModal(false);
  };
  useEffect(() => {
    if (!shouldBgScroll && showModal) {
      rootElement.style.overflow = "hidden";
    } else if (!showModal) {
      closeModal();
    }
  }, [showModal]);

  if (!showModal) {
    return null;
  }
  return ReactDom.createPortal(
    <>
      <div className="justify-center items-center flex fixed inset-0  p-6 z-[999] w-full h-full top-0 left-0 bg-black/20 backdrop-blur-sm">
        <div
          className={`relative ${
            fullScreen ? "h-full w-full" : "w-full max-w-420px h-530px"
          } my-6 mx-auto rounded-xl overflow-hidden`}
        >
          <div className="bordborder-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white  outline-none focus:outline-none px-6 md:px-8 py-6">
            <div className="text-start  flex items-center justify-between ">
              <h3 className="text-18px text-black leading-6 font-bold font-poppins">
              {btnText ? (
                  <FormattedMessage id={`${btnText}`} />
                ) : (
                  <FormattedMessage id="Delete" />
                )}
              </h3>

              {!isProcessing && (
                <div className="flex items-center">
                  {dynamicContent}
                  <button
                    className=" w-26px h-26px rounded-86px"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-gray-900 text-22px  leading-6 font-normal">
                      ×
                    </span>
                  </button>
                </div>
              )}
            </div>
            <hr className="border-black/10 my-3" />
            <div className="text-center space-y-5 pt-4">
            <div className="w-16 h-16 flex items-center justify-center bg-primaryRed/10 rounded-full mx-auto">
              <i className="icon-trashed-alt text-2xl text-primaryRed"></i>
            </div>
            <p className="text-base text-center text-secodarycolor max-w-xs mx-auto">
              {text ? text : <FormattedMessage id="DeleteMsg" />}
              </p>
            </div>
            <div className="flex flex-row gap-2 p-3 pb-0 md:p-5 justify-center">
              <Button
                text={<FormattedMessage id="Cancel" />}
                type="button"
                onClick={() => setShowModal(false)}
                disable={deleteLoader}
                className="w-48 px-2 md:px-5 py-3 text-sm font-bold text-center   text-secondaryOrange border-2 border-secondaryOrange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
              ></Button>
                <Button
                  type="button"
                  loader={deleteLoader}
                  disable={deleteLoader}
                  text={
                    btnText ? (
                      <FormattedMessage id={`${btnText}`} />
                    ) : (
                      <FormattedMessage id="Delete" />
                    )
                  }
                  onClick={() => onDeleteClick(deleteId)}
                className="w-48 px-2 md:px-5 py-3 text-sm font-bold text-center text-primaryRed  border-2 border-primaryRed/10 bg-primaryRed/10 rounded-xl hover:text-white hover:bg-primaryRed focus:ring-0 focus:outline-0"
              ></Button>
      
              
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root") as HTMLElement
  );
};
