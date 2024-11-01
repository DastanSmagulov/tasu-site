// components/LeftSidebar.tsx
import { NavLink } from "react-router-dom";
import routes from "../routes/sidebar";
import SidebarSubmenu from "./SidebarSubmenu";

const LeftSidebar: React.FC = () => {
  return (
    <div className="drawer-side z-30">
      <ul className="menu pt-2 w-80 bg-base-100 min-h-full text-base-content">
        {routes.map((route, index) => (
          <li key={index}>
            {route.submenu ? (
              <SidebarSubmenu name={route.name} submenu={route.submenu} />
            ) : (
              <NavLink
                end
                to={route.path}
                className={({ isActive }: any) =>
                  `${isActive ? "font-semibold bg-base-200" : "font-normal"}`
                }
              >
                <i className="material-icons mr-2">{route.icon}</i>{" "}
                {/* Render icon here */}
                {route.name}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftSidebar;
