import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSideBar from "../AdminSideBar/AdminSideBar";

export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F4F6F8" }}>
      {/* Sidebar - always visible, collapses to icons */}
      <AdminSideBar />

      {/* Page Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
