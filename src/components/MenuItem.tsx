"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Use for Next.js App Router
import { Route } from "../helper/sidebar-routes";
// import { ArrowUpIcon } from "@heroicons/react/outline";

type MenuItemProps = {
  route: Route;
};

const MenuItem: React.FC<MenuItemProps> = ({ route }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const locationRoute = usePathname(); // Get the current route

  const isActive =
    locationRoute === route.path || // Exact match
    (locationRoute.startsWith(route.path) &&
      locationRoute.length === route.path.length);

  const toggleSubmenu = () => setSubmenuOpen(!submenuOpen);

  return (
    <li
      className={`flex flex-col ${
        isActive ? "bg-gray-200 text-gray-900" : "text-[#717579]"
      } rounded-lg`}
    >
      <a
        href={route.submenu ? "#" : route.path}
        onClick={route.submenu ? toggleSubmenu : undefined}
        className={`flex items-center py-2 transition-colors duration-150 ${
          isActive ? "bg-gray-200 text-gray-900" : "hover:bg-gray-100"
        }`}
      >
        {route.icon && (
          <Image
            src={`/icons/${route.icon}.svg`}
            alt={route.icon}
            width={20}
            height={20}
            className="mr-3"
          />
        )}
        <span className="text-sm font-medium">{route.name}</span>
        {route.submenu && (
          <span
            className={`ml-auto transform transition-transform ${
              submenuOpen ? "rotate-90" : ""
            }`}
          >
            {/* <ArrowUpIcon width={13} height={13} /> */}
          </span>
        )}
      </a>

      {submenuOpen && route.submenu && (
        <ul className="ml-8 mt-2 space-y-2 text-sm">
          {route.submenu.map((subitem, index) => (
            <li key={index}>
              <a
                href={subitem.path}
                className={`block px-4 py-2 hover:bg-gray-100 rounded ${
                  locationRoute === subitem.path
                    ? "bg-gray-200 text-gray-900"
                    : ""
                }`}
              >
                {subitem.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;
