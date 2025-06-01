import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logoiit.png";
import brandDark from "assets/images/logoiit.png";
import Login from "layouts/authentication/sign-in";
import PrivateRoute from "components/PrivateRoute";
import { AuthProvider } from "./authContext";
import { MaterialUIControllerProvider } from "./context";

function AppContent() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={
              route.protected ? <PrivateRoute>{route.component}</PrivateRoute> : route.component
            }
            key={route.key}
          />
        );
      }

      return null;
    });

  const configsButton = <MDBox></MDBox>;

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && pathname !== "/authentication/sign-in" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Institut International du Technologie"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              sx={{
                "& .MuiDrawer-paper": {
                  overflow: "hidden",
                },
                "& .MuiBox-root": {
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "0.5rem",
                },
                "& .MuiBox-root img": {
                  width: "100%",
                  height: "auto",
                  maxHeight: "150px",
                  objectFit: "contain",
                  marginBottom: "1rem",
                },
                "& .MuiTypography-root": {
                  width: "100%",
                  textAlign: "center",
                  padding: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                },
              }}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          <Route path="/authentication/sign-in" element={<Login />} />
          {getRoutes(routes)}
          <Route path="/" element={<Navigate to="/authentication/sign-in" />} />
          <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && pathname !== "/authentication/sign-in" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Institut International du Technologie"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            sx={{
              "& .MuiDrawer-paper": {
                overflow: "hidden",
              },
              "& .MuiBox-root": {
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0.5rem",
              },
              "& .MuiBox-root img": {
                width: "100%",
                height: "auto",
                maxHeight: "150px",
                objectFit: "contain",
                marginBottom: "1rem",
              },
              "& .MuiTypography-root": {
                width: "100%",
                textAlign: "center",
                padding: "0.5rem",
                fontSize: "1rem",
                fontWeight: "bold",
              },
            }}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        <Route path="/authentication/sign-in" element={<Login />} />
        {getRoutes(routes)}
        <Route path="/" element={<Navigate to="/authentication/sign-in" />} />
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MaterialUIControllerProvider>
        <AppContent />
      </MaterialUIControllerProvider>
    </AuthProvider>
  );
}
