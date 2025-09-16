import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { ROUTES } from "./routes.jsx";
import Sidebar from "../../components/sidebar/index.jsx";

import i18n from "i18next";
import Navbar from "../../components/navbar/index.jsx";
import Footer from "../../components/footer/index.jsx";

import { KeycloakContext } from "../../contexts/keycloak/KeycloakContext.jsx";


export const AdminLayout = (props) => {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [locale, setLocale] = useState(i18n.language);
  const { kc } = useContext(KeycloakContext);

  const getRoutes = (routes) => {
    return routes
      .filter((route) => route.layout === "/admin")
      .map((route, key) => {
        let path = route.parentPath ? `${route.parentPath}/${route.path}` : route.path;
        return <Route key={key} path={path} element={route.component} />;
      });
  };

  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const fullPath = getFullPath(routes[i]);
      if (matchPath(fullPath, location.pathname)) {
        return routes[i];
      }
    }
    return null;
  };

  const getFullPath = (route) => {
    let path = route.layout || "";
    if (route.parentPath) {
      path += "/" + route.parentPath;
    }
    if (route.path) {
      path += "/" + route.path;
    }
    return path.replace(/\/+/g, "/");
  };

  const matchPath = (routePath, currentPath) => {
    const regexPattern = new RegExp(
      "^" + routePath.replace(/:[^/]+/g, "([^/]+)") + "$"
    );
    return regexPattern.test(currentPath);
  };

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  useEffect(() => {
    setCurrentRoute(getActiveRoute(ROUTES));
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
            <div className="pt-5s mx-auto mb-auto h-full min-h-screen p-2 md:pr-2">
              <Routes>
                {getRoutes(ROUTES)}
                <Route
                  index
                  element={<Navigate to="dashboard" replace />}
                />
                <Route path="*" element={<div>404</div>} />
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
