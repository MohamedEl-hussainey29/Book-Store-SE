/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";

export function useFilters(allBooks: any[]) {

  const initialFilters = {
    minPrice: "",
    maxPrice: "",
    types: [] as string[],
    statuses: [] as string[],
  };

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const toggleFilter = (filterType: "types" | "statuses", value: string) => {
    setFilters((prev) => {
      if (filterType === "types") {
        const isAlreadySelected = prev.types.includes(value);
        return {
          ...prev,
          types: isAlreadySelected ? [] : [value],
        };
      }

      const exists = prev[filterType].includes(value);
      return {
        ...prev,
        [filterType]: exists
          ? prev[filterType].filter((v) => v !== value)
          : [...prev[filterType], value],
      };
    });
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const filteredBooks = useMemo(() => {
    const min = appliedFilters.minPrice ? Number(appliedFilters.minPrice) : 0;
    const max = appliedFilters.maxPrice ? Number(appliedFilters.maxPrice) : Infinity;

    return allBooks.filter((book) => {
      const bookPrice = Number(book.price) || 0;
      const matchPrice = bookPrice >= min && bookPrice <= max;

      const bookStatus = (book.status || "").toString().toLowerCase().trim();
      const matchStatus =
        appliedFilters.statuses.length === 0 ||
        appliedFilters.statuses.includes(bookStatus);

      return matchPrice && matchStatus; 
    });
  }, [allBooks, appliedFilters]);

  return {
    filters,
    setPrice: (field: any, value: any) => setFilters(p => ({...p, [field]: value})),
    toggleFilter,
    applyFilters,
    filteredBooks,
  };
}