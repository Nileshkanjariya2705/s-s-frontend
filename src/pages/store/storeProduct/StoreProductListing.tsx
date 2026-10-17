import { REACT_APP_IMAGE_PATH } from "config";
import {
  getCategoryListing,
  getCategoryProductListing,
} from "./services/productListing.service";
import { useEffect, useState } from "react";
import GlobalLoader from "components/globalLoader/GlobalLoader";
import useDebounce from "hooks/useDebounce";
import {
  // CategoryData,
  Language,
  categoryListType,
  productRatingType,
  ProductsRelatedCategoryType,
  // productDataType,
} from "./types/storeListing.types";
import { Link, useNavigate } from "react-router-dom";
import { ApiParamsType } from "components/table/types";
import { categoryCards } from "constant/common.constant";
import { FormattedMessage, useIntl } from "react-intl";
import { NoData } from "components/noDataFound/NoDataFound";
import { Countdown } from "components/countDown/Countdown";
import { formatNumberWithCommas } from "helper/jsonParser.helper";
import useLocale from "hooks/useLocale";

const StoreProductListing = () => {
  const [categoryListing, setCategoryListing] = useState([]);
  const [productsRelatedCategory, setProductsRelatedCategory] = useState([]);
  const [productRating, setProductRating] = useState<productRatingType[]>([]);
  const [startCategoryIndex, setStartCategoryIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const intl = useIntl();
  const { language } = useLocale()
  const debouncedHtmlContent = useDebounce(searchTerm, 800);
  const [isLoading, setIsLoading] = useState(true);
  const [apiParams, setApiParams] = useState<ApiParamsType>({
    limit: 0,
    page: 0,
    count: 0,
    searchText: "",
  });
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [categoryLength, setCategoryCardLength] = useState(6);
  

  const CategoryListing = async () => {
    try {
      const response = await getCategoryListing(apiParams);
      const response2 = await getCategoryProductListing(apiParams);
      setProductsRelatedCategory(response2?.data?.data?.supplierProducts?.rows);
      setProductRating(response2?.data?.data?.ratingOfProduct);
      setCategoryListing(response?.data?.data?.rows);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    CategoryListing();
  }, [debouncedHtmlContent]);

  const handleChange = (e: { target: HTMLInputElement }) => {
    setApiParams((params) => {
      return {
        ...params,
        page: 1,
        searchText: e.target.value,
      };
    });
    setSearchTerm(e.target.value);
  };

  const navigate = useNavigate();

  const viewProductListing = (category_uuid: string) => {
    navigate(`/product/all-products`, {
      state: { category_uuid: category_uuid },
    });
  };

  const handleNext = () => {
    if (startCategoryIndex < categoryListing.length - categoryLength) {
      setStartCategoryIndex(startCategoryIndex + 1);
    }
  };
  const handlePrev = () => {
    if (startCategoryIndex > 0) {
      setStartCategoryIndex(startCategoryIndex - 1);
    }
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    setStartCategoryIndex(0);
    setCategoryCardLength(2);
  };

  useEffect(() => {
    isMobile ? setCategoryCardLength(2) : setCategoryCardLength(6);
    window.addEventListener("resize", handleResize);
    return () => {
      setCategoryCardLength(6);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  return (
    <>
      {isLoading ? (
        <GlobalLoader />
      ) : (
        <>
          <div>
            <div className="relative my-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                <i
                  className="icon-left_arrow text-24px text-primarycolor cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                ></i>
              </div>
              <div className="flex items-center gap-2 relative max-w-5xl">
                <i className="icon-search-icon text-base text-black/50 absolute top-2 left-4"></i>
                <input
                  type="search"
                  placeholder={intl.formatMessage({
                    id: "search",
                  })}
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                  className="w-full px-8 pl-11 focus:outline-0 text-black placeholder:text-black/50 py-2 bg-primarygrey rounded-xl"
                />
              </div>
            </div>
            {categoryListing.length > 0 ? (
              <>
                <div className="flex items-center justify-between py-4 pb-5">
                  <h2 className="text-xl md:text-3xl font-bold break-words">
                    {<FormattedMessage id="Categories" />}
                  </h2>
                </div>
                <div className="flex -mx-3 flex-wrap gap-y-3 mt-5 relative">
                  <div className="md:absolute md:right-0 md:-top-20 -top-5 left-2.5 md:left-unset relative flex gap-3 rtl:right-3 md:rtl:right-unset md:rtl:left-3 ">
                    <div
                      onClick={() => handlePrev()}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange"
                    >
                      <i
                        className={`icon-left_arrow text-xl md:text-2xl  text-black group-hover/hs:text-white  rtl:-rotate-180 ${
                          startCategoryIndex === 0 && "cursor-not-allowed"
                        }`}
                      ></i>
                    </div>

                    <div
                      onClick={() => handleNext()}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange"
                    >
                      <i
                        className={`icon-right_arrow text-xl md:text-2xl  text-black group-hover/hs:text-white rtl:rotate-180 ${
                          startCategoryIndex <
                            categoryListing.length - categoryCards ===
                            false && "cursor-not-allowed"
                        }`}
                      ></i>
                    </div>
                  </div>
                  <div className="flex w-full">
                    {categoryListing &&
                      Array.isArray(categoryListing) &&
                      categoryListing?.length > 0 &&
                      categoryListing
                        ?.slice(
                          startCategoryIndex,
                          startCategoryIndex + categoryLength
                        )
                        .map((item: categoryListType) => {
                          return (
                            <div
                              className="w-full md:w-1/3 xl:w-1/6 px-3"
                              onClick={() => viewProductListing(item?.uuid)}
                            >
                              <div className="text-center border border-black/10 p-5 group/hs   rounded-10px min-h-178px flex items-center justify-center cursor-pointer hover:shadow-second-shadow transition-all duration-500">
                                <div>
                                  <img
                                    src={`${REACT_APP_IMAGE_PATH}${item?.image}`}
                                    alt="category_img"
                                    width={50}
                                    className="mx-auto "
                                  />
                                  <h3 className="text-lg font-semibold text-secodarycolor group-hover/green:text-white break-all">
                                    {language === "en"
                                      ? item?.[`name`]
                                      : `${
                                          item?.[`name_${language as Language}`]
                                        }`}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>
                {productsRelatedCategory?.length > 0 && (
                  <div className="flex items-center justify-between py-6">
                    <h2 className="text-xl md:text-3xl font-bold">
                      {<FormattedMessage id="Latest_Products" />}
                    </h2>
                  </div>
                )}
                <div className="flex flex-wrap -mx-3 gap-y-5">
                  {productsRelatedCategory &&
                    Array.isArray(productsRelatedCategory) &&
                    productsRelatedCategory.length > 0 &&
                    productsRelatedCategory.map(
                      (item: ProductsRelatedCategoryType) => {
                        const ratings = productRating.find(
                          (rating: productRatingType) => {
                            return (
                              rating?.product_uuid === item?.product?.uuid &&
                              rating.supplier_info_uuid ===
                                item.supplier_info_uuid
                            );
                          }
                        );
                        let prodId = item?.product?.uuid;
                        let suppId = item?.supplier_uuid;
                        let supplierProdId = item?.uuid;
                        const encodedId1 = btoa(prodId);
                        const encodedId2 = btoa(suppId);
                        const encodedId3 = btoa(supplierProdId);

                        const mergeId = `${encodedId1}|${encodedId2}|${encodedId3}`;

                        const filledStars = ratings
                          ? Math.round(Number(ratings.averageRating))
                          : 0;

                        return (
                          <>
                            <div
                              className="w-full md:w-1/2 px-3 lg:w-1/3 xl:w-1/4"
                              key={prodId}
                            >
                              <div className="border border-black/10 p-3.5 rounded-14px ">
                                <div className="relative">
                                  <div className="w-full h-48 overflow-hidden rounded-xl">
                                    <img
                                      src={`${REACT_APP_IMAGE_PATH}${item?.product?.featured_image}`}
                                      alt="FoodSeven"
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <div className="absolute top-10px left-10px flex bg-white shadow-lg text-primarycolor font-medium text-xs gap-3 rounded-lg py-1.5 px-2.5">
                                    <Countdown end_date={item.end_date} />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex my-2">
                                    {Array.from(
                                      {
                                        length: filledStars,
                                      },
                                      (_, index) => (
                                        <i
                                          key={index}
                                          className="icon-star-fill text-base text-PrimaryYellow"
                                        ></i>
                                      )
                                    )}

                                    {Array.from(
                                      {
                                        length: 5 - filledStars,
                                      },
                                      (_, index) => (
                                        <i
                                          key={index + filledStars}
                                          className="icon-star-outline text-base text-PrimaryYellow"
                                        ></i>
                                      )
                                    )}
                                  </div>
                                </div>
                                <h4 className="font-semibold text-secodarycolor text-lg subtext-truncate h-14">
                                  {`${
                                    item.product?.[
                                      `name_${language as Language}`
                                    ]
                                  }`}
                                </h4>
                                <p className="text-sm text-black/60 mt-2">
                                  {item.units}{" "}
                                  {language === "en"
                                    ? item?.product?.measurement?.[`unit_name`]
                                    : `${
                                        item?.product?.measurement?.[
                                          `unit_name_${language as "ar" | "ur"}`
                                        ]
                                      }`}
                                </p>
                                <hr className="border-black/10 my-3" />
                                <div className="flex justify-between items-center my-4">
                                  <p className="text-primarycolor font-bold text-xl xxl:text-25px">
                                    {formatNumberWithCommas(parseFloat(item?.price))}
                                    <span className="text-black/60 text-sm font-normal ml-2">
                                      SAR
                                    </span>
                                  </p>
                                  <Link
                                    to={`/product/details/${mergeId}`}
                                    className="uppercase px-3.5 py-2 inline-block group-hover/button:bg-secondaryOrange group-hover/button:text-white text-xs font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white"
                                  >
                                    {<FormattedMessage id="View_Details" />}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      }
                    )}
                </div>
              </>
            ) : (
              <NoData text={<FormattedMessage id="No_Category_Found" />} />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default StoreProductListing;
