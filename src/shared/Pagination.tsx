"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ArrowLeft from "../../public/icons/arrow-left.svg";
import ArrowRight from "../../public/icons/arrow-right.svg";

type PaginationProps = {
  totalCount: number;
  pageSize: number;
  onPageChange: (url: string | null) => void;
  next: string | null;
  previous: string | null;
};

const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  pageSize,
  onPageChange,
  next,
  previous,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState<(number | string)[]>([]);

  /** Generates page numbers dynamically **/
  useEffect(() => {
    const generatePageNumbers = () => {
      const pages: (number | string)[] = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 3; i++) pages.push(i);
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++)
            pages.push(i);
          pages.push("...");
          pages.push(totalPages);
        }
      }
      setPageNumbers(pages);
    };

    generatePageNumbers();
  }, [currentPage, totalPages]);

  /** Handle page click **/
  const handlePageChange = (url: string | null, newPage: number) => {
    if (url) {
      onPageChange(url);
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex items-center justify-end mt-4">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(previous, currentPage - 1)}
        disabled={!previous}
        className={`flex items-center justify-center w-10 h-10 mr-4 bg-[#FDE107] text-[#1A1A1A] rounded-lg ${
          !previous ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-300"
        }`}
      >
        <Image src={ArrowLeft} alt="Previous" width={20} height={20} />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() =>
              handlePageChange(
                `/acts/?limit=${pageSize}&offset=${(page - 1) * pageSize}`,
                page
              )
            }
            className={`flex items-center justify-center w-10 h-10 text-lg font-medium rounded-lg ${
              currentPage === page
                ? "bg-[#FDE107] text-[#1A1A1A]"
                : "bg-white text-gray-600"
            } hover:bg-[#FDE107] hover:text-[#1A1A1A]`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-3 py-2 mx-1 text-gray-600">
            {page}
          </span>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(next, currentPage + 1)}
        disabled={!next}
        className={`flex items-center justify-center w-10 h-10 ml-4 bg-[#FDE107] text-[#1A1A1A] rounded-lg ${
          !next ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-300"
        }`}
      >
        <Image src={ArrowRight} alt="Next" width={20} height={20} />
      </button>
    </div>
  );
};

export default Pagination;
