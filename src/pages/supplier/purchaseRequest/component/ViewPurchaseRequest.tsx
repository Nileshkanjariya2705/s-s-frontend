import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button/Button";
import CountdownTimer from "components/countDown/CountdownTimer";
import Loading from "components/globalLoader/Loading";
import Input from "components/input/Input";
import { Modal } from "components/model/Model";
import { PageNotFound } from "components/pageNotFound/PageNotFound";
import { REACT_APP_IMAGE_PATH } from "config";
import { responseType, toastType } from "constant/common.constant";
import { showToast } from "helper/toast.helper";
import useUserData from "hooks/getUserData";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import purchaseRequestSchema from "../schema/purchaseRequest.schema";
import {
  createSupplierProductQuotes,
  getCategoryWiseProducts,
  getSinglePurchaseRequest,
  updateSupplierProductQuotes,
} from "../services/purchaseRequest.service";
import {
  otherBrandsProductType,
  SinglePurchaseRequestProductType,
  SupplierPurchaseRequestQuoteCreate,
  // supplierPurchaseRequestView,
  viewState,
} from "../types/purchaseRequest.type";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "components/customSelect/CustomSelect";
import useLocale from "hooks/useLocale";

const ViewPurchaseRequest = () => {
  const { language } = useLocale();

  const navigate = useNavigate();
  const { uuid, given_permissions } = useUserData();
  const { requestId, selectedTab } = useParams();

  const [tab, setTab] = useState("OPEN");

  useEffect(() => {
    if (selectedTab) {
      setTab(selectedTab.toLocaleUpperCase());
    }
  }, [selectedTab]);
  const sendQuote_permission = given_permissions.find(
    (item) => item.name === "Send Quotes"
  )?.granted;
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [purchaseRequestProduct, setPurchaseRequestProduct] =
    useState<SinglePurchaseRequestProductType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState<viewState>({});
  const [editProductData, setEditProductData] = useState<
    otherBrandsProductType[]
  >([]);
  const [updateButtonLoader, setUpdateButtonLoader] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [otherBrandProduct, setOtherBrandProduct] = useState<
    otherBrandsProductType[]
  >([]);

  const [defaultValues, setDefaultValues] = useState<{
    product_details: { quantity: string; offered_price: string }[];
    charges: string;
    subtotal: number;
    grandtotal: number | undefined;
  }>();

  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<SupplierPurchaseRequestQuoteCreate>({
    resolver: yupResolver(purchaseRequestSchema),
    values: defaultValues,
  });
  const formValues = watch();

  const intl = useIntl();
  let errCount = 0;

  const onSubmit = async (values: SupplierPurchaseRequestQuoteCreate) => {
    try {
      setButtonLoader(true);

      values.product_details.map((data) => {
        if (Number(data.offered_price) <= 0) {
          return errCount++;
        }
      });
      let response;
      const purchase_request_product =
        purchaseRequestProduct?.product_details?.map(
          (prdId) => prdId.purchase_request_product_uuid
        ) || [];
      if (tab === "OPEN") {
        const purchaseRequestQuote = {
          purchase_request_uuid: requestId,
          quoted_by: uuid,
          charges: values.charges !== undefined && parseFloat(values.charges),
          product_details: values?.product_details
            .map(
              (
                data: {
                  quantity: string;
                  offered_price?: string | undefined;
                },
                index: number
              ) => {
                if (Number(data.offered_price) > 0) {
                  return {
                    ...data,
                    purchase_request_products_uuid:
                      purchase_request_product[index],
                    other_brand_product_uuid: otherBrandProduct.map(
                      (item: otherBrandsProductType) =>
                        item?.value ? item.value : null
                    )[index],
                  };
                } else {
                  return null;
                }
              }
            )
            .filter((item) => item !== null),
        };
        if (
          purchaseRequestProduct?.offer_for_entire_request &&
          errCount === 0
        ) {
          response = await createSupplierProductQuotes(purchaseRequestQuote);
        } else if (
          purchaseRequestProduct?.offer_for_entire_request === false &&
          errCount <= purchaseRequestProduct.product_details.length - 1
        ) {
          response = await createSupplierProductQuotes(purchaseRequestQuote);
        } else {
          setShowErrorModal(true);
        }
      } else {
        const supplier_product_quote =
          purchaseRequestProduct?.product_details.map((quoteId) => {
            return quoteId.supplierProductQuoteUuid;
          }) || [];

        const data = {
          charges: values.charges !== undefined && parseFloat(values.charges),
          supplier_quote_uuid: purchaseRequestProduct?.supplierQuoteUuid,
          product_details: values.product_details.map(
            (
              data: {
                offered_price?: string | undefined;
                quantity: string;
              },
              index: number
            ) => {
              return {
                ...data,
                offered_price: data.offered_price ? data.offered_price : null,
                supplier_product_quote_uuid: supplier_product_quote[index],
                purchase_request_products_uuid: purchase_request_product[index],
                other_brand_product_uuid: otherBrandProduct.map(
                  (item: otherBrandsProductType) =>
                    item?.value ? item.value : null
                )[index],
              };
            }
          ),
        };

        if (
          purchaseRequestProduct?.offer_for_entire_request &&
          errCount === 0
        ) {
          response = await updateSupplierProductQuotes(data);
        } else if (
          purchaseRequestProduct?.offer_for_entire_request === false &&
          errCount <= purchaseRequestProduct.product_details.length - 1
        ) {
          response = await updateSupplierProductQuotes(data);
        } else {
          setShowErrorModal(true);
        }
      }

      if (response?.data?.responseType === responseType.Success) {
        showToast(response?.data?.message, toastType.Success, intl);
        navigate(`/purchase-request`);
      }
      setButtonLoader(false);
    } catch (error) {
      setButtonLoader(false);
    }
  };

  let subTotal: { quantity: number; offered_price: number }[] | undefined;

  const calculateSubtotal = () => {
    if (Array.isArray(formValues.product_details)) {
      subTotal =
        formValues &&
        formValues.product_details.map((item) => {
          return {
            quantity: Number(item.quantity),
            offered_price: Number(item.offered_price),
          };
        });
    }

    const total =
      subTotal &&
      parseFloat(
        subTotal
          .reduce((accumulator, product) => {
            const quantity = product.quantity;
            const offered_price = product.offered_price;
            const totalPrice = quantity * offered_price;
            return accumulator + totalPrice;
          }, 0)
          .toFixed(2)
      );
    setValue(
      "subtotal",
      !isNaN(total as number) && (total as number) > 0 ? (total as number) : 0
    );
    const GrandTotal = formValues.charges
      ? (total as number) + parseFloat(formValues?.charges)
      : total;
    setDefaultValues((prev: any) => ({
      ...prev,
      subtotal:
        !isNaN(total as number) && (total as number) > 0
          ? (total as number)
          : 0,
      product_details: formValues.product_details,
      charges: formValues.charges,
      grandtotal: GrandTotal,
    }));
  };

  const getSingleRequest = async () => {
    try {
      const response = await getSinglePurchaseRequest(
        requestId as string,
        uuid
      );
      setPurchaseRequestProduct(response?.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (requestId) {
      getSingleRequest();
    }
  }, [requestId]);

  useEffect(() => {
    if (purchaseRequestProduct) {
      const subtotal = purchaseRequestProduct?.product_details?.reduce(
        (accumulator, product) => {
          const quantity = product.quantity;
          const offered_price = product.offered_price
            ? product.offered_price
            : 0;
          const totalPrice = quantity * Number(offered_price);
          return accumulator + totalPrice;
        },
        0
      );

      setDefaultValues({
        product_details: purchaseRequestProduct?.product_details?.map(
          (data) => ({
            quantity: data?.quantity?.toString(),
            offered_price: data?.offered_price?.toString(),
          })
        ),

        charges:
          purchaseRequestProduct.charges_and_total === null
            ? "0"
            : String(
                purchaseRequestProduct.charges_and_total &&
                  (
                    parseFloat(
                      Number(purchaseRequestProduct?.charges_and_total).toFixed(
                        2
                      )
                    ) - subtotal
                  ).toFixed(2)
              ),
        subtotal: parseFloat(Number(subtotal).toFixed(2)),
        grandtotal: parseFloat(
          Number(purchaseRequestProduct?.charges_and_total).toFixed(2)
        ),
      });
      purchaseRequestProduct?.product_details?.forEach((data) => {
        otherBrandProduct.push({
          label_en: data?.otherBrandsProduct?.label_en || "-",
          label_ar: data?.otherBrandsProduct?.label_ar || "-",
          label_ur: data?.otherBrandsProduct?.label_ur || "-",
          value: data?.otherBrandsProduct?.value || "",
          featured_image: data?.otherBrandsProduct?.featured_image || "",
        });
      });
    }
  }, [purchaseRequestProduct]);

  const getProductEditModal = async (
    purchase_request_product_uuid: string,
    category_uuid: string
  ) => {
    setShowEditModal({
      [purchase_request_product_uuid]: true,
    });

    setLoading(true);

    const response = await getCategoryWiseProducts(
      category_uuid,
      purchase_request_product_uuid,
      language
    );
    if (response?.data?.data) {
      const productOptions = response.data.data.map(
        (item: {
          [key: string]: string;
          featured_image: string;
          uuid: string;
        }) => {
          return {
            featured_image: item.featured_image,
            value: item.uuid,
            label: item?.[`name_${language}`],
            label_en: item?.name_en,
            label_ar: item?.name_ar,
            label_ur: item?.name_ur,
          };
        }
      );
      setLoading(false);
      setEditProductData(productOptions);
    }
  };

  const updateProduct = async (
    purchase_request_product_uuid: string,
    index: number
  ) => {
    setUpdateButtonLoader(true);
    const getOtherBrandData = editProductData.find(
      (data) => data.value === selectedProduct
    );
    setOtherBrandProduct((prevOtherBrandProducts: otherBrandsProductType[]) => {
      const newOtherBrandProducts = [...prevOtherBrandProducts];
      newOtherBrandProducts[index] =
        getOtherBrandData as otherBrandsProductType;
      return newOtherBrandProducts;
    });
    setUpdateButtonLoader(false);
    setShowEditModal({
      [purchase_request_product_uuid]: false,
    });
  };

  const calculateGrandTotal = (charges: string) => {
    setDefaultValues((prev) => {
      if (!prev) {
        return prev;
      }
      const GrandTotal =
        charges !== "" ? prev.subtotal + parseFloat(charges) : prev.subtotal;
      return {
        ...prev,
        charges,
        grandtotal: GrandTotal,
      };
    });
  };

  const givenDateTimeString = purchaseRequestProduct?.quotes_accepted_upto;
  const givenDateTime = new Date(givenDateTimeString as string);
  const currentDateTime = new Date();
  return (
    <>
      {!loading ? (
        <>
          {purchaseRequestProduct ? (
            <div className="w-full xl:w-3/4 space-y-30px">
              <div className="border border-black/10 rounded-14px p-20px md:p-30px">
                <div className="flex justify-between flex-wrap space-y-5 md:space-x-0">
                  <div className="flex items-center gap-3 ">
                    <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                      <i
                        className="icon-left_arrow text-24px text-primarycolor cursor-pointer"
                        onClick={() => navigate("/purchase-request")}
                      ></i>
                    </div>
                    <h2 className="text-base md:text-2xl font-semibold text-black">
                      {<FormattedMessage id="Purchase_Requests" />} - #{" "}
                      {requestId?.slice(0, 8)}
                    </h2>
                  </div>
                  <div>
                    <CountdownTimer
                      endDate={purchaseRequestProduct?.quotes_accepted_upto}
                    />
                  </div>
                </div>
                <hr className="mt-5" />
                <form onSubmit={handleSubmit(onSubmit)}>
                  {purchaseRequestProduct &&
                    purchaseRequestProduct?.product_details?.map(
                      (productDetail: any, index: number) => {
                        return (
                          <>
                            <div className="border border-black/10 rounded-14px p-20px md:p-30px mt-8">
                              <div className="flex flex-wrap -mx-4">
                                <div className="w-full md:w-4/5 px-4 pb-4 md:pb-0">
                                  <div className="relative overflow-x-auto ">
                                    <table className="w-full text-sm ">
                                      <thead>
                                        <tr className="text-left rtl:text-right">
                                          <th
                                            scope="col"
                                            className="px-4 py-3  bg-primarycolor/10"
                                          >
                                            <p className="truncate max-w-280px text-sm  font-semibold  text-primarycolor">
                                              <FormattedMessage id="Category" />
                                            </p>
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-4 py-3 bg-primarycolor/10"
                                          >
                                            <p className="truncate max-w-280px text-sm  font-semibold  text-primarycolor">
                                              <FormattedMessage id="Product" />
                                            </p>
                                          </th>
                                          <th className="px-4 py-3 bg-primarycolor/10">
                                            <p className="truncate max-w-280px text-sm  font-semibold  text-primarycolor">
                                              <FormattedMessage id="Other_brand_product" />
                                            </p>
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-4 py-3 bg-primarycolor/10"
                                          >
                                            <p className="truncate max-w-280px text-sm  font-semibold  text-primarycolor">
                                              <FormattedMessage id="Qty" />
                                            </p>
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-4 py-3 bg-primarycolor/10"
                                          >
                                            <p className="truncate max-w-280px text-sm  font-semibold  text-primarycolor">
                                              <FormattedMessage id="Requested_Price" />
                                            </p>
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-4 py-3 bg-primarycolor/10"
                                          >
                                            <p className="truncate max-w-280px text-sm  font-semibold  text-primarycolor">
                                              <FormattedMessage id="Total" />
                                            </p>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="bg-white  text-sm shadow-primary-shadows rounded-lg text-darkgrey/75 text-left rtl:text-right">
                                          <td className="px-4 py-4 align-top">
                                            <p className="whitespace-nowrap rtl:text-right ">
                                              {language === "en"
                                                ? productDetail.category_name
                                                : language === "ar"
                                                ? productDetail.category_name_ar
                                                : productDetail.category_name_ur}
                                            </p>
                                          </td>

                                          <td className="px-4 py-4 align-top">
                                            <div className="flex">
                                              <div className="text-center flex gap-2">
                                                <img
                                                  src={`${REACT_APP_IMAGE_PATH}${productDetail.image}`}
                                                  alt=""
                                                  className="w-4 md:w-6 h-4 md:h-6 mb-1"
                                                />

                                                <span className=" text-left w-300px">
                                                  {language === "en"
                                                    ? productDetail.product_name
                                                    : language === "ar"
                                                    ? productDetail.product_name_ar
                                                    : productDetail.product_name_ur}
                                                </span>
                                              </div>
                                              <div>
                                                {productDetail.allow_other_brands && (
                                                  <i
                                                    className="icon-edit-alt text-base cursor-pointer px-4 py-1.5  text-secondaryOrange"
                                                    onClick={() =>
                                                      getProductEditModal(
                                                        productDetail.purchase_request_product_uuid,
                                                        productDetail.category_uuid
                                                      )
                                                    }
                                                  ></i>
                                                )}
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-4 py-4 align-top">
                                            <div className="relative">
                                              {otherBrandProduct[index] &&
                                              otherBrandProduct[index]
                                                ?.featured_image ? (
                                                <img
                                                  src={`${REACT_APP_IMAGE_PATH}${otherBrandProduct[index]?.featured_image}`}
                                                  alt=""
                                                  className="w-4 md:w-6 h-4 md:h-6 mb-1"
                                                />
                                              ) : (
                                                productDetail
                                                  ?.otherBrandsProduct
                                                  ?.featured_image && (
                                                  <img
                                                    src={`${REACT_APP_IMAGE_PATH}${productDetail.otherBrandsProduct.featured_image}`}
                                                    className="w-4 md:w-6 h-4 md:h-6 mb-1 mx-auto"
                                                    alt=""
                                                  />
                                                )
                                              )}
                                              <span className="break-all text-xs text-center">
                                                {otherBrandProduct[index]
                                                  ? otherBrandProduct[index]?.[
                                                      `label_${language}`
                                                    ]
                                                  : productDetail.otherBrandsProduct
                                                  ? productDetail
                                                      .otherBrandsProduct?.[
                                                      `label_${language}`
                                                    ]
                                                  : "-"}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="px-4 py-4 align-top ">
                                            <Input
                                              required={true}
                                              errors={errors}
                                              register={register}
                                              type="text"
                                              id={`product_details.${index}.quantity`}
                                              errorKey={`product_details.${index}.quantity`}
                                              style={`border border-black/10 px-3 py-2  focus:outline-0 min-w-60px max-w-60px rounded-md`}
                                              HandleChange={calculateSubtotal}
                                              readonly={
                                                tab === "CLOSED" ? true : false
                                              }
                                            />
                                          </td>
                                          <td className="px-4 py-4 align-top">
                                            <p className="whitespace-nowrap rtl:text-right">
                                              <span className="inline-block">
                                                SAR
                                              </span>{" "}
                                              <span>
                                                {productDetail.requested_price}{" "}
                                                <span className="text-gray-400">
                                                  /{" "}
                                                  {
                                                    productDetail[
                                                      `unit_of_measurement_${
                                                        language as
                                                          | "en"
                                                          | "ur"
                                                          | "ar"
                                                      }`
                                                    ]
                                                  }
                                                </span>
                                              </span>
                                            </p>
                                          </td>
                                          <td className="px-4 py-4 align-top">
                                            <p className="whitespace-nowrap rtl:text-right">
                                              <span className="inline-block">
                                                SAR
                                              </span>{" "}
                                              {Number(
                                                productDetail.quantity *
                                                  productDetail.requested_price
                                              ).toFixed(2)}
                                            </p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div className="w-full md:w-1/5 px-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:rtl:border-l-0 md:rtl:border-r">
                                  <h2 className="text-sm mt-3 font-semibold">
                                    <FormattedMessage id="Offered_Price" />
                                  </h2>
                                  <div className="mt-5">
                                    <Input
                                      required={true}
                                      errors={errors}
                                      register={register}
                                      placeholder={intl.formatMessage({
                                        id: "Enter_Offer_Price",
                                      })}
                                      type="text"
                                      id={`product_details.${index}.offered_price`}
                                      errorKey={`product_details.${index}.offered_price`}
                                      style={`border border-black/10 rounded-xl px-4 w-full  py-2 focus:outline-0`}
                                      HandleChange={() => calculateSubtotal()}
                                      readonly={tab === "CLOSED" ? true : false}
                                      fixDecimal={true}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="w-full">
                                <hr className="my-3 lg:my-5 border-black/10" />
                                <div className="space-y-4">
                                  <h2 className="text-sm font-semibold">
                                    <FormattedMessage id="Description" />
                                  </h2>
                                  <p className="text-sm  text-gray-500 break-all">
                                    {productDetail.description}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {showEditModal?.[
                              productDetail.purchase_request_product_uuid
                            ] && (
                              <Modal
                                title={<FormattedMessage id="Edit_Products" />}
                                showModal={
                                  showEditModal[
                                    productDetail.purchase_request_product_uuid
                                  ]
                                }
                                setShowModal={() => {
                                  setShowEditModal((prevState) => ({
                                    [productDetail.purchase_request_product_uuid]:
                                      prevState[
                                        productDetail
                                          .purchase_request_product_uuid
                                      ] === true
                                        ? false
                                        : true,
                                  }));
                                }}
                              >
                                {editProductData &&
                                Array?.isArray(editProductData) &&
                                editProductData?.length === 0 ? (
                                  <div>
                                    <FormattedMessage id="Catgory_No_Product" />
                                  </div>
                                ) : (
                                  <>
                                    <CustomSelect
                                      label={
                                        <FormattedMessage id="Product_Name" />
                                      }
                                      options={editProductData}
                                      control={control}
                                      name="product_details"
                                      register={register}
                                      error={errors}
                                      required={true}
                                      handleSelectChange={(event) =>
                                        setSelectedProduct(event.target.value)
                                      }
                                    />
                                    <div className="flex justify-center gap-4 mt-4 md:!mt-8 w-full px-3 ">
                                      <Button
                                        type="button"
                                        text={<FormattedMessage id="Cancel" />}
                                        className="w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange  bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0"
                                        onClick={() => {
                                          setShowEditModal({
                                            [productDetail.purchase_request_product_uuid]:
                                              false,
                                          });
                                        }}
                                      />
                                      <Button
                                        text={<FormattedMessage id="Update" />}
                                        type="button"
                                        loader={updateButtonLoader}
                                        className="w-48 px-5 py-3 text-sm font-bold text-center border-2 border-primarycolor text-primarycolor bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0"
                                        onClick={() =>
                                          updateProduct(
                                            productDetail.purchase_request_product_uuid,
                                            index
                                          )
                                        }
                                      ></Button>
                                    </div>
                                  </>
                                )}
                              </Modal>
                            )}
                          </>
                        );
                      }
                    )}
                  {purchaseRequestProduct.shipping_info && (
                    <div className="border border-black/10 rounded-14px p-20px md:p-30px mt-8 flex items-center flex-wrap gap-5 ">
                      <h3 className="">
                        <span className="font-semibold  text-primarycolor ">
                          <FormattedMessage id="associated_delivery_address" />{" "}
                          :
                        </span>
                        <span className="ml-1 break-all">
                          {" "}
                          {purchaseRequestProduct.shipping_info.address},{" "}
                          {purchaseRequestProduct.shipping_info.city},{" "}
                          {purchaseRequestProduct.shipping_info.country} ,{" "}
                          {purchaseRequestProduct.shipping_info.postal_code}{" "}
                        </span>
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-block">
                          (M) : {purchaseRequestProduct.shipping_info.phone}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="border border-black/10 rounded-14px p-20px md:p-30px mt-8 ">
                    <div className="flex items-center flex-wrap space-y-4 ">
                      <div className="w-full md:justify-end md:space-x-4 md:rtl:space-x-reverse flex items-center flex-wrap md:flex-nowrap space-y-4 md:space-y-0">
                        <p className="text-primarycolor text-base capitalize">
                          {" "}
                          <FormattedMessage id="subtotal" />{" "}
                          <span className="hidden md:inline-block">:</span>{" "}
                        </p>
                        <div className="w-full md:w-1/4 ">
                          <Input
                            required={true}
                            errors={errors}
                            register={register}
                            type="number"
                            id={`subtotal`}
                            readonly={true}
                            value={
                              formValues.subtotal ? formValues.subtotal : 0
                            }
                            style={`border border-black/10 rounded-xl w-full  px-4 py-2 focus:outline-0`}
                          />
                        </div>
                      </div>
                      <div className="flex md:justify-end items-center w-full md:space-x-4 md:rtl:space-x-reverse flex-wrap md:flex-nowrap space-y-4 md:space-y-0">
                        <p className="text-primarycolor text-base capitalize ">
                          <FormattedMessage id="charges" />{" "}
                          <span className="hidden md:inline-block">:</span>{" "}
                        </p>
                        <div className="relative w-full md:w-1/4">
                          <Input
                            required={false}
                            errors={errors}
                            register={register}
                            type="text"
                            id="charges"
                            style={`border border-black/10 rounded-xl w-full px-4 py-2 focus:outline-0`}
                            readonly={tab === "CLOSED" ? true : false}
                            fixDecimal={true}
                            HandleChange={(e) =>
                              calculateGrandTotal(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="flex md:justify-end items-center w-full md:space-x-4 md:rtl:space-x-reverse flex-wrap md:flex-nowrap space-y-4 md:space-y-0">
                        <p className="text-primarycolor text-base capitalize ">
                          <FormattedMessage id="Grand_Total" />{" "}
                          <span className="hidden md:inline-block">:</span>{" "}
                        </p>
                        <div className="relative w-full md:w-1/4">
                          <Input
                            required={false}
                            errors={errors}
                            register={register}
                            type="text"
                            id="grandtotal"
                            style={`border border-black/10 rounded-xl w-full px-4 py-2 focus:outline-0`}
                            readonly={true}
                            fixDecimal={true}
                          />
                        </div>
                      </div>
                    </div>

                    {tab !== "CLOSED" &&
                      givenDateTime > currentDateTime &&
                      purchaseRequestProduct?.status !== "COMPLETED" &&
                      sendQuote_permission && (
                        <div className="flex md:justify-end mt-5 space-x-3 md:space-x-5 rtl:space-x-reverse">
                          <Button
                            text={<FormattedMessage id="Cancel" />}
                            type="button"
                            disable={buttonLoader}
                            className="px-4 py-2.5 md:px-6 md:py-3 text-sm font-bold text-center border-2 border-secondaryOrange text-secondaryOrange bg-white rounded-xl  hover:bg-secondaryOrange hover:text-white focus:ring-0 focus:outline-0 uppercase"
                            onClick={() => navigate("/purchase-request")}
                          ></Button>
                          <Button
                            text={
                              tab === "OPEN" ? (
                                <FormattedMessage id="Send_Quotes" />
                              ) : (
                                <FormattedMessage id="Update_quotes" />
                              )
                            }
                            type="submit"
                            disable={
                              purchaseRequestProduct?.status === "COMPLETED" ||
                              purchaseRequestProduct?.status === "EXPIRED"
                                ? true
                                : false
                            }
                            loader={buttonLoader}
                            className="px-4 py-2.5 md:px-6 md:py-3 text-sm font-bold text-center bg-primarycolor border-2 border-primarycolor text-primarycolor text-white rounded-xl hover:bg-primarycolor hover:text-white focus:ring-0 focus:outline-0 uppercase"
                          ></Button>
                        </div>
                      )}
                    {purchaseRequestProduct?.status === "COMPLETED" && (
                      <p className="text-red-500 font-semibold flex justify-end mt-5">
                        <FormattedMessage id="completed_req" />
                      </p>
                    )}
                  </div>
                </form>
              </div>

              {showErrorModal && (
                <Modal
                  title={<FormattedMessage id="Alert" />}
                  setShowModal={setShowErrorModal}
                  showModal={showErrorModal}
                >
                  <div className="text-center space-y-4 p-5">
                    <svg
                      className="w-14 md:w-20 mx-auto"
                      viewBox="0 0 65 57"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M28.0344 3.12928L1.63432 48.8523C1.15744 49.678 0.906338 50.6146 0.90625 51.5681C0.906162 52.5217 1.15709 53.4584 1.63382 54.2842C2.11055 55.1099 2.79627 55.7957 3.62204 56.2724C4.44781 56.7491 5.38454 57.0001 6.33805 57H59.134C60.0875 57.0001 61.0242 56.7491 61.85 56.2724C62.6758 55.7957 63.3615 55.1099 63.8382 54.2842C64.3149 53.4584 64.5659 52.5217 64.5658 51.5681C64.5657 50.6146 64.3146 49.678 63.8377 48.8523L37.4404 3.12928C36.9638 2.30375 36.2783 1.61822 35.4527 1.1416C34.6272 0.664981 33.6907 0.414062 32.7374 0.414062C31.7842 0.414062 30.8477 0.664981 30.0222 1.1416C29.1966 1.61822 28.5111 2.30375 28.0344 3.12928Z"
                        fill="#EE404C"
                      />
                      <path
                        d="M33.0867 17.2266H32.3981C30.7026 17.2266 29.3281 18.601 29.3281 20.2965V34.9702C29.3281 36.6657 30.7026 38.0401 32.3981 38.0401H33.0867C34.7822 38.0401 36.1566 36.6657 36.1566 34.9702V20.2965C36.1566 18.601 34.7822 17.2266 33.0867 17.2266Z"
                        fill="#FFF7ED"
                      />
                      <path
                        d="M32.7424 49.6801C34.628 49.6801 36.1566 48.1515 36.1566 46.2658C36.1566 44.3802 34.628 42.8516 32.7424 42.8516C30.8567 42.8516 29.3281 44.3802 29.3281 46.2658C29.3281 48.1515 30.8567 49.6801 32.7424 49.6801Z"
                        fill="#FFF7ED"
                      />
                    </svg>

                    <p className="max-w-md mx-auto text-sm md:text-base">
                      {purchaseRequestProduct.offer_for_entire_request ? (
                        <FormattedMessage id="All_Quotes_Required" />
                      ) : (
                        <FormattedMessage id="One_Quote_Required" />
                      )}
                    </p>
                    <Button
                      type="button"
                      text={<FormattedMessage id="Close" />}
                      onClick={() => setShowErrorModal(false)}
                      className="px-6 py-2 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl  hover:bg-primarycolor hover:text-white focus:ring-0 focus:outline-0 uppercase !mt-5"
                    />
                  </div>
                </Modal>
              )}
            </div>
          ) : (
            <div className="w-full xl:w-3/4 space-y-30px relative">
              <PageNotFound />
            </div>
          )}
        </>
      ) : (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
    </>
  );
};

export default ViewPurchaseRequest;
