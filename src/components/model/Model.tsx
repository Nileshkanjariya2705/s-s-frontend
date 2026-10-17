import React, { useEffect } from "react"
import ReactDom from "react-dom"

interface PropsInterface {
    children?: React.ReactNode
    title: React.ReactNode
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    showModal: boolean
    shouldBgScroll?: boolean
    isProcessing?: boolean
    fullScreen?: boolean
    dynamicContent?: React.ReactNode
    width?: string
    height?: boolean
    closeButton?: boolean
}

export const Modal = ({
    children,
    title,
    showModal,
    setShowModal,
    shouldBgScroll = false,
    isProcessing = false,
    fullScreen = false,
    width,
    height,
    dynamicContent = <></>,
    closeButton = true,
}: PropsInterface) => {
    const rootElement = document.getElementById("root") as HTMLElement
    const closeModal = () => {
        rootElement.style.overflow = "visible"
        setShowModal(false)
    }
    useEffect(() => {
        if (!shouldBgScroll && showModal) {
            rootElement.style.overflow = "hidden"
        } else if (!showModal) {
            closeModal()
        }
    }, [showModal])

    if (!showModal) {
        return null
    }
    return ReactDom.createPortal(
        <>
            <div className='justify-center items-center flex fixed inset-0  p-6 z-[999] w-full h-full top-0 left-0 bg-black/20 backdrop-blur-sm'>
                <div
                    style={{ ...(width && { width }) }}
                    className={`${
                        width
                            ? `relative ${
                                  fullScreen
                                      ? "h-full w-full"
                                      : `${
                                            height &&
                                            `h-[600px] overflow-x-auto overflow-y-auto`
                                        }`
                              } my-6 mx-auto rounded-xl overflow-hidden`
                            : `relative ${
                                  fullScreen
                                      ? "h-full w-full overflow-x-auto"
                                      : `w-full max-w-700px  ${
                                            height &&
                                            `h-[600px] overflow-x-auto overflow-y-auto`
                                        }`
                              } my-6 mx-auto rounded-xl`
                    }`}
                >
                    <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white  outline-none focus:outline-none px-6 md:px-8 py-6'>
                        <div className='text-start  flex items-center justify-between '>
                            <h3 className='text-base md:text-lg text-black leading-6 font-bold font-poppins '>
                                {title}
                            </h3>

                            {!isProcessing && (
                                <div className='flex items-center'>
                                    {dynamicContent}
                                    {closeButton && (
                                        <button
                                            className='w-26px h-26px rounded-86px'
                                            onClick={() => setShowModal(false)}
                                        >
                                            <span className='text-gray-900 text-22px  leading-6 font-normal'>
                                                ×
                                            </span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <hr className='border-black/10 my-3' />
                        <div className='relative'>{children}</div>
                    </div>
                </div>
            </div>
        </>,
        document.getElementById("modal-root") as HTMLElement
    )
}
