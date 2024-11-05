import Image from "next/image";
import Arrow from "../../public/icons/ic_chevron-2.svg";
import Arrow2 from "../../public/icons/ic_chevron.svg";

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
  return (
    <div className="flex justify-between items-center mt-4">
      <div>
        <p className="font-medium text-[#1D1B23]">Показано 10 из 160 данных</p>
      </div>
      <div className="flex items-center mt-4 font-medium text-lg">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`btn bg-[#FED035] text-[#FFFFFF] border-none mr-4 flex items-center ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Image src={Arrow} alt="arrow-left" width={18} height={18} />
          Предыдущий
        </button>
        <div className="border border-[#FED035] rounded-lg">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            const isActive = currentPage === pageNumber;
            return (
              <button
                key={index}
                onClick={() => onPageChange(pageNumber)}
                className={`btn border-none ${
                  !isActive
                    ? "bg-white text-[#FF7D34]"
                    : "bg-[#FED035] text-[#FFFFFF]"
                } hover:bg-[#f0d16d] hover:text-white]`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`btn bg-[#FED035] text-[#FFFFFF] border-none ml-4 flex items-center ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Следующий
          <Image src={Arrow2} alt="arrow-right" width={18} height={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
