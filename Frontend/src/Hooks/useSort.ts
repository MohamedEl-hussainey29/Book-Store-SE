// hooks/useSort.ts
import { useMemo } from "react";

interface Book {
  id: number;
  title: string;
  category: string;
  author: string;
  price: number;
  image: string;
  description: string;
  status: string;
}

type SortOption =
  | "price-low" | "price-high"
  | "alpha-asc" | "alpha-desc"
  | "oldest" | "newest";

export function useSort(allBooks: Book[], sortBy: SortOption): Book[] {
  const sortedData = useMemo(() => {
    const tempBooks = [...allBooks];

    switch (sortBy) {
      case "price-low":
        return tempBooks.sort((a, b) => a.price - b.price);

      case "price-high":
        return tempBooks.sort((a, b) => b.price - a.price);

      case "alpha-asc":
        return tempBooks.sort((a, b) =>
          a.title.localeCompare(b.title)
        );

      case "alpha-desc":
        return tempBooks.sort((a, b) =>
          b.title.localeCompare(a.title)
        );

      case "oldest":
        return tempBooks.sort((a, b) => a.id - b.id);

      case "newest":
      default:
        return tempBooks.sort((a, b) => b.id - a.id);
    }
  }, [sortBy, allBooks]);

  return sortedData;
}