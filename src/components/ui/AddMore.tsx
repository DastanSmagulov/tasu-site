import { FC } from "react";
import PlusIcon from "../../../public/icons/plus.svg";
import Image from "next/image";

interface AddMoreProps {
  onClick: () => void;
  disabled?: boolean;
}

const AddMore: FC<AddMoreProps> = ({ onClick, disabled }) => {
  return (
    <button
      className="flex items-center text-xs gap-2 px-4 py-2 bg-customYellow text-black rounded-lg hover:bg-customYellowHover focus:outline-none focus:ring-2 focus:ring-yellow-300"
      onClick={onClick}
      disabled={disabled}
    >
      <Image width={10} height={10} alt="plus" src={PlusIcon} />
      Добавить ещё
    </button>
  );
};

export default AddMore;
