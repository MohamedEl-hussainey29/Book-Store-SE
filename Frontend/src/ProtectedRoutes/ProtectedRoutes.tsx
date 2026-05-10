/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";

interface ProtectedRoutesProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoutes({
  children,
  allowedRoles,
}: ProtectedRoutesProps) {

  const { userData, loading }: any =
    useContext(AuthContext);

  const token =
    localStorage.getItem("userToken");

  // Wait until auth restoration finishes
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }

  // Role not allowed
  if (
    !allowedRoles.includes(userData.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}