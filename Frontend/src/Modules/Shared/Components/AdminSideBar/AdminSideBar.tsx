import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem, menuClasses } from "react-pro-sidebar";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthAPI } from "../../../../Api";
import { useContext } from "react";
import { AuthContext } from "../../../../Contexts/AuthContext";

const SIDEBAR_BG = "#393280";
const ACTIVE_COLOR = "#ED553B";
const TEXT_COLOR = "rgba(255,255,255,0.75)";
const HOVER_BG = "rgba(245,166,35,0.12)";

const navItems = [
  { title: "Home", path: "/admin/home", icon: <HomeIcon /> },
  { title: "Users", path: "/admin/users", icon: <PeopleIcon /> },
  { title: "Admins", path: "/admin/admins", icon: <AdminPanelSettingsIcon /> },
  { title: "Books", path: "/admin/books", icon: <MenuBookIcon /> },
  { title: "Categories", path: "/admin/categories", icon: <CategoryIcon /> },
  { title: "Orders", path: "/admin/orders", icon: <ShoppingCartIcon /> },
  { title: "Profile", path: "/admin/profile", icon: <PersonIcon /> },
];

export default function AdminSideBar() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [collapsed, setCollapsed] = useState(false);
  const authContext = useContext(AuthContext);
  const userData = authContext?.userData;

  // Automatically collapse sidebar on small screens
  useEffect(() => {
    if (isSmallScreen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isSmallScreen]);

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const logout = async () => {
    try {
      const response = await AuthAPI.Logout();
      localStorage.removeItem("userToken");
      navigate("/");
      toast.success(response?.data?.message);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const adminName =
    userData?.name ||
    (userData?.firstName
      ? `${userData.firstName} ${userData.lastName || ""}`
      : "Admin");
  const adminInitials = userData?.firstName
    ? userData.firstName.charAt(0).toUpperCase()
    : userData?.name?.charAt(0).toUpperCase() || "A";

  return (
    <Box
      sx={{
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <Sidebar
        collapsed={collapsed}
        backgroundColor={SIDEBAR_BG}
        style={{ height: "100%", border: "none" }}
        transitionDuration={300}
      >
        {/* Toggle Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: collapsed ? 0 : 2,
            py: 1.5,
            bgcolor: "#393280",
          }}
        >
          {!collapsed && (
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={ACTIVE_COLOR}
              letterSpacing={1}
            >
              BOOK STORE
            </Typography>
          )}
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            size="small"
            sx={{ color: TEXT_COLOR, "&:hover": { color: ACTIVE_COLOR } }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Box>

        {/* Admin Avatar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2.5,
            bgcolor: "#393280",
            mb: 1,
          }}
        >
          <Avatar
            src={
              userData?.image
                ? `/api/images/users/${userData.image}`
                : undefined
            }
            sx={{
              bgcolor: ACTIVE_COLOR,
              width: collapsed ? 36 : 52,
              height: collapsed ? 36 : 52,
              fontSize: collapsed ? 16 : 22,
              fontWeight: 700,
              mb: collapsed ? 0 : 1,
              transition: "all 0.3s",
            }}
          >
            {!userData?.image && adminInitials}
          </Avatar>
          {!collapsed && (
            <>
              <Typography variant="body2" color="#fff" fontWeight={700}>
                {adminName}
              </Typography>
              <Typography variant="caption" color={ACTIVE_COLOR}>
                Administrator
              </Typography>
            </>
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        {/* Nav Items */}
        <Menu
          menuItemStyles={{
            button: ({ active }) => ({
              color: active ? "#fff" : TEXT_COLOR,
              backgroundColor: active ? ACTIVE_COLOR : "transparent",
              borderRadius: "8px",
              margin: "2px 8px",
              width: "calc(100% - 16px)",
              "&:hover": {
                backgroundColor: active ? ACTIVE_COLOR : HOVER_BG,
                color: active ? "#fff" : ACTIVE_COLOR,
              },
              transition: "all 0.2s ease",
            }),
            icon: ({ active }) => ({
              color: active ? "#fff" : TEXT_COLOR,
            }),
            [`.${menuClasses.label}`]: {
              fontSize: "14px",
              fontWeight: 500,
            },
          }}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.title}
              icon={item.icon}
              active={isActive(item.path)}
              onClick={() => navigate(item.path)}
            >
              {item.title}
            </MenuItem>
          ))}
        </Menu>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mt: "auto" }} />

        {/* Logout */}
        <Menu
          menuItemStyles={{
            button: {
              color: TEXT_COLOR,
              borderRadius: "8px",
              margin: "2px 8px",
              width: "calc(100% - 16px)",
              "&:hover": {
                backgroundColor: "rgba(231,76,60,0.18)",
                color: "#e74c3c",
              },
            },
            icon: { color: TEXT_COLOR },
          }}
        >
          <MenuItem icon={<LogoutIcon />} onClick={logout}>
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </Box>
  );
}
