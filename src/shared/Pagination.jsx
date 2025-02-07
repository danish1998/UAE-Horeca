import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const Pagination = ({ paginationData, setPage, page }) => {
  console.log("page", page);
  console.log("pagination data", paginationData);

  const extractPageNumber = (url) => {
    if (!url) return null;
    const params = new URLSearchParams(new URL(url).search);
    return Number(params.get("page")) || null;
  };

  const handlerPrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handlerNext = (pageLength) => {
    if (page < pageLength) {
      setPage(page + 1);
    }
  };

  const renderUI = (index, pageLength, link) => {
    const tempPage = extractPageNumber(link?.url);

    if (index === 0) {
      return (
        <span
          key={index}
          style={{ opacity: page === 1 ? 0.3 : 1 }}
          className="cursor-pointer text-[#64748B] flex items-center text-sm p-[10px] sm:p-5 font-bold uppercase"
          onClick={handlerPrev}
        >
          <FaChevronLeft className="mr-2" size={"12px"} /> Previous
        </span>
      );
    } else if (index === pageLength) {
      return (
        <span
          key={index}
          style={{ opacity: page >= pageLength ? 0.3 : 1 }}
          className="cursor-pointer text-[#64748B] flex items-center text-sm p-[10px] sm:p-5 font-bold uppercase"
          onClick={() => handlerNext(pageLength)}
        >
          Next <FaChevronRight className="ml-2" size={"12px"} />
        </span>
      );
    } else {
      return (
        <span
          key={index}
          onClick={() => link?.label !== "..." && tempPage && setPage(tempPage)}
          className={`border-transparent border transition-all hover:border-[#030303] cursor-pointer text-[#030303] rounded sm:rounded-0 py-[0px] px-[10px] sm:py-4 sm:px-6 block ${
            link.active ? "bg-primary text-white" : ""
          } ${link.label === "..." ? "pointer-events-none opacity-50" : ""}`}
        >
          {link.label}
        </span>
      );
    }
  };

  return (
    <div className="block text-center w-[96vw] sm:w-[100%]">
      <div className="mb-8 w-[96vw] sm:w-[100%] text-center inline-flex flex-row justify-center flex-wrap items-center border border-[#E2E8F0] rounded-[4px]">
        {paginationData.links?.map((link, index) =>
          renderUI(index, paginationData.links.length - 1, link)
        )}
      </div>
    </div>
  );
};
