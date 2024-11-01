import { useState } from "react";
import Image from "next/image";
import { Route } from "../routes/sidebar";

type MenuItemProps = {
  route: Route;
};

const MenuItem: React.FC<MenuItemProps> = ({ route }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const toggleSubmenu = () => setSubmenuOpen(!submenuOpen);

  return (
    <li className="flex flex-col space-y-1 max-lg:pr-12">
      <a
        href={route.submenu ? "#" : route.path}
        onClick={route.submenu ? toggleSubmenu : undefined}
        className="flex items-center space-y-3 space-x-2 text-[#717579] hover:text-gray-900 transition-colors duration-150 relative"
      >
        <Image
          src={`/icons/${route.icon}.svg`}
          alt={route.icon}
          width={22}
          height={22}
          className="mr-3 mt-3"
        />
        <span className="font-medium text-[#717579] text-sm">{route.name}</span>

        {route.count && (
          <span
            className={`bg-gray-300 text-[#717579] text-sm font-bold rounded-full px-2 py-0.5`}
            style={{ marginLeft: "28%" }}
          >
            {route.count}
          </span>
        )}
        {route.highlight && (
          <span
            className={`bg-red-500 text-white text-sm font-semibold rounded-full px-2 py-0.5 ml-auto max-[1090px]:hidden`}
            style={{ marginLeft: "15%" }}
          >
            Новый
          </span>
        )}

        {/* Display arrow if there's a submenu */}
        {route.submenu && (
          <span
            className={`transform transition-transform text-[9px] ${
              submenuOpen ? "rotate-90" : ""
            }`}
            style={{ marginLeft: "40%" }}
          >
            ▶
          </span>
        )}
      </a>

      {/* Show submenu if expanded */}
      {submenuOpen && route.submenu && (
        <ul className="pl-6 mt-1 space-y-1 text-gray-500">
          {route.submenu.map((subitem, index) => (
            <li key={index}>
              <a
                href={subitem.path}
                className="flex items-center space-x-2 hover:text-gray-700 transition-colors duration-150"
              >
                <Image
                  src={`/icons/${subitem.icon}.svg`}
                  alt={subitem.icon}
                  width={22}
                  height={22}
                />
                <span>{subitem.name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;
