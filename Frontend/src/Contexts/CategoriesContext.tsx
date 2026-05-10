import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axiosClient from "../Api/axiosClient";

export interface Category {
  id: number;
  name: string;
  image?: string;
  bookCount: number;
}

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const CategoriesContext =
  createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await axiosClient.get("/categories");

      const list: Category[] = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.categories || [];

      setCategories(list);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        refresh: fetchCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCategories() {
  const ctx = useContext(CategoriesContext);

  if (!ctx) {
    throw new Error(
      "useCategories must be used inside CategoriesProvider"
    );
  }

  return ctx;
}