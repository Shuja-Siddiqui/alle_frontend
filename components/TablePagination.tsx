"use client";

import { useState } from "react";
import Image from "next/image";

type TablePaginationProps = {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Total number of items */
  totalItems: number;
  /** Item name (e.g., "students", "items") */
  itemName?: string;
  /** Called when page changes */
  onPageChange: (page: number) => void;
  /** Optional className for custom styling */
  className?: string;
};

export function TablePagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  itemName = "items",
  onPageChange,
  className,
}: TablePaginationProps) {
  const [goToPageValue, setGoToPageValue] = useState<string>(currentPage.toString());

  // Calculate displayed range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const displayedCount = endItem - startItem + 1;

  // Generate page numbers to display
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 7; // Maximum visible page numbers (excluding ellipsis)

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Show pages 2, 3, 4, 5, ..., last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first, ..., last-4, last-3, last-2, last-1, last
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first, ..., current-1, current, current+1, ..., last
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      setGoToPageValue((currentPage - 1).toString());
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      setGoToPageValue((currentPage + 1).toString());
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setGoToPageValue(page.toString());
    }
  };

  const handleGoToSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(goToPageValue, 10);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    } else {
      // Reset to current page if invalid
      setGoToPageValue(currentPage.toString());
    }
  };

  const handleGoToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setGoToPageValue(value);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`flex items-center justify-between py-[16px] rounded-[32px] ${className ?? ""}`}
    >
      {/* Left: Displayed items count */}
      <p
        style={{
          fontFamily: "var(--font-orbitron), system-ui, sans-serif",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "1.5",
          color: "#FFFFFF",
          letterSpacing: "-0.154px",
        }}
      >
        Shown {displayedCount} of {totalItems} {itemName}
      </p>

      {/* Center: Pagination controls */}
      <div className="flex gap-[12px] items-center">
        {/* Previous button */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center justify-center px-[16px] py-[8px] rounded-[12px] shrink-0"
          style={{
            width: "38px",
            backgroundColor: "#21265d",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          <div
            className="relative shrink-0"
            style={{
              width: "22px",
              height: "22px",
            }}
          >
            <Image
              src="/assets/icons/admin/pagination_arrow_left.svg"
              alt="Previous page"
              width={22}
              height={22}
              className="block max-w-none size-full"
            />
          </div>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex items-center justify-center px-[16px] py-[8px] rounded-[12px] shrink-0"
                style={{
                  width: "38px",
                  backgroundColor: "#21265d",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "22px",
                    color: "#FFFFFF",
                    letterSpacing: "-0.176px",
                  }}
                >
                  ...
                </p>
              </div>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => handlePageClick(page)}
              className="flex items-center justify-center px-[16px] py-[8px] rounded-[12px] shrink-0"
              style={{
                width: "38px",
                backgroundColor: "#21265d",
                cursor: "pointer",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "22px",
                  color: isActive ? "#ff00ca" : "#FFFFFF",
                  letterSpacing: "-0.176px",
                }}
              >
                {page}
              </p>
            </button>
          );
        })}

        {/* Next button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center px-[16px] py-[8px] rounded-[12px] shrink-0"
          style={{
            width: "38px",
            backgroundColor: "#21265d",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          <div
            className="relative shrink-0"
            style={{
              width: "22px",
              height: "22px",
            }}
          >
            <Image
              src="/assets/icons/admin/pagination_arrow_right.svg"
              alt="Next page"
              width={22}
              height={22}
              className="block max-w-none size-full"
            />
          </div>
        </button>
      </div>

      {/* Right: Go to page */}
      <div className="flex gap-[12px] items-center justify-end" style={{ width: "190px" }}>
        <p
          style={{
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "1.5",
            color: "#FFFFFF",
            letterSpacing: "-0.154px",
          }}
        >
          Go to
        </p>
        <form onSubmit={handleGoToSubmit} className="inline-block">
          <input
            type="text"
            value={goToPageValue}
            onChange={handleGoToChange}
            onBlur={() => {
              // Reset to current page if invalid on blur
              const page = parseInt(goToPageValue, 10);
              if (isNaN(page) || page < 1 || page > totalPages) {
                setGoToPageValue(currentPage.toString());
              }
            }}
            className="flex items-center justify-center px-[16px] py-[8px] rounded-[12px] shrink-0 text-center"
            style={{
              width: "38px",
              backgroundColor: "#21265d",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "22px",
              color: "#FFFFFF",
              letterSpacing: "-0.176px",
            }}
          />
        </form>
        <p
          style={{
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "1.5",
            color: "#FFFFFF",
            letterSpacing: "-0.154px",
          }}
        >
          of {totalPages}
        </p>
      </div>
    </div>
  );
}

