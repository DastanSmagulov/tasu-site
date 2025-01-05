import routes from "./sidebar-routes";
import { Route } from "./types";

export const getRoutesForRole = (role: string): Route[] => {
  const filterRoutes = (routes: Route[]): Route[] =>
    routes
      .filter((route) => !route.roles || route.roles.includes(role)) // Check if role matches
      .map((route) => ({
        ...route,
        submenu: route.submenu ? filterRoutes(route.submenu) : undefined, // Recursively filter submenus
      }));

  return filterRoutes(routes);
};
