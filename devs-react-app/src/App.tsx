import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Register from "./pages/register/Register";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react";
import Home from "./pages/home/Home";
import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionStore from "./stores/SessionStore";
import { useEffect } from "react";
import { decodeJwt } from "./utils/jwt";
import {
  Folder,
  Archive,
  Person,
  Tag,
  DashboardOutlined,
  Code,
} from "@mui/icons-material";
import { UsersTable } from "./pages/users/UsersTable";
import { ModelCards } from "./pages/models/ModelCards";
import { ROUTES } from "./utils/constants";
import CssBaseline from "@mui/material/CssBaseline";
import DeletedModels from "./pages/models/trash/DeletedModels";
import { TagsTable } from "./pages/tags/TagsTable";
import { SchemasTable } from "./pages/schemas/SchemasTable";

interface PrivateRouteProps {
  element: React.ComponentType<any>;
  path: string;
}

const PrivateRoute = ({ element: Component, ...rest }: PrivateRouteProps) => {
  if (SessionStore.isLoggedIn) {
    return (
      <div style={{ marginTop: 60, marginLeft: 240, padding: 30 }}>
        <Component {...rest} />
      </div>
    );
  } else {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  const location = useLocation();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      primary: {
        main: "#4831D4",
      },
      secondary: {
        main: "#CCF381",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              backgroundColor: prefersDarkMode ? "#261875" : "#eae8fa",
              width: 14,
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: "#4831D4",
              minHeight: 24,
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
              {
                backgroundColor: "#978ae7",
              },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
              {
                backgroundColor: "#978ae7",
              },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
              {
                backgroundColor: "#978ae7",
              },
            "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
              backgroundColor: "#978ae7",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlined: {
            borderColor: prefersDarkMode ? "#CCF381" : "#4831D4",
            color: prefersDarkMode ? "#CCF381" : "#4831D4",
          },
        },
      },
      MuiListItemButton: {},
      MuiToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: "#4831D4",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          text: {
            color: prefersDarkMode ? "#CCF381" : "#4831D4",
          },
          outlined: {
            borderColor: prefersDarkMode ? "#CCF381" : "#4831D4",
            color: prefersDarkMode ? "#CCF381" : "#4831D4",
            "&:hover": {
              borderColor: prefersDarkMode ? "#E5F9BF" : "#7A69E0",
              color: prefersDarkMode ? "#E5F9BF" : "#7A69E0",
              backgroundColor: prefersDarkMode ? "transparent" : "transparent",
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            "&:has(> input:-webkit-autofill)": {
              backgroundColor: prefersDarkMode ? "#121212" : "#ffffff",
            },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: prefersDarkMode ? "#E5F9BF" : "#7A69E0",
              },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
              color: prefersDarkMode ? "#E5F9BF" : "#7A69E0",
            },
            "& .MuiInputLabel-outlined.Mui-focused": {
              color: prefersDarkMode ? "#E5F9BF" : "#7A69E0",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: prefersDarkMode ? "#E5F9BF" : "#7A69E0",
              },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
              color: prefersDarkMode ? "#E5F9BF" : "#7A69E0",
            },
            "& .MuiInputLabel-outlined.Mui-focused": {
              color: prefersDarkMode ? "#E5F9BF" : "#7A69E0",
            },
          },
        },
      },
    },
    typography: {
      fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
    },
  });

  const menuItems = [
    {
      id: 1,
      icon: <DashboardOutlined />,
      title: "Dashboard",
      route: ROUTES.DASHBOARD,
      active: location.pathname === ROUTES.DASHBOARD,
    },
    {
      id: 2,
      icon: <Folder />,
      title: "Models",
      route: ROUTES.MODELS,
      active: location.pathname === ROUTES.MODELS,
    },
    {
      id: 4,
      icon: <Archive />,
      title: "Archive",
      route: ROUTES.ARCHIVE,
      active: location.pathname === ROUTES.ARCHIVE,
    },
  ];

  const adminMenuItems = [
    {
      id: 5,
      icon: <Person />,
      title: "Users",
      route: ROUTES.USERS,
      active: location.pathname === ROUTES.USERS,
    },
    {
      id: 6,
      icon: <Code />,
      title: "Schemas",
      route: ROUTES.SCHEMAS,
      active: location.pathname === ROUTES.SCHEMAS,
    },
    {
      id: 7,
      icon: <Tag />,
      title: "Tags",
      route: ROUTES.TAGS,
      active: location.pathname === ROUTES.TAGS,
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = decodeJwt(token);
        if (decodedToken && decodedToken.exp) {
          const expirationTime = decodedToken.exp * 1000;
          if (Date.now() > expirationTime) {
            SessionStore.logout();
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <NavBar />
      {SessionStore.isLoggedIn && !SessionStore.isLoading && (
        <Drawer
          open={SessionStore.isLoggedIn}
          variant={"permanent"}
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: "border-box",
              top: 64,
            },
          }}
          className="drawer"
        >
          <List>
            {menuItems.map((menuItem) => (
              <ListItemButton
                key={menuItem.id}
                selected={menuItem.active}
                component={Link}
                to={menuItem.route}
              >
                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                <ListItemText primary={menuItem.title} />
              </ListItemButton>
            ))}
            {SessionStore.isAdmin && (
              <>
                <Divider style={{ borderColor: "gray" }} />
                <Typography className="p-3">
                  {" "}
                  <b>Admin panel</b>{" "}
                </Typography>
                {adminMenuItems.map((adminMenuItem) => (
                  <ListItemButton
                    key={adminMenuItem.id}
                    selected={adminMenuItem.active}
                    component={Link}
                    to={adminMenuItem.route}
                  >
                    <ListItemIcon>{adminMenuItem.icon}</ListItemIcon>
                    <ListItemText primary={adminMenuItem.title} />
                  </ListItemButton>
                ))}
              </>
            )}
          </List>
        </Drawer>
      )}
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route
          path={ROUTES.DASHBOARD}
          element={<PrivateRoute element={Dashboard} path={ROUTES.DASHBOARD} />}
        />
        <Route
          path={ROUTES.MODELS}
          element={
            <PrivateRoute element={ModelCards} path={ROUTES.DASHBOARD} />
          }
        />
        <Route
          path={ROUTES.ARCHIVE}
          element={
            <PrivateRoute element={DeletedModels} path="/models/deleted" />
          }
        />
        <Route
          path={ROUTES.USERS}
          element={
            <PrivateRoute element={UsersTable} path={ROUTES.DASHBOARD} />
          }
        />
        <Route
          path={ROUTES.SCHEMAS}
          element={
            <PrivateRoute element={SchemasTable} path={ROUTES.DASHBOARD} />
          }
        />
        <Route
          path={ROUTES.TAGS}
          element={<PrivateRoute element={TagsTable} path={ROUTES.DASHBOARD} />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default observer(App);
