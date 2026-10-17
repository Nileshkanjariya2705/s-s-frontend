import { ApiParamsType } from "components/table/types";
import { perPage } from "constant/common.constant";
import React from "react";
import ReactPaginate from "react-paginate";

interface PaginationPagination {
  parentClass?: string;
  apiParams: ApiParamsType;
  setApiParams: React.Dispatch<React.SetStateAction<ApiParamsType>>;
}
const Pagination = ({ apiParams, setApiParams }: PaginationPagination) => {
  const { count, page: currentPage } = apiParams;
  const paginationCount = Math.ceil(count / perPage);
  const handlePageClick = (event: { selected: number }) => {
    setApiParams((params) => {
      return {
        ...params,
        page: event.selected + 1,
      };
    });
  };

  return (
    <>
      <ReactPaginate
        breakLabel={<span className="text-black">...</span>}
        nextLabel={
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange">
            <i className="icon-right_arrow rtl:-rotate-180 text-base lg:text-2xl text-black group-hover/hs:text-white"></i>
          </div>
        }
        onPageChange={handlePageClick}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        pageCount={paginationCount}
        previousLabel={
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-black/10 hover:shadow-primary-shadow hover:border-secondaryOrange flex items-center justify-center cursor-pointer group/hs hover:bg-secondaryOrange">
            <i className="icon-left_arrow rtl:rotate-180 text-base lg:text-2xl  text-black group-hover/hs:text-white"></i>
          </div>
        }
        renderOnZeroPageCount={null}
        className="mb-5  inline-flex items-center  justify-center mt-5 rounded-full shadow-card  bg-white mx-auto font-medium"
        pageClassName="text-black text-sm lg:text-xl px-2"
        previousClassName={`font-bold text-black pr-2 ${
          currentPage === 1 ? "pointer-events-none opacity-50" : ""
        }`}
        nextClassName={`font-bold text-black pl-2 ${
          currentPage === paginationCount
            ? "pointer-events-none opacity-50"
            : ""
        }`}
        forcePage={currentPage - 1}
        activeLinkClassName={`text-xs lg:text-xl px-2 border rounded-full flex items-center justify-center bg-primarycolor/10 text-primarycolor w-8 h-8 md:w-10 md:h-10`}
      />
    </>
  );
};

export default Pagination;
