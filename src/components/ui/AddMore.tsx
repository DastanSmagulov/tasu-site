import { FC } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

interface AddMoreProps {
  onClick: () => void;
}

const AddMore: FC<AddMoreProps> = ({ onClick }) => {
  return (
    <button
      className="flex items-center text-xs gap-2 px-4 py-2 bg-customYellow text-black rounded-lg hover:bg-customYellowHover focus:outline-none focus:ring-2 focus:ring-yellow-300"
      onClick={onClick}
    >
      <PlusIcon className="w-4 h-4" />
      Добавить ещё
    </button>
  );
};

export default AddMore;
