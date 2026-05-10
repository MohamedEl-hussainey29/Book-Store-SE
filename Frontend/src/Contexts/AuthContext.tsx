/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */

import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: string;
  userId?: string;
  sub: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: string;
  phoneNumber?: string;
  image?: string;
}

interface AuthContextInterface {
  userData: User | null;
  setUserData: any;
  loading: boolean;
  saveUserData: () => void;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext =
  createContext<AuthContextInterface | null>(null);

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {

  const [userData, setUserData] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const saveUserData = () => {

    const encodedToken =
      localStorage.getItem("userToken");

    if (encodedToken) {

      const decodedToken =
        jwtDecode<User>(encodedToken);

      setUserData(decodedToken);
    }

    setLoading(false);
  };

  useEffect(() => {

    if (localStorage.getItem("userToken")) {
      saveUserData();
    } else {
      setLoading(false);
    }

  }, []);

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        loading,
        saveUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}