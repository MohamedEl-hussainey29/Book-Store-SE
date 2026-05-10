import { Box, Breadcrumbs, Link as MuiLink } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

export default function BreadCrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  const isAdmin = pathSegments[0] === "admin";
  const baseSegment = isAdmin ? "admin" : "dashboard";
  const homePath = `/${baseSegment}/home`;
  
  // Find index of base segment to start breadcrumbs from after it
  const baseIndex = pathSegments.indexOf(baseSegment);
  const subPath = baseIndex !== -1 ? pathSegments.slice(baseIndex + 1) : [];
  
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ background: "linear-gradient(to right, #FFE5E5 , #F5FFFE);" }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ fontSize: "25px", py: 3, textTransform: "capitalize" }}
        >
          <MuiLink
            component={RouterLink}
            to={homePath}
            underline="hover"
            color="inherit"
          >
            Home
          </MuiLink>

          {subPath.map((segment, index) => {
            const to = `/${baseSegment}/` + subPath.slice(0, index + 1).join("/");

            return (
              <MuiLink
                key={to}
                component={RouterLink}
                to={to}
                underline="hover"
                color={index === subPath.length - 1 ? "#393280" : "inherit"}
              >
                {segment}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      </Box>
    </>
  );
}

