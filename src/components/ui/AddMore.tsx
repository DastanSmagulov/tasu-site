import { FC } from "react";
import PlusIcon from "../../../public/icons/plus.svg";
import Image from "next/image";

interface AddMoreProps {
  onClick: () => void;
}

const AddMore: FC<AddMoreProps> = ({ onClick }) => {
  return (
    <button
      className="flex items-center text-xs gap-2 px-4 py-2 bg-customYellow text-black rounded-lg hover:bg-customYellowHover focus:outline-none focus:ring-2 focus:ring-yellow-300"
      onClick={onClick}
    >
      <Image width={4} height={4} alt="plus" src={PlusIcon} />
      Добавить ещё
    </button>
  );
};

export default AddMore;
