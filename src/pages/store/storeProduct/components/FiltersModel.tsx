import { filterProducts } from "constant/filter.contant";
import { useOutsideClick } from "hooks/clickOutside";
import useLocale from "hooks/useLocale";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface FilterModelProps {
  filterModel: boolean;
  setFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setsort: (item: string) => void;
  setPriceRange: (item: string) => void;
  sort: string;
  priceRange: string;
  categories?: string[] | any;
  setCategories?: (item: string[]) => void;
  oneCategory?: string[] | any;
  setOneCategory?: (item: string[]) => void;
}

const FiltersModel: React.FC<FilterModelProps> = ({
  filterModel,
  setFilterModal,
  setsort,
  setPriceRange,
  priceRange,
  sort,
  categories,
  oneCategory,
  setOneCategory,
}) => {
  const { language } = useLocale();
  const intl = useIntl();

  const ref = useOutsideClick(() => {
    if (filterModel) {
      setFilterModal(false);
    }
  });
  const checkCategory = (e: any) => {
    if (e.target.checked) {
      setOneCategory?.([...oneCategory, e.target.value]);
    } else {
      const data = oneCategory.filter((item: string) => {
        return item !== e.target.value;
      });
      setOneCategory?.(data);
    }
  };

  return (
    <div
      className="bg-white block w-[calc(100vw-50px)] md:w-620px left-0 absolute top-16 z-20 px-5 py-6 rounded-md shadow-box-search rtl:left-0 rtl:right-0 lg:rtl:right-14"
      ref={ref}
    >
      <h4 className="text-black font-semibold capitalize">
        <FormattedMessage id="Sort_By" />
      </h4>
      <div className="flex flex-wrap my-2 -mx-3">
        {filterProducts.sort_by.map(
          (
            item: { display: string; value: string; name: string },
            index: number
          ) => {
            return (
              <>
                <div className="w-full md:w-1/3 px-3 my-1" key={index}>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      id={item.name}
                      name={item.name}
                      type="radio"
                      value={item.value}
                      checked={item.value === sort}
                      onClick={() => setsort(item.value)}
                      className="w-4 h-4 accent-primarycolor text-blue-600 bg-gray-100 border-gray-300  focus:ring-0"
                    />
                    <label className="text-base font-medium text-secodarycolor">
                      {intl.formatMessage({
                        id: item.display.includes(":")
                          ? item.display.split(":")[1].replace(/ /g, "_")
                          : item.display.replace(/ /g, "_"),
                      })}
                    </label>
                  </div>
                </div>
              </>
            );
          }
        )}
      </div>
      <hr className="border-black/10 my-3 block" />
      <h4 className="text-black font-semibold capitalize">
        <FormattedMessage id="Price_Range" />
      </h4>
      <div className="flex flex-wrap my-2 -mx-3">
        {filterProducts.price_range.map(
          (
            item: { display: string; value: string; name: string },
            index: number
          ) => {
            return (
              <>
                <div className="w-full md:w-1/3 px-3 my-1" key={index}>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      id={item.name}
                      name={item.name}
                      type="radio"
                      value={item.value}
                      onClick={() => setPriceRange(item.value)}
                      checked={item.value === priceRange}
                      className="w-4 h-4 accent-primarycolor text-blue-600 bg-gray-100 border-gray-300  focus:ring-0"
                    />
                    <label className="text-base font-medium text-secodarycolor">
                      {intl.formatMessage({
                        id:
                          item.display === "All Prices"
                            ? item.display.replace(/ /g, "_")
                            : item.display,
                      })}
                    </label>
                  </div>
                </div>
              </>
            );
          }
        )}
      </div>
      <hr className="border-black/10 my-3 block" />
      <>
        {categories && categories?.length > 0 ? (
          <h4 className="text-black font-semibold capitalize">
            <FormattedMessage id="Categories" />
          </h4>
        ) : null}
      </>
      <div className="flex flex-wrap my-2 -mx-3 max-h-44 overflow-y-auto">
        {categories &&
          categories?.length > 0 &&
          categories.map((item: any, index: number) => {
            return (
              <>
                <div className="w-full md:w-1/3 px-3 my-1" key={index}>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      id={item.name}
                      name={item.name}
                      type="checkbox"
                      value={item.uuid}
                      defaultChecked={
                        // categories?.[0]?.uuid === item?.uuid ?? true
                        oneCategory.includes(item?.uuid)
                      }
                      onClick={checkCategory}
                      className="w-4 h-4 accent-primarycolor text-blue-600 bg-gray-100 border-gray-300  focus:ring-0"
                    />
                    <label className="text-base font-medium text-secodarycolor">
                      {language === "en" ? item.name : item[`name_${language}`]}
                    </label>
                  </div>
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default FiltersModel;
