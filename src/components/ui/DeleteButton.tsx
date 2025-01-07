import { FC } from "react";
import TrashIcon from "../../../public/icons/trash.svg";
import Image from "next/image";

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      className="flex items-center text-xs gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      onClick={onClick}
    >
      <Image
        src={TrashIcon}
        width={10}
        height={10}
        className="mr-1"
        alt="trash"
      />{" "}
      Удалить
    </button>
  );
};

export default DeleteButton;
