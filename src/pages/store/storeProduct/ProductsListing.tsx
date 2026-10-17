import { REACT_APP_IMAGE_PATH } from "config";
import {
  getCategoryListing,
  getCategoryWiseProduct,
} from "./services/productListing.service";
import { useEffect, useState } from "react";
import GlobalLoader from "components/globalLoader/GlobalLoader";
import {
  Language,
  ProductCategoryData,
  ProductDataType,
  productRatingType,
} from "./types/storeListing.types";
import { Button } from "components/button/Button";
import { useNavigate, useLocation } from "react-router-dom";
import FiltersModel from "./components/FiltersModel";
import { responseType } from "constant/common.constant";
import useDebounce from "hooks/useDebounce";
import { remainingTime } from "helper/timezone.helper";
import { PageNotFound } from "components/pageNotFound/PageNotFound";
import { ApiParamsType } from "components/table/types";
import { FormattedMessage, useIntl } from "react-intl";
import { NoData } from "components/noDataFound/NoDataFound";
import Loading from "components/globalLoader/Loading";
import useLocale from "hooks/useLocale";

const ProductsListing = () => {
  const location = useLocation();
  const { language } = useLocale()
  const intl = useIntl();
  const categoryId = location.state?.category_uuid;

  const [filterModel, setFilterModal] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [productsofCategory, setProductsofCategory] =
    useState<ProductCategoryData>();

  const [isLoading, setIsLoading] = useState(true);
  const [sort, setsort] = useState<string>("low-to-high");
  const [priceRange, setPriceRange] = useState<string>("0+");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [oneCategory, setOneCategory] = useState<string[]>([categoryId]);
  const [filterLoader, setFilterLoader] = useState<boolean>(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const SearchValue = e.target.value;
    setSearchTerm(SearchValue);
  };
  const [productRating, setProductRating] = useState<productRatingType[]>([]);
  const debouncedHtmlContent = useDebounce(searchTerm, 800);
  const [apiParams, _setApiParams] = useState<ApiParamsType>({
    limit: 0,
    page: 0,
    count: 0,
    searchText: "",
  });
  const CategoryListing = async () => {
    try {
      setFilterLoader(true);
      const getAllCategories = await getCategoryListing(apiParams);
      if (getAllCategories?.data?.data?.rows) {
        setCategories(getAllCategories.data.data.rows);
      }
      const response = await getCategoryWiseProduct({
        sortBy: sort,
        priceRange: priceRange,
        searchText: debouncedHtmlContent,
        lang: language,
        categoriesId: oneCategory?.length > 0 ? oneCategory : categoryId,
      });
      if (response?.data?.responseType === responseType.Success) {
        setProductsofCategory(response?.data?.data?.categoryData);
        setProductRating(response?.data?.data?.ratingOfProduct);
      } else {
        // setProductsofCategory([]);
      }
      setFilterLoader(false);
      setIsLoading(false);
    } catch (error) {
      setFilterLoader(false);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    CategoryListing();
  }, [sort, priceRange, debouncedHtmlContent, oneCategory]);

  const navigate = useNavigate();

  return (
    <>
      {isLoading ? (
        <GlobalLoader />
      ) : (
        <>
          {productsofCategory ? (
            <>
              {filterLoader && (
                <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              )}
              <div className="relative my-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                  <i
                    className="icon-left_arrow text-2xl text-primarycolor cursor-pointer"
                    onClick={() => navigate("/product/listing")}
                  ></i>
                </div>
                <div className="flex items-center gap-2 relative max-w-200px md:max-w-5xl">
                  <i className="icon-search-icon text-base text-black/50 absolute top-2 left-4"></i>
                  <input
                    type="search"
                    placeholder={intl.formatMessage({
                      id: "Search",
                    })}
                    required
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSearchChange(e)
                    }
                    className="w-full px-8 pl-11 focus:outline-0 text-black text-base placeholder:text-black/50 py-2 bg-primarygrey rounded-xl"
                  />
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                    <Button
                      type="button"
                      onClick={() => setFilterModal(!filterModel)}
                      className="icon-filter text-base text-primarycolor"
                    />
                  </div>
                </div>
                {filterModel === true && (
                  <>
                    <FiltersModel
                      setFilterModal={setFilterModal}
                      filterModel={filterModel}
                      setsort={setsort}
                      sort={sort}
                      setPriceRange={setPriceRange}
                      priceRange={priceRange}
                      categories={categories}
                      setCategories={setCategories}
                      oneCategory={oneCategory}
                      setOneCategory={setOneCategory}
                    />
                  </>
                )}
              </div>
              <div>
                {productsofCategory &&
                Array.isArray(Object.values(productsofCategory)) &&
                Object.values(productsofCategory).length > 0 ? (
                  Object.values(productsofCategory).map(
                    (item: ProductCategoryData) => {
                      return (
                        <>
                          <div className="flex items-center justify-between py-4 pb-5">
                            <h2 className="text-xl md:text-3xl font-bold">
                              {`${item?.[`category_${language as Language}`]}`}
                            </h2>
                          </div>
                          <div className="flex flex-wrap -mx-3 gap-y-5">
                            <>
                              {Array.isArray &&
                                Array.isArray(item?.product_data) &&
                                item?.product_data.map(
                                  (item: ProductDataType) => {
                                    const ratings = productRating.find(
                                      (rating: productRatingType) => {
                                        return (
                                          rating.product_uuid ===
                                            item?.product_uuid &&
                                          rating.supplier_info_uuid ===
                                            item?.supplier_info_uuid
                                        );
                                      }
                                    );
                                    let prodId = item?.product_uuid;
                                    let suppId = item?.supplier_uuid;
                                    let { supplierProdId } = item;
                                    const encodedId1 = btoa(prodId);
                                    const encodedId2 = btoa(suppId);
                                    const encodedId3 = btoa(supplierProdId);

                                    const mergeId = `${encodedId1}|${encodedId2}|${encodedId3}`;
                                    const filledStars = ratings
                                      ? Math.round(
                                          Number(ratings.averageRating)
                                        )
                                      : 0;
                                    return (
                                      <>
                                        <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                                          <div className="w-full px-3">
                                            <div className="border border-black/10 p-3.5 rounded-14px group/button ">
                                              <div className="relative">
                                                <div className="w-full h-48 overflow-hidden rounded-xl">
                                                  <img
                                                    src={`${REACT_APP_IMAGE_PATH}${item.featured_image}`}
                                                    alt="FoodSeven"
                                                    className="w-full h-full object-contain"
                                                  />
                                                </div>
                                                <div className="absolute top-10px left-10px flex bg-white shadow-lg text-primarycolor font-medium text-xs gap-3 rounded-lg py-1.5 px-2.5">
                                                  {remainingTime(item.end_date)}
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
                                                        key={
                                                          index + filledStars
                                                        }
                                                        className="icon-star-outline text-base text-PrimaryYellow"
                                                      ></i>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                              <h4 className="font-semibold text-secodarycolor text-lg subtext-truncate h-14">
                                                {`${
                                                  item?.[
                                                    `name_${
                                                      language as Language
                                                    }`
                                                  ]
                                                }`}
                                              </h4>
                                              <p className="text-sm text-black/60">
                                                {item.units}{" "}
                                                {`${
                                                  item?.[
                                                    `unit_name_${
                                                      language as Language
                                                    }`
                                                  ]
                                                }`}
                                              </p>
                                              <hr className="border-black/10 my-3" />
                                              <div className="flex justify-between items-center my-4">
                                                <p className="text-primarycolor font-bold text-xl xxl:text-2xl">
                                                  {item?.price}
                                                  <span className="text-black/60 text-sm font-normal ml-2 rtl:mr-2">
                                                    {
                                                      <FormattedMessage id="currency" />
                                                    }
                                                  </span>
                                                </p>
                                                <p
                                                  className="uppercase px-3.5 py-2 inline-block group-hover/button:bg-secondaryOrange group-hover/button:text-white text-xs font-bold text-secondaryOrange border-2 border-secondaryOrange rounded-xl hover:bg-secondaryOrange hover:text-white cursor-pointer"
                                                  onClick={() =>
                                                    navigate(
                                                      `/product/details/${mergeId}`
                                                    )
                                                  }
                                                >
                                                  {
                                                    <FormattedMessage id="View_Details" />
                                                  }
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    );
                                  }
                                )}
                            </>
                          </div>
                        </>
                      );
                    }
                  )
                ) : (
                  <NoData text={<FormattedMessage id="No_Product_Found" />} />
                )}
              </div>
            </>
          ) : (
            <PageNotFound />
          )}
        </>
      )}
    </>
  );
};

export default ProductsListing;
