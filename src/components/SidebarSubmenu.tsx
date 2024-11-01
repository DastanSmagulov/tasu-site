// components/SidebarSubmenu.tsx
import { NavLink } from "react-router-dom";
import { useState } from "react";

type SubmenuProps = {
  name: string;
  submenu: { path: string; name: string; icon: React.ReactNode }[];
};

const SidebarSubmenu: React.FC<SubmenuProps> = ({ name, submenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="flex items-center justify-between w-full p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{name}</span>
        <i className="material-icons">
          {isOpen ? "expand_less" : "expand_more"}
        </i>
      </button>
      {isOpen && (
        <ul className="pl-4">
          {submenu.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }: any) =>
                  `${isActive ? "font-semibold bg-base-200" : "font-normal"}`
                }
              >
                {item.icon} {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarSubmenu;
