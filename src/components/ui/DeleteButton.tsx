import { FC } from "react";
import { TrashIcon } from "@heroicons/react/outline";

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      className="flex items-center text-xs gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      onClick={onClick}
    >
      <TrashIcon className="w-4 h-4" />
      Удалить
    </button>
  );
};

export default DeleteButton;
