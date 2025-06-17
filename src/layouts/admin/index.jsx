import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { ROUTES } from "./routes.jsx";
import Sidebar from "../../components/sidebar/index.jsx";

import i18n from "i18next";
import Navbar from "../../components/navbar/index.jsx";
import Footer from "../../components/footer/index.jsx";

import { KeycloakContext } from "../../contexts/keycloak/KeycloakContext.jsx";

const routeList = ROUTES;

export const AdminLayout = (props) => {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState(routeList[0]);
  const [locale, setLocale] = useState(i18n.language);
  const { kc } = useContext(KeycloakContext);

  const getRoutes = (routes) => {
    return routes
      .filter((route) => route.layout === "/admin")
      .map((route, key) => (
        <Route key={key} path={getPath(route)} element={route.component} />
      ));
  };

  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const fullPath = `${routes[i].layout}/${getPath(routes[i])}`.replace(
        /\/+/g,
        "/"
      );

      if (matchPath(fullPath, location.pathname)) {
        return routes[i];
      }
    }
    return null;
  };

  const matchPath = (routePath, currentPath) => {
    const regexPattern = new RegExp(
      "^" + routePath.replace(/:[^/]+/g, "([^/]+)") + "$"
    );
    return regexPattern.test(currentPath);
  };

  const getPath = (route) => {
    if (route.parentPath) {
      const parentRoute = routeList.find((r) => r.path === route.parentPath);

      if (!parentRoute) throw new Error("Route Error");

      return `${getPath(parentRoute)}/${route.path}`;
    }
    return route.path;
  };

  useEffect(() => {
    window.addEventListener("resize", () =>
        window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  useEffect(() => {
    setCurrentRoute(getActiveRoute(routeList));
  }, [location.pathname]);

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  document.documentElement.dir = "ltr";

  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-light-primary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all mt-4 md:pr-2 xl:ml-[313px]`}
        >
          {/* Navbar */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              currentRoute={currentRoute}
              locale={locale}
              changeLocale={(locale) => setLocale(locale)}
              keycloak={kc}
              {...rest}
            />
            {/* Routes */}
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routeList)}
                <Route
                  path="/"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route path="*" element={<div>404</div>}/>
              </Routes>
            </div>
            {/* Footer */}
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
