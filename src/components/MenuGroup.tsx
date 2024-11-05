import { useState } from "react";
import MenuItem from "./MenuItem";
import { Route } from "../routes/sidebar";

type MenuGroupProps = {
  title: string;
  items: Route[];
};

const MenuGroup: React.FC<MenuGroupProps> = ({ title, items }) => {
  return (
    <div className="mb-4">
      <p className={`text-[#717579] font-semibold uppercase mb-2 text-sm`}>
        {title}
      </p>
      <ul className={`space-y-2`}>
        {items.map((item, index) => (
          <MenuItem key={index} route={item} />
        ))}
      </ul>
    </div>
  );
};

export default MenuGroup;
