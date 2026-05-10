/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";
import {
  Stack,
  styled,
  type BadgeProps,
  Drawer,
  useMediaQuery,
  useTheme,
  Badge,
  Grid,
  Divider,
  Avatar,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import KeyIcon from "@mui/icons-material/Key";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import { AuthAPI } from "../../../../Api";
import { AuthContext } from "./../../../../Contexts/AuthContext";
import { useSelector } from "react-redux";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

export default function NavBar() {
  const navigate = useNavigate();

  const { userData }: any = useContext(AuthContext);
  const quantity = useSelector((state: any) =>
    state.cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0),
  );

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  // Returns true if screen is smaller than 900px (md)
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const navLinks = [
    { title: "Home", path: "/dashboard/home" },
    { title: "Books", path: "/dashboard/books" },
    { title: "Wishlist", path: "/dashboard/wishlist" },
  ];

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

  return (
    <>
      <Grid
        container
        sx={{ my: 2, px: 5 }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid>
          <Avatar
            src={
              userData?.image
                ? `/api/images/users/${userData.image}?v=${userData.imageVersion}`
                : undefined
            }
            sx={{
              bgcolor: deepOrange[500],
            }}
          >
            {!userData?.image &&
              `${userData?.firstName?.[0] || ""}
              ${userData?.lastName?.[0] || ""}`}
          </Avatar>
        </Grid>

        {!isMobile && (
          <Grid>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={3}
            >
              {navLinks.map((link) => (
                <Box
                  key={link.title}
                  component={NavLink}
                  to={link.path}
                  sx={{
                    textDecoration: "none",
                    fontSize: "18px",
                    color: "#111",
                    transition: "0.3s",
                    "&.active": {
                      color: "#ED553B",
                      fontWeight: "bold",
                    },
                  }}
                >
                  {link.title}
                </Box>
              ))}
            </Stack>
          </Grid>
        )}
        {!isMobile && (
          <Grid>
            <Stack
              direction="row"
              sx={{ color: "#393280" }}
              divider={<Divider orientation="vertical" flexItem />}
              spacing={1}
            >
              <Tooltip title="Profile">
                <IconButton
                  color="inherit"
                  onClick={() => navigate("/dashboard/profile")}
                >
                  <PersonOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cart">
                <IconButton
                  aria-label="cart"
                  color="inherit"
                  onClick={() => navigate("/dashboard/cart")}
                >
                  <StyledBadge badgeContent={quantity} color="primary">
                    <ShoppingBagOutlinedIcon />
                  </StyledBadge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Wishlist">
                <IconButton
                  color="inherit"
                  onClick={() => navigate("/dashboard/wishlist")}
                >
                  <FavoriteBorderOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Change Password">
                <IconButton color="inherit" onClick={() => navigate("/change")}>
                  <KeyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton color="inherit" onClick={logout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        )}

        {isMobile && (
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        )}
      </Grid>

      {/* Drawer Component */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            pt: 2,
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <Stack alignItems="center" spacing={1} sx={{ mb: 4, mt: 5 }}>
            <Avatar
              src={
                userData?.image
                  ? `/api/images/users/${userData.image}`
                  : undefined
              }
              sx={{
                bgcolor: deepOrange[500],
                width: 64,
                height: 64,
                fontSize: "1.5rem",
                boxShadow: 2,
              }}
            >
              {!userData?.image &&
                `${userData?.firstName?.[0] || ""}
                ${userData?.lastName?.[0] || ""}`}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
              {userData?.firstName} {userData?.lastName}
            </Typography>
          </Stack>
          <Stack
            direction="column"
            divider={<Divider orientation="horizontal" flexItem />}
            spacing={3}
          >
            {navLinks.map((link) => (
              <Box
                key={link.title}
                component={NavLink}
                to={link.path}
                sx={{
                  my: 3,
                  px: 1,
                  textDecoration: "none",
                  fontSize: "18px",
                  color: "#111",
                  transition: "0.3s",
                  "&.active": {
                    color: "#ED553B",
                    fontWeight: "bold",
                  },
                }}
              >
                {link.title}
              </Box>
            ))}
          </Stack>
          <hr />
          <Stack
            direction="column"
            alignItems="flex-start"
            sx={{ color: "#393280" }}
            divider={<Divider orientation="horizontal" flexItem />}
            spacing={1}
          >
            <IconButton
              color="inherit"
              onClick={() => navigate("/dashboard/profile")}
            >
              <PersonOutlinedIcon />{" "}
              <Typography component="span" color="black">
                Profile
              </Typography>
            </IconButton>
            <IconButton
              aria-label="cart"
              color="inherit"
              onClick={() => navigate("/dashboard/cart")}
            >
              <StyledBadge badgeContent={quantity} color="primary">
                <ShoppingBagOutlinedIcon />
              </StyledBadge>{" "}
              <Typography component="span" mx={2} color="black">
                Cart
              </Typography>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => navigate("/dashboard/wishlist")}
            >
              <FavoriteBorderOutlinedIcon />{" "}
              <Typography component="span" color="black">
                Wishlist
              </Typography>
            </IconButton>
            <IconButton color="inherit">
              <KeyIcon />{" "}
              <Typography
                component="span"
                color="black"
                onClick={() => navigate("/change")}
              >
                Change Password
              </Typography>
            </IconButton>
            <IconButton color="inherit" onClick={logout}>
              <LogoutIcon />{" "}
              <Typography component="span" color="black">
                Logout
              </Typography>
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            sx={{ color: "#393280" }}
            divider={<Divider orientation="vertical" flexItem />}
            spacing={1}
          ></Stack>
        </Box>
      </Drawer>
    </>
  );
}
