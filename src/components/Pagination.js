import React from "react";

const Pagination = ({ currentPage, totalPages, goToPage, goToNextPage, goToPreviousPage, }) => {

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  
  return (
    <div className="flex justify-end mt-10 mb-4">
      <nav className="flex gap-2">
        <a
          href="#"
          className={"hover:bg-blue-200 hover:text-blue-500 rounded-full px-3 py-1.5 text-gray-600"}
          disabled={isFirstPage}
          onClick={goToPreviousPage}
          style={{
            pointerEvents: isFirstPage ? "none" : "auto",
            opacity: isFirstPage ? 0.5 : 1,
          }}
        >
          &laquo;
        </a>
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <a
                key={index}
                href="#"
                className={`${
                  currentPage === pageNumber
                    ? "text-blue-500 bg-blue-100 rounded-full"
                    : "text-gray-500 text-sm hover:bg-blue-200 hover:text-blue-500"
                } px-3 py-2 rounded-full text-sm`}
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </a>
            );
          } else if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return (
              <span key={index} className="dot-mark">
                ...
              </span>
            );
          }
          return null;
        })}
        <a
          href="#"
          className={"hover:bg-blue-200 hover:text-blue-500 rounded-full px-3 py-1.5 text-gray-600"}
          disabled={isLastPage}
          onClick={goToNextPage}
          style={{
            pointerEvents: isLastPage ? "none" : "auto",
            opacity: isLastPage ? 0.5 : 1,
          }}
        >
          &raquo;
        </a>
      </nav>
    </div>
  );
};

export default Pagination;