import { Route } from "../helper/sidebar-routes";
import MenuItem from "./MenuItem";

type MenuGroupProps = {
  title: string;
  items: Route[];
};

const MenuGroup: React.FC<MenuGroupProps> = ({ title, items }) => {
  return (
    <div className="mb-6">
      <p className="text-[#717579] font-bold uppercase text-xs">{title}</p>
      <ul className="space-y-3 mt-4">
        {items.map((item, index) => (
          <MenuItem key={index} route={item} />
        ))}
      </ul>
    </div>
  );
};

export default MenuGroup;
