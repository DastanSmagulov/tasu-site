import Image from "next/image";
import ArrowLeft from "../../public/icons/arrow-left.svg";
import ArrowRight from "../../public/icons/arrow-right.svg";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-end mt-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 mr-4 bg-[#FDE107] text-[#1A1A1A] rounded-lg ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-yellow-300"
        }`}
      >
        <Image src={ArrowLeft} alt="Previous" width={16} height={16} />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((pageNumber, index) =>
        typeof pageNumber === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(pageNumber)}
            className={`flex items-center justify-center w-10 h-10 text-lg font-medium rounded-lg ${
              currentPage === pageNumber
                ? "bg-[#FDE107] text-[#1A1A1A]"
                : "bg-white text-gray-600"
            } hover:bg-[#FDE107] hover:text-[#1A1A1A]`}
          >
            {pageNumber}
          </button>
        ) : (
          <span
            key={index}
            className="flex items-center justify-center w-10 h-10 text-lg text-gray-600"
          >
            {pageNumber}
          </span>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 ml-4 bg-[#FDE107] text-[#1A1A1A] rounded-lg ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-yellow-300"
        }`}
      >
        <Image src={ArrowRight} alt="Next" width={16} height={16} />
      </button>
    </div>
  );
};

export default Pagination;
