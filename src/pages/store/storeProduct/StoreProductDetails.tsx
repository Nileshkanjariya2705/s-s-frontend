import Instagram from "../../../assets/images/instagram_s.svg"

import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { showToast } from "helper/toast.helper"
import { REACT_APP_IMAGE_PATH } from "config"
import { useSelector } from "react-redux"
import { RootState } from "store"
import GlobalLoader from "components/globalLoader/GlobalLoader"
import {
    Language,
    ProductDetailType,
    productRatingType,
    PurchaseRequest,
    RatingTypes,
} from "./types/storeListing.types"
import { remainingTime } from "helper/timezone.helper"

import { PageNotFound } from "components/pageNotFound/PageNotFound"

import {
    addReviewsRatings,
    createPurchseRequest,
    getStoreProductDetail,
} from "./services/storeProductDetails.service"
import { Button } from "components/button/Button"
import { Modal } from "components/model/Model"
import Input from "components/input/Input"
import { useForm } from "react-hook-form"
import TextArea from "components/textArea/Textarea"
import { yupResolver } from "@hookform/resolvers/yup"
import DatePicker from "components/datePicker/DatePicker"
import CountdownTimer from "components/countDown/CountdownTimer"
import { purchaseRequestSchema } from "./schema/purchaseRequest.schema"
import { FormattedMessage, useIntl } from "react-intl"
import { responseType, toastType } from "constant/common.constant"
import { ReviewSchema } from "../checkOut/schema/reviewsAndRating.schema"
import { Reviews } from "../checkOut/types/checkout.types"
import useLocale from "hooks/useLocale"

const StoreProductDetails = () => {
    const { language } = useLocale();
    const [isLoading, setIsLoading] = useState(true)

    const { mergeId } = useParams()
    const [encodedId1, encodedId2, encodedId3]: any = mergeId?.split("|")

    const prodId = encodedId1 && atob(encodedId1)
    const suppId = encodedId2 && atob(encodedId2)
    const supplierProdId = encodedId3 && atob(encodedId3)

    const [productDetails, setProductDetails] = useState<ProductDetailType>()
    const [ratings, showRatings] = useState<RatingTypes>()
    const [showPurchaseRequest, setShowPurchaseRequest] =
        useState<boolean>(false)
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false)
    const [ratingCount, setRatingCount] = useState(0)

    const [buttonLoader, setButtonLoader] = useState<boolean>(false)
    const [imageValue, setImageValue] = useState<string>()
    const [activeTab, setActiveTab] = useState<String>("Description")
    const [otherSupplierOffer, setOtherSupplierOffer] = useState([])
    const [editReview, setEditReview] = useState(false)
    const [currentProductRating, setCurrentProductRating] = useState<
        productRatingType[]
    >([])
    const [otherProductRating, setOtherProductRating] = useState<
        productRatingType[]
    >([])

    const { uuid, user_entity_uuid } = useSelector(
        (state: RootState) => ({
            uuid: state.account.uuid,
            user_entity_uuid: state.account.user_entity_uuid,
        })
    )
    const getProductDetail = async () => {
        try {
            const response = await getStoreProductDetail({
                supplierId: suppId,
                productId: prodId,
                storeId: user_entity_uuid,
                supplierProdId: supplierProdId,
            })

            setOtherSupplierOffer(response?.data?.data?.otherSimilarProducts)
            setProductDetails(response?.data?.data?.supplierProducts)

            const items = []
            for (
                let i = 0;
                i <
                Number(
                    response.data?.data?.ratingOfCurrentProduct[0].averageRating
                );
                i++
            ) {
                items.push(i + 1)
            }

            setCurrentProductRating(response.data?.data?.ratingOfCurrentProduct)
            setOtherProductRating(response.data?.data.ratingOfOtherProduct)
            showRatings({
                items,
                review:
                    response.data?.data?.ratings &&
                    response.data?.data?.ratings.reviews,
            })

            setRatingCount(
                response.data?.data?.ratings
                    ? response.data?.data?.ratings?.rating
                    : 0
            )
            ReviewSetValue("reviews", response.data?.data?.ratings?.reviews)
            if (response?.data?.data?.ratings !== null) {
                setEditReview(true)
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        getProductDetail()
    }, [mergeId])

    const handleActiveTab = (tab: string) => {
        setActiveTab(tab)
    }
    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        setError,
        getValues,
    } = useForm<PurchaseRequest>({
        resolver: yupResolver(purchaseRequestSchema),
    })
    const formValues = watch()
    const [quantity, setQuantity] = useState<number>(1)
    const intl = useIntl()
    const navigate = useNavigate()

    const handleDecQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const handleIncQuantity = () => {
        if (productDetails && quantity < productDetails?.units) {
            setQuantity(quantity + 1)
        }
    }

    useEffect(() => {
        if (
            parseFloat(productDetails?.base_price as string) >
            parseFloat(getValues(`requested_price`) as string)
        ) {
            setError("requested_price", {
                type: "manual",
                message: `This Product base price ${productDetails?.base_price}`,
            })
        } 
    }, [formValues?.requested_price])

    const onSubmit = async (values: PurchaseRequest) => {
            setButtonLoader(true)
            const data = {
                quotes_accepted_upto: values?.request_expiry,
                requested_price: values?.requested_price,
                quantity: values?.quantity,
                description: values?.description,
                requester_uuid: uuid,
                product_uuid: productDetails?.product_uuid,
                store_info_uuid: user_entity_uuid,
                supplier_uuid: productDetails?.supplier_uuid,
                category_uuid: productDetails?.product.category_uuid,
            }
            const response = await createPurchseRequest(data)
            if (response?.data?.responseType === "success") {
                setButtonLoader(false)
                showToast(response?.data?.message, "success", intl)
                reset()
                setShowPurchaseRequest(false)
            } else {
                setButtonLoader(false)
                reset()
                showToast(response?.data?.message, "error", intl)
        }
    }
    useEffect(() => {
        if (formValues.requested_price && formValues.quantity) {
            const quantity = Number(formValues.quantity) || 0
            const price = Number(formValues.requested_price) || 0
            const subTotal = (quantity * price).toFixed(2)
            if (quantity >= 0.0 && price >= 0.0) {
                setValue("sub_total", subTotal)
            } else {
                setValue("sub_total", "0.00")
            }
        }
    }, [formValues.requested_price, formValues.quantity])

    const handleCancel = () => {
        setShowPurchaseRequest(false)
        reset()
    }

    useEffect(() => {
        if (!showPurchaseRequest) {
            reset()
        }
    }, [showPurchaseRequest])

    const {
        handleSubmit: ReviewSubmit,
        register: ReviewRegister,
        setValue: ReviewSetValue,
    } = useForm<Reviews>({
        resolver: yupResolver(ReviewSchema),
    })

    const handleReviewAndRating = async (values: {
        reviews: string | undefined
    }) => {
        try {
            setButtonLoader(true)
            const response = await addReviewsRatings({
                product_uuid: productDetails?.product_uuid,
                review_by: uuid,
                store_info_uuid: user_entity_uuid,
                supplier_info_uuid: productDetails?.supplier_info_uuid,
                reviews: values.reviews,
                rating: ratingCount,
            })
            if (response) {
                if (response?.data.responseType === responseType.Success) {
                    showToast(response?.data.message, toastType.Success, intl)
                    getProductDetail()
                    setButtonLoader(false)
                    setShowReviewModal(false)
                } else {
                    showToast(response?.data.message, toastType.Error, intl)
                    setButtonLoader(false)
                    setShowReviewModal(false)
                }
            }
        } catch (error) {
            setShowReviewModal(false)
            setButtonLoader(false)
        }
    }

    const handleStarClick = (index: number) => {
        setRatingCount(index + 1)
    }

    const avgeRating =
        currentProductRating &&
        currentProductRating.find((rating: productRatingType) => {
            return (
                rating.product_uuid === productDetails?.product?.uuid &&
                rating.supplier_info_uuid === productDetails?.supplier_info_uuid
            )
        })

    const filledStars = avgeRating
        ? Math.round(Number(avgeRating.averageRating))
        : 0

    return (
        <>
            {isLoading ? (
                <GlobalLoader />
            ) : (
                <>
                    {productDetails && productDetails !== undefined ? (
                        <div className='relative'>
                            <div className='w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center mt-2'>
                                <i
                                    className='icon-left_arrow text-24px text-primarycolor cursor-pointer'
                                    onClick={() => navigate("/product/listing")}
                                ></i>
                            </div>
                            <div className='flex xl:px-10 mt-3 flex-wrap'>
                                <div className='w-full lg:w-1/2 md:px-5 xl:px-10'>
                                    <div className='xl:max-w-[620px] md:h-680px xl:h-572px bg-slate-50 p-2'>
                                        <img
                                            src={
                                                !!imageValue
                                                    ? imageValue
                                                    : `${REACT_APP_IMAGE_PATH}/${productDetails?.product?.featured_image}`
                                            }
                                            className='w-full h-full object-cover'
                                            alt='product_detail'
                                        />
                                    </div>

                                    <ul className='flex items-center flex-wrap gap-2.5 mt-3'>
                                        <>
                                            {Array.isArray(
                                                JSON.parse(
                                                    productDetails?.product
                                                        ?.images
                                                )
                                            ) &&
                                                JSON.parse(
                                                    productDetails?.product
                                                        ?.images
                                                ).length > 0 &&
                                                JSON.parse(
                                                    productDetails?.product
                                                        ?.images
                                                ).map((images: string) => {
                                                    return (
                                                        <>
                                                            <li
                                                                className='w-80px h-80px hover:cursor-pointer bg-slate-100 p-2'
                                                                onClick={() => {
                                                                    setImageValue(
                                                                        `${REACT_APP_IMAGE_PATH}/${images}`
                                                                    )
                                                                }}
                                                            >
                                                                <img
                                                                    src={`${REACT_APP_IMAGE_PATH}/${images}`}
                                                                    className='w-full h-[70px] object-contain'
                                                                    alt='product_detail'
                                                                />
                                                            </li>
                                                        </>
                                                    )
                                                })}
                                        </>
                                    </ul>
                                </div>
                                <div className='w-full lg:w-1/2 md:px-5 xl:px-10'>
                                    <h2 className=' text-3xl font-semibold text-secodarycolor'>
                                        {productDetails &&
                                            `${
                                                productDetails?.product?.[
                                                    `name_${
                                                        language as Language
                                                    }`
                                                ]
                                            }`}
                                    </h2>
                                    <p className='text-base text-black/60 mt-2'>
                                        {productDetails?.units}{" "}
                                        {language === "en"
                                            ? productDetails?.product
                                                  ?.measurement?.unit_short_name
                                            : language === "ar"
                                            ? productDetails?.product
                                                  ?.measurement
                                                  ?.unit_short_name_ar
                                            : productDetails?.product
                                                  ?.measurement
                                                  ?.unit_short_name_ur}
                                    </p>
                                    <div className='flex items-center gap-3 mt-3'>
                                        <ul className='flex gap-1'>
                                            <div className='flex my-2'>
                                                {Array.from(
                                                    { length: filledStars },
                                                    (_, index) => (
                                                        <i
                                                            key={index}
                                                            className='icon-star-fill text-base text-PrimaryYellow'
                                                        ></i>
                                                    )
                                                )}

                                                {Array.from(
                                                    { length: 5 - filledStars },
                                                    (_, index) => (
                                                        <i
                                                            key={
                                                                index +
                                                                filledStars
                                                            }
                                                            className='icon-star-outline text-base text-PrimaryYellow'
                                                        ></i>
                                                    )
                                                )}
                                            </div>
                                        </ul>
                                        {remainingTime(
                                            productDetails?.end_date
                                        ) !== "End date has passed" && (
                                            <Button
                                                text={
                                                    <FormattedMessage id='Review' />
                                                }
                                                type='button'
                                                onClick={() =>
                                                    setShowReviewModal(true)
                                                }
                                                // className="mt-5 ml-5 flex text-sm text-center rounded-xl items-center border border-primarycolor w-15 text-primarycolor hover:bg-primarycolor hover:text-white"
                                                className='px-3 py-1 text-sm leading-5 items-center justify-center hover:bg-primarycolor hover:text-white  border border-primarycolor rounded-lg text-primarycolor'
                                            ></Button>
                                        )}
                                    </div>

                                    <hr className='border-black/10 my-5' />
                                    <p className='text-base text-black/60'>
                                        {productDetails &&
                                            `${
                                                productDetails?.product?.[
                                                    `overview_${
                                                        language as Language
                                                    }`
                                                ]
                                            }`}
                                    </p>
                                    <div className='block py-8'>
                                        <p className='text-primarycolor text-xl md:text-3xl font-bold flex pr-2 gap-2 items-baseline'>
                                            {productDetails?.price}
                                            <span className='text-black/60 text-base font-normal'>
                                                SAR
                                            </span>
                                        </p>
                                        <div className='flex items-center'>
                                            <p className='text-m text-black/80'>
                                                Extra Charges :
                                            </p>
                                            <p className='text-l  flex  gap-2 px-2 items-baseline font-normal'>
                                                {productDetails?.charges}
                                                <span className='text-black/60 text-base font-medium'>
                                                    SAR
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className=' inline-flex gap-5 items-center border border-black/10 p-1 rounded-full'>
                                            <span
                                                className='text-secondaryGreen  text-2xl flex items-center justify-center font-medium w-10 h-10 bg-black/10 rounded-full cursor-pointer'
                                                onClick={handleDecQuantity}
                                            >
                                                -
                                            </span>
                                            <input
                                                type='text'
                                                style={{
                                                    width: `${
                                                        (quantity.toString()
                                                            .length +
                                                            1) *
                                                        10
                                                    }px`,
                                                }}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    const inputValue =
                                                        e.target.value

                                                    if (inputValue === "") {
                                                        setQuantity(0)
                                                    } else if (
                                                        !isNaN(
                                                            parseInt(inputValue)
                                                        )
                                                    ) {
                                                        setQuantity(
                                                            parseInt(
                                                                inputValue
                                                            ) || 0
                                                        )
                                                    }
                                                }}
                                                value={quantity}
                                                className='focus:outline-none text-center '
                                            />
                                            <span
                                                className='text-secondaryGreen  text-2xl flex items-center justify-center font-medium w-10 h-10 bg-black/10 rounded-full cursor-pointer'
                                                onClick={handleIncQuantity}
                                            >
                                                +
                                            </span>
                                        </div>
                                    </div>

                                    <div className='mt-4'>
                                        {!isLoading &&
                                            !!productDetails?.end_date && (
                                                <CountdownTimer
                                                    endDate={
                                                        productDetails?.end_date
                                                    }
                                                    setShowPurchaseRequest={
                                                        setShowPurchaseRequest
                                                    }
                                                    setShowReviewModal={
                                                        setShowReviewModal
                                                    }
                                                    supplier_uuid={
                                                        productDetails?.supplier_uuid
                                                    }
                                                    price={
                                                        productDetails?.price
                                                    }
                                                    product_uuid={
                                                        productDetails?.product_uuid
                                                    }
                                                    quantity={quantity}
                                                    is_purchaseable={
                                                        productDetails?.is_purchaseable
                                                    }
                                                    supplier_product_uuid={
                                                        productDetails?.uuid
                                                    }
                                                />
                                            )}
                                    </div>
                                    {showReviewModal && (
                                        <Modal
                                            showModal={showReviewModal}
                                            title={
                                                editReview === true ? (
                                                    <FormattedMessage id='Edit_Review_And_Rating' />
                                                ) : (
                                                    <FormattedMessage id='Add_Review_And_Rating' />
                                                )
                                            }
                                            setShowModal={setShowReviewModal}
                                        >
                                            <form
                                                onSubmit={ReviewSubmit(
                                                    handleReviewAndRating
                                                )}
                                            >
                                                <div className='m-2'>
                                                    <div className='flex gap-3 md:gap-5  justify-center'>
                                                        {[1, 2, 3, 4, 5].map(
                                                            (_item, index) => {
                                                                return (
                                                                    <i
                                                                        onClick={() =>
                                                                            handleStarClick(
                                                                                index
                                                                            )
                                                                        }
                                                                        className={`${
                                                                            index <
                                                                            ratingCount
                                                                                ? "icon-star-fill hover:cursor-pointer"
                                                                                : "icon-star-outline hover:cursor-pointer"
                                                                        } text-3xl md:text-4xl text-PrimaryYellow`}
                                                                    ></i>
                                                                )
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='mt-8'>
                                                    <TextArea
                                                        id='reviews'
                                                        label={
                                                            <FormattedMessage id='Reviews' />
                                                        }
                                                        name='reviews'
                                                        register={
                                                            ReviewRegister
                                                        }
                                                        type='textarea'
                                                        parentClass='mb-30px last:mb-0'
                                                        errors={errors}
                                                    />
                                                </div>
                                                <div className='mt-8 flex justify-center gap-4'>
                                                    <Button
                                                        text={
                                                            editReview ===
                                                            true ? (
                                                                <FormattedMessage id='Save' />
                                                            ) : (
                                                                <FormattedMessage id='Submit' />
                                                            )
                                                        }
                                                        type='submit'
                                                        disable={buttonLoader}
                                                        loader={buttonLoader}
                                                        className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                                    ></Button>
                                                </div>
                                            </form>
                                        </Modal>
                                    )}
                                    {showPurchaseRequest && (
                                        <Modal
                                            showModal={showPurchaseRequest}
                                            title='Purchase Request'
                                            setShowModal={
                                                setShowPurchaseRequest
                                            }
                                            width='1165px'
                                        >
                                            <div className='flex flex-wrap  py-2 md:-mx-3 space-y-5 lg:space-y-0 overflow-y-auto max-h-480px md:max-h-680px'>
                                                <div className='w-full lg:w-1/3 md:h-436px lg:h-466px lg:px-3  overflow-hidden'>
                                                    <div className='bg-slate-50 p-2 w-full h-full rounded-xl'>
                                                        <img
                                                            src={`${REACT_APP_IMAGE_PATH}/${productDetails?.product?.featured_image}`}
                                                            className='w-full h-full object-contain rounded-xl'
                                                            alt='product_detail'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='w-full lg:w-2/3 lg:px-3'>
                                                    <div className='px-2 mb-2 md:mb-4'>
                                                        <h3 className='w-full text-xl lg:text-2xl font-semibold'>
                                                            {
                                                                productDetails
                                                                    ?.product?.[
                                                                    `name_${
                                                                        language as Language
                                                                    }`
                                                                ]
                                                            }
                                                        </h3>
                                                    </div>
                                                    <form
                                                        onSubmit={handleSubmit(
                                                            onSubmit
                                                        )}
                                                    >
                                                        <div className='flex flex-wrap gap-y-3'>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <Input
                                                                    id='quantity'
                                                                    type='text'
                                                                    label={
                                                                        <FormattedMessage id='Quantity_Needed' />
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    value={
                                                                        quantity ??
                                                                        quantity
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Enter_quantity",
                                                                        }
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <Input
                                                                    id='requested_price'
                                                                    type='text'
                                                                    label={
                                                                        <FormattedMessage id='Request_Price' />
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Enter_requested_price",
                                                                        }
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <Input
                                                                    id='sub_total'
                                                                    type='text'
                                                                    label={
                                                                        <FormattedMessage id='Subtotal_Price' />
                                                                    }
                                                                    readonly={
                                                                        true
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    required={
                                                                        true
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                />
                                                            </div>
                                                            <div className='relative w-full md:w-1/2 px-2'>
                                                                <DatePicker
                                                                    label={
                                                                        <FormattedMessage id='Quotes_Accepted_Upto' />
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    required={true}
                                                                    id='request_expiry'
                                                                    name='request_expiry'
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Enter_date",
                                                                        }
                                                                    )}
                                                                    control={
                                                                        control
                                                                    }
                                                                />
                                                            </div>
                                                            <div className='relative w-full px-2'>
                                                                <TextArea
                                                                    id='description'
                                                                    label={
                                                                        <FormattedMessage id='Description' />
                                                                    }
                                                                    name='description'
                                                                    required={true}
                                                                    register={
                                                                        register
                                                                    }
                                                                    type='textarea'
                                                                    parentClass='mb-30px last:mb-0'
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    placeholder={intl.formatMessage(
                                                                        {
                                                                            id: "Enter_description",
                                                                        }
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='flex flex-row gap-3 md:gap-4 mt-3 px-2 flex-wrap'>
                                                                <Button
                                                                    text={
                                                                        <FormattedMessage id='Send_Request' />
                                                                    }
                                                                    type='submit'
                                                                    loader={
                                                                        buttonLoader
                                                                    }
                                                                    className='md:w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                                                                ></Button>
                                                                <Button
                                                                    text={
                                                                        <FormattedMessage id='Cancel' />
                                                                    }
                                                                    type='button'
                                                                    onClick={
                                                                        handleCancel
                                                                    }
                                                                    disable={
                                                                        buttonLoader
                                                                    }
                                                                    className='md:w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                                                                ></Button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </Modal>
                                    )}
                                    <hr className='border-black/10 my-10' />
                                    <div className='flex gap-3 items-center flex-wrap'>
                                        <p className='text-base text-black'>
                                            {
                                                <FormattedMessage id='Share_this_product' />
                                            }
                                            :
                                        </p>
                                        <ul className='flex gap-3'>
                                            <button className='w-10 h-10 rounded-full bg-PrimaryFacebook/10 flex items-center justify-center'>
                                                <i className='icon-facebook text-lg text-PrimaryFacebook '></i>
                                            </button>
                                            <button className='w-10 h-10 rounded-full bg-PrimaryLinkdin/10 flex items-center justify-center'>
                                                <i className='icon-linkdin text-lg text-PrimaryLinkdin '></i>
                                            </button>
                                            <button className='w-10 h-10 rounded-full bg-PrimaryTwitter/10 flex items-center justify-center'>
                                                <i className='icon-twitter text-lg text-PrimaryTwitter '></i>
                                            </button>
                                            <button className='w-10 h-10 rounded-full bg-PrimaryInstagram/10 flex items-center justify-center'>
                                                <img
                                                    src={Instagram}
                                                    alt='Instagram'
                                                />
                                            </button>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='relative md:px-5 xl:px-20 my-12 space-y-8'>
                                <ul className='flex md:border-b border-black/10 flex-wrap gap-y-3 md:gap-6'>
                                    <li className='w-full md:w-unset border-b border-black/10 md:border-b-0'>
                                        <button
                                            onClick={() =>
                                                handleActiveTab("Description")
                                            }
                                            className={`text-xl border-b-4  text-primarycolor pb-3 ${
                                                activeTab === "Description"
                                                    ? `border-primarycolor font-semibold`
                                                    : ` text-sm md:text-base lg:text-xl text-secodarycolor border-white font-medium`
                                            } `}
                                        >
                                            {
                                                <FormattedMessage id='Description' />
                                            }
                                        </button>
                                    </li>
                                    <li className='w-full md:w-unset border-b border-black/10 md:border-b-0'>
                                        <button
                                            onClick={() =>
                                                handleActiveTab(
                                                    "Specifications"
                                                )
                                            }
                                            className={`text-xl  border-b-4  text-primarycolor pb-3 ${
                                                activeTab === "Specifications"
                                                    ? `border-primarycolor font-semibold`
                                                    : `text-sm md:text-base lg:text-xl text-secodarycolor border-white font-medium`
                                            } `}
                                        >
                                            {
                                                <FormattedMessage id='Specification' />
                                            }
                                        </button>
                                    </li>
                                    {ratings?.review !== "" && (
                                        <li className='w-full md:w-unset border-b border-black/10 md:border-b-0'>
                                            <button
                                                onClick={() =>
                                                    handleActiveTab("Reviews")
                                                }
                                                className={`text-xl  border-b-4  text-primarycolor pb-3 ${
                                                    activeTab === "Reviews"
                                                        ? `border-primarycolor font-semibold`
                                                        : `text-sm md:text-base lg:text-xl text-secodarycolor border-white font-medium`
                                                } `}
                                            >
                                                {
                                                    <FormattedMessage id='Reviews' />
                                                }
                                            </button>
                                        </li>
                                    )}
                                </ul>
                                <p className='relative text-black/60 text-base'>
                                    {activeTab === "Description" ? (
                                        <>
                                            {productDetails &&
                                                `${
                                                    productDetails?.product?.[
                                                        `overview_${
                                                            language as Language
                                                        }`
                                                    ]
                                                }`}
                                        </>
                                    ) : activeTab === "Specifications" ? (
                                        <>
                                            {productDetails &&
                                                `${
                                                    productDetails?.product?.[
                                                        `specification_${
                                                            language as Language
                                                        }`
                                                    ]
                                                }`}
                                        </>
                                    ) : activeTab === "Reviews" ? (
                                        <>{ratings?.review}</>
                                    ) : null}
                                </p>
                            </div>

                            {otherSupplierOffer &&
                                Array.isArray(otherSupplierOffer) &&
                                otherSupplierOffer.length > 0 && (
                                    <>
                                        <div className='relative my-11'>
                                            <h2 className='text-secodarycolor text-xl md:text-3xl font-bold capitalize text-center'>
                                                {
                                                    <FormattedMessage id='other_offer' />
                                                }
                                            </h2>
                                        </div>

                                        <div className='flex flex-wrap gap-y-4 -mx-3'>
                                            <>
                                                {otherSupplierOffer.map(
                                                    (productItem: {
                                                        price: string
                                                        unit_short_name: string
                                                        units: string
                                                        end_date: string
                                                        uuid: string
                                                        product:
                                                            | {
                                                                  [
                                                                      key: string
                                                                  ]:
                                                                      | string
                                                                      | undefined
                                                              }
                                                            | any
                                                        supplier_info_uuid: string
                                                        supplier_uuid: string
                                                    }) => {
                                                        const ratings =
                                                            otherProductRating &&
                                                            otherProductRating.find(
                                                                (
                                                                    rating: productRatingType
                                                                ) => {
                                                                    return (
                                                                        rating.product_uuid ===
                                                                            productItem
                                                                                .product
                                                                                .uuid &&
                                                                        rating.supplier_info_uuid ===
                                                                            productItem.supplier_info_uuid
                                                                    )
                                                                }
                                                            )
                                                        let prodId =
                                                            productItem?.product
                                                                .uuid
                                                        let suppId =
                                                            productItem?.supplier_uuid
                                                        let supplierProdId =
                                                            productItem?.uuid
                                                        const encodedId1 = btoa(
                                                            prodId as string
                                                        )
                                                        const encodedId2 =
                                                            btoa(suppId)
                                                        const encodedId3 =
                                                            btoa(supplierProdId)

                                                        const mergeId = `${encodedId1}|${encodedId2}|${encodedId3}`

                                                        const filledStars =
                                                            ratings
                                                                ? Math.round(
                                                                      Number(
                                                                          ratings.averageRating
                                                                      )
                                                                  )
                                                                : 0
                                                        return (
                                                            <div className='w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-3'>
                                                                <div className='border border-black/10 p-3.5 rounded-14px group/button cursor-pointer'>
                                                                    <div className='relative'>
                                                                        <div className='w-full h-48 overflow-hidden rounded-xl'>
                                                                            <img
                                                                                src={`${REACT_APP_IMAGE_PATH}/${productItem?.product?.featured_image}`}
                                                                                alt='FoodSeven'
                                                                                className='w-full h-full object-contain'
                                                                            />
                                                                        </div>
                                                                        <div className='absolute top-10px left-10px flex bg-white shadow-lg text-primarycolor font-medium text-xs gap-3 rounded-lg py-1.5 px-2.5'>
                                                                            <>
                                                                                {remainingTime(
                                                                                    productItem?.end_date
                                                                                )}
                                                                            </>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className='flex my-2'>
                                                                            <ul className='flex gap-1'>
                                                                                <div className='flex my-2'>
                                                                                    {Array.from(
                                                                                        {
                                                                                            length: filledStars,
                                                                                        },
                                                                                        (
                                                                                            _,
                                                                                            index
                                                                                        ) => (
                                                                                            <i
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                className='icon-star-fill text-base text-PrimaryYellow'
                                                                                            ></i>
                                                                                        )
                                                                                    )}

                                                                                    {Array.from(
                                                                                        {
                                                                                            length:
                                                                                                5 -
                                                                                                filledStars,
                                                                                        },
                                                                                        (
                                                                                            _,
                                                                                            index
                                                                                        ) => (
                                                                                            <i
                                                                                                key={
                                                                                                    index +
                                                                                                    filledStars
                                                                                                }
                                                                                                className='icon-star-outline text-base text-PrimaryYellow'
                                                                                            ></i>
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <h4 className='font-semibold text-secodarycolor text-lg subtext-truncate h-14'>
                                                                        {`${
                                                                            productItem
                                                                                ?.product[
                                                                                `name_${language}`
                                                                            ]
                                                                        }`}
                                                                    </h4>
                                                                    <p className='text-sm text-black/60'>
                                                                        {
                                                                            productItem?.units
                                                                        }{" "}
                                                                        {
                                                                            productItem
                                                                                ?.product
                                                                                ?.measurement
                                                                                ?.unit_short_name
                                                                        }
                                                                    </p>
                                                                    <hr className='border-black/10 my-3' />
                                                                    <div className='flex justify-between items-center my-4'>
                                                                        <p className='text-primarycolor font-bold text-xl xxl:text-25px'>
                                                                            {
                                                                                productItem?.price
                                                                            }
                                                                            <span className='text-black/60 text-sm font-normal ml-2'>
                                                                                SAR
                                                                            </span>
                                                                        </p>
                                                                        <Link
                                                                            to={`/product/details/${mergeId}`}
                                                                            className='uppercase px-3.5 py-2 inline-block group-hover/button:bg-secondaryOrange group-hover/button:text-white text-xs font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white'
                                                                        >
                                                                            {
                                                                                <FormattedMessage id='View_Details' />
                                                                            }
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                )}
                                            </>
                                        </div>
                                    </>
                                )}
                        </div>
                    ) : (
                        <PageNotFound />
                    )}
                </>
            )}
        </>
    )
}
export default StoreProductDetails
